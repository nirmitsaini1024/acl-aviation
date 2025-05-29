import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Edit, 
  Trash2, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Eye,
  CheckSquare,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "IT",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "HR",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    department: "Finance",
  },
  {
    id: "4",
    name: "Emily Williams",
    email: "emily.williams@example.com",
    department: "Marketing",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    department: "IT",
  },
];

// Mock roles data with variant and icon information
const mockRoles = [
  { id: "1", name: "Administrator", variant: "destructive", icon: "ShieldAlert" },
  { id: "2", name: "Manager", variant: "default", icon: "ShieldCheck" },
  { id: "3", name: "Editor", variant: "secondary", icon: "Edit" },
  { id: "4", name: "Viewer", variant: "outline", icon: "Eye" },
  { id: "5", name: "Approver", variant: "success", icon: "CheckSquare" },
];

// Initial role assignments data
const initialRoleAssignments = [
  {
    id: "1",
    userId: "1",
    roleId: "1",
    userName: "John Doe",
    roleName: "Administrator",
    assignedDate: "2025-04-10",
  },
  {
    id: "2",
    userId: "2",
    roleId: "2",
    userName: "Jane Smith",
    roleName: "Manager",
    assignedDate: "2025-04-11",
  },
  {
    id: "3",
    userId: "3",
    roleId: "4",
    userName: "Robert Johnson",
    roleName: "Viewer",
    assignedDate: "2025-04-12",
  },
  {
    id: "4",
    userId: "5",
    roleId: "3",
    userName: "Michael Brown",
    roleName: "Editor",
    assignedDate: "2025-04-15",
  },
];

