import React, { useContext } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanBoard } from "@/components/doc-review-management-center/kanban-board"
import { DocumentContext } from "../contexts/DocumentContext" // You'll need to create this context

export const DocumentWorkflowSection = () => {
  // Get document state and handlers from context
  const { documents, handleDragEnd } = useContext(DocumentContext)
  
  const finalVersionDocs = documents.filter((doc) => doc.status === "final")
  const workingCopyDocs = documents.filter((doc) => doc.status === "working")
  const reviewDocs = documents.filter((doc) => doc.status === "review")
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className="mb-10">
      <div className="p-4 bg-white rounded-t-xl shadow-sm border border-blue-100 border-b-0">
        <h2 className="text-xl font-semibold text-blue-800">Select Final and Working Copy</h2>
      </div>
      <div className="bg-white rounded-b-xl shadow-md border border-blue-100 p-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanBoard id="final" title="Previous Final Version" documents={finalVersionDocs} />
            <KanbanBoard id="working" title="Working Copy" documents={workingCopyDocs} />
            <KanbanBoard id="review" title="In Review" documents={reviewDocs} highlight={true} />
          </div>
        </DndContext>
      </div>
    </div>
  )
}

export default DocumentWorkflowSection