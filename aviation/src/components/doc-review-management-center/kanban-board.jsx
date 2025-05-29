import React, { useContext } from "react";
import { DocumentContext } from "../review-administration/contexts/DocumentContext";
import { File, FileText, ClipboardCheck } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";

// DocumentCard component
function DocumentCard({ document }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: document.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-grab active:cursor-grabbing"
    >
      <Card className="border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {document.isFinal ? (
              <File className="h-5 w-5 text-red-500 flex-shrink-0" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
            )}
            <div className="truncate font-medium">
             {document.name.replace(/\.[^/.]+$/, "")}
          </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="uppercase font-medium">{document.fileType}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// DropZone component with visual feedback
function DropZone({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`h-full w-full ${isOver ? 'bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg' : ''}`}
      style={{ minHeight: '300px' }}
    >
      {children}
    </div>
  );
}

// KanbanBoard component
export function KanbanBoard({ id, title, documents, highlight = false }) {
  return (
    <div
      className={`rounded-lg shadow-sm p-4 ${
        highlight
          ? "bg-amber-50 border border-amber-200"
          : id === "final"
            ? "bg-red-50 border border-red-100"
            : "bg-blue-50 border border-blue-100"
      }`}
    >
      <h3 className="font-medium mb-4 flex items-center gap-2 pb-2 border-b border-blue-100">
        {id === "final" ? (
          <File className="h-5 w-5 text-red-500" />
        ) : id === "working" ? (
          <FileText className="h-5 w-5 text-blue-500" />
        ) : (
          <ClipboardCheck className="h-5 w-5 text-amber-500" />
        )}
        {title} ({documents.length})
      </h3>

      {/* Wrap content in DropZone to ensure we're dropping into columns */}
      <DropZone id={id}>
        {/* Always show scroll bar with fixed height */}
        <div 
          className="min-h-[300px] h-[300px] overflow-y-scroll overflow-x-hidden pr-1"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E1 transparent',
          }}
        >
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}

          {documents.length === 0 && (
            <div className="h-[150px] border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 bg-white/50">
              Drag documents here
            </div>
          )}
        </div>
      </DropZone>
    </div>
  );
}

// Main container component
export function KanbanContainer() {
  const { documents } = useContext(DocumentContext);
  
  // Ensure we're getting ALL documents in each category
  const finalVersionDocs = documents.filter((doc) => doc.status === "final");
  const workingCopyDocs = documents.filter((doc) => doc.status === "working");
  const reviewDocs = documents.filter((doc) => doc.status === "review");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanBoard id="final" title="Previous Final Versions" documents={finalVersionDocs} />
      <KanbanBoard id="working" title="Working Copy" documents={workingCopyDocs} />
      <KanbanBoard id="review" title="For Review" documents={reviewDocs} highlight={true} />
    </div>
  );
}

export default KanbanContainer;