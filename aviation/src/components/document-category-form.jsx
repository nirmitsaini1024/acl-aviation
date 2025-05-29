import { useState } from "react"
import { Loader2, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock departments data
const initialDepartments = [
  { id: "1", name: "IT" },
  { id: "2", name: "HR" },
  { id: "3", name: "Finance" },
  { id: "4", name: "Marketing" },
  { id: "5", name: "Operations" },
]

export function DocumentCategoryForm({ category, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState(initialDepartments)
  const [newDepartment, setNewDepartment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    id: category?.id || "",
    departmentName: category?.departmentName || "",
    categoryName: category?.categoryName || "",
    description: category?.description || "",
    receiveMode: category?.receiveMode || "upload",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      const newId = (departments.length + 1).toString()
      setDepartments([...departments, { id: newId, name: newDepartment.trim() }])
      setFormData((prev) => ({ ...prev, departmentName: newDepartment.trim() }))
      setNewDepartment("")
      setIsDialogOpen(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSave) {
        onSave(formData)
      } else {
        // Reset form after successful submission
        setFormData({
          id: "",
          departmentName: "",
          categoryName: "",
          description: "",
          receiveMode: "upload",
        })
      }
    } catch (error) {
      console.error("Form submission failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Document Category" : "Create Document Category"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="departmentName">Department Name</Label>
            </div>
            <Select
              value={formData.departmentName}
              onValueChange={(value) => handleSelectChange("departmentName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              required
              value={formData.categoryName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter category description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Mode to Receive Documents</Label>
            <RadioGroup
              value={formData.receiveMode}
              onValueChange={(value) => handleSelectChange("receiveMode", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="font-normal">
                  Upload from User Computer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="folder" id="folder" />
                <Label htmlFor="folder" className="font-normal">
                  Folder Location
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="font-normal">
                  By Email
                </Label>
              </div>
            </RadioGroup>
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
                {category ? "Updating..." : "Creating..."}
              </>
            ) : category ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}