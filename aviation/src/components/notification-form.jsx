import { useState } from "react";
import { Loader2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

// Mock document categories data
const documentCategories = [
  { id: "1", name: "Financial Reports" },
  { id: "2", name: "HR Documents" },
  { id: "3", name: "Compliance Updates" },
  { id: "4", name: "Project Plans" },
  { id: "5", name: "Policy Changes" },
];

// Mock roles data
const roles = [
  { id: "1", name: "Administrator" },
  { id: "2", name: "Manager" },
  { id: "3", name: "Employee" },
  { id: "4", name: "HR Specialist" },
  { id: "5", name: "Finance Officer" },
];

export function NotificationForm({ notification, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: notification?.id || "",
    documentCategory: notification?.documentCategory || "",
    role: notification?.role || "",
    cadence: notification?.cadence || "daily",
    specificTime: notification?.specificTime || "09:00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        onSave(formData);
      } else {
        setFormData({
          id: "",
          documentCategory: "",
          role: "",
          cadence: "daily",
          specificTime: "09:00",
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{notification ? "Edit Notification" : "Create Notification"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="documentCategory">Document Category</Label>
              <Select 
                value={formData.documentCategory} 
                onValueChange={(value) => handleSelectChange("documentCategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notification Cadence</Label>
            <RadioGroup 
              value={formData.cadence}
              onValueChange={(value) => handleSelectChange("cadence", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specificTime" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Specific Time
            </Label>
            <Input
              id="specificTime"
              name="specificTime"
              type="time"
              value={formData.specificTime}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-[#335aff] hover:bg-[#335aff]/80" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {notification ? "Updating..." : "Creating..."}
              </>
            ) : notification ? (
              "Update Notification"
            ) : (
              "Create Notification"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}