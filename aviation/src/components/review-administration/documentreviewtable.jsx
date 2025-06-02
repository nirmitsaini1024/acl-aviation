import React, { useContext, useState, useMemo } from "react";
import { DocumentContext } from "../review-administration/contexts/DocumentContext";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  List,
  Clock,
  DotSquare,
  EllipsisVertical,
  Pencil,
  CircleMinus,
  ChevronDown,
  FileIcon,
  Download,
  User,
  Building,
  Briefcase,
  Tag,
  Bot,
} from "lucide-react";
import PDFTextDiffViewer from "../doc-reviewer-2/main";
import PDFViewer from "../doc-reviewer/pdf-viewer";
import WordViewer from "../doc-reviewer/web-viewer";
import WebViewerComponent from "../docx-viewer";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import PDFViewerPendingTable from "../doc-reviewer/pdf-viewer-with-pending-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import SignatureComponent from "../signature/signature-component";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Import CASL components
import { Can, AbilityContext } from "./sections/Can"; // Both in one line
import { useAbility } from '@casl/react';

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return timestamp;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${formattedHours}:${minutes}${ampm}`;
  } catch (error) {
    return timestamp;
  }
}

// Updated sample data with reference documents and pending status
const sampleData = [
  {
    id: 1,
    title: "Annual Report 2024",
    fileType: "pdf",
    type: "Annual Report",
    status: "approved",
    category: "ASP",
    department: "TSA",
    domain: "Airport",
    finalCopy: "This is the final copy content...",
    uploadedAt: "2025-01-01 12:47:20",
    lastActionTS: "2025-01-02 14:30:15",
    workingCopy: "This is the working copy content...",
    owner: {
      officer: "Officer 1",
      department: "TSA",
      title: "Security Manager",
    },
  },
  {
    id: 2,
    title: "Security Guidelines Draft",
    fileType: "docx",
    type: "Security Manual",
    status: "pending",
    category: "ASP",
    department: "FAA",
    domain: "Airport",
    finalCopy: "This is the final copy content...",
    uploadedAt: "2025-01-01 12:47:20",
    lastActionTS: "2025-01-03 09:15:42",
    workingCopy: "This is the working copy content...",
    owner: {
      officer: "Officer 1",
      department: "FAA",
      title: "Security Manager",
    },
  },
  {
    id: 3,
    title: "Business Proposal",
    fileType: "pdf",
    type: "Business Document",
    status: "approved",
    category: "AEP",
    department: "Public Safety",
    domain: "Airline",
    finalCopy: "Proposal final content...",
    workingCopy: "Proposal draft content...",
    uploadedAt: "2025-05-02 17:47:20",
    lastActionTS: "2025-05-03 11:22:30",
    owner: {
      officer: "Officer 2",
      department: "Airport Security",
      title: "Finance Manager",
    },
  },
  {
    id: 4,
    title: "Marketing Plan Draft",
    fileType: "docx",
    type: "Marketing Plan",
    status: "pending",
    category: "AEP",
    department: "Public Safety",
    domain: "Airline",
    finalCopy: "Proposal final content...",
    uploadedAt: "2025-05-02 17:47:20",
    lastActionTS: "2025-05-04 16:45:18",
    workingCopy: "Proposal draft content...",
    owner: {
      officer: "Officer 2",
      department: "Airport Security",
      title: "Finance Manager",
    },
  },
  {
    id: 5,
    title: "TSA Security Guidelines",
    fileType: "pdf",
    type: "Reference Document",
    status: "refdoc",
    reviewStatus: "reference",
    isReference: true,
    category: "ASP",
    department: "TSA",
    domain: "Airport",
    finalCopy: "Security guidelines reference content...",
    uploadedAt: "2025-04-15 09:30:00",
    lastActionTS: "2025-04-16 13:45:25",
    owner: {
      officer: "Officer 3",
      department: "Airport Operations",
      title: "HR Director",
    },
  },
  {
    id: 6,
    title: "Aviation Safety Manual",
    fileType: "pdf",
    type: "Reference Document",
    status: "refdoc",
    reviewStatus: "reference",
    isReference: true,
    category: "SMS",
    department: "FAA",
    domain: "Airport",
    finalCopy: "Aviation safety reference content...",
    uploadedAt: "2025-03-20 14:15:00",
    lastActionTS: "2025-03-21 10:20:35",
    owner: {
      officer: "Officer 4",
      department: "FAA",
      title: "Safety Director",
    },
  },
];

const sampleApprovalNodes = [
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

const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:cursor-pointer hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

function DocumentReviewTable({ setActiveStep, status, setIsBotOpen }) {
  const {
    documents,
    pendingDocuments,
    approvedDocuments,
    disapprovedDocuments,
    referenceDocuments,
    deactivateDocument,
    setCurrentDocId,
    updateDocumentReviewStatus,
    isSubmitted,
  } = useContext(DocumentContext);

  // Add CASL ability hook
  const ability = useAbility(AbilityContext);

  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedTab, setSelectedTab] = useState("working");
  const [viewerType, setViewerType] = useState(null);
  const [expandedApprovalCycle, setExpandedApprovalCycle] = useState(null);
  const [editWorkflowOpen, setEditWorkflowOpen] = useState(false);
  const [confirmEditWorkflow, setConfirmEditWorkflow] = useState(false);
  const [showRejectUI, setShowRejectUI] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionSignature, setRejectionSignature] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(null);

  const [summaryData, setSummaryData] = useState({
    title: "Document Review Summary",
    reviewContentSelected: "Sections A, B, and C",
    reviewGroups: [
      {
        id: "group1",
        title: "Initial Review Group",
        status: "Approved",
        approvedAt: "2024-01-15 14:30:00",
        comments: [
          {
            id: "comment1",
            title: "Initial Comment",
            user: "John Doe",
            timestamp: "2024-01-15 14:30:00",
            content: "This is the initial review comment.",
            replies: [
              {
                id: "reply1",
                user: "Jane Smith",
                timestamp: "2024-01-15 15:00:00",
                content: "Reply to the initial comment.",
              },
            ],
          },
        ],
      },
      {
        id: "group2",
        title: "Legal Review Group",
        status: "Approved",
        approvedAt: "2024-01-16 10:00:00",
        comments: [
          {
            id: "comment2",
            title: "Legal Comment",
            user: "Alice Johnson",
            timestamp: "2024-01-16 10:00:00",
            content: "This is the legal review comment.",
            replies: [],
          },
        ],
      },
    ],
  });

  // Badge functions
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

  const handleWebViewerLoad = () => {
    setIsWebViewerLoaded(true);
  };

  const normalizeStatus = (doc) => {
    const normalizedDoc = { ...doc };

    if (!normalizedDoc.uploadedAt) {
      normalizedDoc.uploadedAt = new Date().toLocaleString();
    }

    if (normalizedDoc.isReference || normalizedDoc.status === "refdoc") {
      normalizedDoc.status = "refdoc";
      normalizedDoc.reviewStatus = "reference";
      return normalizedDoc;
    }

    if (
      !normalizedDoc.status ||
      normalizedDoc.status === "working" ||
      normalizedDoc.status === "final"
    ) {
      if (normalizedDoc.fileType === "pdf") {
        normalizedDoc.status = "approved";
        normalizedDoc.reviewStatus = normalizedDoc.reviewStatus || "submitted";
      } else if (
        normalizedDoc.fileType === "docx" ||
        normalizedDoc.fileType === "doc"
      ) {
        normalizedDoc.status = "draft review";
        normalizedDoc.reviewStatus =
          normalizedDoc.reviewStatus || "draft review";
      }
    }

    return normalizedDoc;
  };

  const allDocs = useMemo(() => {
    const contextDocs = documents ? documents.map(normalizeStatus) : [];
    const normalizedSampleData = sampleData.map(normalizeStatus);

    if (referenceDocuments && referenceDocuments.length > 0) {
      return [...contextDocs, ...normalizedSampleData];
    }

    return [...contextDocs, ...normalizedSampleData];
  }, [documents, referenceDocuments]);

  const filteredDocs = useMemo(() => {
    let docs = [...allDocs];

    if (status !== "reference") {
      docs = docs.filter(
        (doc) =>
          !(
            doc.isReference ||
            doc.status === "reference" ||
            doc.status === "refdoc" ||
            doc.reviewStatus === "reference"
          )
      );
    } else if (status === "reference") {
      docs = docs.filter(
        (doc) =>
          doc.isReference ||
          doc.status === "reference" ||
          doc.status === "refdoc" ||
          doc.reviewStatus === "reference"
      );
      return docs;
    }

    if (status) {
      if (status === "final") {
        docs = docs.filter(
          (doc) =>
            doc.fileType === "pdf" ||
            doc.status === "final" ||
            doc.status === "submitted"
        );
      } else if (status === "working") {
        docs = docs.filter(
          (doc) =>
            doc.fileType === "docx" ||
            doc.fileType === "doc" ||
            doc.status === "working" ||
            doc.status === "in review" ||
            doc.status === "draft review"
        );
      }
    }

    if (selectedTab === "working") {
      docs = docs.filter(
        (doc) =>
          doc.fileType === "docx" ||
          doc.fileType === "doc" ||
          doc.status === "working" ||
          doc.status === "in review" ||
          doc.status === "draft review" ||
          doc.status === "pending"
      );
    } else if (selectedTab === "final") {
      docs = docs.filter(
        (doc) =>
          doc.fileType === "pdf" ||
          doc.status === "final" ||
          doc.status === "submitted" ||
          doc.status === "approved"
      );
    }

    return docs;
  }, [allDocs, selectedTab, status]);

  const hasBothVersions = useMemo(() => {
    const titleMap = {};

    allDocs.forEach((doc) => {
      const title = doc.title || doc.name || `Document ${doc.id}`;
      if (!titleMap[title]) {
        titleMap[title] = new Set();
      }
      titleMap[title].add(doc.fileType || "unknown");
    });

    const result = {};
    Object.entries(titleMap).forEach(([title, fileTypes]) => {
      result[title] = fileTypes.size > 1;
    });

    return result;
  }, [allDocs]);

  const hasDocumentsInReview = useMemo(() => {
    return filteredDocs.some((doc) => {
      const status = doc.status || doc.reviewStatus || "";
      return status === "in review" || status === "review";
    });
  }, [filteredDocs]);

  const getDocumentName = (document) => {
    if (document.title) return document.title;
    if (document.file?.name) return document.file.name.replace(/\.[^/.]+$/, "");
    if (document.name) return document.name;
    return `Document ${document.id}`;
  };

  const getFileTypeBadge = (document) => {
    const fileType =
      document.fileType ||
      (document.isReference ? document.actualExtension || "pdf" : "unknown");

    let badgeClass = "";
    switch (fileType) {
      case "pdf":
        badgeClass = "bg-red-50 text-red-600 text-xs";
        break;
      case "docx":
      case "doc":
        badgeClass = "bg-blue-50 text-blue-600 text-xs";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 text-xs";
    }

    return <Badge className={`${badgeClass} px-2`}>{fileType}</Badge>;
  };

  // Update the getStatusBadge function to prioritize reviewStatus over status
  const getStatusBadge = (document) => {
    // Fix: Use reviewStatus first, then fall back to status
    const docStatus = document.reviewStatus || document.status || "unknown";

    let badgeClass = "";
    let displayText = "";

    if (
      docStatus === "refdoc" ||
      docStatus === "reference" ||
      document.isReference
    ) {
      badgeClass = "bg-purple-100 text-purple-800";
      displayText = "Reference";
    } else if (docStatus === "pending") {
      badgeClass = "bg-yellow-100 text-yellow-800";
      displayText = "Pending";
    } else if (docStatus === "draft review") {
      badgeClass = "bg-orange-100 text-orange-800";
      displayText = "Draft Review";
    } else if (docStatus === "approved") {
      badgeClass = "bg-green-100 text-green-800";
      displayText = "Approved";
    } else if (docStatus === "in review") {
      badgeClass = "bg-blue-100 text-blue-800";
      displayText = "In Review";
    } else if (docStatus === "submitted" || docStatus === "final") {
      badgeClass = "bg-green-100 text-green-800";
      displayText = docStatus === "final" ? "Final" : "Submitted";
    } else if (docStatus === "review" || docStatus === "working") {
      badgeClass = "bg-gray-100 text-gray-800";
      displayText = docStatus === "working" ? "Working" : "Ready for Review";
    } else if (docStatus === "disapproved") {
      badgeClass = "bg-red-100 text-red-800";
      displayText = "Disapproved";
    } else {
      badgeClass = "bg-gray-100 text-gray-800";
      displayText = docStatus.charAt(0).toUpperCase() + docStatus.slice(1);
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${badgeClass}`}
      >
        {displayText}
      </span>
    );
  };

  const handleCompare = (document) => {
    setSelectedDoc(document);
    setIsComparePopupOpen(true);
  };

  const handleView = (document) => {
    console.log("clicked");
    setSelectedDoc(document);
    setViewerType(document.fileType);
    setIsViewerPopupOpen(true);
  };

  const handleEditClick = (docId) => {
    if (setActiveStep) {
      setActiveStep(1);
      setCurrentDocId(docId);
    }
  };

  const isDocumentInReview = (document) => {
    const status = document.status || document.reviewStatus || "";
    return status === "in review" || status === "review";
  };

  const isReferenceDocument = (document) => {
    return (
      document.isReference ||
      document.status === "reference" ||
      document.status === "refdoc" ||
      document.reviewStatus === "reference"
    );
  };

  // Helper functions to determine visibility
  const shouldShowActionsColumn = (doc) => {
    const inReview = isDocumentInReview(doc);
    const isReference = isReferenceDocument(doc);
    const isFinalVersion = doc.status === "approved" || doc.status === "final" || doc.status === "submitted";
    
    // Don't show actions column for reference documents
    if (isReference) return false;
    
    // Don't show actions column in final tab
    if (selectedTab === "final") return false;
    
    // Don't show actions column for final version documents in all tab
    if (selectedTab === "all" && isFinalVersion) return false;
    
    // Show actions column if document is in review and submitted
    return inReview && isSubmitted;
  };

  const shouldShowReviewPanel = (doc) => {
    const inReview = isDocumentInReview(doc);
    const isReference = isReferenceDocument(doc);
    const isFinalVersion = doc.status === "approved" || doc.status === "final" || doc.status === "submitted";
    
    // Don't show review panel for reference documents
    if (isReference) return false;
    
    // Don't show review panel in final tab
    if (selectedTab === "final") return false;
    
    // Don't show review panel for final version documents in all tab
    if (selectedTab === "all" && isFinalVersion) return false;
    
    // Show review panel if document is in review
    return inReview && hasDocumentsInReview;
  };

  const handleRejectionSignatureSave = (signature) => {
    setRejectionSignature(signature);
  };

  const handleConfirmEditWorkflow = (docId) => {
    console.log("Edit workflow confirmed");
    setEditWorkflowOpen(false);
    setConfirmEditWorkflow(false);
    console.log(docId);
    setCurrentDocId(docId);
    setActiveStep(1);
  };

  const handleDeleteDocument = (doc) => {
    if (deactivateDocument) {
      deactivateDocument(doc.id);
    }
    setDeletePopoverOpen(false);
  };

  const renderDocumentRow = (doc) => {
    const docName = getDocumentName(doc);
    const inReview = isDocumentInReview(doc);
    const isReference = isReferenceDocument(doc);
    const showActions = shouldShowActionsColumn(doc);
    const showReviewPanel = shouldShowReviewPanel(doc);

    return (
      <React.Fragment key={doc.id}>
        <tr className="border-t-[1px] border-gray-400 hover:bg-gray-50">
          <td className="px-2 py-1">
            <div className="flex items-center">
              {doc.fileType === "pdf" ? (
                <FileIcon className="w-4 h-4 text-red-600 mr-1" />
              ) : (
                <FileText className="w-4 h-4 text-blue-600 mr-1" />
              )}
              <span className="font-medium">
                {docName} {getFileTypeBadge(doc)}
              </span>
              <div className="py-2 ml-1">{getStatusBadge(doc)}</div>
            </div>

            {/* Document badges section */}
            {doc.type && (
              <DocumentBadgesSection
                doc={doc}
                showType={true}
                showDomain={true}
                showCategory={true}
                className="inline-flex items-center gap-1.5 ml-1"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <div className="flex mt-1.5 ml-4 items-center gap-5 flex-wrap">
              <button
                onClick={() => handleView(doc)}
                className="text-blue-600 hover:cursor-pointer hover:text-blue-800 flex items-center text-xs"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isReference ? "View Doc" : "View"}
              </button>

              {!isReference &&
                (doc.fileType === "docx" || doc.fileType === "doc") && (
                  <>
                    {/* Edit Button - Show for Manager and Admin, Hide for Normal User */}
                    <Can I="edit" a="Document">
                      <button
                        onClick={() => handleEditClick(doc?.id)}
                        disabled={inReview}
                        className={`flex items-center text-xs hover:cursor-pointer ${
                          inReview
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-yellow-600 hover:text-yellow-800"
                        }`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </Can>

                    {/* Delete Button - Only show for Admin */}
                    <Can I="delete" a="Document">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            disabled={inReview}
                            className={`flex items-center text-xs hover:cursor-pointer ${
                              inReview
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-4" align="start">
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm">
                              Confirm Deletion
                            </h4>
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this document?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletePopoverOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  handleDeleteDocument(doc);
                                  setDeletePopoverOpen(false);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </Can>
                  </>
                )}
            </div>
          </td>

          {/* Owner Column with the new design */}
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

          <td className="py-2 px-3">
            <p className="font-normal flex gap-2 items-center text-zinc-700">
              <Clock size={14} />
              <span title={doc.uploadedAt}>
                {formatTimestamp(doc.uploadedAt)}
              </span>
            </p>
          </td>

          {status === "pending" && (
            <td className="py-3 px-4">
              <p className="font-normal flex gap-2 items-center text-zinc-700">
                <Clock size={14} />
                <span title={doc.lastActionTS}>
                  {formatTimestamp(doc.lastActionTS)}
                </span>
              </p>
            </td>
          )}

          {!isReference && (
            <td className="py-3 px-4">
              <button
                onClick={() => handleCompare(doc)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center"
              >
                <List className="w-4 h-4 mr-1" />
                Compare
              </button>
            </td>
          )}

          {/* Action Column for Reference Documents - Keep the Ask AI functionality */}
          {status === "reference" && (
            <td className="px-4 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Bot className="mx-auto h-4 w-4 cursor-pointer" onClick={() => {setIsBotOpen(true)}}/>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-50 px-2 text-gray-800 border-gray-300 border">Ask AI</TooltipContent>
              </Tooltip>
            </td>
          )}

          {/* Actions Column - Only show when conditions are met */}
          {showActions && (
            <td className="py-3 pl-4">
              <Popover>
                <PopoverTrigger asChild>
                  <EllipsisVertical size={16} className="cursor-pointer" />
                </PopoverTrigger>
                {!showRejectUI ? (
                  <PopoverContent className="w-60 mr-4">
                    <div className="space-y-2">
                      <Popover
                        open={editWorkflowOpen}
                        onOpenChange={setEditWorkflowOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setEditWorkflowOpen(true)}
                          >
                            <Pencil size={16} className="mr-2" />
                            Edit Review Process
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 mr-4">
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm">
                              Confirm Edit Workflow
                            </h4>
                            <p className="text-sm text-gray-500">
                              <p className="font-medium">
                                Review is already in process.
                              </p>
                              Are you sure you want to edit the workflow?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditWorkflowOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleConfirmEditWorkflow(doc.id)
                                }
                              >
                                Yes, Confirm
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => setShowRejectUI(true)}
                      >
                        <CircleMinus size={16} className="mr-2" />
                        Deactivate Review Process
                      </Button>
                    </div>
                  </PopoverContent>
                ) : (
                  <PopoverContent className="w-80 p-4 mr-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-red-500">Deactivate</h4>
                      <p className="text-sm text-gray-500">
                        Please sign below to deactivate this section.
                      </p>

                      <SignatureComponent
                        onSave={handleRejectionSignatureSave}
                      />

                      <p className="text-sm text-gray-500 mt-2">
                        Please provide a reason for deactivating this section.
                      </p>
                      <Textarea
                        placeholder="Enter reason..."
                        className="min-h-24"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRejectionReason("");
                            setRejectionSignature(null);
                            setShowRejectUI(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setShowRejectUI(false)}
                          disabled={
                            !rejectionReason.trim() || !rejectionSignature
                          }
                        >
                          Confirm Deactivation
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            </td>
          )}

          {/* Review Panel Column - Only show when conditions are met */}
          {showActions && (
            <td className="px-4 py-3 text-center">
              <button
                onClick={() =>
                  setExpandedApprovalCycle(
                    expandedApprovalCycle === doc.id ? null : doc.id
                  )
                }
                className="p-2 rounded hover:bg-gray-200 flex items-center justify-center mx-auto"
                title="Review Panel"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    expandedApprovalCycle === doc.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            </td>
          )}
        </tr>
        
        {/* Review Panel Expansion Row - Only show when conditions are met */}
        {showReviewPanel &&
          expandedApprovalCycle === doc.id && (
            <tr>
              <td
                colSpan={hasDocumentsInReview ? 8 : 6}
                className="px-4 py-2 bg-gray-50 border-b border-gray-200"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-400">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Attributes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-400">
                      {sampleApprovalNodes.map((node) => (
                        <tr
                          key={node.id}
                          className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  node.type === "user"
                                    ? "bg-blue-500"
                                    : node.type === "group"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
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
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
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
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  node.status === "Assigned" ||
                                  node.status === "Initiated"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
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

        {/* Summary Expansion Row */}
        {expandedSummary === doc.id && summaryData && (
          <tr>
            <td
              colSpan={hasDocumentsInReview ? 6 : 4}
              className="px-4 py-2 bg-gray-50 border-b border-gray-200"
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-white p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {summaryData.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">
                        Review Content Selected:
                      </span>{" "}
                      {summaryData.reviewContentSelected}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {summaryData.reviewGroups.map((group) => (
                      <div
                        key={group.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                          <h4 className="font-medium text-gray-700">
                            {group.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Approved At: {formatTimestamp(group.approvedAt)}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {group.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          {group.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-medium text-gray-800">
                                    {comment.title}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    By {comment.user} •{" "}
                                    {formatTimestamp(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                {comment.content}
                              </p>

                              {comment.replies.length > 0 && (
                                <div className="ml-6 mt-3 space-y-2 border-l-2 border-gray-200 pl-4">
                                  {comment.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="bg-gray-50 p-3 rounded-md border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs text-gray-500">
                                          Reply by {reply.user} •{" "}
                                          {formatTimestamp(reply.timestamp)}
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {reply.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const getTableHeaderConfig = () => {
    if (status === "reference") {
      return {
        title: "Reference Documents",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      };
    } else {
      return {
        title: "Current Document Details",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      };
    }
  };

  const tableHeaderConfig = getTableHeaderConfig();

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border-1 border-gray-400">
      <div
        className={`p-4 border-b border-gray-200 ${tableHeaderConfig.bgColor}`}
      >
        <h2 className={`text-lg font-semibold ${tableHeaderConfig.textColor}`}>
          {tableHeaderConfig.title}
        </h2>

        {status !== "reference" && (
          <div className="mt-4 flex space-x-2">
            {["working", "final", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                  selectedTab === tab
                    ? "bg-blue-600  text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab === "working"
                  ? "Working Copies"
                  : tab === "final"
                  ? "Final Version"
                  : "All Documents"}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {status === "reference"
            ? "No reference documents found."
            : selectedTab === "working"
            ? "No working copies found."
            : selectedTab === "final"
            ? "No final versions found."
            : "No documents found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-left">
              <tr className="border-b bg-blue-600 border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Document Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-50">Owner</th>
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Uploaded TS
                </th>
                {status === "pending" && (
                  <th className="px-4 py-3 font-semibold text-gray-50">
                    Last Action TS
                  </th>
                )}
                {status !== "reference" && (
                  <th className="px-4 py-3 font-semibold text-gray-50">
                    Compare
                  </th>
                )}
                {status === "reference" && (
                  <th className="px-4 py-3 font-semibold text-gray-50">
                    Action
                  </th>
                )}
                {/* Conditionally show Actions header based on documents */}
                {filteredDocs.some(shouldShowActionsColumn) && (
                  <th className="px-4 py-3 font-semibold text-gray-50">Actions</th>
                )}
                {/* Conditionally show Review Panel header */}
                {filteredDocs.some(shouldShowActionsColumn) && (
                  <th className="px-4 py-3 font-semibold text-gray-50 text-center w-32">Review Panel</th>
                )}
              </tr>
            </thead>
            <tbody>{filteredDocs.map(renderDocumentRow)}</tbody>
          </table>
        </div>
      )}

      <FullPagePopup
        isOpen={isComparePopupOpen}
        onClose={() => setIsComparePopupOpen(false)}
      >
        {selectedDoc && (
          <PDFTextDiffViewer
            oldText={selectedDoc.finalCopy}
            newText={selectedDoc.workingCopy}
          />
        )}
      </FullPagePopup>

      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={() => {
          setIsViewerPopupOpen(false), setIsWebViewerLoaded(false);
        }}
      >
        {selectedDoc && viewerType === "pdf" && (
          <>
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
              <PDFViewer onLoadComplete={handleWebViewerLoad} />
            </div>
          </>
        )}
        {selectedDoc && (viewerType === "docx" || viewerType === "doc") && (
          <>
            {!isWebViewerLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-600">Loading document viewer...</p>
                </div>
              </div>
            )}

            <div
            >
              <PDFViewerPendingTable onLoadComplete={handleWebViewerLoad} />
            </div>
          </>
        )}
      </FullPagePopup>
    </div>
  );
}

export default DocumentReviewTable