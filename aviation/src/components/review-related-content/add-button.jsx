import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddButton({ onClick, isWaiting = false }) {
  return (
    <Button 
      onClick={onClick} 
      className={`w-full flex items-center justify-center ${
        isWaiting ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
      disabled={isWaiting}
    >
      {isWaiting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Waiting for selection...
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </>
      )}
    </Button>
  )
}