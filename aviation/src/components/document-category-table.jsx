// src/components/DocumentCategoryTable.jsx

import { useState } from "react"
import { Edit, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { DocumentCategoryForm } from "@/components/document-category-form"

// Mock data for document categories
const initialCategories = [
  {
    id: "1",
    departmentName: "IT",
    categoryName: "Technical Documentation",
    description: "Technical specifications and documentation",
    receiveMode: "upload",
  },
  {
    id: "2",
    departmentName: "HR",
    categoryName: "Employee Records",
    description: "Employee personal and professional records",
    receiveMode: "folder",
  },
  {
    id: "3",
    departmentName: "Finance",
    categoryName: "Financial Reports",
    description: "Financial statements and reports",
    receiveMode: "email",
  },
  {
    id: "4",
    departmentName: "Marketing",
    categoryName: "Marketing Materials",
    description: "Marketing collateral and assets",
    receiveMode: "upload",
  },
  {
    id: "5",
    departmentName: "IT",
    categoryName: "System Logs",
    description: "System and application logs",
    receiveMode: "folder",
  },
]

export function DocumentCategoryTable() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [openPopover, setOpenPopover] = useState(null)

  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      category.departmentName.toLowerCase().includes(searchLower) ||
      category.categoryName.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    )
  })

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId))
    setOpenPopover(null)
  }

  const handleEditCategory = (categoryId) => {
    setEditingCategory(categoryId)
  }

  const handleSaveCategory = (updatedCategory) => {
    setCategories(categories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)))
    setEditingCategory(null)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  const getReceiveModeBadge = (mode) => {
    switch (mode) {
      case "upload":
        return <Badge className="bg-blue-500">Upload</Badge>
      case "folder":
        return <Badge className="bg-green-500">File Watcher</Badge>
      case "email":
        return <Badge className="bg-amber-500">Email</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#335aff]">
              <TableHead>Department</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Receive Mode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) =>
                editingCategory === category.id ? (
                  <TableRow key={category.id}>
                    <TableCell colSpan={5}>
                      <DocumentCategoryForm
                        category={category}
                        onSave={handleSaveCategory}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={category.id}>
                    <TableCell>{category.departmentName}</TableCell>
                    <TableCell>{category.categoryName}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-center">{getReceiveModeBadge(category.receiveMode)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditCategory(category.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Popover 
                          open={openPopover === category.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(category.id);
                            } else {
                              setOpenPopover(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Delete Category</h4>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this document category? This action cannot be undone.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setOpenPopover(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}