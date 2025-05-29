import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Eye,
  ChevronUp,
  ChevronDown,
  PenTool,
  BookOpen,
  User,
  Users,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatusCard from "@/components/status-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { documentsToReview } from "@/mock-data/navigate-document";
import { Textarea } from "@/components/ui/textarea";
import {
  ExpandableComments,
  ExpandedCommentsContent,
} from "@/components/navigate-document/comment-expandible";
import AiSummary from "@/components/ai-summary";
import AiSentiment from "@/components/ai-sentiment";
import SignatureComponent from "@/components/signature/signature-component";
import { SearchableColumnHeader } from "@/components/searchable-column-header";
import { useSearchParams } from "react-router-dom";

// Add flight manual sections data - modified to match document structure
const flightManualSections = [
  {
    id: "section-001",
    title: "Pre-Flight Checklist",
    description: "Complete set of required checks before aircraft departure",
    referenceText:
      "Section 1.2: Pre-departure safety checks including equipment verification, system tests, and external aircraft inspection procedures.",
    commentDetails:
      "Please review updated checklist items based on new regulations (FAA-2025-04)",
    status: "pending",
    lastUpdated: "05 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: This document outlines critical pre-flight procedures. The content contains comprehensive checklists aligned with industry standards. Several sections have been updated to reflect recent FAA regulatory changes.",
      sentiment: "neutral",
    },
  },
  {
    id: "section-002",
    title: "Emergency Landing Procedures",
    description:
      "Protocol for safely executing emergency landings in various conditions",
    referenceText:
      "Section 2.3: Step-by-step procedures for emergency landings in various terrain and weather conditions with decision trees for pilots.",
    commentDetails:
      "Updated with findings from recent simulator training sessions",
    status: "pending",
    lastUpdated: "01 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: Emergency landing protocols have been significantly updated based on simulation data. Terrain-specific guidance has been enhanced with clearer instructions. Recommend priority review of water landing scenarios.",
      sentiment: "negative",
    },
  },
  {
    id: "section-003",
    title: "Weather Diversion Protocols",
    description:
      "Guidelines for handling severe weather encounters during flight",
    referenceText:
      "Section 3.1: Decision matrix for weather-related diversions including visibility thresholds, wind limitations, and icing condition responses.",
    commentDetails: "Incorporated recent meteorological data from Q1 2025",
    status: "pending",
    lastUpdated: "04 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: This document incorporates the latest meteorological data and updated decision matrices. All procedures align with current regulations and best practices for severe weather operations.",
      sentiment: "positive",
    },
  },
];

