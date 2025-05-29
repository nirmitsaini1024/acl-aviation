"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function DocuSignIntegrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [docuSignConfig, setDocuSignConfig] = useState({
    integrationKey: "",
    accountId: "",
    userId: "",
    privateKey: "",
    enabled: false,
  })

  const handleDocuSignChange = (e) => {
    const { name, value, type, checked } = e.target
    setDocuSignConfig((prev) => ({
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
      alert("DocuSign configuration saved successfully")
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
            <Label htmlFor="integrationKey">Integration Key</Label>
            <Input
              id="integrationKey"
              name="integrationKey"
              placeholder="Enter DocuSign integration key"
              value={docuSignConfig.integrationKey}
              onChange={handleDocuSignChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID</Label>
              <Input
                id="accountId"
                name="accountId"
                placeholder="Enter account ID"
                value={docuSignConfig.accountId}
                onChange={handleDocuSignChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                name="userId"
                placeholder="Enter user ID"
                value={docuSignConfig.userId}
                onChange={handleDocuSignChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <Input
              id="privateKey"
              name="privateKey"
              type="password"
              placeholder="Enter private key"
              value={docuSignConfig.privateKey}
              onChange={handleDocuSignChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              name="enabled"
              checked={docuSignConfig.enabled}
              onCheckedChange={(checked) => setDocuSignConfig((prev) => ({ ...prev, enabled: checked }))}
            />
            <Label htmlFor="enabled">Enable DocuSign Integration</Label>
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