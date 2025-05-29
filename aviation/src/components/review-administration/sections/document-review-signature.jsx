import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { File, FileText, Check, CheckCircle, Send } from "lucide-react";
import SignatureComponent from "@/components/signature/signature-component";
import { DocumentContext } from "../contexts/DocumentContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanContainer } from "@/components/doc-review-management-center/kanban-board";
import { Label } from "@/components/ui/label";

export const DocumentSignature = () => {
  const {
    documents,
    selectedDepartment,
    setSelectedDepartment,
    setSelectedCategory,
    selectedCategory,
    signature,
    handleSignatureSave,
    handleConfirm,
    handleDragEnd,
    isSubmitted,
    domain, 
    setDomain
  } = useContext(DocumentContext);

  const [selectedWorkingGroup, setSelectedWorkingGroup] = useState("");
  //   const [domain, setDomain] = useState("")
  // const [department, setDepartment] = useState("")
  // const [category, setCategory] = useState("");

   const domains = ["Airport", "Airline"];

  const departments = [
    "Airport Security",
    "Airport Operations",
    "Public Safety",
    "TSA",
    "FAA",
  ];

  const departmentOptions = {
    "Airport": ["TSA", "FAA", "Airport Security", "Airport Operations", "Public Safety"],
    "Airline": ["Airline Security", "Airline Operations"]
  }
  const categories = ["ASP", "AEP", "ACM", "SMS", "ADFAP(Airport), ADFP"];
  const workingGroups = [
    "ASP Working Group",
    "Security Working Group",
    "Airline Security Group",
    "Terminal Working Group",
  ];
  const categoryOptions = {
    "Airport": ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
    "Airline": ["ASP", "ADFP"]
  }

  const reviewDocs = documents.filter((doc) => doc.status === "review");
  const finalReviewDocs = reviewDocs.filter((doc) => doc.isFinal === true);
  const workingReviewDocs = reviewDocs.filter((doc) => doc.isFinal !== true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="space-y-8">
      {/* Document Workflow Section */}
      <div className="mb-10">
        <div className="p-4 bg-white rounded-t-xl shadow-sm border border-blue-100 border-b-0">
          <h2 className="text-xl font-semibold text-blue-800">
            Documents for Review
          </h2>
        </div>
        <div className="bg-white rounded-b-xl shadow-md border border-blue-100 p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <KanbanContainer />
          </DndContext>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800">
            Document Review Owner
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Please select the department responsible for review and sign the
            document to confirm.
          </p>

          {/* Department and Category Selection */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select value={domain} onValueChange={setDomain} required>
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domainOption) => (
                    <SelectItem key={domainOption} value={domainOption}>
                      {domainOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                required
                disabled={!domain}
              >
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder={domain ? "Select Department" : "Select Domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {domain && departmentOptions[domain].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                required
                disabled={!domain}
              >
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder={domain ? "Select Category" : "Select Domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {domain && categoryOptions[domain].map((categoryOption) => (
                    <SelectItem key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents for Review */}
      <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800">
            Documents for Review
          </h2>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium flex items-center gap-2 text-red-700">
              <File className="h-5 w-5 text-red-500" />
              Final Version Documents
            </h3>
            {finalReviewDocs.length > 0 ? (
              <ul className="space-y-2">
                {finalReviewDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-2 text-sm p-2 bg-red-50 rounded-md"
                  >
                    <File className="h-4 w-4 text-red-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No final version documents available
              </p>
            )}
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5 text-blue-500" />
              Working Copy Documents
            </h3>
            {workingReviewDocs.length > 0 ? (
              <ul className="space-y-2">
                {workingReviewDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-md"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No working copy documents available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h3 className="text-xl font-medium flex items-center gap-2 text-blue-800">
            <Check className="h-5 w-5 text-blue-600" />
            Signature Required
          </h3>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Please sign below to start the document review process.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <SignatureComponent onSave={handleSignatureSave} />
          </div>

          {signature && (
            <div className="mt-4 text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Signature captured successfully</span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Section with Working Group Dropdown */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        <Label htmlFor="ff">Select Review Panel</Label>
        <div className="w-64">
          <Select
            id="ff"
            value={selectedWorkingGroup}
            onValueChange={setSelectedWorkingGroup}
          >
            <SelectTrigger className="w-full border-blue-100 focus:border-blue-300">
              <SelectValue placeholder="Working Group Approval" />
            </SelectTrigger>
            <SelectContent>
              {workingGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleConfirm}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-8 py-3 text-white font-medium rounded-md shadow-md transition-all transform hover:scale-105"
          disabled={
            !signature ||
            !selectedDepartment ||
            !selectedCategory ||
            reviewDocs.length === 0 ||
            isSubmitted ||
            !selectedWorkingGroup
          }
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Submission Complete
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Start Review Process
            </>
          )}
        </Button>
      </div>

      {(!reviewDocs || reviewDocs.length === 0) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
          <p className="text-yellow-800 text-center">
            No documents are marked for review. Please use the Document Workflow
            above to move documents to the "In Review" column.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentSignature;
