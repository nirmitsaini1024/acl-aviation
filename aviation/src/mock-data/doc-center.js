// Mock documents data with empty file URLs
export const documents = [
  {
    id: 1,
    name: "Mickey_Mouse_ASP",
    type: "Airport Security",
    createdAt: "04 April 2025",
    createdAtTime: "16:05:05",
    owner: {
      officer: "Officer 1",
      department: "TSA", // Changed to TSA
      title: "Security Manager",
    },
    status: "In Review",
    details: {
      summary: "Security protocol update for international flights",
      fullText:
        "This document outlines the updated security protocols for international flights...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 2,
    name: "Aviation_Doc2",
    type: "Security",
    createdAt: "05 April 2025",
    createdAtTime: "16:05:05",
    owner: {
      officer: "Officer 1",
      department: "FAA", // Changed to FAA
      title: "Security Manager",
    },
    status: "In Review",
    details: {
      summary: "Domestic flight security guidelines",
      fullText:
        "Comprehensive guidelines for domestic flight security operations...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 3,
    name: "Finance_Report",
    type: "Security",
    createdAt: "03 April 2025",
    createdAtTime: "10:15:22",
    approvedAt: "08 April 2025", // Added for approved documents
    approvedAtTime: "16:20:45", // Added for approved documents
    owner: {
      officer: "Officer 2",
      department: "Airport Security", // Changed to Airport Security
      title: "Finance Manager",
    },
    status: "Approved",
    details: {
      summary: "Budget overview for Q2",
      fullText:
        "Detailed financial report for Q2 2025, including budget allocations...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 4,
    name: "HR_Policy",
    type: "Policy",
    createdAt: "02 April 2025",
    createdAtTime: "09:30:45",
    deactivatedAt: "07 April 2025", // Added for deactivated documents
    deactivatedAtTime: "11:15:20", // Added for deactivated documents
    owner: {
      officer: "Officer 3",
      department: "Airport Operations", // Changed to Airport Operations 
      title: "HR Director",
    },
    status: "Rejected",
    details: {
      summary: "Updated leave policy",
      fullText:
        "Proposed updates to the company leave policy...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 5,
    name: "Marketing_Plan",
    type: "Strategy",
    createdAt: "01 April 2025",
    createdAtTime: "14:22:10",
    owner: {
      officer: "Officer 4",
      department: "Public Safety", // Changed to Public Safety
      title: "Marketing Lead",
    },
    status: "In Review",
    details: {
      summary: "Q2 marketing initiatives",
      fullText:
        "Strategic marketing plan for Q2 2025...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 6,
    name: "TSA_Security_Guidelines",
    type: "Reference",
    createdAt: "10 April 2025",
    createdAtTime: "10:30:15",
    owner: {
      officer: "Officer 5",
      department: "Airline Security", // Changed to Airline Security
      title: "Security Expert",
    },
    status: "N/A",
    details: {
      summary: "TSA security guidelines for airport operations",
      fullText:
        "Comprehensive guidelines from TSA regarding security protocols...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 7,
    name: "FAA_Regulations_2025",
    type: "Reference",
    createdAt: "08 April 2025",
    createdAtTime: "14:45:30",
    owner: {
      officer: "Officer 6",
      department: "Airline Operations", // Changed to Airline Operations
      title: "Regulations Expert",
    },
    status: "N/A",
    details: {
      summary: "Updated FAA regulations for 2025",
      fullText:
        "Latest FAA regulations affecting airport and airline operations...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 8,
    name: "FAA_Regulations_2025_Duplicate",
    type: "Reference",
    createdAt: "08 April 2025",
    createdAtTime: "14:45:30",
    owner: {
      officer: "Officer 6",
      department: "FAA",
      title: "Regulations Expert",
    },
    status: "N/A",
    details: {
      summary: "Updated FAA regulations for 2025",
      fullText:
        "Latest FAA regulations affecting airport and airline operations...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 9,
    name: "Safety_Audit_Template",
    type: "Reference",
    createdAt: "05 April 2025",
    createdAtTime: "11:20:40",
    owner: {
      officer: "Officer 7",
      department: "Aviation Safety",
      title: "Safety Auditor",
    },
    status: "N/A",
    details: {
      summary: "Template for conducting safety audits",
      fullText:
        "Standardized template for performing safety audits at airports...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 10,
    name: "Emergency_Response_Protocol",
    type: "Policy",
    createdAt: "11 April 2025",
    createdAtTime: "12:00:00",
    approvedAt: "15 April 2025", // Added for approved documents
    approvedAtTime: "13:45:30", // Added for approved documents
    owner: {
      officer: "Officer 8",
      department: "Public Safety",
      title: "Crisis Manager",
    },
    status: "Approved", // Changed to Approved to demonstrate the approved column
    details: {
      summary: "Airport emergency response planning",
      fullText:
        "Procedures for managing emergencies, evacuations, and response coordination...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 11,
    name: "Airline_Safety_Manual",
    type: "Manual",
    createdAt: "07 April 2025",
    createdAtTime: "08:45:00",
    approvedAt: "14 April 2025", // Added for approved documents
    approvedAtTime: "10:20:15", // Added for approved documents
    owner: {
      officer: "Officer 9",
      department: "Airline Security",
      title: "Safety Officer",
    },
    status: "Approved",
    details: {
      summary: "Safety manual for airline crew and ground staff",
      fullText:
        "Detailed procedures and training material for maintaining airline safety...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 12,
    name: "Passenger_Complaints_Report",
    type: "Report",
    createdAt: "09 April 2025",
    createdAtTime: "15:15:00",
    deactivatedAt: "13 April 2025", // Added for deactivated documents
    deactivatedAtTime: "09:30:45", // Added for deactivated documents
    owner: {
      officer: "Officer 10",
      department: "Airport Operations",
      title: "Operations Head",
    },
    status: "Rejected",
    details: {
      summary: "Quarterly analysis of passenger complaints",
      fullText:
        "This report presents insights from complaint data, trends, and suggested resolutions...",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 13,
    name: "Airline_Incident_Log",
    type: "Log",
    createdAt: "06 April 2025",
    createdAtTime: "07:35:50",
    owner: {
      officer: "Officer 11",
      department: "Airline Operations",
      title: "Incident Reporter",
    },
    status: "In Review",
    details: {
      summary: "Incident records from March 2025",
      fullText:
        "Summarized log of all airline-related incidents reported in March, including delays, technical failures, and responses.",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
  {
    id: 14,
    name: "Airline_Incident_Log2",
    type: "Log",
    createdAt: "06 April 2025",
    createdAtTime: "07:35:50",
    deactivatedAt: "11 April 2025", // Added for deactivated documents
    deactivatedAtTime: "14:20:30", // Added for deactivated documents
    owner: {
      officer: "Officer 11",
      department: "Airline Operations",
      title: "Incident Reporter",
    },
    status: "Rejected", // Changed to Rejected to demonstrate the deactivated column
    details: {
      summary: "Incident records from March 2025",
      fullText:
        "Summarized log of all airline-related incidents reported in March, including delays, technical failures, and responses.",
    },
    revisionHistory: "Revision History",
    docUrl: "",
  },
];
// Domain and Department Options
export const domains = ["Airport", "Airline"];

export const departmentOptions = {
  Airport: ["TSA", "FAA", "Airport Security", "Airport Operations", "Public Safety"],
  Airline: ["Airline Security", "Airline Operations"],
};

export const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
};
