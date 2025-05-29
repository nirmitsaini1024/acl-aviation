import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Clock, 
  List, 
  Trash2, 
  EllipsisVertical, 
  User, 
  Building, 
  Briefcase, 
  Tag, 
  ChevronDown 
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

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

// Domain badge configuration
const domainBadgeConfig = {
  Airport: "bg-blue-100 text-blue-800 border-blue-200",
  Airline: "bg-green-100 text-green-800 border-green-200",
};

// Category badge configuration
const categoryBadgeConfig = {
  ASP: "bg-purple-100 text-purple-800 border-purple-200",
  AEP: "bg-amber-100 text-amber-800 border-amber-200",
  ACM: "bg-sky-100 text-sky-800 border-sky-200",
  SMS: "bg-rose-100 text-rose-800 border-rose-200",
  "ADFAP (Airport)": "bg-indigo-100 text-indigo-800 border-indigo-200",
  ADFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

// Function to get domain badge
const getDomainBadge = (doc) => {
  if (!doc.domain) return null;

  const colorClass = domainBadgeConfig[doc.domain] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colorClass}`}
    >
      <Building className="h-3.5 w-3.5" />
      <span>{doc.domain}</span>
    </Badge>
  );
};

// Function to get category badge
const getCategoryBadge = (doc) => {
  if (!doc.category) return null;

  const colorClass = categoryBadgeConfig[doc.category] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colorClass}`}
    >
      <Tag className="h-3.5 w-3.5" />
      <span>{doc.category}</span>
    </Badge>
  );
};

// Function to get document type badge
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

// Main reusable component for document badges section
const DocumentBadgesSection = ({ 
  doc, 
  showType = true, 
  showDomain = true, 
  showCategory = true,
  className = "mt-1 inline-flex items-center gap-1.5",
  onClick
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
      {/* Domain Badge */}
      {showDomain && getDomainBadge(doc)}

      {/* Document Type Badge */}
      {showType && getDocumentTypeBadge(doc)}

      {/* Category Badge */}
      {showCategory && getCategoryBadge(doc)}
    </div>
  );
};

