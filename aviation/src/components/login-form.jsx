import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { decodeToken, getCurrentUser } from "@/utils/jwt"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function LoginForm({setUser}) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      // Parse the response from the backend
      const data = await response.json()
      console.log('Login response:', data)
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user || {}))
      
      // Store token if available
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      // Store permissions in localStorage (CRITICAL for CASL)
      if (data.permissions) {
        console.log('Storing permissions in localStorage:', data.permissions)
        localStorage.setItem('permissions', JSON.stringify(data.permissions))
      } else {
        console.warn('No permissions in login response')
      }
      
      // Store roles if available
      if (data.roles) {
        localStorage.setItem('roles', JSON.stringify(data.roles))
      }
      
      // Call the setUser function to update application state
      setUser(data.user)
      
      // Navigate based on role
      if (data.user?.role === 'admin' || 
          (data.roles && data.roles.some(role => role.name === 'Administrator'))) {
        navigate('/admin-dashboard')
      } else {
        navigate('/landing-page')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Sign In</h2>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#335aff] hover:bg-[#335aff]/80"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-[#335aff] hover:text-[#335aff]/80"
            >
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}