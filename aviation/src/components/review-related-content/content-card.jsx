import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContentCard({ content, onRemove }) {
  return (
    <Card className="border-gray-200 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-3 flex items-center gap-2">
        <div className="flex-grow">{content}</div>
        {onRemove && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}