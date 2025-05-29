// Mock data for doc-details page
export const documentData = {
  name: "Aviation_Doc1",
  revisions: [
    {
      id: 1,
      name: "Aviation_Doc1_1",
      date: "2023-01-15",
      status: "Pending",
      createdAt: "2023-01-15 09:15 AM",
      activeAt: "N/A",
      approvals: 0,
      comments: 0,
    },
    {
      id: 9,
      name: "Aviation_Doc1_9",
      date: "2023-05-22",
      status: "Pending",
      createdAt: "2023-05-22 10:30 AM",
      activeAt: "N/A",
      approvals: 2,
      comments: 5,
    },
    {
      id: 10,
      name: "Aviation_Doc1_10",
      date: "2023-06-30",
      status: "Approved",
      createdAt: "2023-06-28 09:15 AM",
      activeAt: "2023-06-30 02:30 PM",
      approvals: 5,
      comments: 100,
      approvalStages: [
        {
          id: 1,
          name: "Stage 1 Approval Details",
          steps: [
            {
              stepName: "Initial Review",
              approvers: [
                {
                  name: "John",
                  approvedAt: "2023-06-29 10:15 AM",
                  title: "Security Chief",
                  notificationMode: "Email",
                },
              ],
              requestSentAt: "2023-06-28 11:30 AM",
              viewed: "2023-06-28 01:45 PM",
              decision: "Approved",
              decisionAt: "2023-06-29 10:15 AM",
              commentsCount: 3,
            },
            {
              stepName: "Initial Review",
              approvers: [
                {
                  name: "John",
                  approvedAt: "2023-06-29 10:15 AM",
                  title: "Security Chief",
                  notificationMode: "Email",
                },
              ],
              requestSentAt: "2023-06-28 11:30 AM",
              viewed: "2023-06-28 01:45 PM",
              decision: "Approved",
              decisionAt: "2023-06-29 10:15 AM",
              commentsCount: 3,
            },
          ],
        },
        {
          id: 2,
          name: "Stage 2 Approval Details",
          steps: [
            {
              stepName: "Final Review",
              approvers: [
                {
                  name: "Sarah",
                  approvedAt: "2023-06-30 09:45 AM",
                  title: "Department Head",
                  notificationMode: "Email",
                },
              ],
              requestSentAt: "2023-06-29 02:30 PM",
              viewed: "2023-06-29 04:15 PM",
              decision: "Approved",
              decisionAt: "2023-06-30 09:45 AM",
              commentsCount: 2,
            },
          ],
        },
      ],
      commentReferences: [
        {
          id: 1,
          text: "Referenced Text 1",
          referenceText: "Reference Text few lines",
          comments: [
            {
              givenBy: "John",
              givenAt: "2023-06-29 11:30 AM",
              details: "This is comment",
              notificationMode: "Email",
              notificationSent: "2023-06-29 11:31 AM",
            },
          ],
        },
        {
          id: 2,
          text: "Referenced Text 2",
          referenceText: "Another reference text section",
          comments: [
            {
              givenBy: "Sarah",
              givenAt: "2023-06-29 03:45 PM",
              details: "Please review this section",
              notificationMode: "Email",
              notificationSent: "2023-06-29 03:46 PM",
            },
          ],
        },
      ],
    },
  ],
}