// Role assignment form component
function RoleAssignmentForm({ assignment, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: assignment?.id || "",
    userId: assignment?.userId || "",
    roleId: assignment?.roleId || "",
  });

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Find the user and role names based on selected IDs
      const user = mockUsers.find((u) => u.id === formData.userId);
      const role = mockRoles.find((r) => r.id === formData.roleId);

      if (onSave) {
        onSave({
          ...formData,
          userName: user?.name || "",
          roleName: role?.name || "",
          assignedDate: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show selected role badge preview
  const selectedRole = formData.roleId ? mockRoles.find(r => r.id === formData.roleId) : null;
  const RoleIcon = selectedRole?.icon === "ShieldAlert" ? ShieldAlert :
                  selectedRole?.icon === "ShieldCheck" ? ShieldCheck :
                  selectedRole?.icon === "Edit" ? Edit :
                  selectedRole?.icon === "Eye" ? Eye :
                  selectedRole?.icon === "CheckSquare" ? CheckSquare :
                  null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{assignment ? "Edit Role Assignment" : "Assign Role to User"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium">User Account</Label>
              <Select 
                value={formData.userId} 
                onValueChange={(value) => handleSelectChange("userId", value)}
                disabled={assignment}
              >
                <SelectTrigger className="border-gray-200 bg-gray-50 w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="py-2.5">
                      <div className="flex gap-4 items-center">
                        <span>{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role to Assign</Label>
              <Select 
                value={formData.roleId} 
                onValueChange={(value) => handleSelectChange("roleId", value)}
              >
                <SelectTrigger className="border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => {
                    const RoleIcon = role.icon === "ShieldAlert" ? ShieldAlert :
                                    role.icon === "ShieldCheck" ? ShieldCheck :
                                    role.icon === "Edit" ? Edit :
                                    role.icon === "Eye" ? Eye :
                                    role.icon === "CheckSquare" ? CheckSquare :
                                    ShieldQuestion;
                    
                    return (
                      <SelectItem key={role.id} value={role.id} className="py-2.5">
                        <div className="flex items-center">
                          <RoleIcon className="h-4 w-4 mr-2 text-gray-600" />
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedRole && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium mb-2">Role Preview</p>
              <div className="flex items-center gap-2">
                {RoleIcon && (
                  <Badge 
                    className={`flex items-center gap-1 px-2 py-1 ${
                      selectedRole.variant === "destructive" ? "bg-red-100 text-red-800" :
                      selectedRole.variant === "secondary" ? "bg-gray-100 text-gray-800" :
                      selectedRole.variant === "outline" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                      selectedRole.variant === "success" ? "bg-green-100 text-green-800" :
                      "bg-[#335aff]/10 text-[#335aff]"
                    }`}
                  >
                    <RoleIcon className="h-3 w-3" />
                    <span>{selectedRole.name}</span>
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {formData.userId ? `will be assigned to ${mockUsers.find(u => u.id === formData.userId)?.name || ''}` : ''}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-200"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-[#335aff] hover:bg-[#335aff]/90" 
            disabled={isLoading || !formData.userId || !formData.roleId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {assignment ? "Updating..." : "Assign Role"}
              </>
            ) : assignment ? (
              "Update Assignment"
            ) : (
              "Assign Role"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Main role assignment page component
export default function RoleAssignmentPage() {
  const [roleAssignments, setRoleAssignments] = useState(initialRoleAssignments);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "userName", direction: "ascending" });
  const [openPopover, setOpenPopover] = useState(null);

  // Table columns configuration
  const columns = [
    {
      key: "userName",
      label: "User",
      sortValue: (assignment) => assignment.userName.toLowerCase(),
    },
    {
      key: "roleName",
      label: "Role",
      sortValue: (assignment) => assignment.roleName.toLowerCase(),
    },
    {
      key: "assignedDate",
      label: "Date Assigned",
      sortValue: (assignment) => assignment.assignedDate,
    },
  ];

  // Filter and sort assignments based on search term and sort config
  const sortedAndFilteredAssignments = () => {
    const filtered = roleAssignments.filter((assignment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        assignment.userName.toLowerCase().includes(searchLower) ||
        assignment.roleName.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a);
          const bValue = column.sortValue(b);
          if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  };

  // Handle sorting when column headers are clicked
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon for column header
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Handle delete assignment
  const handleDeleteAssignment = (assignmentId) => {
    setRoleAssignments(roleAssignments.filter((assignment) => assignment.id !== assignmentId));
    setOpenPopover(null);
  };

  // Handle edit assignment
  const handleEditAssignment = (assignmentId) => {
    const assignment = roleAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      const currentRole = mockRoles.find(r => r.name === assignment.roleName);
      setSelectedRole(currentRole?.id);
      setEditingAssignment(assignmentId);
    }
  };

  // Handle save assignment (new or updated)
  const handleSaveAssignment = (updatedAssignment) => {
    if (updatedAssignment.id) {
      // Update existing
      setRoleAssignments(
        roleAssignments.map((assignment) =>
          assignment.id === updatedAssignment.id ? updatedAssignment : assignment
        )
      );
      setEditingAssignment(null);
    } else {
      // Add new
      const newAssignment = {
        ...updatedAssignment,
        id: String(roleAssignments.length + 1),
      };
      setRoleAssignments([...roleAssignments, newAssignment]);
      setIsFormOpen(false);
    }
  };
  
  // Handle quick role change
  const handleQuickRoleChange = (assignmentId, roleId) => {
    const assignment = roleAssignments.find(a => a.id === assignmentId);
    const role = mockRoles.find(r => r.id === roleId);
    
    if (assignment && role) {
      const updatedAssignment = {
        ...assignment,
        roleId,
        roleName: role.name,
        assignedDate: new Date().toISOString().split("T")[0]
      };
      
      setRoleAssignments(
        roleAssignments.map((a) =>
          a.id === assignmentId ? updatedAssignment : a
        )
      );
      setEditingAssignment(null);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setSelectedRole(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin-dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            Access Control
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#335aff]">Role Assignments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Assign and manage user roles and permissions
          </p>
        </div>
        <Button
          className="bg-[#335aff] hover:bg-[#335aff]/90 flex items-center gap-1.5 px-4"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingAssignment(null);
          }}
        >
          <Plus className="h-4 w-4" />
          Assign New Role
        </Button>
      </div>

      {/* Form for new role assignment */}
      {isFormOpen && !editingAssignment && (
        <Card className="mb-8 shadow-sm border-gray-200">
          <RoleAssignmentForm onSave={handleSaveAssignment} onCancel={() => setIsFormOpen(false)} />
        </Card>
      )}

      {/* Role assignments table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search assignments..."
              className="pl-8 bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className=" hover:bg-blue-600">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="cursor-pointer font-medium"
                    onClick={() => requestSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredAssignments().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No role assignments found
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredAssignments().map((assignment) =>
                  (
                    <TableRow key={assignment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{assignment.userName}</TableCell>
                      <TableCell>
                        {(() => {
                          const role = mockRoles.find(r => r.name === assignment.roleName);
                          const RoleIcon = role?.icon === "ShieldAlert" ? ShieldAlert :
                                          role?.icon === "ShieldCheck" ? ShieldCheck :
                                          role?.icon === "Edit" ? Edit :
                                          role?.icon === "Eye" ? Eye :
                                          role?.icon === "CheckSquare" ? CheckSquare :
                                          ShieldQuestion;
                          
                          const variantClass = 
                            role?.variant === "destructive" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                            role?.variant === "secondary" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" :
                            role?.variant === "outline" ? "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-50" :
                            role?.variant === "success" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            "bg-[#335aff]/10 text-[#335aff] hover:bg-[#335aff]/10";
                          
                          return (
                            <Badge className={`flex items-center gap-1 px-2 py-1 ${variantClass}`}>
                              <RoleIcon className="h-3 w-3" />
                              <span>{assignment.roleName}</span>
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-gray-600">{assignment.assignedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Popover 
                            open={editingAssignment === assignment.id} 
                            onOpenChange={(open) => {
                              if (open) {
                                handleEditAssignment(assignment.id);
                              } else {
                                handleCancelEdit();
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4 text-gray-600" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4 shadow-lg border-gray-200" side="top">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Change Role for {assignment.userName}</h4>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-role-${assignment.id}`} className="text-sm">Select New Role</Label>
                                    <Select 
                                      defaultValue={mockRoles.find(r => r.name === assignment.roleName)?.id}
                                      onValueChange={(roleId) => setSelectedRole(roleId)}
                                    >
                                      <SelectTrigger className="border-gray-200 bg-gray-50">
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mockRoles.map((role) => {
                                          const RoleIcon = role.icon === "ShieldAlert" ? ShieldAlert :
                                                          role.icon === "ShieldCheck" ? ShieldCheck :
                                                          role.icon === "Edit" ? Edit :
                                                          role.icon === "Eye" ? Eye :
                                                          role.icon === "CheckSquare" ? CheckSquare :
                                                          ShieldQuestion;
                                          
                                          return (
                                            <SelectItem key={role.id} value={role.id} className="py-2.5">
                                              <div className="flex items-center">
                                                <RoleIcon className="h-4 w-4 mr-2 text-gray-600" />
                                                <span>{role.name}</span>
                                              </div>
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {selectedRole && selectedRole !== mockRoles.find(r => r.name === assignment.roleName)?.id && (
                                  <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                                    <p className="text-xs text-gray-500">Role will be changed to: 
                                      <span className="font-medium text-gray-700 ml-1">
                                        {mockRoles.find(r => r.id === selectedRole)?.name}
                                      </span>
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleCancelEdit}
                                    className="border-gray-200"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-[#335aff] hover:bg-[#335aff]/90"
                                    disabled={!selectedRole || selectedRole === mockRoles.find(r => r.name === assignment.roleName)?.id}
                                    onClick={() => handleQuickRoleChange(assignment.id, selectedRole)}
                                  >
                                    Confirm Change
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          
                          <Popover 
                            open={openPopover === assignment.id} 
                            onOpenChange={(open) => {
                              if (open) {
                                setOpenPopover(assignment.id);
                              } else {
                                setOpenPopover(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-red-50">
                                <Trash2 className="h-4 w-4 text-red-600" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4 shadow-lg border-gray-200" side="left">
                              <div className="space-y-3">
                                <div className="">
                                  <h4 className="font-medium text-gray-900">Remove Role Assignment</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Are you sure you want to remove the {assignment.roleName} role from {assignment.userName}?
                                  </p>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setOpenPopover(null)}
                                    className="border-gray-200"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}