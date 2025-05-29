import React, { useRef, useState } from "react";
import {
  FileText,
  Eye,
  Clock,
  UsersRound,
  CornerDownRight,
  FileDown,
  UserPen,
  ClipboardList,
  Bot,
  Ellipsis,
  Tag,
  Briefcase,
  Building,
  User,
  Link,
  Unlink,
  ChevronDown,
  X,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { documentData } from "@/mock-data/review-adm-approved-table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";

import html2pdf from "html2pdf.js";
import CommentedCopyPDFViewer from "../commented-copy-pdf-viewer";
import PDFViewer from "../doc-reviewer/pdf-viewer";
import PDFTableViewer from "../doc-reviewer/pdf-no-comment-viewer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Approval nodes data (extracted from DocumentTable)
const approvalNodes = [
  {
    id: "1",
    label: "Application Security Group",
    type: "group",
    status: "Initiated",
    attributes: [
      { name: "Role", value: "ASC" },
      { name: "Department", value: "ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "2" },
    ],
  },
  {
    id: "2",
    label: "Non-Application Security Group",
    type: "group",
    status: "Assigned",
    attributes: [
      { name: "Role", value: "Non-ASC" },
      { name: "Department", value: "Non-ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "5" },
    ],
  },
  {
    id: "3",
    label: "TSA",
    type: "group",
    status: "Not Assigned",
    attributes: [
      { name: "Role", value: "TSA" },
      { name: "Department", value: "TSA" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "5" },
    ],
  },
  {
    id: "4",
    label: "Application Security Group",
    type: "group",
    status: "Not Assigned",
    attributes: [
      { name: "Role", value: "ASC" },
      { name: "Department", value: "ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "2" },
    ],
  },
];

const cctData = [
  {
    category: "Airline Defense Maintenance",
    references: ["ABC 1", "ABC 11"],
  },
  {
    category: "Airport Safety and Compliance",
    references: ["ABC 2"],
  },
  {
    category: "Airline Defense Maintenance",
    references: ["XYZ 1"],
  },
  {
    category: "Airport Safety and Compliance",
    references: ["ABC 11", "ABC 22"],
  },
];
const mockDocumentReferences = {
  1: ["ref1", "ref2"], // First document has 2 reference docs
  2: ["ref3", "ref4", "ref5"], // Second document has 3 reference docs
  3: ["ref1", "ref3"], // Third document has 2 reference docs
  4: ["ref2", "ref5", "ref6"], // Fourth document has 3 reference docs
  // Add more as needed based on your documentData IDs
};

// Mock data for reference documents
const mockReferenceDocuments = [
  { id: "ref1", name: "Airport Security Manual", type: "PDF" },
  { id: "ref2", name: "TSA Compliance Guidelines", type: "PDF" },
  { id: "ref3", name: "Aviation Safety Protocol", type: "DOCX" },
  { id: "ref4", name: "Emergency Response Procedures", type: "PDF" },
  { id: "ref5", name: "Aircraft Maintenance Standards", type: "PDF" },
  { id: "ref6", name: "Security Personnel Training Guide", type: "DOCX" },
  { id: "ref7", name: "Baggage Screening Protocol", type: "PDF" },
  { id: "ref8", name: "Access Control Procedures", type: "PDF" },
  { id: "ref9", name: "Incident Reporting Guidelines", type: "DOCX" },
  { id: "ref10", name: "Security Audit Checklist", type: "PDF" },
  { id: "ref11", name: "Perimeter Security Standards", type: "PDF" },
  { id: "ref12", name: "Cyber Security Framework", type: "DOCX" },
  { id: "ref13", name: "International Aviation Standards", type: "PDF" },
  { id: "ref14", name: "Risk Assessment Template", type: "PDF" },
  { id: "ref15", name: "Security Training Schedule", type: "PDF" },
];

// Reference texts matching the image
const referenceTexts = {
  "ABC 1": {
    text: "Monitor: To observe the delivery of merchandise and consumables, in person or via closed-circuit television (CCTV), to ensure there is no unauthorized access to the merchandise or consumables. Monitoring may be performed by multiple personnel who have been trained to carry out this responsibility.  Monitoring personnel must be capable of immediately initiating a response to any unauthorized access or activity near the merchandise or consumables, including immediately contacting laws enforcement or other local authority as appropriate.",
    author: "John Smith",
    authorTitle: "Security Specialist",
    authorGroup: "Airport Security",
    timestamp: "2023-05-15T09:30:00Z",
  },
  "ABC 2": {
    text: "Identification (ID) Media ID: Media is any credential, card, badge, or other media issued for ID purposes and used at an airport. This includes, bus is not limited to, media signifying unescorted access to an Air Operations Area (AOA), Secured Area/SIDA, or Sterile Area.",
    author: "Sarah Johnson",
    authorTitle: "Compliance Officer",
    authorGroup: "TSA",
    timestamp: "2023-05-16T11:15:00Z",
  },
  "XYZ 1": {
    text: "Secured Area: Means a portion of an airport, specified in the airport security program, in which certain security measures specified in Part 1542 of this chapter are carried out.  This area is where aircraft operators and foreign air carriers that have a security program under Part 1544 or 1546 of this chapter enplane and deplane passengers and sort and load baggage and any adjacent areas that are not separated by adequate security measures ",
    author: "Michael Brown",
    authorTitle: "Security Manager",
    authorGroup: "Airline Defense",
    timestamp: "2023-05-14T14:45:00Z",
  },
  "ABC 11": {
    text: "The ASC serves as the Airport operator's 24-hour primary and immediate contact for security-related activities and communications with the TSA, FAA, and Airport tenants. The ASC also is charged with general oversight of Airport security functions, including managerial elements, as required to maintain Airport security under 49 CFR Part 1542. Additional responsibilities include, but are not limited to: ",
    author: "Emily Davis",
    authorTitle: "Operations Lead",
    authorGroup: "Airport Safety",
    timestamp: "2023-05-17T10:20:00Z",
  },
  "ABC 22": {
    text: "KMMW uses the Physical Access Control System (ACS). It is a comprehensive security solution designed to manage and control access to physical spaces within the Airport. All individuals requiring access to the Secured Area must possess, use, and visibly display an appropriate identification badge as described in Section X of this ASP. Individuals without Airport identification badges, who require access to the Secured Area, must be kept under escort.",
    author: "Robert Wilson",
    authorTitle: "Security Director",
    authorGroup: "TSA",
    timestamp: "2023-05-18T13:10:00Z",
  },
};

// Approver data for each reference
const approverData = {
  "ABC 1": {
    name: "Jane Anderson",
    title: "Senior Security Analyst",
    group: "TSA",
    timestamp: "2023-05-20T14:15:00Z",
    signature: "/signatures/jane-anderson.png",
  },
  "ABC 2": {
    name: "David Miller",
    title: "Compliance Manager",
    group: "FAA",
    timestamp: "2023-05-21T09:30:00Z",
    signature: "/signatures/david-miller.png",
  },
  "XYZ 1": {
    name: "Lisa Thompson",
    title: "Security Supervisor",
    group: "Airline Defense",
    timestamp: "2023-05-19T16:45:00Z",
    signature: "/signatures/lisa-thompson.png",
  },
  "ABC 11": {
    name: "Mark Johnson",
    title: "Operations Manager",
    group: "Airport Safety",
    timestamp: "2023-05-22T11:20:00Z",
    signature: "/signatures/mark-johnson.png",
  },
  "ABC 22": {
    name: "Karen White",
    title: "Chief Security Officer",
    group: "TSA",
    timestamp: "2023-05-23T10:15:00Z",
    signature: "/signatures/karen-white.png",
  },
};

// Reference Documents Dialog Component
const ReferenceDocumentsDialog = ({
  isOpen,
  onClose,
  selectedDocIds,
  onSave,
  currentDocId,
}) => {
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedDocIds);

  const handleDocumentToggle = (docId) => {
    setTempSelectedIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSave = () => {
    onSave(tempSelectedIds);
    onClose();
  };

  // Filter out the current document from the list
  const availableDocuments = mockReferenceDocuments.filter(
    (doc) => doc.id !== currentDocId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Reference Documents</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {availableDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={tempSelectedIds.includes(doc.id)}
                    onCheckedChange={() => handleDocumentToggle(doc.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`doc-${doc.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {doc.name}
                    </label>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Replace the existing ReferenceDocumentsPopover component with this updated version:

const ReferenceDocumentsPopover = ({
  isOpen,
  onOpenChange,
  referenceDocuments,
  onRemoveDocument,
}) => {
  const handleViewDocument = () => {
    window.open("/refdoc", "_blank"); // Opens in new tab
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex gap-1 text-[#1a56db] py-1 font-normal cursor-pointer border-none shadow-none hover:text-blue-600 hover:bg-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <Link className="h-full w-full" />
          <span>Ref Docs ({referenceDocuments.length})</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[600px] max-h-[250px] overflow-y-auto"
        side="right"
        align="start"
        sideOffset={10}
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
            <span>Referenced Documents</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </h4>
          <div className="w-full">
            {referenceDocuments.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No referenced documents
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-blue-500 rounded-md text-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Document
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Added By
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referenceDocuments.map((doc, index) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500 " />
                          <div>
                            <div className="flex gap-4">
                              <p className="font-medium line-clamp-1">
                                {doc.name}
                              </p>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDocument();
                                      }}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Document</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {doc.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{doc.addedBy || "John Doe"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {doc.dateAdded ? (
                          <span className="text-gray-800">
                            {new Date(doc.dateAdded).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        ) : (
                          <span className=" ">22-05-2025</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FullPagePopup = ({
  isOpen,
  onClose,
  children,
  title,
  setIsDownloading = () => {},
  exportButton = false,
}) => {
  if (!isOpen) return null;

  const tableRef = useRef();

  const handleExportPDF = async () => {
    const element = tableRef.current;
    console.log("starting");

    const opt = {
      margin: 0.5,
      filename: "documents-summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    try {
      setIsDownloading(true);
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsDownloading(false);
      console.log("ended downloading");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-[#ffffff] w-11/12 max-w-[1400px] h-5/6 rounded-md shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-b-[#1a56db] bg-[#1a56db]">
          <h2 className="text-lg font-semibold text-[#ffffff]">{title}</h2>
          <div className="flex gap-2 items-center">
            {exportButton && (
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  console.log("Export clicked");
                  await handleExportPDF();
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer px-6 shadow-md flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" /> Export as PDF
              </Button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("Close clicked");
                onClose();
              }}
              className="text-[#ffffff] hover:text-gray-200 text-3xl font-bold cursor-pointer flex"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[calc(100%-60px)]">
          <div className="p-12" ref={tableRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentApprovedTable = ({ setIsBotOpen }) => {
  const [documents, setDocuments] = useState(documentData);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFullPagePopupOpen, setIsFullPagePopupOpen] = useState(false);
  const [isCommentedOpen, setIsCommentedCopyOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);

  // Review Panel state (extracted from DocumentTable)
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);

  // Reference documents state - REPLACE THIS SECTION
  const [referenceDocsDialogOpen, setReferenceDocsDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  // Initialize with mock data instead of empty object
  const [documentReferences, setDocumentReferences] = useState(
    mockDocumentReferences
  );
  const [referencePopovers, setReferencePopovers] = useState({});

  const handleWebViewerLoad = () => {
    setIsWebViewerLoaded(true);
  };

  // Handle review cycle click (extracted from DocumentTable)
  const handleReviewCycleClick = (docId, e) => {
    e.stopPropagation();
    if (expandedReviewCycle === docId) {
      setExpandedReviewCycle(null);
    } else {
      setExpandedReviewCycle(docId);
    }
  };

  const getDomainBadge = (doc) => {
    if (!doc.domain) return null;

    const colors = {
      Airport: "bg-blue-100 text-blue-800 border-blue-200",
      Airline: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <Badge
        variant="outline"
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${
          colors[doc.domain] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Building className="h-3.5 w-3.5" />
        <span>{doc.domain}</span>
      </Badge>
    );
  };

  const getCategoryBadge = (doc) => {
    if (!doc.category) return null;

    const colors = {
      ASP: "bg-purple-100 text-purple-800 border-purple-200",
      AEP: "bg-amber-100 text-amber-800 border-amber-200",
      ACM: "bg-sky-100 text-sky-800 border-sky-200",
      SMS: "bg-rose-100 text-rose-800 border-rose-200",
      "ADFAP (Airport)": "bg-indigo-100 text-indigo-800 border-indigo-200",
      ADFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    return (
      <Badge
        variant="outline"
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${
          colors[doc.category] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Tag className="h-3.5 w-3.5" />
        <span>{doc.category}</span>
      </Badge>
    );
  };

  const getDocumentTypeBadge = (doc) => {
    if (!doc.type) return null;
    return (
      <Badge
        variant="secondary"
        className="px-2 py-0.5 bg-gray-100 text-gray-600 flex items-center gap-1.5"
      >
        <Tag className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{doc.type}</span>
      </Badge>
    );
  };

  const DocumentBadgesSection = ({
    doc,
    showType = true,
    showDomain = true,
    showCategory = true,
    className = "mt-1 inline-flex items-center gap-1.5",
    onClick,
  }) => {
    const handleClick = (e) => {
      if (onClick) {
        onClick(e);
      } else {
        e.stopPropagation();
      }
    };

    return (
      <div className={className} onClick={handleClick}>
        {showDomain && getDomainBadge(doc)}
        {showType && getDocumentTypeBadge(doc)}
        {showCategory && getCategoryBadge(doc)}
      </div>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSummaryClick = (doc) => {
    console.log("Summary clicked for document:", doc);
    setSelectedDocument(doc);
    setIsFullPagePopupOpen(true);
  };

  const handleCommentedCopyClick = () => {
    setIsCommentedCopyOpen(true);
  };

  const handleClosePopup = () => {
    setIsFullPagePopupOpen(false);
    setSelectedDocument(null);
  };

  const handleCommentedCopyClosePopup = () => {
    setIsCommentedCopyOpen(false);
    setIsViewOpen(false);
    setIsWebViewerLoaded(false);
  };

  // Reference documents handlers
  const handleOpenReferenceDialog = (doc) => {
    setSelectedDoc(doc);
    setReferenceDocsDialogOpen(true);
  };

  const handleSaveReferenceDocuments = (selectedDocIds) => {
    if (selectedDoc) {
      setDocumentReferences((prev) => ({
        ...prev,
        [selectedDoc.id]: selectedDocIds,
      }));
    }
  };

  const handleRemoveReferenceDocument = (docId, refDocId) => {
    setDocumentReferences((prev) => ({
      ...prev,
      [docId]: prev[docId].filter((id) => id !== refDocId),
    }));
  };

  const getReferenceDocuments = (docId) => {
    const refIds = documentReferences[docId] || [];
    return mockReferenceDocuments.filter((doc) => refIds.includes(doc.id));
  };

  const toggleReferencePopover = (docId) => {
    setReferencePopovers((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  return (
    <div className="border-1 border-gray-400 rounded-md w-full overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-600 text-left ">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-50">
              Document Name
            </th>
            <th className="px-4 py-3 font-semibold text-gray-50">Owner</th>
            <th className="px-4 py-3 font-semibold text-gray-50">
              Uploaded TS
            </th>
            <th className="px-4 py-3 font-semibold text-gray-50">
              Approved TS
            </th>
            <th className="px-4 py-3 font-semibold text-gray-50">Action</th>
            <th className="px-2 py-1 font-semibold text-gray-50 whitespace-nowrap">
              Review Panel
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <tr className="border-t-[1px] border-t-gray-400">
                <td className="">
                  <div className="flex gap-1 px-2 items-center">
                    <FileText className="w-4 h-4 text-[#1a56db] mr-2" />
                    <span className="font-medium">
                      {doc.title}
                      <Badge className="bg-[#fef2f2] text-[#dc2626] text-xs px-2 ml-2">
                        {doc.fileType}
                      </Badge>
                    </span>
                    <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-md bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#16a34a]"></span>
                      Approved
                    </span>
                  </div>
                  {doc.type && (
                    <DocumentBadgesSection
                      doc={doc}
                      showType={true}
                      showDomain={true}
                      showCategory={true}
                      className="mt-1 inline-flex pl-2 mx-auto items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="flex mt-1 px-1 items-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsViewOpen(true);
                      }}
                      className="text-[#1a56db] mr-3 flex items-center text-xs cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Final Copy
                    </button>
                    <button
                      className="text-xs flex gap-1 text-[#1a56db] px-2 py-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSummaryClick(doc);
                      }}
                    >
                      <ClipboardList size={14} />
                      Summary
                    </button>
                    <button
                      className="text-xs flex gap-1 text-[#1a56db] px-2 py-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentedCopyClick();
                      }}
                    >
                      <UserPen size={14} />
                      Annotated Doc
                    </button>
                    {/* Reference Documents Popover */}
                    <ReferenceDocumentsPopover
                      isOpen={referencePopovers[doc.id] || false}
                      onOpenChange={() => toggleReferencePopover(doc.id)}
                      referenceDocuments={getReferenceDocuments(doc.id)}
                      onRemoveDocument={(refDocId) =>
                        handleRemoveReferenceDocument(doc.id, refDocId)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  {doc.owner && (
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">
                          {doc.owner.officer}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm">{doc.owner.department}</span>
                        {doc.domain && (
                          <Badge className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {doc.domain}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="text-sm">{doc.owner.title}</span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-1">
                  <p className="font-normal flex gap-1 items-center text-[#3f3f46]">
                    <Clock size={14} />
                    {formatTimestamp(doc.uploadedAt)}
                  </p>
                </td>
                <td className="py-1 px-2">
                  <p className="font-normal flex gap-1 items-center text-[#3f3f46]">
                    <Clock size={14} />
                    {formatTimestamp(doc.approvedAt)}
                  </p>
                </td>
                <td>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Bot
                        className="mx-auto h-4 w-4 cursor-pointer"
                        onClick={() => {
                          setIsBotOpen(true);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-50 px-2 text-gray-800 border-gray-300 border">Ask AI</TooltipContent>
                  </Tooltip>
                </td>
                {/* Review Panel Cell (extracted from DocumentTable) */}
                <td onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-full flex justify-center items-center ${
                      expandedReviewCycle === doc.id
                        ? "bg-blue-100 text-blue-600"
                        : ""
                    }`}
                    onClick={(e) => handleReviewCycleClick(doc.id, e)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedReviewCycle === doc.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </td>
              </tr>

              {/* Review Cycle Expanded Section (extracted from DocumentTable) */}
              {expandedReviewCycle === doc.id && (
                <tr key={`review-cycle-expanded-${doc.id}`}>
                  <td colSpan={6} className="p-0">
                    <div className="p-4 border-t">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Attributes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {approvalNodes.map((node) => (
                            <tr
                              key={node.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      node.type === "user"
                                        ? "bg-blue-500"
                                        : node.type === "group"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    }`}
                                  ></div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {node.label}
                                  </div>
                                  <Badge
                                    className={`ml-2 ${
                                      node.type === "user"
                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                        : node.type === "group"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    }`}
                                  >
                                    {node.type === "user"
                                      ? "User"
                                      : node.type === "group"
                                      ? "Group"
                                      : "Approval"}
                                  </Badge>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md ${
                                    node.status === "Assigned" ||
                                    node.status === "Initiated"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      node.status === "Assigned" ||
                                      node.status === "Initiated"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    }`}
                                  ></span>
                                  {node.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {node.attributes.map((attr, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center group"
                                    >
                                      <span
                                        className={`bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-blue-200 group-hover:bg-blue-100 transition-colors ${
                                          index % 3 === 1
                                            ? "bg-green-50 text-green-800 border-green-200 group-hover:bg-green-100"
                                            : index % 3 === 2
                                            ? "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100"
                                            : ""
                                        }`}
                                      >
                                        {attr.name}
                                      </span>
                                      <span
                                        className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border ${
                                          index % 3 === 1
                                            ? "border-green-100 border-l-0 group-hover:border-green-200"
                                            : index % 3 === 2
                                            ? "border-purple-100 border-l-0 group-hover:border-purple-200"
                                            : "border-blue-100 border-l-0 group-hover:border-blue-200"
                                        } transition-colors`}
                                      >
                                        {attr.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* All Popup Modals */}
      <FullPagePopup
        isOpen={isFullPagePopupOpen}
        onClose={handleClosePopup}
        title={`${selectedDocument?.title || "Document"} - Review Summary`}
        setIsDownloading={setIsDownloading}
        exportButton={true}
      >
        <div>
          <div className="w-full border border-[#e5e7eb] border-b-0 overflow-hidden">
            {/* Header */}
            <div className="bg-[#f3f4f6] p-2 border-b border-b-[#d1d5db]">
              <h3 className="font-medium text-lg">Document Details</h3>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-6 text-sm">
              {/* Existing Fields */}
              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Owner:
              </div>
              <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.owner?.officer ||
                  selectedDocument?.owner ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Uploaded By:
              </div>
              <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.uploadedByName ||
                  selectedDocument?.owner?.officer ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Department:
              </div>
              <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.department ||
                  selectedDocument?.owner?.department ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Uploaded TS:
              </div>
              <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                {formatTimestamp(selectedDocument?.uploadedAt)}
              </div>

              <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Category:
              </div>
              <div className="col-span-2 p-2 border-r border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.category || "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                File Type:
              </div>
              <div className="col-span-2 p-2 border-[#e5e7eb]">
                {isDownloading ? (
                  <p className="text-[#dc2626] text-xs px-2">pdf</p>
                ) : (
                  <Badge className="bg-[#fef2f2] text-[#dc2626] text-xs px-2">
                    {selectedDocument?.fileType || "N/A"}
                  </Badge>
                )}
              </div>

              {/* Reference Documents Section */}
              <div className="col-span-1 p-2 border-r border-t border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Reference Documents Linked:
              </div>
              <div className="col-span-5 p-2 border-t border-[#e5e7eb] text-[#1a56db] space-y-1 ">
                {selectedDocument?.referenceDocuments.map((item) => (
                  <p className="">{item}</p>
                ))}
              </div>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium">
                  Change Control Title/Modification
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-72">
                  Review Content Selected
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium min-w-72">
                  Comments
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-64">
                  Approval Details
                </th>
              </tr>
            </thead>
            <tbody>
              {cctData.map((cct, cctIndex) => (
                <React.Fragment key={cctIndex}>
                  {cct.references.map((ref, refIndex) => {
                    const isFirstRef = refIndex === 0;
                    const reference = referenceTexts[ref];
                    const approver = approverData[ref];

                    return (
                      <tr key={`${cctIndex}-${refIndex}`}>
                        {isFirstRef && (
                          <td
                            className="border border-[#E5E7EB] p-2 align-top"
                            rowSpan={cct.references.length}
                          >
                            <div className="font-medium">{cct.category}</div>
                            {reference && (
                              <div className="mt-2 text-sm text-[#1a56db] border-t pt-2">
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Author:
                                  </span>{" "}
                                  {reference.author}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Title:
                                  </span>{" "}
                                  {reference.authorTitle}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Group:
                                  </span>{" "}
                                  {reference.authorGroup}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Created:
                                  </span>{" "}
                                  {formatTimestamp(reference.timestamp)}
                                </div>
                              </div>
                            )}
                          </td>
                        )}
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          <div className="text-sm text-[#4b5563] whitespace-pre-line">
                            {reference?.text || "No content available"}
                          </div>
                          {reference && (
                            <div className="mt-2 text-sm text-[#2563eb] border-t pt-2">
                              <div>
                                <span className="text-[#000000] font-medium">
                                  Author:
                                </span>{" "}
                                {reference.author}
                              </div>
                              <div>
                                <span className="text-[#000000] font-medium">
                                  Created:
                                </span>{" "}
                                {formatTimestamp(reference.timestamp)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          {selectedDocument?.comments?.length > 0 ? (
                            selectedDocument.comments.map((comment) => (
                              <div key={comment.id} className="mb-4">
                                <div className="bg-[#ffffff] p-3 rounded-md border border-[#e5e7eb]">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {comment.name}
                                          </span>
                                          {isDownloading ? (
                                            <p className="text-[#000000] text-xs">
                                              {comment.title}
                                            </p>
                                          ) : (
                                            <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                              {comment.title}
                                            </Badge>
                                          )}
                                        </div>
                                        {isDownloading ? (
                                          <p className="text-xs w-fit text-[#2563eb]">
                                            {comment.group}
                                          </p>
                                        ) : (
                                          <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                            <UsersRound size={12} />
                                            {comment.group}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm">
                                        {comment.comment}
                                      </p>
                                      <p className="text-xs text-[#6b7280] mt-1">
                                        {formatTimestamp(comment.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {comment.replies?.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="ml-6 mt-2 bg-[#eff6ff] p-3 rounded-md border border-[#bfdbfe]"
                                  >
                                    <div className="flex items-start gap-2">
                                      <CornerDownRight
                                        size={16}
                                        className="text-[#4b5563] mt-1"
                                      />
                                      <div className="flex-1">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {reply.name}
                                            </span>
                                            {isDownloading ? (
                                              <p className="text-[#000000] text-xs">
                                                {reply.title}
                                              </p>
                                            ) : (
                                              <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                                {reply.title}
                                              </Badge>
                                            )}
                                          </div>
                                          {isDownloading ? (
                                            <p className="text-xs w-fit text-[#2563eb]">
                                              {reply.group}
                                            </p>
                                          ) : (
                                            <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                              <UsersRound size={12} />
                                              {reply.group}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="mt-2 text-sm">
                                          {reply.comment}
                                        </p>
                                        <p className="text-xs text-[#6b7280] mt-1">
                                          {formatTimestamp(reply.timestamp)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-[#6B7280]">
                              No comments available for this document.
                            </div>
                          )}
                        </td>
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          {approver ? (
                            <div className="flex flex-col gap-2">
                              <div className="font-medium">{approver.name}</div>
                              {isDownloading ? (
                                <p className="text-[#000000] text-xs">
                                  {approver.title}
                                </p>
                              ) : (
                                <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                  {approver.title}
                                </Badge>
                              )}
                              {isDownloading ? (
                                <p className="text-xs w-fit text-[#2563eb]">
                                  {approver.group}
                                </p>
                              ) : (
                                <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                  <UsersRound size={12} />
                                  {approver.group}
                                </Badge>
                              )}
                              <div className="text-sm mt-2 text-[#2563eb]">
                                <span className="text-[#000000] font-medium">
                                  Approved at:
                                </span>{" "}
                                {formatTimestamp(approver.timestamp)}
                              </div>
                              <div className="mt-2 border-t pt-2">
                                <div className="text-xs text-[#6b7280]">
                                  Signature:
                                </div>
                                <img
                                  src={"/sig-2.png"}
                                  alt={`Signature of ${approver.name}`}
                                  className="h-24 object-contain mt-1"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-[#6B7280]">
                              No approval details available.
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </FullPagePopup>

      <FullPagePopup
        isOpen={isCommentedOpen}
        onClose={handleCommentedCopyClosePopup}
        title={`Review Summary`}
      >
        <CommentedCopyPDFViewer />
      </FullPagePopup>

      <FullPagePopup
        isOpen={isViewOpen}
        onClose={handleCommentedCopyClosePopup}
        title={`Final Copy`}
      >
        {!isWebViewerLoaded && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-600">Loading document viewer...</p>
            </div>
          </div>
        )}

        <div
          className={`transition-opacity duration-300 ${
            isWebViewerLoaded ? "opacity-100 h-full" : "opacity-0"
          }`}
        >
          <PDFTableViewer onLoadComplete={handleWebViewerLoad} />
        </div>
      </FullPagePopup>

      {/* Reference Documents Dialog */}
      {referenceDocsDialogOpen && selectedDoc && (
        <ReferenceDocumentsDialog
          isOpen={referenceDocsDialogOpen}
          onClose={() => setReferenceDocsDialogOpen(false)}
          selectedDocIds={documentReferences[selectedDoc.id] || []}
          onSave={handleSaveReferenceDocuments}
          currentDocId={selectedDoc.id}
        />
      )}
    </div>
  );
};

export default DocumentApprovedTable;