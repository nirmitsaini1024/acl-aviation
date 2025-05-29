// NOTE: This separate component is now obsolete since the functionality has been 
// integrated directly into the Home component. This file can be deleted.
// See the updated Home component for the integrated review popover functionality.

import { useState } from "react"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { File, FileText, Check } from "lucide-react"
import SignatureComponent from "../signature/signature-component"

// This component is now obsolete since the functionality is integrated directly
// in the Home component
export function ReviewPopover({ documents, department, onClose }) {
  const [open, setOpen] = useState(true)
  const finalVersions = documents.filter((doc) => doc.isFinal)
  const workingCopies = documents.filter((doc) => !doc.isFinal)
  const [signature, setSignature] = useState(null)

  const handleConfirm = () => {
    if (!signature) {
      alert("Please provide a signature first!")
      return
    }
    
    alert("Review confirmed with signature!")
    setOpen(false)
    onClose()
  }

  const handleSignatureSave = (signatureURL) => {
    setSignature(signatureURL)
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (!isOpen) {
      onClose()
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        {/* This trigger is needed but not actually used */}
        <span className="hidden"></span>
      </PopoverTrigger>
      <PopoverContent className="w-96 border border-blue-100 p-0">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-blue-800 text-lg font-semibold">Review Process - {department}</h2>
        </div>

        <div className="space-y-6 p-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-red-700">
              <File className="h-5 w-5 text-red-500" />
              Final Version Documents
            </h3>
            {finalVersions.length > 0 ? (
              <ul className="space-y-2">
                {finalVersions.map((doc) => (
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
            {workingCopies.length > 0 ? (
              <ul className="space-y-2">
                {workingCopies.map((doc) => (
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
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="border-blue-200 text-blue-700">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}