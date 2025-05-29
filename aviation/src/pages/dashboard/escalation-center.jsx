import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  UserPlus,
  Calendar,
  FileText,
  AlertCircle,
  User,
  UsersRound,
  Clock,
  AlarmClock,
  ArrowRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  FolderArchive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnHeader } from "@/components/column-header";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Sample data for the escalation table
const escalations = [
  {
    id: "esc-002",
    category: "Compliance Alert",
    documentName: "Regulatory Compliance Update",
    role: "Compliance Manager",
    assignedTo: "Emma Davis",
    assignedAt: "08 Apr 2025 at 14:30:45",
    expiredAt: "15 Apr 2025 at 14:30:45",
    status: "Active",
    priority: "Medium",
    departmentId: "COMP-02",
  },
  {
    id: "esc-003",
    category: "System Outage",
    documentName: "Critical System Recovery Plan",
    role: "IT Manager",
    assignedTo: "Michael Chen",
    assignedAt: "05 Apr 2025 at 11:20:18",
    expiredAt: "12 Apr 2025 at 11:20:18",
    status: "Expired",
    priority: "Critical",
    departmentId: "IT-03",
  },
  {
    id: "esc-004",
    category: "Customer Complaint",
    documentName: "Customer Resolution Process",
    role: "Customer Service Lead",
    assignedTo: "Sophia Rodriguez",
    assignedAt: "09 Apr 2025 at 15:45:30",
    expiredAt: "16 Apr 2025 at 15:45:30",
    status: "Active",
    priority: "Low",
    departmentId: "CS-04",
  },
  {
    id: "esc-005",
    category: "Operational Risk",
    documentName: "Business Continuity Plan",
    role: "Operations Director",
    assignedTo: "Robert Johnson",
    assignedAt: "07 Apr 2025 at 10:05:12",
    expiredAt: "14 Apr 2025 at 10:05:12",
    status: "Active",
    priority: "High",
    departmentId: "OPS-05",
  },
  {
    id: "esc-006",
    category: "Security Incident",
    documentName: "Phishing Attack Response",
    role: "IT Security Specialist",
    assignedTo: "Alex Thompson",
    assignedAt: "06 Apr 2025 at 08:30:00",
    expiredAt: "13 Apr 2025 at 08:30:00",
    status: "Expired",
    priority: "Medium",
    departmentId: "SEC-06",
  },
  {
    id: "esc-007",
    category: "HR Issue",
    documentName: "Workplace Harassment Claim",
    role: "HR Director",
    assignedTo: "Jennifer Lee",
    assignedAt: "11 Apr 2025 at 13:25:40",
    expiredAt: "18 Apr 2025 at 13:25:40",
    status: "Active",
    priority: "High",
    departmentId: "HR-07",
  },
];

// Sample team members for reassignment
const teamMembers = [
  { id: "user-002", name: "Emma Davis", role: "Compliance Manager" },
  { id: "user-003", name: "Michael Chen", role: "IT Manager" },
  { id: "user-004", name: "Sophia Rodriguez", role: "Customer Service Lead" },
  { id: "user-005", name: "Robert Johnson", role: "Operations Director" },
  { id: "user-006", name: "Alex Thompson", role: "IT Security Specialist" },
  { id: "user-007", name: "Jennifer Lee", role: "HR Director" },
  { id: "user-008", name: "David Wilson", role: "Security Officer" },
  { id: "user-009", name: "Sarah Miller", role: "Compliance Specialist" },
];

