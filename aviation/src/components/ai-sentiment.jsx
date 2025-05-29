import { useState } from "react";
import { Sparkles, Smile, Meh, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * AI Sentiment component that displays a document sentiment analysis in a popover
 * 
 * @param {Object} props
 * @param {string} props.documentId - The ID of the document to analyze
 * @param {Function} props.getSentiment - Function that returns the sentiment for a document ID
 * @param {string} props.title - Optional custom title for the popover
 */
export default function AiSentiment({ documentId, getSentiment, title = "Document Sentiment" }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the sentiment for this document
  const sentiment = getSentiment(documentId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          title={title}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center">
            <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
            {title}
          </h4>
          <div className="flex justify-center space-x-4 py-2">
            <div className={`flex flex-col items-center text-green-500 ${sentiment === "positive" ? "opacity-100" : "opacity-40"}`}>
              <Smile className="h-8 w-8 " />
              <span className="text-xs mt-1">Positive</span>
            </div>
            <div className={`flex flex-col items-center text-yellow-500 ${sentiment === "neutral" ? "opacity-100" : "opacity-40"}`}>
              <Meh className="h-8 w-8 " />
              <span className="text-xs mt-1">Neutral</span>
            </div>
            <div className={`flex flex-col items-center text-red-500 ${sentiment === "negative" ? "opacity-100" : "opacity-40"}`}>
              <Frown className="h-8 w-8 " />
              <span className="text-xs mt-1">Negative</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}