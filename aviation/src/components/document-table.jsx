import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  Bell,
  Check,
  X,
  Bot,
  User,
  Building,
  Briefcase,
  FileText,
  FileSearch,
  CheckCircle,
  XCircle,
  File,
  Clock,
  Calendar,
  Tag,
  ChevronDown,
  Folder,
  FolderOpen,
  FilePlus,
  MessageSquare,
  Cog,
  MessageCircleCode,
  Layers,
  Link,
  Unlink,
  List,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnHeader } from "./column-header";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { documents } from "@/mock-data/doc-center";
import { DocumentViewer } from "./document-viewer";
import PDFTextDiffViewer from "./doc-reviewer-2/main";
import { parse, isWithinInterval } from "date-fns";
import { ExpandedCommentsContent } from "./navigate-document/comment-expandible";
import { Avatar } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { AbilityContext } from "@/abilityContext";

// Domain and Department Options
const domains = ["Airport", "Airline"];

const departmentOptions = {
  Airport: [
    "TSA",
    "FAA",
    "Airport Security",
    "Airport Operations",
    "Public Safety",
  ],
  Airline: ["Airline Security", "Airline Operations"],
};

const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
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

// CCT categories with richer metadata
const cctCategories = [
  "Airline Defense Maintenance",
  "Airport Safety and Compliance",
  "Aviation Regulatory Affairs",
  "Hazardous Materials Management",
  "Emergency Response Planning",
];

// SubCategories for each CCT category
const cctSubCategories = {
  "Airline Defense Maintenance": [
    "Aircraft Security Protocols - Regulations for monitoring and securing aircraft during maintenance operations and between flights to prevent unauthorized access and potential security threats.",
    "Passenger Screening - Mickey Mouse Airport (KMMW), also known as Mickey Mouse Club House, is a public use airport located east of the central business district of Disney Corner, Florida. The airport is owned by Disney Corner. Currently it operates two commercial airlines flights daily and serves general aviation activities as well.",
    "Cargo Inspection - Standardized procedures for examining cargo loads, detecting prohibited items, and ensuring compliance with international air cargo security regulations.",
    "Security Personnel Training - Requirements for security staff certification, ongoing education, and performance assessment to maintain high security standards.",
  ],
  "Airport Safety and Compliance": [
    "Terminal Safety - Guidelines for passenger flow management, emergency evacuation protocols, and infrastructure security measures within terminal buildings.",
    "Runway Management - Procedures for runway inspection, maintenance scheduling, and wildlife management to prevent incidents during takeoff and landing operations.",
    "Security Zones - Designation criteria for restricted areas, access control systems, and perimeter security measures to prevent unauthorized entry.",
    "Compliance Reporting - Documentation requirements, reporting timelines, and verification procedures for regulatory compliance with national and international aviation standards.",
  ],
};

// Mock CCT data for documents
const documentCctData = [
  {
    id: "doc1",
    cctCategory: "Airline Defense Maintenance",
    cctSubCategory: "Aircraft Security Protocols",
    cctOwner: "Sarah Chen",
    cctReviewers: ["John Adams", "Maria Garcia"],
    cctNextReview: "30 June 2025",
    cctVersion: "2.3",
  },
  {
    id: "doc2",
    cctCategory: "Airport Safety and Compliance",
    cctSubCategory: "Terminal Safety",
    cctOwner: "Robert Johnson",
    cctReviewers: ["Emily Wilson", "David Lee"],
    cctNextReview: "15 July 2025",
    cctVersion: "1.7",
  },
];

// Approval nodes data
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