export default function EscalationTable({ globalFilter }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  
  // State for reassign and notify popovers
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  
  // State to manage open/closed popovers
  const [reassignPopoverOpen, setReassignPopoverOpen] = useState(false);
  const [notifyPopoverOpen, setNotifyPopoverOpen] = useState(false);

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

  // Open reassign popover
  const openReassignPopover = (escalation) => {
    setSelectedEscalation(escalation);
    setSelectedTeamMember("");
    setReassignPopoverOpen(true);
  };

  // Close reassign popover
  const closeReassignPopover = () => {
    setReassignPopoverOpen(false);
  };

  // Open notify popover
  const openNotifyPopover = (escalation) => {
    setSelectedEscalation(escalation);
    setNotificationMessage(`Reminder: The "${escalation.documentName}" escalation requires your attention.`);
    setNotifyPopoverOpen(true);
  };

  // Close notify popover
  const closeNotifyPopover = () => {
    setNotifyPopoverOpen(false);
  };

  // Handle sending notification
  const handleSendNotification = () => {
    // Here you would implement the actual notification logic
    console.log(`Notification sent to ${selectedEscalation.assignedTo}:`, notificationMessage);
    closeNotifyPopover();
  };

  // Handle reassignment
  const handleReassign = () => {
    // Here you would implement the actual reassignment logic
    const selectedMember = teamMembers.find(member => member.id === selectedTeamMember);
    console.log(`Reassigned from ${selectedEscalation.assignedTo} to ${selectedMember.name}`);
    closeReassignPopover();
  };

  // Filter and sort data
  const filteredData = escalations.filter((escalation) => {
    // Apply global filter
    if (globalFilter) {
      const searchableValues = [
        escalation.category,
        escalation.documentName,
        escalation.role,
        escalation.assignedTo,
        escalation.assignedAt,
        escalation.expiredAt,
        escalation.status,
        escalation.priority,
      ];

      if (
        !searchableValues.some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // Apply column filters
    for (const [key, value] of Object.entries(columnFilters)) {
      if (!value) continue;

      const escalationValue = escalation[key];
      if (!String(escalationValue).toLowerCase().includes(value.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = String(a[sortColumn]);
    const bValue = String(b[sortColumn]);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "security incident":
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case "compliance alert":
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      case "system outage":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "customer complaint":
        return <User className="h-4 w-4 mr-1" />;
      case "operational risk":
        return <Shield className="h-4 w-4 mr-1" />;
      case "hr issue":
        return <UsersRound className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600 ">Escalation Center</h1>
      <div className="rounded-md border-1 border-gray-400 shadow-sm bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#335aff]">
              <ColumnHeader
                title="Document Category"
                column="category"
                width="w-[150px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Document Name"
                column="documentName"
                width="w-[180px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Role"
                column="role"
                width="w-[150px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Assigned To"
                column="assignedTo"
                width="w-[150px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Assigned TS"
                column="assignedAt"
                width="w-[160px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Expired TS"
                column="expiredAt"
                width="w-[160px]"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <ColumnHeader
                title="Actions"
                column="actions"
                width="w-[100px]"
                sortable={false}
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No escalations found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((escalation, index) => (
                <TableRow key={escalation.id} className="border-t-[1px] border-gray-400">
                  <TableCell>
                    <div className="flex items-center">
                      {escalation.category}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={`/doc-center/doc-details/${index+1}`}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      {escalation.documentName}
                    </a>
                  </TableCell>
                  <TableCell>{escalation.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{escalation.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      {escalation.assignedAt}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Badge 
                        className="flex items-center bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        <AlarmClock className="h-4 w-4 mr-2" />
                        {escalation.expiredAt}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {/* Reassign Popover */}
                      <Popover 
                        open={reassignPopoverOpen && selectedEscalation?.id === escalation.id} 
                        onOpenChange={(open) => {
                          if (open) {
                            openReassignPopover(escalation);
                          } else {
                            closeReassignPopover();
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 "
                            title="Reassign"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 mr-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Reassign Escalation</h4>
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="escalation-id" className="text-sm">
                                  Escalation
                                </Label>
                                <div className="col-span-2 font-medium text-sm">
                                  {escalation.documentName}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="current-assignee" className="text-sm">
                                  Current Assignee
                                </Label>
                                <div className="col-span-2 text-sm">
                                  {escalation.assignedTo}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="new-assignee" className="text-sm">
                                  New Assignee
                                </Label>
                                <div className="col-span-2">
                                  <Select
                                    value={selectedTeamMember}
                                    onValueChange={setSelectedTeamMember}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teamMembers
                                        .filter(member => member.name !== escalation.assignedTo)
                                        .map(member => (
                                          <SelectItem key={member.id} value={member.id}>
                                            {member.name} ({member.role})
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="reason" className="text-sm">
                                  Reason
                                </Label>
                                <Input
                                  id="reason"
                                  placeholder="Reason for reassignment"
                                  className="col-span-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={closeReassignPopover}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleReassign} disabled={!selectedTeamMember} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                                Reassign
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Notify Popover */}
                      <Popover 
                        open={notifyPopoverOpen && selectedEscalation?.id === escalation.id} 
                        onOpenChange={(open) => {
                          if (open) {
                            openNotifyPopover(escalation);
                          } else {
                            closeNotifyPopover();
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Notify"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 mr-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Send Notification</h4>
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="recipient" className="text-sm">
                                  Recipient
                                </Label>
                                <div className="col-span-2 font-medium text-sm">
                                  {escalation.assignedTo}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="message" className="text-sm">
                                  Message
                                </Label>
                                <Textarea
                                  id="message"
                                  className="col-span-2"
                                  value={notificationMessage}
                                  onChange={(e) => setNotificationMessage(e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Label htmlFor="channel" className="text-sm">
                                  Channel
                                </Label>
                                <Select defaultValue="email" className="col-span-2">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select notification channel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                    <SelectItem value="app">In-App</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={closeNotifyPopover}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSendNotification} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                                Send Notification
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}