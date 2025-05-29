import React, { useState } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from './ui/button'
import { CircleHelp, PlayCircle, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


const HELP_ITEMS = [
  {
    id: 'ref-doc',
    title: 'How to add a reference document',
    description: 'Learn how to add reference documents to your project',
    steps: [
      'Navigate to the Documents section',
      'Click on "Add Reference Document"',
      'Select the file from your computer',
      'Add metadata (title, author, etc.)',
      'Click "Upload" to complete the process'
    ],
    videoUrl: '/help.mp4'
  },
  {
    id: 'export-data',
    title: 'How to export data',
    description: 'Steps to export your project data',
    steps: [
      'Go to the Export section',
      'Select the data format (CSV, JSON, etc.)',
      'Choose which data to include',
      'Click "Export" and save the file'
    ],
    videoUrl: '/help.mp4'
  },
  {
    id: 'user-management',
    title: 'User management guide',
    description: 'How to add and manage users',
    steps: [
      'Open the Admin panel',
      'Navigate to User Management',
      'Click "Add User"',
      'Fill in user details and permissions',
      'Send invitation'
    ]
  }
]

const HeaderHelp = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const filteredItems = HELP_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <CircleHelp />
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="bg-blue-600 ">
            <SheetTitle className={"text-white"}>Help Center</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-4 px-4 ">
            <div className="grid items-center gap-4">
              <Input
                id="search"
                placeholder="Search help articles..."
                className="ring-2 ring-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {selectedItem ? (
              <div className="help-details">
                <Button 
                  variant="ghost" 
                  className="mb-4" 
                  onClick={() => setSelectedItem(null)}
                >
                  ← Back to all articles
                </Button>
                
                <h3 className="text-xl font-semibold mb-2 text-blue-600">{selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedItem.description}</p>
                
                {selectedItem.steps && (
                  <div className="steps mb-6">
                    <h4 className="font-medium mb-2">Steps:</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {selectedItem.steps.map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {selectedItem.videoUrl && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    <PlayCircle size={16} /> Watch tutorial video
                  </Button>
                )}
              </div>
            ) : (
              <div className="help-items space-y-3">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 border rounded-lg hover:bg-blue-100 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No help articles found</p>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title} Tutorial</DialogTitle>
          </DialogHeader>
          <div className="video-container mt-4">
            {selectedItem?.videoUrl && (
              <video controls autoPlay className="w-full rounded-lg">
                <source src={selectedItem.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HeaderHelp