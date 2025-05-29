export const documentData = [
  {
    id: '1',
    title: 'Mickey Mouse Final Version',
    uploadedAt: '2023-05-15T10:30:00Z',
    approvedAt: '2023-05-20T14:15:00Z',
    fileType: 'pdf',
    type: 'Security Manual',
    domain: 'Airport',
    status: 'approved',
    department: 'TSA',
    category: 'ASP',
    uploadedByName: 'Thomas Anderson',
    owner: {
      officer: "Officer 8",
      department: "Public Safety",
      title: "Crisis Manager",
    },
    referenceDocuments: ['TSA_Security_Guidelines', 'FAA_Regulations_2025'],
    comments: [
      {
        id: 'c1',
        name: 'John Davis',
        title: 'Finance Manager',
        group: 'Application Security Group',
        comment: 'Checked Baggage: Means property tendered by or on behalf of a passenger and accepted by an aircraft operator for transport, which is inaccessible to passengers during flight. Accompanied commercial courier consignments are not classified as checked baggage.',
        timestamp: '2023-05-18T09:30:00Z',
        replies: [
          {
            id: 'r1',
            name: 'Jane Wilson',
            title: 'Senior Auditor',
            group: 'Non-Application Security Group',
            comment: "I've reviewed them and they look correct.",
            timestamp: '2023-05-18T11:45:00Z'
          },
          {
            id: 'r2',
            name: 'Michael Johnson',
            title: 'Security Analyst',
            group: 'TSA',
            comment: "The security protocols mentioned need to be verified with the latest TSA guidelines.",
            timestamp: '2023-05-18T14:20:00Z'
          }
        ]
      },
      {
        id: 'c2',
        name: 'Sarah Thompson',
        title: 'Lead Auditor',
        group: 'Non-Application Security Group',
        comment: 'All figures verified and approved.',
        timestamp: '2023-05-19T10:15:00Z',
        replies: []
      }
    ]
  },
  {
    id: '2',
    title: 'Financial Statements Q1',
    uploadedAt: '2023-04-10T09:15:00Z',
    approvedAt: '2023-04-12T16:45:00Z',
    fileType: 'pdf',
    type: 'Financial Report',
    domain: 'Airport',
    status: 'approved',
    department: 'FAA',
    category: 'AEP',
    uploadedByName: 'Richard Williams',
    owner: {
      officer: "Officer 1",
      department: "TSA",
      title: "Security Manager",
    },
    referenceDocuments: ['FAA_Regulations_2025', 'Safety_Audit_Template'],
    comments: [
      {
        id: 'c3',
        name: 'Alice Wong',
        title: 'Chief Financial Officer',
        group: 'Application Security Group',
        comment: 'Great work on the quarterly report. Please ensure all financial data complies with our security protocols.',
        timestamp: '2023-04-11T14:20:00Z',
        replies: [
          {
            id: 'r3',
            name: 'Robert Chen',
            title: 'Finance Team Lead',
            group: 'Application Security Group',
            comment: 'Thank you! We appreciate your feedback. All data has been encrypted following Application Security Group standards.',
            timestamp: '2023-04-11T15:30:00Z'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Project Proposal - New Initiative',
    uploadedAt: '2023-06-01T11:20:00Z',
    approvedAt: '2023-06-05T10:00:00Z',
    fileType: 'pdf',
    type: 'Project Proposal',
    domain: 'Airport',
    status: 'approved',
    department: 'Airport Security',
    category: 'ACM',
    uploadedByName: 'Lisa Brown',
    owner: {
      officer: "Officer 2",
      department: "Airport Security",
      title: "Finance Manager",
    },
    referenceDocuments: ['TSA_Security_Guidelines', 'FAA_Regulations_2025_Duplicate'],
    comments: [
      {
        id: 'c4',
        name: 'David Miller',
        title: 'Security Officer',
        group: 'TSA',
        comment: 'This proposal needs TSA approval before implementation. Please submit the required security documentation.',
        timestamp: '2023-06-03T09:15:00Z',
        replies: []
      }
    ]
  },
  {
    id: '4',
    title: 'Employee Handbook',
    uploadedAt: '2023-01-15T08:45:00Z',
    approvedAt: '2023-01-20T13:30:00Z',
    fileType: 'pdf',
    type: 'HR Manual',
    domain: 'Airport',
    status: 'approved',
    department: 'Airport Operations',
    category: 'SMS',
    uploadedByName: 'Jennifer Martinez',
    owner: {
      officer: "Officer 2",
      department: "Airport Security",
      title: "Finance Manager",
    },
    referenceDocuments: ['Safety_Audit_Template', 'TSA_Security_Guidelines'],
    comments: [
      {
        id: 'c5',
        name: 'Emily Rodriguez',
        title: 'HR Director',
        group: 'Non-Application Security Group',
        comment: 'Updated with new policies regarding physical security measures.',
        timestamp: '2023-01-18T09:15:00Z',
        replies: []
      },
      {
        id: 'c6',
        name: 'James Wilson',
        title: 'Legal Counsel',
        group: 'Application Security Group',
        comment: 'Reviewed and approved the data privacy sections. All digital security measures comply with Application Security standards.',
        timestamp: '2023-01-19T11:45:00Z',
        replies: []
      }
    ]
  },
  {
    id: '5',
    title: 'Marketing Strategy 2023',
    uploadedAt: '2023-03-22T14:10:00Z',
    approvedAt: '2023-03-28T11:15:00Z',
    fileType: 'pdf',
    type: 'Marketing Plan',
    domain: 'Airport',
    status: 'approved',
    department: 'Public Safety',
    category: 'ADFAP (Airport)',
    uploadedByName: 'Christopher Lee',
    owner: {
      officer: "Officer 6",
      department: "Airport Security",
      title: "Finance Manager",
    },
    referenceDocuments: ['FAA_Regulations_2025', 'FAA_Regulations_2025_Duplicate'],
    comments: [
      {
        id: 'c7',
        name: 'Olivia Parker',
        title: 'Marketing Director',
        group: 'Non-Application Security Group',
        comment: 'This strategy aligns with our goals. Security team please review the data sharing protocols.',
        timestamp: '2023-03-25T10:30:00Z',
        replies: [
          {
            id: 'r4',
            name: 'Daniel Kim',
            title: 'Security Lead',
            group: 'Application Security Group',
            comment: 'Data sharing protocols reviewed and approved. Added additional encryption requirements for external communications.',
            timestamp: '2023-03-26T16:45:00Z'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Security Protocol Updates',
    uploadedAt: '2023-07-10T13:25:00Z',
    approvedAt: '2023-07-15T09:45:00Z',
    fileType: 'pdf',
    type: 'Security Protocol',
    domain: 'Airport',
    status: 'approved',
    department: 'TSA',
    category: 'ASP',
    uploadedByName: 'Michael Johnson',
    owner: {
      officer: "Officer 5",
      department: "Airport Security",
      title: "Finance Manager",
    },
    referenceDocuments: ['TSA_Security_Guidelines', 'Safety_Audit_Template'],
    comments: [
      {
        id: 'c8',
        name: 'Samuel Wilson',
        title: 'Security Supervisor',
        group: 'TSA',
        comment: 'All new protocols have been reviewed and meet federal requirements.',
        timestamp: '2023-07-12T14:30:00Z',
        replies: []
      }
    ]
  },
  {
    id: '7',
    title: 'Runway Maintenance Schedule',
    uploadedAt: '2023-02-18T10:15:00Z',
    approvedAt: '2023-02-22T11:30:00Z',
    fileType: 'pdf',
    type: 'Maintenance Schedule',
    domain: 'Airport',
    status: 'approved',
    department: 'Airport Operations',
    category: 'SMS',
    uploadedByName: 'Robert Taylor',
    owner: {
      officer: "Officer 3",
      department: "Airport Operations",  
      title: "HR Director",
    },
    referenceDocuments: ['FAA_Regulations_2025', 'Safety_Audit_Template'],
    comments: [
      {
        id: 'c9',
        name: 'Amanda Clark',
        title: 'Operations Manager',
        group: 'Non-Application Security Group',
        comment: 'Schedule approved with minor adjustments to accommodate peak hours.',
        timestamp: '2023-02-20T09:45:00Z',
        replies: []
      }
    ]
  }
];