import { useState } from "react"
import {
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  User,
  Mail,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { documents } from "@/mock-data/doc-center"
import { CommentDetails } from "@/components/doc-details/comment-details"

// Mock data for doc-details page
export const documentData = {
  name: "Aviation_Doc1",
  revision: {
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
}

// Stats Card Component
const StatCard = ({ icon, title, count }) => {
  const Icon = icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-md flex items-center">
          <Icon className={`h-5 w-5 ${title === "Approvals" ? "text-green-500" : "text-blue-500"} mr-2`} />
          {title} ({count || 0})
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

// Document Details Component
const DocumentDetails = ({ revision }) => {
  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white border-b p-2 rounded-t-md">
        <CardTitle className="text-lg p-2">Document Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DetailItem
            label="Status"
            content={
              revision.status === "Approved" ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {revision.status}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejected
                </Badge>
              )
            }
          />
          <DetailItem
            label="Approved/Rejected"
            content={
              revision.status === "Approved" ? (
                <span className="text-green-600 font-medium">Approved</span>
              ) : (
                <span className="text-red-600 font-medium">Rejected</span>
              )
            }
          />
          <DetailItem
            label="Created At"
            content={
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                <span>{revision.createdAt || "N/A"}</span>
              </div>
            }
          />
          <DetailItem
            label="Active At"
            content={
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                <span>{revision.activeAt || "N/A"}</span>
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Detail Item Component
const DetailItem = ({ label, content }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center">{content}</div>
    </div>
  )
}

// Approval Details Component
const ApprovalDetails = ({ revision, selectedStageId, onStageClick }) => {
  if (!revision.approvalStages || revision.approvalStages.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="bg-neutral-50 text-blue-600 font-bold border-b p-4 rounded-t-md">
        <CardTitle className="text-lg">Approval Details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Horizontal Stage Tabs */}
        <div className="flex border-b mb-4">
          {revision.approvalStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "px-6 py-3 cursor-pointer hover:bg-slate-50 text-center",
                selectedStageId === stage.id
                  ? "border-b-2 border-blue-500 bg-slate-50 font-medium"
                  : "border-b border-transparent"
              )}
              onClick={() => onStageClick(stage.id)}
            >
              <div className="flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm font-semibold">Stage {index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stage Content Area */}
        <div>
          {selectedStageId && (
            <ApprovalStageDetails
              stage={revision.approvalStages.find(stage => stage.id === selectedStageId)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}


// Main Component
export default function DocDetails() {
  const { docId } = useParams();
  const [selectedApprovalStage, setSelectedApprovalStage] = useState(1) // Default to first stage
  const [selectedReferenceText, setSelectedReferenceText] = useState(null)

  const handleApprovalStageClick = (id) => {
    setSelectedApprovalStage(id === selectedApprovalStage ? null : id)
  }

  const handleReferenceTextClick = (id) => {
    setSelectedReferenceText(id === selectedReferenceText ? null : id)
  }

  // Get the revision - we're hardcoding to just show Aviation_Doc1_10
  const revision = documentData.revision

  return (
    <div className="mx-auto py-2 flex flex-col gap-4">
      <Link to="/doc-center" className="w-fit">
        <Button variant="link" className="font-semibold text-blue-600 flex gap-4 cursor-pointer">
          <ArrowLeft /> Back to Doc Center
        </Button>
      </Link>

      <h1 className="text-2xl font-bold text-black mb-2">
        {docId && documents && documents[docId - 1] ? documents[docId - 1].name : 'Aviation_Doc1'} Details
      </h1>

      <div className="border rounded-lg p-6 space-y-6 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            icon={CheckCircle2}
            title="Approvals"
            count={revision.approvals}
          />
          <StatCard
            icon={MessageSquare}
            title="Comments"
            count={revision.comments}
          />
        </div>

        <DocumentDetails revision={revision} />

        <CommentDetails
          revision={revision}
          selectedRefId={selectedReferenceText}
          onRefClick={handleReferenceTextClick}
        />
      </div>
    </div>
  )
}