const linkedWithDocs = [
  {
    id: "ref1",
    name: "Airport Security Manual",
    type: "PDF",
    addedBy: "John doe",
    addedat: "15-04-2025",
  },
  {
    id: "ref2",
    name: "Mickey Mouse Asp",
    type: "PDF",
    addedBy: "John doe",
    addedat: "25-04-2025",
  },
];

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
        <DialogFooter className="">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReferenceDocumentsPopover = ({
  isOpen,
  onOpenChange,
  referenceDocuments,
  onRemoveDocument,
}) => {
  const handleViewDocument = () => {
    window.open("/refdoc", "_blank");
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ml-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Link className="h-3.5 w-3.5" />
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

const FileTree = ({
  categories,
  selectedCategory,
  onSelectCategory,
  cctFilter,
}) => {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initialExpanded = {};
    if (selectedCategory) {
      const [category] = selectedCategory.split("/");
      initialExpanded[category] = true;
    }
    Object.keys(categories).forEach((cat) => {
      if (!(cat in initialExpanded)) {
        initialExpanded[cat] = false;
      }
    });
    return initialExpanded;
  });

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter categories based on cctFilter
  const filteredCategories = useMemo(() => {
    if (!cctFilter || cctFilter === "all_cct") return categories;

    return Object.keys(categories).reduce((acc, category) => {
      if (category.toLowerCase().includes(cctFilter.toLowerCase())) {
        acc[category] = categories[category];
      }
      return acc;
    }, {});
  }, [categories, cctFilter]);

  const handleCategorySelect = useCallback(
    (categoryPath) => {
      if (categoryPath !== selectedCategory) {
        onSelectCategory(categoryPath);
      }
    },
    [selectedCategory, onSelectCategory]
  );

  const toggleCategory = useCallback((category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const [category] = selectedCategory.split("/");
      setExpandedCategories((prev) => ({
        ...prev,
        [category]: true, // Expand the category of the selected subcategory
      }));
    }
  }, [selectedCategory]);

  return (
    <div className="w-64 border-r border-gray-200 pr-4 h-full">
      <h3 className="font-bold text-sm mb-3 text-gray-700">
        Change Control Title/Modifications
      </h3>
      <div className="space-y-1">
        {Object.keys(filteredCategories).map((category) => (
          <div key={category} className="space-y-1">
            <div
              className={`flex items-center p-1.5 rounded-md cursor-pointer ${selectedCategory === category
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => toggleCategory(category)}
            >
              <button className="mr-1 flex items-center justify-center">
                {expandedCategories[category] ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500 transform -rotate-90" />
                )}
              </button>
              <div className="flex items-center flex-1">
                <Cog className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-md truncate font-medium">{category}</span>
              </div>
            </div>

            {expandedCategories[category] && (
              <div className="ml-6 space-y-1">
                {categories[category].map((subCategory) => (
                  <div
                    key={subCategory}
                    className={`flex items-center p-1.5 rounded-md cursor-pointer ${selectedCategory === `${category}/${subCategory}`
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                      }`}
                    onClick={() =>
                      handleCategorySelect(`${category}/${subCategory}`)
                    }
                    title={subCategory}
                  >
                    <MessageCircleCode className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium truncate">
                      {truncateText(subCategory)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryView = React.memo(({ category, documents, onViewDocument }) => {
  const [loading, setLoading] = useState(false);

  const parts = category ? category.split("/") : [];
  const mainCategory = parts[0];
  const subCategory = parts[1];

  // Mock data for linked documents
  const linkedDocuments = [
    {
      id: "ld1",
      name: "Mickey-mouse.docx",
      type: "DOCX",
      category: "Aircraft Security Protocols",
    },
    {
      id: "ld2",
      name: "aviation.pdf",
      type: "PDF",
      category: "Airline Defense Maintenance",
    },
  ];
  const mockDocuments = [
    {
      id: "doc3",
      name: "Aviation Safety Protocol",
      type: "DOCX",
      category: "Airport Safety and Compliance",
    },
    {
      id: "doc4",
      name: "Emergency Response Procedures",
      type: "PDF",
      category: "Airport Safety and Compliance",
    },
  ];

  // Filter documents relevant to this category
  const relevantDocuments = linkedDocuments.filter(
    (doc) =>
      doc.category === mainCategory ||
      (subCategory && doc.category === subCategory.split(" - ")[0])
  );

  const relevantMockDocuments = mockDocuments.filter(
    (doc) =>
      doc.category === mainCategory ||
      (subCategory && doc.category === subCategory.split(" - ")[0])
  );

  const renderDocumentBadge = (doc) => {
    const handleEyeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open("/refdoc", "_blank");
    };

    const handleBadgeClick = () => {
      console.log("View document:", doc.name);
    };

    return (
      <Badge
        key={doc.id}
        variant="outline"
        className="px-3 py-1 text-sm flex items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 cursor-pointer"
        onClick={handleBadgeClick}
      >
        {doc.type === "PDF" ? (
          <FileText className="h-4 w-4 text-red-500" />
        ) : (
          <FileText className="h-4 w-4 text-blue-500" />
        )}
        <span>{doc.name}</span>
        <button
          onClick={handleEyeClick}
          className="flex items-center justify-center"
        >
          <Eye className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      </Badge>
    );
  };

  const getCategoryMetadata = () => {
    let docsCount = documents.length;
    let pendingReviews = documents.filter(
      (doc) => doc.status === "In Review" || doc.status === "Review"
    ).length;
    let approvedDocs = documents.filter(
      (doc) => doc.status === "Approved"
    ).length;

    return {
      docsCount,
      pendingReviews,
      approvedDocs,
      owners: [
        ...new Set(documents.map((doc) => doc.cct?.owner).filter(Boolean)),
      ],
      reviewers: [
        ...new Set(documents.flatMap((doc) => doc.cct?.reviewers || [])),
      ],
      nextReview:
        documents.length > 0
          ? documents.sort((a, b) => {
            if (!a.cct?.nextReview) return 1;
            if (!b.cct?.nextReview) return -1;
            return new Date(a.cct.nextReview) - new Date(b.cct.nextReview);
          })[0]?.cct?.nextReview || "N/A"
          : "N/A",
    };
  };

  const metadata = getCategoryMetadata();

  return (
    <div className="p-4 space-y-6">
      <div className="mb-2">
        <div className="flex items-start gap-4">
          <h3 className="text-lg font-medium text-gray-900">{mainCategory}</h3>
          {relevantMockDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {relevantMockDocuments.map(renderDocumentBadge)}
            </div>
          )}
        </div>

        {subCategory && (
          <p className="text-blue-500 mt-4 mb-3 font-medium bg-blue-50 border-1 border-blue-200 p-4 rounded-md text-[16px]">
            {subCategory}
            {relevantDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {relevantDocuments.map(renderDocumentBadge)}
              </div>
            )}
          </p>
        )}
      </div>

      {/* AI Summary Section */}
      <div className="pt-4">
        <ExpandedCommentsContent
          allowRating={true}
          title={""}
          maxHeight="300px"
          documentId={`category-${category?.replace("/", "-")}`}
          user="current_user"
          getSummary={() =>
            `This ${subCategory ? "subcategory" : "category"} "${mainCategory}${subCategory ? ` - ${subCategory}` : ""
            }" has ${metadata.docsCount} documents with ${metadata.approvedDocs
            } approved and ${metadata.pendingReviews
            } pending review. The overall feedback from reviewers has been ${metadata.approvedDocs > metadata.pendingReviews
              ? "positive"
              : "mixed"
            }.`
          }
          getSentiment={() =>
            metadata.approvedDocs > metadata.pendingReviews
              ? "positive"
              : "neutral"
          }
        />
      </div>
    </div>
  );
});

const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

const parseDocumentDate = (dateString) => {
  try {
    return parse(dateString, "dd MMMM yyyy", new Date());
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

// Enhancement: Determine document domain and category based on owner department
const getDomainAndCategory = (doc) => {
  // Map departments to domains
  const departmentToDomain = {
    TSA: "Airport",
    FAA: "Airport",
    "Airport Security": "Airport",
    "Airport Operations": "Airport",
    "Public Safety": "Airport",
    "Aviation Security": "Airport",
    "Airline Security": "Airline",
    "Airline Operations": "Airline",
  };

  // Map document types to categories
  const typeToCategory = {
    "Airport Security": "ASP",
    Security: "ASP",
    Policy: "AEP",
    Strategy: "ACM",
    Manual: "SMS",
    Reference: "ADFAP (Airport)",
    Report: "ADFP",
    Log: "ADFP",
  };

  // Determine domain based on department
  const domain = departmentToDomain[doc.owner.department] || "Airport";

  // Determine category based on type
  let category = typeToCategory[doc.type] || "ASP";

  // Ensure category is valid for the domain
  if (domain === "Airline" && !["ASP", "ADFP"].includes(category)) {
    category = "ASP"; // Default to ASP for Airline domain if category is not valid
  }

  return { domain, category };
};

const mergeDocumentData = () => {
  const cctDataMap = documentCctData.reduce((map, cctData) => {
    map[cctData.id] = cctData;
    return map;
  }, {});

  return documents.map((doc, index) => {
    const docId = `doc${index + 1}`;
    const cctData =
      cctDataMap[docId] ||
      cctDataMap[Object.keys(cctDataMap)[index % documentCctData.length]];

    // Determine domain and category for the document
    const { domain, category } = getDomainAndCategory(doc);

    return {
      ...doc,
      domain: domain,
      category: category,
      cct: cctData
        ? {
          category: cctData.cctCategory,
          subCategory: cctData.cctSubCategory,
          owner: cctData.cctOwner,
          reviewers: cctData.cctReviewers,
          nextReview: cctData.cctNextReview,
          version: cctData.cctVersion,
        }
        : null,
    };
  });
};

const enrichedDocuments = mergeDocumentData();

export function DocumentTable({
  globalFilter,
  documentTypeFilter,
  documentNameFilter,
  cctFilter,
  domainFilter,
  departmentFilter,
  categoryFilter,
  dateFrom,
  dateTo,
  status, // Add this prop to receive the status filter from the parent
  IsresetFilters,
  setIsResetFilters,
  setIsBotOpen,
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [openRevisionPopovers, setOpenRevisionPopovers] = useState([]);
  const [isFullPagePopupOpen, setIsFullPagePopupOpen] = useState(false);
  const [expandedCCTRow, setExpandedCCTRow] = useState(null);
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);
  const [initalRender, setInitialRender] = useState(true);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [selectedCategoryDocuments, setSelectedCategoryDocuments] = useState(
    []
  );
  const [viewerOpen, setViewerOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Initialize with first category/subcategory if available
    const firstCategory = cctCategories[0];
    if (firstCategory && cctSubCategories[firstCategory]?.length > 0) {
      return `${firstCategory}/${cctSubCategories[firstCategory][0]}`;
    }
    return firstCategory || null;
  });

  // Compare functionality state
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    console.log("Runned UseEffect", {
      globalFilter,
      documentTypeFilter,
      documentNameFilter,
      cctFilter,
      domainFilter,
      departmentFilter,
      categoryFilter,
      dateFrom,
      dateTo,
      status,
    });

    if (initalRender) {
      console.log("Runned");
      setInitialRender(false);
      return;
    }

    const hasActiveFilters =
      (domainFilter !== "all_domains" && domainFilter !== null) ||
      (documentTypeFilter !== "all_types" && documentTypeFilter !== null) ||
      (cctFilter !== "all_cct" && cctFilter !== null) ||
      (documentNameFilter !== "all_documents" && documentNameFilter !== null) ||
      (departmentFilter !== "all_departments" && departmentFilter !== null) ||
      (categoryFilter !== "all_categories" && categoryFilter !== null) ||
      dateFrom ||
      dateTo;

    if (!hasActiveFilters) {
      setExpandedCCTRow(null);
      setExpandedReviewCycle(null);
      return;
    }

    // Find the first document that matches the current filters AND has CCT data
    const filteredDocs = enrichedDocuments.filter((doc) => {
      // Apply the same filtering logic as in your main filter
      switch (status) {
        case "active":
          if (doc.status !== "In Review") return false;
          break;
        case "refdoc":
          if (doc.status !== "N/A") return false;
          break;
        case "approved":
          if (doc.status !== "Approved") return false;
          break;
        case "disapproved":
          if (doc.status !== "Rejected") return false;
          break;
      }

      // Apply domain filter
      if (domainFilter && domainFilter !== "all_domains") {
        if (doc.domain !== domainFilter) return false;
      }

      // Apply department filter
      if (departmentFilter && departmentFilter !== "all_departments") {
        if (doc.owner.department !== departmentFilter) return false;
      }

      // Apply category filter
      if (categoryFilter && categoryFilter !== "all_categories") {
        if (doc.category !== categoryFilter) return false;
      }

      // Apply document type filter
      if (documentTypeFilter && documentTypeFilter !== "all_types") {
        if (doc.type.toLowerCase() !== documentTypeFilter.toLowerCase())
          return false;
      }

      // Apply document name filter
      if (documentNameFilter && documentNameFilter !== "all_documents") {
        if (doc.name.toLowerCase() !== documentNameFilter.toLowerCase())
          return false;
      }

      // Apply CCT filter
      if (cctFilter && cctFilter !== "all_cct") {
        if (!doc.cct) return false;
        const matchesCategory =
          doc.cct.category &&
          doc.cct.category.toLowerCase().includes(cctFilter.toLowerCase());
        const matchesSubCategory =
          doc.cct.subCategory &&
          doc.cct.subCategory.toLowerCase().includes(cctFilter.toLowerCase());
        if (!matchesCategory && !matchesSubCategory) return false;
      }

      return true;
    });

    const firstDocWithCCT = filteredDocs.find((doc) => doc.cct);

    if (firstDocWithCCT) {
      setExpandedCCTRow(firstDocWithCCT.id);
      const category = firstDocWithCCT.cct.category;
      const subCategories = cctSubCategories[category];
      if (subCategories && subCategories.length > 0) {
        setSelectedCategory(`${category}/${subCategories[0]}`);
      } else {
        setSelectedCategory(category);
      }
    }
  }, [
    domainFilter,
    documentTypeFilter,
    documentNameFilter,
    cctFilter,
    departmentFilter,
    categoryFilter,
    dateFrom,
    dateTo,
    status,
    initalRender,
  ]);

  // Add new state for reference documents
  const [referenceDocsDialogOpen, setReferenceDocsDialogOpen] = useState(false);
  const [selectedDocForRef, setSelectedDocForRef] = useState(null);
  const [documentReferences, setDocumentReferences] = useState({}); // { docId: [refDocIds] }
  const [referencePopovers, setReferencePopovers] = useState({}); // Track which popovers are open

  const isFiltered = Boolean(
    globalFilter ||
    documentTypeFilter ||
    documentNameFilter ||
    cctFilter ||
    domainFilter ||
    departmentFilter ||
    categoryFilter ||
    dateFrom ||
    dateTo ||
    Object.values(columnFilters).some((val) => Boolean(val))
  );

  const filteredData = enrichedDocuments.filter((doc) => {
    // First filter by status based on the active tab
    switch (status) {
      case "active": // In Review tab
        if (doc.status !== "In Review") return false;
        break;
      case "refdoc": // Reference Documents tab
        if (doc.status !== "N/A") return false;
        break;
      case "approved": // Approved tab
        if (doc.status !== "Approved") return false;
        break;
      case "disapproved": // Deactivated tab
        if (doc.status !== "Rejected") return false;
        break;
      default:
        // No status filter (shouldn't happen with your tab setup)
        break;
    }

    if (globalFilter) {
      const searchableValues = [
        doc.name,
        doc.type,
        doc.createdAt,
        doc.owner.officer,
        doc.owner.department,
        doc.owner.title,
        doc.status,
      ];

      if (
        !searchableValues.some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      ) {
        return false;
      }
    }

    if (
      documentTypeFilter &&
      documentTypeFilter !== "all_types" &&
      doc.type.toLowerCase() !== documentTypeFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      documentNameFilter &&
      documentNameFilter !== "all_documents" &&
      doc.name.toLowerCase() !== documentNameFilter.toLowerCase()
    ) {
      return false;
    }

    // Filter by domain
    if (domainFilter && domainFilter !== "all_domains") {
      if (doc.domain !== domainFilter) {
        return false;
      }
    }

    // Filter by department
    if (departmentFilter && departmentFilter !== "all_departments") {
      if (doc.owner.department !== departmentFilter) {
        return false;
      }
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all_categories") {
      if (doc.category !== categoryFilter) {
        return false;
      }
    }

    if (cctFilter && cctFilter !== "all_cct") {
      if (!doc.cct) return false;

      const matchesCategory =
        doc.cct.category &&
        doc.cct.category.toLowerCase().includes(cctFilter.toLowerCase());
      const matchesSubCategory =
        doc.cct.subCategory &&
        doc.cct.subCategory.toLowerCase().includes(cctFilter.toLowerCase());

      if (!matchesCategory && !matchesSubCategory) {
        return false;
      }
    }

    if (dateFrom || dateTo) {
      const docDate = parseDocumentDate(doc.createdAt);

      if (docDate) {
        if (dateFrom && dateTo) {
          return isWithinInterval(docDate, { start: dateFrom, end: dateTo });
        } else if (dateFrom) {
          return docDate >= dateFrom;
        } else if (dateTo) {
          return docDate <= dateTo;
        }
      }
    }

    for (const [key, value] of Object.entries(columnFilters)) {
      if (!value) continue;

      if (key === "owner") {
        const ownerValues = [
          doc.owner.officer,
          doc.owner.department,
          doc.owner.title,
        ];
        if (
          !ownerValues.some((val) =>
            val.toLowerCase().includes(value.toLowerCase())
          )
        ) {
          return false;
        }
      } else if (key === "name") {
        const nameValues = [doc.name, doc.type];
        if (
          !nameValues.some((val) =>
            String(val).toLowerCase().includes(value.toLowerCase())
          )
        ) {
          return false;
        }
      } else {
        const docValue = doc[key];
        if (!String(docValue).toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue, bValue;

    if (sortColumn === "owner") {
      aValue = a.owner.officer;
      bValue = b.owner.officer;
    } else if (sortColumn === "name") {
      aValue = a.name;
      bValue = b.name;
    } else if (
      sortColumn === "createdAt" ||
      sortColumn === "approvedAt" ||
      sortColumn === "deactivatedAt"
    ) {
      const aDate = parseDocumentDate(a[sortColumn] || a.createdAt);
      const bDate = parseDocumentDate(b[sortColumn] || b.createdAt);
      if (aDate && bDate) {
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      return 0;
    } else {
      aValue = a[sortColumn];
      bValue = b[sortColumn];
    }

    aValue = String(aValue);
    bValue = String(bValue);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  useEffect(() => {
    if (selectedCategory) {
      const [category, subCategory] = selectedCategory.split("/");
      const docsInCategory = enrichedDocuments.filter((doc) => {
        if (!doc.cct) return false;
        if (subCategory) {
          return (
            doc.cct.category === category && doc.cct.subCategory === subCategory
          );
        }
        return doc.cct.category === category;
      });
      setSelectedCategoryDocuments(docsInCategory);
    } else if (cctFilter && cctFilter !== "all_cct") {
      // Auto-select first matching category when filter is applied
      const matchingCategory = Object.keys(cctSubCategories).find((cat) =>
        cat.toLowerCase().includes(cctFilter.toLowerCase())
      );

      if (matchingCategory && cctSubCategories[matchingCategory]?.length > 0) {
        setSelectedCategory(
          `${matchingCategory}/${cctSubCategories[matchingCategory][0]}`
        );
      } else if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      }
    }
  }, [selectedCategory, cctFilter]); // Only depend on selectedCategory and cctFilter

  // Display domain/department/category info in table
  const getDomainBadge = (doc) => {
    if (!doc.domain) return null;

    const colors = {
      Airport: "bg-blue-100 text-blue-800 border-blue-200",
      Airline: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <Badge
        variant="outline"
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colors[doc.domain] || "bg-gray-100 text-gray-800 border-gray-200"
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
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colors[doc.category] || "bg-gray-100 text-gray-800 border-gray-200"
          }`}
      >
        <Tag className="h-3.5 w-3.5" />
        <span>{doc.category}</span>
      </Badge>
    );
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleSelectCategory = useCallback((categoryPath) => {
    setSelectedCategory(categoryPath);
  }, []);

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

  const handleRowClick = (doc) => {
    if (expandedCCTRow === doc.id) {
      setExpandedCCTRow(null);
    } else {
      setExpandedCCTRow(doc.id);
    }
    if (expandedReviewCycle === doc.id) {
      setExpandedReviewCycle(null);
    }
  };

  const handleReviewCycleClick = (docId, e) => {
    e.stopPropagation();
    if (expandedReviewCycle === docId) {
      setExpandedReviewCycle(null);
    } else {
      setExpandedReviewCycle(docId);
    }
    if (expandedCCTRow === docId) {
      setExpandedCCTRow(null);
    }
  };

  const openDocumentViewer = (doc) => {
    setViewingDocument(doc);
    setViewerOpen(true);
  };

  const closeDocumentViewer = () => {
    setViewerOpen(false);
    setViewingDocument(null);
  };

  const openDiffView = () => {
    setDiffOpen(true);
  };

  const closeDiffView = () => {
    setDiffOpen(false);
  };

  const toggleRevisionPopover = (id) => {
    setOpenRevisionPopovers((prev) =>
      prev.includes(id) ? prev.filter((revId) => revId !== id) : [...prev, id]
    );
  };

  // Compare functionality handlers
  const handleCompare = (document) => {
    setSelectedDoc(document);
    setIsComparePopupOpen(true);
  };

  const handleOpenReferenceDialog = (doc) => {
    setSelectedDocForRef(doc);
    setReferenceDocsDialogOpen(true);
  };

  // Handler to save reference documents
  const handleSaveReferenceDocuments = (selectedDocIds) => {
    if (selectedDocForRef) {
      setDocumentReferences((prev) => ({
        ...prev,
        [selectedDocForRef.id]: selectedDocIds,
      }));
    }
  };

  // Handler to remove a reference document
  const handleRemoveReferenceDocument = (docId, refDocId) => {
    setDocumentReferences((prev) => ({
      ...prev,
      [docId]: prev[docId].filter((id) => id !== refDocId),
    }));
  };

  // Get reference documents for a specific document
  const getReferenceDocuments = (docId) => {
    const refIds = documentReferences[docId] || [];
    return mockReferenceDocuments.filter((doc) => refIds.includes(doc.id));
  };

  // Toggle reference popover
  const toggleReferencePopover = (docId) => {
    setReferencePopovers((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const getRevisionHistory = (docId) => [
    {
      id: `${docId}-rev1`,
      number: "1",
      description: "Changes in Badge Procedures",
      pageNumbers: "12",
      dateSubmitted: "10-05-2025",
      dateApproved: "14-05-2025",
    },
    {
      id: `${docId}-rev2`,
      number: "2",
      description: "Modification in Airport Boundary",
      pageNumbers: "32",
      dateSubmitted: "15-05-2025",
      dateApproved: "17-05-2025",
    },
    {
      id: `${docId}-rev3`,
      number: "3",
      description: "Airport Security Drill Procedure Changes",
      pageNumbers: "6",
      dateSubmitted: "16-05-2025",
      dateApproved: "",
    },
  ];

  // Updated getStatusColor function to handle N/A status for reference documents
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "n/a":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Updated getStatusIcon function to handle N/A status for reference documents
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "in review":
        return <Clock className="h-4 w-4 mr-1" />;
      case "pending":
        return <FileSearch className="h-4 w-4 mr-1" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "n/a":
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return <File className="h-4 w-4 mr-1" />;
    }
  };
  const ability = useContext(AbilityContext);

  const canViewActionRefDoc = ability.can('manage','documentRepoAccess.inReview.actions.referenceDocumentAccess')
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <div className="space-y-4">
      <div className="rounded-md border-1  border-gray-400 shadow-sm bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className=" hover:bg-[#335aff] whitespace-nowrap">
              <ColumnHeader
                title="Document Name"
                column="name"
                width="w-[170px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              {tab !== "refdoc" && (
                <ColumnHeader
                  title="Revision"
                  column="revision"
                  width="w-[20px]"
                  sortable={false}
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
              <ColumnHeader
                title="Owner"
                column="owner"
                width="w-[200px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title={
                  tab !== "refdoc" &&
                    tab !== "approved" &&
                    tab !== "disapproved"
                    ? "Created TS"
                    : "Uploaded TS"
                }
                column="createdAt"
                width="w-[230px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              {tab == "refdoc" && (
                <ColumnHeader
                  title="Linked with"
                  column="linkedwith"
                  width="w-[20px]"
                  sortable={false}
                  filterable={false}
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
              {(tab === "approved" || tab === "disapproved") && (
                <ColumnHeader
                  title={tab === "approved" ? "Approved TS" : "Deactivated TS"}
                  column={tab === "approved" ? "approvedAt" : "deactivatedAt"}
                  width="w-[250px]"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
              {/* Compare Column Header - only show for approved tab */}
              {tab === "approved" && (
                <ColumnHeader
                  title="Current Vs Last Final"
                  column="compare"
                  width="w-[400px]"
                  sortable={false}
                  filterable={false}
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
              {tab !== "refdoc" &&
                tab !== "approved" &&
                tab !== "disapproved" && (
                  <ColumnHeader
                    title="Final Vs Working Copy"
                    column="details"
                    width="w-[100px]"
                    sortable={false}
                    filterable={false}
                    handleSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    columnFilters={columnFilters}
                    handleFilterChange={handleFilterChange}
                  />
                )}
              {tab !== "disapproved" && (
                <ColumnHeader
                  title="Action"
                  column="action"
                  width="w-[20px]"
                  sortable={false}
                  filterable={false}
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
              {tab !== "refdoc" && (
                <ColumnHeader
                  title="Review Panel"
                  column="reviewCycle"
                  width="w-[200px]"
                  sortable={false}
                  filterable={false}
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((doc) => (
                <>
                  <TableRow
                    key={doc.id}
                    className={`cursor-pointer border-t-[1px] border-gray-400 hover:bg-gray-50 ${expandedCCTRow === doc.id ||
                        expandedReviewCycle === doc.id
                        ? "bg-blue-50"
                        : ""
                      }`}
                    onClick={() => handleRowClick(doc)}
                  >
                    {/* Document Name Cell */}
                    <TableCell
                      className="font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <a
                              href={`/doc-center/doc-details/${doc.id}`}
                              className="text-blue-600 hover:underline flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              {doc.name}
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDocumentViewer(doc);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                            {tab !== "refdoc" && (
                              <Badge
                                className={`flex items-center ${getStatusColor(
                                  doc.status
                                )}`}
                              >
                                {getStatusIcon(doc.status)}
                                {doc.status}
                              </Badge>
                            )}
                          </div>
                          {doc.type && (
                            <div
                              className="mt-1 inline-flex items-center gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Display domain badge */}
                              {getDomainBadge(doc)}

                              <Badge
                                variant="secondary"
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 flex items-center gap-1.5"
                              >
                                <Tag className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">
                                  {doc.type}
                                </span>
                              </Badge>

                              {/* Display category badge */}
                              {getCategoryBadge(doc)}
                            </div>
                          )}
                          {status !== "refdoc" && (
                            <div className="flex items-center gap-1 mt-1">
                              {/* Modifications button (conditional) */}
                              {doc.cct && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (expandedCCTRow === doc.id) {
                                      setExpandedCCTRow(null);
                                      console.log("In If block");
                                      setIsResetFilters(true);
                                    } else {
                                      setExpandedCCTRow(doc.id);
                                      setExpandedReviewCycle(null);
                                      setIsResetFilters(false);
                                      console.log("In else block");
                                      // Auto-select first subcategory if document has CCT data
                                      if (doc.cct) {
                                        const category = doc.cct.category;
                                        const subCategories =
                                          cctSubCategories[category];
                                        if (
                                          subCategories &&
                                          subCategories.length > 0
                                        ) {
                                          setSelectedCategory(
                                            `${category}/${subCategories[0]}`
                                          );
                                        } else {
                                          setSelectedCategory(category);
                                        }
                                      }
                                    }
                                  }}
                                >
                                  <Layers className="h-3.5 w-3.5" />
                                  <span>Modifications</span>
                                </Button>
                              )}

                              {/* Always visible Reference Documents button */}
                              {status !== "refdoc" && (
                                <ReferenceDocumentsPopover
                                  isOpen={referencePopovers[doc.id] || false}
                                  onOpenChange={() =>
                                    toggleReferencePopover(doc.id)
                                  }
                                  referenceDocuments={getReferenceDocuments(
                                    doc.id
                                  )}
                                  onRemoveDocument={(refDocId) =>
                                    handleRemoveReferenceDocument(
                                      doc.id,
                                      refDocId
                                    )
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Revision Cell (conditional) */}
                    {status !== "refdoc" && (
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Popover
                          open={openRevisionPopovers.includes(doc.id)}
                          onOpenChange={(open) => {
                            if (open) {
                              toggleRevisionPopover(doc.id);
                            } else {
                              setOpenRevisionPopovers((prev) =>
                                prev.filter((id) => id !== doc.id)
                              );
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[800px] max-h-[300px] overflow-y-auto"
                            side="right"
                            align="start"
                            sideOffset={10}
                          >
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
                                <span>Revision History</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-full hover:bg-gray-100"
                                  onClick={() => {
                                    setOpenRevisionPopovers((prev) =>
                                      prev.filter((id) => id !== doc.id)
                                    );
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </h4>
                              <div className="w-full">
                                <table className="w-full text-sm">
                                  <thead className="bg-blue-500 rounded-md text-white">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                        Number
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                        Description of change
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                        Page No
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                        Date Submitted
                                      </th>
                                      <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                        Date Approved
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {getRevisionHistory(doc.id).map(
                                      (revision) => (
                                        <tr
                                          key={revision.id}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {revision.number}
                                          </td>
                                          <td className="px-3 py-2">
                                            {revision.description}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {revision.pageNumbers}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {revision.dateSubmitted}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            {revision.dateApproved &&
                                              revision.dateApproved !== "" ? (
                                              <span className="text-gray-800">
                                                {revision.dateApproved}
                                              </span>
                                            ) : (
                                              <span className="text-amber-500 italic">
                                                {status === "approved" ? (
                                                  <span className="text-gray-800 not-italic">
                                                    22-05-2025
                                                  </span>
                                                ) : (
                                                  "Pending"
                                                )}
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    )}

                    {/* Owner Cell */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{doc.owner.officer}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-green-600" />
                          <span>{doc.owner.department}</span>
                          {doc.domain && (
                            <Badge className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {doc.domain}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                          <span>{doc.owner.title}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Created At / Uploaded TS Cell */}
                    <TableCell
                      className="whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar size={14} className="text-gray-500" />
                          <p>{doc.createdAt}</p>
                        </div>
                        <div className="flex items-center text-xs gap-1 text-gray-600">
                          <Clock size={13} className="text-gray-500" />
                          <p>{doc.createdAtTime}</p>
                        </div>
                      </div>
                    </TableCell>

                    {tab == "refdoc" && (
                      <TableCell
                        className="whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ml-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[600px] max-h-[250px] overflow-y-auto"
                            side="right"
                            align="start"
                            sideOffset={10}
                          >
                            <div className="space-y-4">
                              <div className="w-full">
                                {linkedWithDocs.length === 0 ? (
                                  <p className="text-sm text-gray-500 py-4 text-center">
                                    No referenced documents
                                  </p>
                                ) : (
                                  <table className="w-full text-sm">
                                    <thead className="bg-blue-500 rounded-md text-white">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                          Review Document Name
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
                                      {linkedWithDocs.map((doc, index) => (
                                        <tr
                                          key={doc.id}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-3 py-3">
                                            <div className="flex items-center gap-3">
                                              <FileText className="h-4 w-4 text-blue-500" />
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
                                                            // This will open /refdoc in a new tab
                                                            window.open(
                                                              "/refdoc",
                                                              "_blank"
                                                            );
                                                          }}
                                                        >
                                                          <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                      </TooltipTrigger>

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
                                              <span>
                                                {doc.addedBy || "John Doe"}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3 whitespace-nowrap">
                                            {doc.dateAdded ? (
                                              <span className="text-gray-800">
                                                {new Date(
                                                  doc.dateAdded
                                                ).toLocaleDateString("en-GB")}
                                              </span>
                                            ) : (
                                              <span>
                                                {doc.addedat || "22-05-2025"}
                                              </span>
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
                      </TableCell>
                    )}

                    {/* Approved TS / Deactivated TS Cell (conditional) */}
                    {(tab === "approved" || tab === "disapproved") && (
                      <TableCell
                        className="whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar
                              size={14}
                              className={
                                tab === "approved"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            />
                            <p>
                              {tab === "approved"
                                ? doc.approvedAt || "N/A"
                                : doc.deactivatedAt || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center text-xs gap-1 text-gray-600">
                            <Clock
                              size={13}
                              className={
                                tab === "approved"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            />
                            <p>
                              {tab === "approved"
                                ? doc.approvedAtTime || "N/A"
                                : doc.deactivatedAtTime || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {/* Compare Column Cell - only show for approved tab */}
                    {status === "approved" && (
                      <TableCell
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleCompare(doc)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-1 py-1 rounded flex items-center"
                        >
                          <List className="w-3 h-3 mr-1" />
                          Compare
                        </button>
                      </TableCell>
                    )}

                    {/* Final vs. Working Copy Cell (conditional) */}
                    {tab !== "refdoc" &&
                      tab !== "approved" &&
                      tab !== "disapproved" && (
                        <TableCell
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleCompare(doc)}
                            className="bg-blue-500 hover:bg-blue-600 mx-auto text-white text-xs px-2 py-1.5 cursor-pointer rounded flex items-center"
                          >
                            <List className="w-3 h-3 mr-1" />
                            Compare
                          </button>
                        </TableCell>
                      )}

                    {/* Action Cell */}
                    {status !== "disapproved" && (
                      <TableCell
                        onClick={() => {
                          setIsBotOpen(true);
                        }}
                      >
                        {status !== "active" ? (
                          <Tooltip className="bg-gray-100">
                            <TooltipTrigger asChild>
                              <Bot className="mx-auto h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-50 px-2 text-gray-800 border-gray-300 border">
                              Ask AI
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {status === "refdoc" ||
                                  status === "approved" ? null : (
                                  <MoreHorizontal className="w-fit h-8 mb-1" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="flex justify-center items-center"
                                onClick={() => {
                                  setIsBotOpen(true);
                                }}
                              >
                                {status === "active" && (
                                  <Bot className="mr-1 h-4 w-4" />
                                )}
                                <span>Ask AI</span>
                              </DropdownMenuItem>
                              {status === "active" && canViewActionRefDoc && (
                                <DropdownMenuItem
                                  className="flex justify-center items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenReferenceDialog(doc);
                                  }}
                                >
                                  <Link className="mr-1 h-4 w-4" />
                                  <span>Ref Doc</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}

                    {/* Review Panel Cell (conditional) */}
                    {status !== "refdoc" && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-full flex justify-center items-center ${expandedReviewCycle === doc.id
                              ? "bg-blue-100 text-blue-600"
                              : ""
                            }`}
                          onClick={(e) => handleReviewCycleClick(doc.id, e)}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expandedReviewCycle === doc.id ? "rotate-180" : ""
                              }`}
                          />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>

                  {/* CCT Expanded Section */}
                  {!IsresetFilters && expandedCCTRow === doc.id && (
                    <TableRow key={`cct-expanded-${doc.id}`}>
                      <TableCell colSpan={8} className="p-0">
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex flex-col h-auto">
                            <div className="flex mb-4">
                              <FileTree
                                categories={cctSubCategories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                                cctFilter={cctFilter}
                              />
                              <div className="flex-1 overflow-auto pl-4">
                                <CategoryView
                                  category={selectedCategory}
                                  documents={selectedCategoryDocuments}
                                  onViewDocument={openDocumentViewer}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Review Cycle Expanded Section */}
                  {expandedReviewCycle === doc.id && (
                    <TableRow key={`review-cycle-expanded-${doc.id}`}>
                      <TableCell colSpan={8} className="p-0">
                        <div className="p-4 border-t">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                        className={`w-2 h-2 rounded-full mr-2 ${node.type === "user"
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
                                        className={`ml-2 ${node.type === "user"
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
                                      className={`px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md ${node.status === "Assigned" ||
                                          node.status === "Initiated"
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                        }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${node.status === "Assigned" ||
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
                                            className={`bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-blue-200 group-hover:bg-blue-100 transition-colors ${index % 3 === 1
                                                ? "bg-green-50 text-green-800 border-green-200 group-hover:bg-green-100"
                                                : index % 3 === 2
                                                  ? "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100"
                                                  : ""
                                              }`}
                                          >
                                            {attr.name}
                                          </span>
                                          <span
                                            className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border ${index % 3 === 1
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
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && viewerOpen && (
        <DocumentViewer
          url={viewingDocument.docUrl}
          filename={viewingDocument.name}
          onClose={closeDocumentViewer}
        />
      )}

      {/* Diff View Popup */}
      <FullPagePopup
        isOpen={isFullPagePopupOpen}
        onClose={() => setIsFullPagePopupOpen(false)}
      >
        <PDFTextDiffViewer />
      </FullPagePopup>

      {/* Compare Popup */}
      <FullPagePopup
        isOpen={isComparePopupOpen}
        onClose={() => setIsComparePopupOpen(false)}
      >
        {selectedDoc && (
          <PDFTextDiffViewer
            oldText={selectedDoc.finalCopy || "Final copy content..."}
            newText={selectedDoc.workingCopy || "Working copy content..."}
          />
        )}
      </FullPagePopup>

      {/* Reference Documents Dialog */}
      {referenceDocsDialogOpen && selectedDocForRef && (
        <ReferenceDocumentsDialog
          isOpen={referenceDocsDialogOpen}
          onClose={() => setReferenceDocsDialogOpen(false)}
          selectedDocIds={documentReferences[selectedDocForRef.id] || []}
          onSave={handleSaveReferenceDocuments}
          currentDocId={selectedDocForRef.id}
        />
      )}
    </div>
  );
}
