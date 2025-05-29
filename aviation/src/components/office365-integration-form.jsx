"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function Office365IntegrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [office365Config, setOffice365Config] = useState({
    tenantId: "",
    clientId: "",
    clientSecret: "",
    username: "",
    password: "",
  })

  const handleOffice365Change = (e) => {
    const { name, value } = e.target
    setOffice365Config((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      // In a real application, you would make an API call to save the configuration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Office 365 configuration saved successfully")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save configuration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant ID</Label>
            <Input
              id="tenantId"
              name="tenantId"
              placeholder="Enter Office 365 tenant ID"
              value={office365Config.tenantId}
              onChange={handleOffice365Change}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                name="clientId"
                placeholder="Enter client ID"
                value={office365Config.clientId}
                onChange={handleOffice365Change}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                name="clientSecret"
                type="password"
                placeholder="Enter client secret"
                value={office365Config.clientSecret}
                onChange={handleOffice365Change}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="o365Username">Username</Label>
              <Input
                id="o365Username"
                name="username"
                placeholder="Enter username"
                value={office365Config.username}
                onChange={handleOffice365Change}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="o365Password">Password</Label>
              <Input
                id="o365Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={office365Config.password}
                onChange={handleOffice365Change}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </div>
    </form>
  )
}