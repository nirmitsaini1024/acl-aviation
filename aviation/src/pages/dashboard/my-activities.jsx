"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import {
  CheckCircle2,
  XCircle,
  MessageSquareText,
  Reply,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AuditActivitiesLog = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const activities = [
    {
      id: 1,
      type: "approved",
      action: "Approved reference text",
      details:
        "Aircraft Security Protocols - Regulations for monitoring and securing aircraft during maintenance operations and between flights to prevent unauthorized access and potential security threats.",
      timestamp: new Date(2023, 5, 15, 8, 23),
      reference: "DOC-ASP-2023-0615",
    },
    {
      id: 2,
      type: "rejected",
      action: "Rejected reference text",
      details:
        "Passenger Screening - Mickey Mouse Airport (KMMW), also known as Mickey Mouse Club House, is a public use airport located east of the central business district of Disney Corner, Florida.",
      timestamp: new Date(2023, 5, 15, 9, 45),
      reference: "DOC-PS-2023-0615",
      reason: "Passenger screening fails",
    },
    {
      id: 3,
      type: "commented",
      action: "Commented on reference text",
      details: "Suggested update to Aircraft Security Protocols section 4.2 regarding overnight parking procedures",
      timestamp: new Date(2023, 5, 15, 10, 12),
      reference: "DOC-ASP-2023-0615",
    },
    {
      id: 4,
      type: "replied",
      action: "Replied to comment",
      details: "Responded to query about passenger screening protocols for diplomatic personnel",
      timestamp: new Date(2023, 5, 15, 11, 30),
      reference: "THREAD-1142",
    },
    {
      id: 5,
      type: "verified",
      action: "Verified document",
      details: "Confirmed all security protocols are up-to-date with latest TSA regulations",
      timestamp: new Date(2023, 5, 15, 12, 15),
      reference: "DOC-ASP-2023-0615",
    },
  ]

  const getActivityIcon = (type) => {
    const iconProps = { size: 18, className: "flex-shrink-0" }
    switch (type) {
      case "approved":
        return <CheckCircle2 {...iconProps} className="text-emerald-600" />
      case "rejected":
        return <XCircle {...iconProps} className="text-red-500" />
      case "commented":
        return <MessageSquareText {...iconProps} className="text-blue-500" />
      case "replied":
        return <Reply {...iconProps} className="text-purple-500" />
      case "verified":
        return <ShieldCheck {...iconProps} className="text-blue-600" />
      default:
        return <div {...iconProps} className="w-[18px] h-[18px]" />
    }
  }

  const getActivityBadge = (type) => {
    const variants = {
      approved: { variant: "default", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
      rejected: { variant: "destructive", className: "bg-red-100 text-red-700 hover:bg-red-100" },
      commented: { variant: "secondary", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
      replied: { variant: "secondary", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
      verified: { variant: "default", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    }

    const config = variants[type] || variants.approved

    return (
      <Badge variant={config.variant} className={config.className}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.reference.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterType === "all" || activity.type === filterType

      return matchesSearch && matchesFilter
    })
  }, [searchTerm, filterType])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Actions</h1>
          <p className=" text-gray-500 mt-1 font-medium">Track and monitor all my activities</p>
        </div>
       
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search activities, details, or references..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="commented">Commented</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">
            Activity Log 
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto border-1 border-gray-400">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-1/3" />
                <col className="w-1/2" />
                <col className="w-1/6" />
              </colgroup>
              <thead className="bg-gray-50 border-b-[1px] border-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Action TS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-400">
                {filteredActivities.map((activity, index) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex flex-col space-y-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {activity.action}
                          </div>
                          {getActivityBadge(activity.type)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{activity.details}</p>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {activity.reference}
                          </Badge>
                          {activity.reason && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-200 whitespace-nowrap">
                              {activity.reason}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{format(activity.timestamp, "MMM d, yyyy")}</div>
                        <div className="text-xs text-gray-500">{format(activity.timestamp, "h:mm a")}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No activities found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Logged as:</span>
              <span>Security Reviewer • Terminal B Documents Team</span>
            </div>
            <div className="text-xs text-gray-500">Last updated: {format(new Date(), "MMM d, yyyy h:mm a")}</div>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default AuditActivitiesLog
