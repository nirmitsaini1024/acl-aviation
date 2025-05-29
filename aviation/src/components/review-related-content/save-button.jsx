import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Clock, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import SignatureComponent from "../signature/signature-component"

export function SaveButton({ title, isInReview }) {
  const [fileName, setFileName] = useState(title || "KSP_SAMPLE")
  const [inputValue, setInputValue] = useState(title || "KSP_SAMPLE")
  const [notifyAll, setNotifyAll] = useState(false)

  const [showPopover, setShowPopover] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionSignature, setRejectionSignature] = useState(null)

  function getCurrentTimestamp() {
    const now = new Date()
    return now.toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-")
  }

  function handleTimestampClick() {
    const timestamp = getCurrentTimestamp()
    const baseName = inputValue.trim() !== "" ? inputValue : fileName
    const newFileName = baseName.replace(/_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/, "")
    setInputValue(`${newFileName}_${timestamp}`)
  }

  function handleSaveClick(e) {
    const trimmedValue = inputValue.trim()
    const nameToSave = trimmedValue || fileName

    if (isInReview && notifyAll) {
      setShowPopover(true)
    } else {
      setFileName(nameToSave)
      console.log(`Saving document as: ${nameToSave}`)
    }
  }

  function handleFinalConfirm() {
    console.log("✅ Final Save Triggered")
    console.log("File Name:", inputValue)
    console.log("Reason:", rejectionReason)
    console.log("Signature:", rejectionSignature)

    setShowPopover(false)
    setRejectionReason("")
    setRejectionSignature(null)
  }

  return (
    <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-md z-10">
      <div className="container mx-auto flex justify-end items-center gap-2">
        {isInReview ? (
          <p className="relative mr-4 bg-zinc-100 rounded-md px-4 py-1">{inputValue}</p>
        ) : (
          <div className="relative max-w-xs w-full">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter file name"
              className="pr-10 border-b border-gray-300 bg-gray-100/60"
            />
            <Pencil className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
          </div>
        )}

        {!isInReview && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTimestampClick}
            className="flex items-center gap-1 text-gray-600"
          >
            <Clock className="h-4 w-4" />
            Timestamp
          </Button>
        )}

        {isInReview && (
          <div className="flex items-center gap-2 mr-2">
            <Checkbox
              id="notifyAll"
              checked={notifyAll}
              onCheckedChange={setNotifyAll}
              className="border border-zinc-600"
            />
            <label htmlFor="notifyAll" className="text-sm text-gray-700 cursor-pointer">
              Notify All
            </label>
          </div>
        )}

<Popover open={showPopover && notifyAll} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSaveClick}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-96">
            <div className="space-y-4">
              <p className="text-base font-medium text-red-600">Signature Required</p>
              <SignatureComponent onSave={setRejectionSignature} />
              <Textarea
                placeholder="Enter reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-24"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPopover(false)
                    setRejectionReason("")
                    setRejectionSignature(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleFinalConfirm}
                  disabled={!rejectionReason.trim() || !rejectionSignature}
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
