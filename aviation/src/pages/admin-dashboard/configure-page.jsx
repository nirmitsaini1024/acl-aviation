import { useState } from "react"
import { Save, Loader2, Plus, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Initial page mapping data
const initialPageMappings = [
  { id: "1", pageName: "Page 1", pageUrl: "/dashboard" },
  { id: "2", pageName: "Page 2", pageUrl: "/users" },
  { id: "3", pageName: "Page 3", pageUrl: "/reports" },
  { id: "4", pageName: "Page 4", pageUrl: "/settings" },
]

export default function PageUrlMapping() {
  const [pageMappings, setPageMappings] = useState(initialPageMappings)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [openPopover, setOpenPopover] = useState(null)

  // Filter pages based on search query
  const filteredPages = pageMappings.filter(page => 
    page.pageName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    page.pageUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (id, field, value) => {
    setPageMappings(prev => 
      prev.map(page => 
        page.id === id ? { ...page, [field]: value } : page
      )
    )
    setHasChanges(true)
  }

  const handleAddNewPage = () => {
    const newId = `new-${Date.now()}`
    setPageMappings(prev => [
      ...prev, 
      { id: newId, pageName: "", pageUrl: "" }
    ])
    setHasChanges(true)
  }

  const handleDeletePage = (id) => {
    setPageMappings(prev => prev.filter(page => page.id !== id))
    setHasChanges(true)
    setOpenPopover(null)
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)

    // Validate no empty fields
    const hasEmptyFields = pageMappings.some(page => !page.pageName.trim() || !page.pageUrl.trim())
    
    if (hasEmptyFields) {
      alert("Please fill in all page names and URLs before saving.")
      setIsLoading(false)
      return
    }

    // Simulate API call
    try {
      // In a real application, you would make an API call to save the page mappings
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHasChanges(false)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Page URL Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleAddNewPage} className="ml-4 bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add New Page
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-blue-600 bg-blue-600">
                  <TableHead className="w-[200px]">Page Name</TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No pages found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Input
                          value={page.pageName}
                          onChange={(e) => handleInputChange(page.id, "pageName", e.target.value)}
                          placeholder="Enter page name"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={page.pageUrl}
                          onChange={(e) => handleInputChange(page.id, "pageUrl", e.target.value)}
                          placeholder="Enter page URL (e.g., /dashboard)"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Popover
                          open={openPopover === page.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(page.id);
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
                          <PopoverContent className="w-60 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this page mapping.
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
                                  onClick={() => handleDeletePage(page.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {hasChanges && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}