import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  X,
  ClipboardCheck,
  FileIcon,
  FileText,
} from "lucide-react";

export default function DocumentTable({ documents, onToggleStatus }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-500 hover:bg-blue-600">
            <TableHead className="font-semibold text-white">Document Name</TableHead>
            <TableHead className="font-semibold text-white">Domain</TableHead>
            <TableHead className="font-semibold text-white">Department</TableHead>
            <TableHead className="font-semibold text-white">Category</TableHead>
            <TableHead className="font-semibold text-white">File Type</TableHead>
            <TableHead className="font-semibold text-white">Final Version</TableHead>
            <TableHead className="font-semibold text-white">Working Copy</TableHead>
            <TableHead className="font-semibold text-white">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-blue-50 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {doc.status === "final" ? (
                    <FileIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-500" />
                  )}
                  {doc.name.split(".")[0]}
                </div>
              </TableCell>
              <TableCell>{doc.domain}</TableCell>
              <TableCell>{doc.department}</TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>
                {doc.status === "final" ? (
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs uppercase">
                    {doc.fileType || "pdf"}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs uppercase">
                    {doc.fileType || "docx"}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onToggleStatus(doc.id, "final")}
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded-full transition-colors"
                >
                  {doc.status === "final" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300" />
                  )}
                </button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onToggleStatus(doc.id, "working")}
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded-full transition-colors"
                >
                  {doc.status === "working" ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300" />
                  )}
                </button>
              </TableCell>
              <TableCell>
                {doc.status === "review" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                    <ClipboardCheck className="h-3 w-3" /> In Review
                  </span>
                ) : doc.status === "final" ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    Final
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    Working
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
