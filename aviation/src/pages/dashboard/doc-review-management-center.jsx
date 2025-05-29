import { useState, useRef } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { File, FileText, Check } from "lucide-react"
import { FileUpload } from "@/components/doc-review-management-center/file-upload"
import DocumentTable  from "@/components/doc-review-management-center/document-table"
import { KanbanBoard } from "@/components/doc-review-management-center/kanban-board"
import SignatureComponent from "@/components/signature/signature-component"

export default function Home() {
  const [documents, setDocuments] = useState([])
  const [showReviewPopover, setShowReviewPopover] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [signature, setSignature] = useState(null)
  
  const triggerRef = useRef(null)

  const departments = ["Accounts", "Recruitment", "Development", "Marketing", "Sales", "Legal", "Operations"]

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleAddDocument = (newDocument) => {
    setDocuments([...documents, newDocument])
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id && over.id) {
      const updatedDocuments = [...documents]
      const documentIndex = updatedDocuments.findIndex((doc) => doc.id === active.id)

      if (documentIndex !== -1) {
        // Update document status based on the container it was dropped into
        updatedDocuments[documentIndex].status = over.id
        setDocuments(updatedDocuments)
      }
    }
  }

  const toggleDocumentStatus = (id, field = "isFinal") => {
    const updatedDocuments = [...documents]
    const documentIndex = updatedDocuments.findIndex((doc) => doc.id === id)

    if (documentIndex !== -1) {
      updatedDocuments[documentIndex][field] = !updatedDocuments[documentIndex][field]
      // Also update the status to match
      updatedDocuments[documentIndex].status = updatedDocuments[documentIndex].isFinal ? "final" : "working"
      setDocuments(updatedDocuments)
    }
  }

  const handleSignatureSave = (signatureURL) => {
    setSignature(signatureURL)
  }

  const handleConfirm = () => {
    alert("Review confirmed with signature!")
    setShowReviewPopover(false)
  }

  const finalVersionDocs = documents.filter((doc) => doc.status === "final")
  const workingCopyDocs = documents.filter((doc) => doc.status === "working")
  const reviewDocs = documents.filter((doc) => doc.status === "review")

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-10 text-center pt-6 text-blue-800">Document Management System</h1>

        <div className="mb-10">
          <FileUpload onAddDocument={handleAddDocument} />
        </div>

        {documents.length > 0 && (
          <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800">Document List</h2>
            </div>
            <DocumentTable documents={documents} onToggleStatus={toggleDocumentStatus} />
          </div>
        )}

        <div className="mb-10">
          <div className="p-4 bg-white rounded-t-xl shadow-sm border border-blue-100 border-b-0">
            <h2 className="text-xl font-semibold text-blue-800">Document Workflow</h2>
          </div>
          <div className="bg-white rounded-b-xl shadow-md border border-blue-100 p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanBoard id="final" title="Final Version" documents={finalVersionDocs} />
                <KanbanBoard id="working" title="Working Copy" documents={workingCopyDocs} />
                <KanbanBoard id="review" title="In Review" documents={reviewDocs} highlight={true} />
              </div>
            </DndContext>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
          <div className="w-full md:w-64">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="border-blue-100 focus:border-blue-300">
                <SelectValue placeholder="Select Department for Review" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Popover open={showReviewPopover} onOpenChange={setShowReviewPopover}>
            <PopoverTrigger asChild>
              <button
                ref={triggerRef}
                onClick={() => setShowReviewPopover(true)}
                className={`px-8 py-3 rounded-md text-white font-medium shadow-md transition-all transform hover:scale-105 ${
                  reviewDocs.length === 0 || !selectedDepartment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={reviewDocs.length === 0 || !selectedDepartment}
              >
                Start Review Process
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 border border-blue-100 p-0" side="top" align="center">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <h2 className="text-blue-800 text-lg font-semibold">Review Process - {selectedDepartment}</h2>
              </div>

              <div className="space-y-6 p-4">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 text-red-700">
                    <File className="h-5 w-5 text-red-500" />
                    Final Version Documents
                  </h3>
                  {reviewDocs.filter(doc => doc.isFinal).length > 0 ? (
                    <ul className="space-y-2">
                      {reviewDocs.filter(doc => doc.isFinal).map((doc) => (
                        <li key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-red-50 rounded-md">
                          <File className="h-4 w-4 text-red-500" />
                          {doc.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No final version documents available</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 text-blue-700">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Working Copy Documents
                  </h3>
                  {reviewDocs.filter(doc => !doc.isFinal).length > 0 ? (
                    <ul className="space-y-2">
                      {reviewDocs.filter(doc => !doc.isFinal).map((doc) => (
                        <li key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-md">
                          <FileText className="h-4 w-4 text-blue-500" />
                          {doc.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No working copy documents available</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-green-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Signature Required
                  </h3>
                  <SignatureComponent onSave={handleSignatureSave} />
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 border-t border-blue-100 bg-gray-50">
                <Button variant="outline" onClick={() => setShowReviewPopover(false)} className="border-blue-200 text-blue-700">
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  disabled = {!signature}
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </main>
  )
}