const DeactivatedDocumentsTable = () => {
  // Sample data for deactivated documents
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'Draft Policy v1.2',
      uploadedAt: '2023-05-15T10:30:00Z',
      deactivatedAt: '2023-05-18T14:15:00Z',
      fileType: 'docx',
      type: 'Policy',
      domain: 'Airport',
      category: 'AEP',
      status: 'deactivated',
      deactivatedBy: 'admin@example.com',
      deactivationReason: 'Superseded by new version',
      owner: {
        officer: "Officer 1",
        department: "TSA",
        title: "Security Manager",
      },
    },
    {
      id: '2',
      title: 'Old Employee Contract',
      uploadedAt: '2023-01-10T09:15:00Z',
      deactivatedAt: '2023-03-12T16:45:00Z',
      fileType: 'docx',
      type: 'Contract',
      domain: 'Airport',
      category: 'SMS',
      status: 'deactivated',
      deactivatedBy: 'hr@example.com',
      deactivationReason: 'New contract template implemented',
      owner: {
        officer: "Officer 1",
        department: "FAA",
        title: "Security Manager",
      },
    },
    {
      id: '3',
      title: 'Project Scope - Initial',
      uploadedAt: '2023-04-01T11:20:00Z',
      deactivatedAt: '2023-04-10T10:00:00Z',
      fileType: 'docx',
      type: 'Project',
      domain: 'Airport',
      category: 'ACM',
      status: 'deactivated',
      deactivatedBy: 'pm@example.com',
      deactivationReason: 'Project requirements changed',
      owner: {
        officer: "Officer 2",
        department: "Airport Security",
        title: "Finance Manager",
      },
    },
    {
      id: '4',
      title: 'Marketing Plan Draft',
      uploadedAt: '2023-02-15T08:45:00Z',
      deactivatedAt: '2023-02-28T13:30:00Z',
      fileType: 'docx',
      type: 'Marketing',
      domain: 'Airline',
      category: 'ADFP',
      status: 'deactivated',
      deactivatedBy: 'marketing@example.com',
      deactivationReason: 'Final version approved',
      owner: {
        officer: "Officer 3",
        department: "Airport Security",
        title: "Finance Manager",
      },
    },
    {
      id: '5',
      title: 'Financial Forecast Q1',
      uploadedAt: '2023-03-22T14:10:00Z',
      deactivatedAt: '2023-04-15T11:15:00Z',
      fileType: 'docx',
      type: 'Financial',
      domain: 'Airport',
      category: 'AEP',
      status: 'deactivated',
      deactivatedBy: 'finance@example.com',
      deactivationReason: 'Updated with actual numbers',
      owner: {
        officer: "Officer 5",
        department: "Airport Security",
        title: "Finance Manager",
      },
    }
  ]);

  // State for expanded review cycles (extracted from DocumentTable)
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);

  // Handle review cycle click (extracted from DocumentTable)
  const handleReviewCycleClick = (docId, e) => {
    e.stopPropagation();
    if (expandedReviewCycle === docId) {
      setExpandedReviewCycle(null);
    } else {
      setExpandedReviewCycle(docId);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file type badge
  const getFileTypeBadge = (doc) => {
    return (
      <Badge className="bg-blue-50 text-blue-600 text-xs px-2">
        {doc.fileType}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (doc) => {
    return (
      <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-red-500"></span>
        Deactivated
      </span>
    );
  };

  // Handle view action
  const handleView = (doc) => {
    console.log('View document:', doc.title);
    // Implement view functionality
  };

  // Handle restore action
  const handleRestore = (docId) => {
    console.log('Restore document:', docId);
    // Implement restore functionality
  };

  // Handle permanent delete action
  const handleDelete = (docId) => {
    console.log('Permanently delete document:', docId);
    // Implement delete functionality
  };

  return (
    <div className="border-1 border-gray-400 rounded-lg overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-600 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-50">Document Name</th>
            <th className="px-4 py-3 font-semibold text-gray-50">Owner</th>
            <th className="px-4 py-3 font-semibold text-gray-50">Uploaded TS</th>
            <th className="px-4 py-3 font-semibold text-gray-50">Deactivated TS</th>
            <th className="px-4 py-3 font-semibold text-gray-50">Review Panel</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <React.Fragment key={doc.id}>
              <tr className="border-t-[1px] border-gray-400 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium">
                      {doc.title} {getFileTypeBadge(doc)}
                    </span>
                    <div className="py-2">
                      {getStatusBadge(doc)}
                    </div>
                  </div>
                  
                  {/* Updated badges section using the extracted component */}
                  {doc.type && (
                    <DocumentBadgesSection 
                      doc={doc} 
                      showType={true}
                      showDomain={true}
                      showCategory={true}
                      className="inline-flex items-center gap-1.5 ml-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  <div className="flex mt-1.5 ml-6">
                    <button
                      onClick={() => handleView(doc)}
                      className="text-blue-600 hover:text-blue-800 mr-3 flex items-center text-xs"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">{doc.owner.officer}</span>
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
                </td>
                <td className="py-3">
                  <p className="font-normal flex gap-2 items-center text-zinc-700">
                    <Clock size={14} />
                    <span title={doc.uploadedAt}>
                      {formatTimestamp(doc.uploadedAt)}
                    </span>
                  </p>
                </td>
                <td className="py-3">
                  <p className="font-normal flex gap-2 items-center text-zinc-700">
                    <Clock size={14} />
                    <span title={doc.deactivatedAt}>
                      {formatTimestamp(doc.deactivatedAt)}
                    </span>
                  </p>
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
                  <td colSpan={5} className="p-0">
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
    </div>
  );
};

export default DeactivatedDocumentsTable;