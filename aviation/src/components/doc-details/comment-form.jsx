import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"


export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  buttonText = "Comment",
}) {
  const [content, setContent] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content.trim())
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full mb-0">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" className="bg-blue-500 hover:bg-blue-600 cursor-pointer" disabled={!content.trim()}>
          {buttonText}
        </Button>
      </div>
    </form>
  )
}
