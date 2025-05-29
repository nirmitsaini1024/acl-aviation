import React, { useContext } from "react"
import { FileUpload } from "@/components/doc-review-management-center/file-upload"
// Use default import for DocumentTable
import { DocumentContext } from "../contexts/DocumentContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const UploadAndTableSection = () => {
  // Get document state and handlers from context
  const { documents, handleAddDocument, toggleDocumentStatus } = useContext(DocumentContext)

  return (
    <>
      <div className="mb-6">
        <FileUpload onAddDocument={handleAddDocument} />
      </div>

    
    </>
  )
}

export default UploadAndTableSection