"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function EmailIntegrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    smtpPort: "",
    username: "",
    password: "",
    senderEmail: "",
    enableSSL: true,
  })

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target
    setEmailConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    try {
      // In a real application, you would make an API call to save the configuration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Email configuration saved successfully")
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                name="smtpServer"
                placeholder="e.g., smtp.example.com"
                value={emailConfig.smtpServer}
                onChange={handleEmailChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                name="smtpPort"
                placeholder="e.g., 587"
                value={emailConfig.smtpPort}
                onChange={handleEmailChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter username"
                value={emailConfig.username}
                onChange={handleEmailChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={emailConfig.password}
                onChange={handleEmailChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Sender Email</Label>
            <Input
              id="senderEmail"
              name="senderEmail"
              type="email"
              placeholder="Enter sender email"
              value={emailConfig.senderEmail}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enableSSL"
              name="enableSSL"
              checked={emailConfig.enableSSL}
              onCheckedChange={(checked) => setEmailConfig((prev) => ({ ...prev, enableSSL: checked }))}
            />
            <Label htmlFor="enableSSL">Enable SSL/TLS</Label>
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