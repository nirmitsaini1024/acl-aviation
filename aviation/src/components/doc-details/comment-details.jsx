import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { CommentSection } from "./comment-section";

export const CommentDetails = ({ revision, selectedRefId, onRefClick }) => {
  if (!revision.commentReferences || revision.commentReferences.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white border-b p-4 rounded-t-md">
        <CardTitle className="text-lg">Comment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex border-b mb-4" id="refee">
          {revision.commentReferences.map((reference, index) => (
            <div
              key={reference.id}
              className={cn(
                "px-6 py-3 cursor-pointer hover:bg-slate-50 text-center",
                selectedRefId === reference.id
                  ? "border-b-2 border-blue-500 bg-slate-50 font-medium"
                  : "border-b border-transparent"
              )}
              onClick={() => onRefClick(reference.id)}
            >
              <div className="flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-semibold">
                  Reference {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Details Content */}
        <div>
          {selectedRefId && (
            <div className="">
              <div className="p-2 bg-gray-50 mb-4 rounded-md">
                <h3 className="font-medium">{revision.commentReferences[selectedRefId - 1].text}</h3>
                <p>
                  {revision.commentReferences[selectedRefId - 1].referenceText}
                </p>
              </div>
              <CommentSection />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