export default function NavDoc3({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [documentToAction, setDocumentToAction] = useState(null);
  const [approvePopoverOpen, setApprovePopoverOpen] = useState(false);
  const [rejectPopoverOpen, setRejectPopoverOpen] = useState(false);
  const [expandedCommentRows, setExpandedCommentRows] = useState([]);
  const [approvalSignature, setApprovalSignature] = useState(null);
  const [rejectionSignature, setRejectionSignature] = useState(null);
  // Store document signatures and reasons
  const [documentSignatures, setDocumentSignatures] = useState({});
  // State for tracking which document is expanded to show sections
  const [expandedDocumentSections, setExpandedDocumentSections] =
    useState(null);
    
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [filterStatus, setFilterStatus] = useState(tabParam ? (tabParam === "all" ? "expired" : "pending") : "pending");
  // const [filterStatus, setFilterStatus] = useState("pending");

  const [reviewerTypeFilter, setReviewerTypeFilter] = useState(
    tabParam && ["group", "user", "all"].includes(tabParam) 
      ? tabParam 
      : "all"
  );

  // const [reviewerTypeFilter, setReviewerTypeFilter] = useState('all'); // 'all', 'user', 'group'

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  // Count documents by status
  const statusCounts = documentsToReview.reduce(
    (acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, expired: 0 }
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDocuments = documentsToReview.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.commentDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesOwner = 
      reviewerTypeFilter === 'all' || 
      doc.reviewerType === reviewerTypeFilter;

    // Apply column filters
    const matchesColumnFilters = Object.entries(columnFilters).every(([key, value]) => {
      if (!value) return true;
      return String(doc[key]).toLowerCase().includes(value.toLowerCase());
    });

    return matchesSearch && matchesStatus && matchesOwner && matchesColumnFilters;
  });

  const sortedData = [...filteredDocuments].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = String(a[sortColumn]);
    const bValue = String(b[sortColumn]);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Toggle document selection
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  // Toggle select all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    }
  };

  // Toggle flight manual sections expansion
  const toggleSectionsExpansion = (docId) => {
    if (expandedDocumentSections === docId) {
      setExpandedDocumentSections(null);
    } else {
      setExpandedDocumentSections(docId);
    }
  };

  // Handle bulk approve
  const handleBulkApprove = () => {
    console.log("Bulk approve documents:", selectedDocuments);
    alert(`Approved ${selectedDocuments.length} documents`);
    setSelectedDocuments([]);
  };

  // Handle bulk reject
  const handleBulkReject = () => {
    console.log("Bulk reject documents:", selectedDocuments);
    alert(`Rejected ${selectedDocuments.length} documents`);
    setSelectedDocuments([]);
  };

  // Handler for approval signature
  const handleApprovalSignatureSave = (signatureURL) => {
    setApprovalSignature(signatureURL);
  };

  // Handler for rejection signature
  const handleRejectionSignatureSave = (signatureURL) => {
    setRejectionSignature(signatureURL);
  };

  // Handle document approval with reason and signature
  const handleApprove = (docId) => {
    if (!approvalSignature) {
      alert("Please sign the document before approving.");
      return;
    }

    console.log(`Approved document ${docId} with reason: ${approvalReason}`);
    console.log(`Signature provided: ${approvalSignature ? "Yes" : "No"}`);

    // Store the signature and reason for this document
    setDocumentSignatures((prev) => ({
      ...prev,
      [docId]: {
        status: "approved",
        signature: approvalSignature,
        reason: approvalReason,
      },
    }));

    // Here you would update the document status in your actual implementation
    alert(`Document approved with reason: ${approvalReason}`);
    setApprovalReason("");
    setApprovalSignature(null);
    setDocumentToAction(null);
    setApprovePopoverOpen(false);
  };

  // Handle document rejection with reason and signature
  const handleReject = (docId) => {
    if (!rejectionSignature) {
      alert("Please sign the document before rejecting.");
      return;
    }

    console.log(`Rejected document ${docId} with reason: ${rejectionReason}`);
    console.log(`Signature provided: ${rejectionSignature ? "Yes" : "No"}`);

    // Store the signature and reason for this document
    setDocumentSignatures((prev) => ({
      ...prev,
      [docId]: {
        status: "rejected",
        signature: rejectionSignature,
        reason: rejectionReason,
      },
    }));

    // Here you would update the document status in your actual implementation
    alert(`Document rejected with reason: ${rejectionReason}`);
    setRejectionReason("");
    setRejectionSignature(null);
    setDocumentToAction(null);
    setRejectPopoverOpen(false);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-gray-200 text-gray-800 hover:bg-gray-100";
        case "expired":
          return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };  

  // Get AI summary for a document - this will be passed to the AiSummary component
  const getAiSummary = (docId) => {
    // In a real app, this would come from an AI processing service or the document's aiAnalysis property
    const doc = documentsToReview.find((d) => d.id === docId);
    if (!doc) {
      // Check if it's a section
      const section = flightManualSections.find((s) => s.id === docId);
      if (section && section.aiAnalysis && section.aiAnalysis.summary) {
        return section.aiAnalysis.summary;
      }
      return "No summary available";
    }

    // Check if we have predefined AI analysis in the mock data
    if (doc.aiAnalysis && doc.aiAnalysis.summary) {
      return doc.aiAnalysis.summary;
    }

    // Generate mock AI summary based on document content as fallback
    return `AI Analysis: This document contains ${
      doc.name.includes("Security")
        ? "security protocols"
        : doc.name.includes("Emergency")
        ? "emergency procedures"
        : doc.name.includes("Maintenance")
        ? "maintenance schedules"
        : doc.name.includes("Training")
        ? "training modules"
        : "aviation procedures"
    }. The content appears to be ${
      doc.status === "approved"
        ? "compliant with current regulations"
        : doc.status === "rejected"
        ? "requiring significant revisions"
        : "pending further review"
    }. Key focus areas include ${doc.referenceText.substring(0, 30)}...`;
  };

  // Get AI sentiment for a document - this will be passed to the AiSentiment component
  const getAiSentiment = (docId) => {
    // In a real app, this would be determined by AI analysis
    const doc = documentsToReview.find((d) => d.id === docId);
    if (!doc) {
      // Check if it's a section
      const section = flightManualSections.find((s) => s.id === docId);
      if (section && section.aiAnalysis && section.aiAnalysis.sentiment) {
        return section.aiAnalysis.sentiment;
      }
      return "neutral";
    }

    // Check if we have predefined AI analysis in the mock data
    if (doc.aiAnalysis && doc.aiAnalysis.sentiment) {
      return doc.aiAnalysis.sentiment;
    }

    // Mock sentiment based on document status as fallback
    switch (doc.status) {
      case "approved":
        return "positive";
      case "rejected":
        return "negative";
      default:
        return "neutral";
    }
  };

  const isDocumentSigned = (docId) => {
    return documentSignatures[docId] !== undefined;
  };

  // Timestamp component with icons
  const TimestampDisplay = ({ timestamp, size = "sm" }) => {
    // Parse the timestamp
    const [datePart, timePart] = timestamp.split(' ');
    
    const iconSize = size === "sm" ? 12 : 14;
    const textSize = size === "sm" ? "text-xs" : "text-sm";
    
    return (
      <div className="flex flex-col space-x-1">
        {/* Calendar icon + Date */}
        <div className="flex items-center space-x-1">
          <Calendar className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-blue-500`} />
          <span className={`${textSize} text-blue-700 font-medium`}>
            {datePart}
          </span>
        </div>
        
        {/* Clock icon + Time */}
        <div className="flex items-center space-x-1">
          <Clock className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-gray-500`} />
          <span className={`${textSize} text-gray-600`}>
            {timePart}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-gray-800">Tasks Review Center</h1>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tasks by name, reference, or comments..."
          className="pl-10 h-12 bg-white shadow-sm border-gray-300 focus:border-blue-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Status Tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tasks to Review</h2>
        </div>
        {/* Filter Buttons */}
        {/* <div className="flex justify-between">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className={
                filterStatus === "all"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : ""
              }
            >
              All Tasks
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              className={
                filterStatus === "pending" ? getStatusColor("pending") : ""
              }
            >
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              onClick={() => setFilterStatus("approved")}
              className={
                filterStatus === "approved" ? getStatusColor("approved") : ""
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              onClick={() => setFilterStatus("rejected")}
              className={
                filterStatus === "rejected" ? getStatusColor("rejected") : ""
              }
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </Button>
          </div>
        </div> */}

        <Tabs defaultValue={tabParam == "all" ? "expired" : "pending"} className="w-full">
          <TabsList className="bg-blue-50 w-full">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              onClick={() => setFilterStatus("all")}
            >
              All Tasks
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
              onClick={() => setFilterStatus("expired")}
            >
              Expired
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              onClick={() => setFilterStatus("approved")}
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="flex-1 data-[state=active]:bg-gray-400 data-[state=active]:text-white"
              onClick={() => setFilterStatus("rejected")}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>
          
        {/* Owner Filter - Only shows when a specific status is selected */}
        {/* {filterStatus !== 'all' && (
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-gray-50 p-1 border border-gray-200">
              {["All", "User", "Group"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setReviewerTypeFilter(tab.toLowerCase())}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                    reviewerTypeFilter === tab.toLowerCase()
                      ? "bg-white shadow-sm text-blue-600 border border-gray-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {tab === "User" && <User className="h-4 w-4 mr-2" />}
                  {tab === "Group" && <Users className="h-4 w-4 mr-2" />}
                  {tab}
                </button>
              ))}
            </div>
            {selectedDocuments.length > 0 && (
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={handleBulkApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Selected ({selectedDocuments.length})
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  onClick={handleBulkReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Selected ({selectedDocuments.length})
                </Button>
              </div>
            )}
          </div>
        )} */}

      </div>

      {/* Table Section */}
      <div className="rounded-lg border-1 border-gray-400 shadow-sm bg-white overflow-x-auto">

        {filterStatus !== "all" && <div className="p-4 bg-blue-50 flex space-x-2">
          {["All", "User", "Group"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReviewerTypeFilter(tab.toLowerCase())}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                reviewerTypeFilter === tab.toLowerCase()
                  ? "bg-blue-600  text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab} Tasks
            </button>
          ))}
        </div>}
        
        <Table>
          {/* Table Headers */}
          <TableHeader>
            <TableRow className="hover:bg-blue-600">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedDocuments.length === filteredDocuments.length &&
                    filteredDocuments.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              
              <SearchableColumnHeader
                title="Review Details"
                column="name"
                width="w-[250px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              
              <SearchableColumnHeader
                title="Reviewer"
                column="reviewerName"
                width="w-[140px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              
              <SearchableColumnHeader
                title="Assigned TS"
                column="createdAt"
                width="w-[180px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              
              <SearchableColumnHeader
                title="Last Updated"
                column="lastUpdated"
                width="w-[180px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              
              <SearchableColumnHeader
                title="Status"
                column="status"
                width="w-[110px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              
              <TableHead className="w-[120px] whitespace-nowrap">AI Analysis</TableHead>
              
              <TableHead className="w-[100px] text-center whitespace-nowrap">
                {filterStatus === "pending" || filterStatus === "all" || filterStatus == "expired"
                  ? "Approval"
                  : "Signed Off"}
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No documents found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((doc, index) => (
                <>
                  <TableRow key={doc.id} className="hover:bg-gray-50 cursor-pointer border-t-[1px] border-gray-400">
                    <TableCell>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocumentSelection(doc.id)}
                        aria-label={`Select ${doc.name}`}
                      />
                    </TableCell>
                    {/* Review Details */}
                    <TableCell className="w-[250px]">
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 font-medium mb-1">
                          <Badge className="bg-blue-200 text-blue-700">Modifications</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium flex items-center min-w-0 flex-1">
                            <div className="text-sm font-medium flex-grow pr-2">
                          {/* <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium flex items-center">
                              <div className="text-sm font-medium flex-grow"> */}
                              {doc.name.length > 50
                                ? `${doc.name.substring(
                                    0,
                                    50
                                  )}...`
                                : doc.name}
                            </div>
                            {/* <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                  aria-label="View full reference text"
                                >
                                  <Eye size={16} />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-96 max-h-64 overflow-y-auto">
                                <div className="text-sm text-gray-700">
                                  {doc.name}
                                </div>
                              </PopoverContent>
                            </Popover> */}
                          </div>
                        <div className="flex flex-col space-x-1 justify-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="View full reference text"
                              >
                                <Eye size={16} />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 max-h-64 overflow-y-auto">
                              <div className="text-sm text-gray-700">
                                {doc.name}
                              </div>
                            </PopoverContent>
                          </Popover>
                          {/* Add your approval/signature buttons here */}
                          <button
                            className="p-1 rounded-full hover:bg-blue-100 transition-colors h-fit"
                            onClick={() => toggleSectionsExpansion(doc.id)}
                          >
                            {expandedDocumentSections === doc.id ? (
                              <ChevronUp size={18} className="text-blue-500" />
                            ) : (
                              <ChevronDown size={18} className="text-blue-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    </TableCell>

                    {/* Approval/Signed Off */}
                    {/* <TableCell className="w-[120px] text-center">
                      <div className="flex space-x-1 justify-center">
                        {/* Add your approval/signature buttons here */}
                        {/* <button
                          className="p-1 rounded-full hover:bg-blue-100 transition-colors h-fit"
                          onClick={() => toggleSectionsExpansion(doc.id)}
                        >
                          {expandedDocumentSections === doc.id ? (
                            <ChevronUp size={18} className="text-blue-500" />
                          ) : (
                            <ChevronDown size={18} className="text-blue-500" />
                          )}
                        </button>
                      </div>
                    </TableCell> */} 

                    <TableCell className="w-[140px]">
                      <div className={`inline-flex p-2 rounded-md text-xs font-medium max-w-full ${
                        doc.reviewerType === 'user' 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-indigo-100 text-indigo-800"
                      }`}>
                        <span className="break-words leading-tight">
                          {doc.reviewerName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Created at */}
                    {/* <TableCell className="w-[180px]">
                      <span className="text-blue-700 text-sm">{doc.createdAt}</span>
                    </TableCell>
                    
                    <TableCell className="w-[180px]">
                      <span className="text-blue-700 text-sm">{doc.lastUpdated}</span>
                    </TableCell> */}

                    <TableCell className="w-[180px]">
                      <TimestampDisplay timestamp={doc.createdAt} size="sm" />
                    </TableCell>

                    <TableCell className="w-[180px]">
                      <TimestampDisplay timestamp={doc.lastUpdated} size="sm" />
                    </TableCell>

                    <TableCell className="w-[110px]">
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="truncate">
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    
                    {/* AI Analysis */}
                    <TableCell className="w-[120px]">
                      {/* <div className="flex space-x-2">
                        <AiSummary
                          documentId={doc.id}
                          getSummary={getAiSummary}
                          title="Review AI Summary"
                        />
                        <AiSentiment
                          documentId={doc.id}
                          getSentiment={getAiSentiment}
                          title="Review Sentiment"
                        />
                      </div> */}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {doc.status === "pending" || doc.status == "expired" ? (
                        <div className="flex space-x-1 justify-center">
                          {/* Approval Button */}
                          <Popover
                            open={
                              approvePopoverOpen &&
                              documentToAction === doc.id
                            }
                            onOpenChange={(open) => {
                              if (!open) {
                                setApprovalReason("");
                                setApprovalSignature(null);
                              }
                              setApprovePopoverOpen(open);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Approve"
                                onClick={() => {
                                  setDocumentToAction(doc.id);
                                  setApprovePopoverOpen(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                              <div className="space-y-4">
                                <h4 className="font-medium text-sm">
                                  Approve Document
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Please sign below to approve this
                                  document.
                                </p>

                                {/* Signature Component */}
                                <SignatureComponent
                                  onSave={handleApprovalSignatureSave}
                                />

                                <p className="text-sm text-gray-500 mt-2">
                                  Please provide a reason for approving this
                                  document.
                                </p>
                                <Textarea
                                  placeholder="Enter approval reason..."
                                  className="min-h-24"
                                  value={approvalReason}
                                  onChange={(e) =>
                                    setApprovalReason(e.target.value)
                                  }
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setApprovalReason("");
                                      setApprovalSignature(null);
                                      setDocumentToAction(null);
                                      setApprovePopoverOpen(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApprove(doc.id)}
                                    disabled={
                                      !approvalReason.trim() ||
                                      !approvalSignature
                                    }
                                  >
                                    Confirm Approval
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>

                          {/* Rejection Button */}
                          <Popover
                            open={
                              rejectPopoverOpen &&
                              documentToAction === doc.id
                            }
                            onOpenChange={(open) => {
                              if (!open) {
                                setRejectionReason("");
                                setRejectionSignature(null);
                              }
                              setRejectPopoverOpen(open);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Reject"
                                onClick={() => {
                                  setDocumentToAction(doc.id);
                                  setRejectPopoverOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                              <div className="space-y-4">
                                <h4 className="font-medium text-sm">
                                  Reject Document
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Please sign below to reject this document.
                                </p>

                                {/* Signature Component */}
                                <SignatureComponent
                                  onSave={handleRejectionSignatureSave}
                                />

                                <p className="text-sm text-gray-500 mt-2">
                                  Please provide a reason for rejecting this
                                  document.
                                </p>
                                <Textarea
                                  placeholder="Enter rejection reason..."
                                  className="min-h-24"
                                  value={rejectionReason}
                                  onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                  }
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setRejectionReason("");
                                      setRejectionSignature(null);
                                      setDocumentToAction(null);
                                      setRejectPopoverOpen(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleReject(doc.id)}
                                    disabled={
                                      !rejectionReason.trim() ||
                                      !rejectionSignature
                                    }
                                  >
                                    Confirm Rejection
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        /* For approved/rejected docs, show signed badge */
                        <Popover>
                          <PopoverTrigger asChild>
                            <Badge
                              className={`cursor-pointer ${
                                isDocumentSigned(doc.id)
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : doc.status === "approved"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  // : "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-gray-200 text-gray-800 hover:bg-gray-100"
                              }`}
                            >
                              <PenTool className="h-3 w-3 mr-1" />
                              {doc.status === "approved"
                                ? "Signed-off"
                                : "Rejected"}
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm">
                                {doc.status === "approved"
                                  ? "Approval"
                                  : "Rejection"}{" "}
                                Details
                              </h4>

                              {/* Display signature image */}
                              <div className="border rounded p-2 bg-gray-50">
                                <p className="text-xs text-gray-500 mb-1">
                                  Signature:
                                </p>
                                <img
                                  src={"/sig.png"}
                                  alt="Signature"
                                  className="max-h-26 object-contain"
                                />
                              </div>

                              <div className="border rounded p-2">
                                <p className="text-xs text-gray-500 mb-1">
                                  Reason:
                                </p>
                                <p className="text-sm">
                                  {doc.status === "approved"
                                    ? "All requirements met. Document aligns with our security protocols and has been thoroughly reviewed."
                                    : "Incomplete technical specifications in maintenance procedures. Additional detail required in sections 4-6."}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Flight Manual sections expansion - only for Flight Safety Manual */}
                  <>
                    {expandedDocumentSections === doc.id && doc.sections && doc.sections.map((section, index) => (
                      <>
                        <TableRow
                          key={section.id}
                          className="bg-blue-50/30 hover:bg-blue-50/50 border-l-4 border-l-blue-400"
                        >
                          {/* Checkbox with indentation */}
                          <TableCell className="w-[50px] pl-8">
                          </TableCell>
                          
                          {/* Section Details - First Column Only */}
                          <TableCell className="pl-6">
                            <div className="flex flex-col">
                              {/* Section indicator */}
                              <div className="text-xs text-blue-600 font-medium mb-1 flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">Review Details</Badge>
                              </div>
                              {/* Section title - Full display */}
                              <div className="text-sm font-medium text-gray-800 mb-1">
                                {section.title}
                              </div>
                              
                              {/* Section reference text */}
                              <div className="text-xs text-gray-500 leading-tight">
                                {section.referenceText}
                              </div>
                            </div>
                          </TableCell>

                          {/* Section Comments - Second Column (Reviewer Column) */}
                          <TableCell className="w-[140px]">
                            <div className="flex items-center justify-center">
                              <ExpandableComments
                                title={`Comments for ${section.title}`}
                                expanded={expandedCommentRows.includes(section.id)}
                                setExpanded={(expanded) => {
                                  if (expanded) {
                                    setExpandedCommentRows((prev) =>
                                      prev.includes(section.id)
                                        ? prev
                                        : [...prev, section.id]
                                    );
                                  } else {
                                    setExpandedCommentRows((prev) =>
                                      prev.filter((id) => id !== section.id)
                                    );
                                  }
                                }}
                                onExpand={() => {}}
                                onCollapse={() => {}}
                                size="sm"
                              />
                            </div>
                          </TableCell>

                          {/* Section dates */}
                          <TableCell className="w-[180px]">
                            <TimestampDisplay timestamp={section.createdAt || doc.createdAt} size="sm" />
                          </TableCell>

                          <TableCell className="w-[180px]">
                            <TimestampDisplay timestamp={section.lastUpdated} size="sm" />
                          </TableCell>
                          
                          {/* Section status */}
                          <TableCell className="w-[110px]">
                            <Badge className={`${getStatusColor(section.status)} text-xs scale-90`}>
                              {getStatusIcon(section.status)}
                              <span className="truncate">
                                {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                              </span>
                            </Badge>
                          </TableCell>
                          
                          {/* Section AI Analysis */}
                          <TableCell className="w-[80px]">
                            <div className="flex items-center space-x-1">
                              <AiSummary
                                documentId={section.id}
                                getSummary={getAiSummary}
                                title="Section AI Summary"
                                size="sm"
                              />
                              <AiSentiment
                                documentId={section.id}
                                getSentiment={getAiSentiment}
                                title="Section Sentiment"
                                size="sm"
                              />
                            </div>
                          </TableCell>
                          
                          {/* Section Actions - Empty for sections */}
                          <TableCell className="w-[100px]">
                            {/* Empty - sections don't have approval actions */}
                          </TableCell>
                        </TableRow>
                          
                        {/* Section expanded comments row */}
                        {expandedCommentRows.includes(section.id) && (
                          <TableRow>
                            <TableCell colSpan={8} className="p-0 bg-blue-25">
                              <div className="ml-12 pl-4">
                                <ExpandedCommentsContent
                                  documentId={section.id}
                                  user={user}
                                  getSummary={() => getAiSummary(section.id)}
                                  getSentiment={() => getAiSentiment(section.id)}
                                  allowRating={true}
                                  readOnly={section.status !== 'pending' && section.status !== 'expired'}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </>

                  {/* Expanded comments row */}
                  {expandedCommentRows.includes(doc.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <ExpandedCommentsContent
                          documentId={doc.id}
                          user={user}
                          getSummary={() => getAiSummary(doc.id)}
                          getSentiment={() => getAiSentiment(doc.id)}
                          allowRating={true}
                          readOnly={doc.status !== 'pending' && doc.status !== 'expired'}
                        />
                      </TableCell>
                    </TableRow>
                  )}  
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}