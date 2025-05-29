import { useState } from "react";
import { Bot, ScrollText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * AI Summary component that displays a document summary in a popover
 * 
 * @param {Object} props
 * @param {string} props.documentId - The ID of the document to analyze
 * @param {Function} props.getSummary - Function that returns the summary text for a document ID
 * @param {string} props.title - Optional custom title for the popover
 */
export default function AiSummary({ documentId, getSummary, title = "AI Summary" }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the summary text for this document
  const summaryText = getSummary(documentId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          title={title}
        >
          <ScrollText className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            {title}
          </h4>
          <div className="text-sm text-gray-700 border-l-2 border-purple-200 pl-3">
            {summaryText}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}