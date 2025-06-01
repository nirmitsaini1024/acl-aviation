import { useState, useEffect } from "react";
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

// API functions
const API_BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : '',
  };
};

const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.UserData || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const fetchGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Groups API response:', data);
    // Return the groupData array from the response
    return data.groupData || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

const fetchRoles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.roleData || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

const assignRole = async (roleId, assignData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/assign/${roleId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error assigning role:", error);
    throw error;
  }
};

const getRoleAssignments = async (roleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/assignments`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.role || null;
  } catch (error) {
    console.error("Error fetching role assignments:", error);
    throw error;
  }
};

// Role assignment form component
function RoleAssignmentForm({ assignment, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    id: assignment?.id || "",
    userId: assignment?.userId || "",
    groupId: assignment?.groupId || "",
    roleId: assignment?.roleId || "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, groupsData, rolesData] = await Promise.all([
          fetchUsers(),
          fetchGroups(),
          fetchRoles()
        ]);
        
        console.log('Form data loaded:', {
          users: usersData,
          groups: groupsData,
          roles: rolesData
        });
        
        setUsers(usersData || []);
        setGroups(groupsData || []);
        setRoles(rolesData || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };
    loadData();
  }, []);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedRole = roles.find(r => r._id === formData.roleId);
      const selectedUser = users.find(u => u._id === formData.userId);
      const selectedGroup = groups.find(g => g._id === formData.groupId);

      if (!selectedRole) {
        throw new Error('Please select a role');
      }

      if (!selectedUser && !selectedGroup) {
        throw new Error('Please select either a user or a group');
      }

      const assignData = {
        userId: formData.userId || null,
        groupId: formData.groupId || null,
      };

      const result = await assignRole(formData.roleId, assignData);

      if (onSave) {
        onSave({
          ...formData,
          userName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : '',
          groupName: selectedGroup ? selectedGroup.groupName : '',
          roleName: selectedRole.roleName,
          assignedDate: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show selected role badge preview
  const selectedRole = formData.roleId ? roles.find(r => r._id === formData.roleId) : null;
  const selectedUser = formData.userId ? users.find(u => u._id === formData.userId) : null;
  const selectedGroup = formData.groupId ? groups.find(g => g._id === formData.groupId) : null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{assignment ? "Edit Role Assignment" : "Assign Role to User/Group"}</CardTitle>
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
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id} className="py-2.5">
                        <div className="flex gap-4 items-center">
                          <span>{user.firstName} {user.lastName}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      No users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group" className="text-sm font-medium">Group</Label>
              <Select 
                value={formData.groupId} 
                onValueChange={(value) => handleSelectChange("groupId", value)}
                disabled={assignment}
              >
                <SelectTrigger className="border-gray-200 bg-gray-50 w-full">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups && groups.length > 0 ? (
                    groups.map((group) => (
                      <SelectItem key={group._id} value={group._id} className="py-2.5">
                        <div className="flex gap-4 items-center">
                          <span>{group.groupName}</span>
                          <span className="text-xs text-gray-500">{group.department}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-groups" disabled>
                      No groups available
                    </SelectItem>
                  )}
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
                  {roles.map((role) => (
                    <SelectItem key={role._id} value={role._id} className="py-2.5">
                      <div className="flex items-center">
                        <span>{role.roleName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(selectedRole || selectedUser || selectedGroup) && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium mb-2">Assignment Preview</p>
              <div className="space-y-2">
                {selectedRole && (
                  <div className="flex items-center gap-2">
                    <Badge className="flex items-center gap-1 px-2 py-1 bg-[#335aff]/10 text-[#335aff]">
                      <span>{selectedRole.roleName}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">will be assigned to:</span>
                  </div>
                )}
                {selectedUser && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">User:</span>
                    <span className="text-sm text-gray-600">
                      {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
                    </span>
                  </div>
                )}
                {selectedGroup && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Group:</span>
                    <span className="text-sm text-gray-600">
                      {selectedGroup.groupName} ({selectedGroup.department})
                    </span>
                  </div>
                )}
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
            disabled={isLoading || !formData.roleId || (!formData.userId && !formData.groupId)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {assignment ? "Updating..." : "Assigning..."}
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
  const [roleAssignments, setRoleAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "userName", direction: "ascending" });
  const [openPopover, setOpenPopover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  // Load role assignments on component mount
  useEffect(() => {
    loadRoleAssignments();
  }, []);

  const loadRoleAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const rolesData = await fetchRoles();
      setRoles(rolesData);
      const assignments = [];
      
      // Fetch assignments for each role
      for (const role of rolesData) {
        const roleWithAssignments = await getRoleAssignments(role._id);
        if (roleWithAssignments) {
          // Add user assignments
          if (roleWithAssignments.userIds && roleWithAssignments.userIds.length > 0) {
            for (const userId of roleWithAssignments.userIds) {
              try {
                const user = await fetch(`${API_BASE_URL}/users/${userId}`, {
                  headers: getAuthHeaders(),
                }).then(res => res.json());
                
                if (user) {
                  assignments.push({
                    id: `${role._id}-user-${userId}`,
                    userId,
                    roleId: role._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    roleName: role.roleName,
                    assignedDate: new Date().toISOString().split("T")[0],
                  });
                }
              } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
              }
            }
          }
          
          // Add group assignments
          if (roleWithAssignments.groupIds && roleWithAssignments.groupIds.length > 0) {
            for (const groupId of roleWithAssignments.groupIds) {
              try {
                const group = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
                  headers: getAuthHeaders(),
                }).then(res => res.json());
                
                if (group) {
                  assignments.push({
                    id: `${role._id}-group-${groupId}`,
                    groupId,
                    roleId: role._id,
                    groupName: group.groupName,
                    roleName: role.roleName,
                    assignedDate: new Date().toISOString().split("T")[0],
                  });
                }
              } catch (error) {
                console.error(`Error fetching group ${groupId}:`, error);
              }
            }
          }
        }
      }
      
      console.log('Loaded assignments:', assignments);
      setRoleAssignments(assignments);
    } catch (err) {
      console.error('Load role assignments error:', err);
      setError(`Failed to load role assignments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: "userName",
      label: "User/Group",
      sortValue: (assignment) => assignment.userName || assignment.groupName || "",
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
        (assignment.userName?.toLowerCase().includes(searchLower) ||
        assignment.groupName?.toLowerCase().includes(searchLower) ||
        assignment.roleName?.toLowerCase().includes(searchLower))
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
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const [roleId, entityId] = assignmentId.split('-');
      const assignData = {
        userId: assignmentId.includes('user') ? entityId : null,
        groupId: assignmentId.includes('group') ? entityId : null,
      };
      
      await assignRole(roleId, assignData);
      setRoleAssignments(roleAssignments.filter((assignment) => assignment.id !== assignmentId));
      setOpenPopover(null);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment');
    }
  };

  // Handle edit assignment
  const handleEditAssignment = (assignmentId) => {
    const assignment = roleAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      setSelectedRole(assignment.roleId);
      setEditingAssignment(assignmentId);
    }
  };

  // Handle save assignment (new or updated)
  const handleSaveAssignment = async (updatedAssignment) => {
    try {
      if (updatedAssignment.id) {
        // Update existing
        const [roleId, entityId] = updatedAssignment.id.split('-');
        const assignData = {
          userId: updatedAssignment.userId,
          groupId: updatedAssignment.groupId,
        };
        
        await assignRole(roleId, assignData);
        setRoleAssignments(
          roleAssignments.map((assignment) =>
            assignment.id === updatedAssignment.id ? updatedAssignment : assignment
          )
        );
        setEditingAssignment(null);
      } else {
        // Add new
        const assignData = {
          userId: updatedAssignment.userId,
          groupId: updatedAssignment.groupId,
        };
        
        await assignRole(updatedAssignment.roleId, assignData);
        const newAssignment = {
          ...updatedAssignment,
          id: `${updatedAssignment.roleId}-${updatedAssignment.userId || updatedAssignment.groupId}`,
        };
        setRoleAssignments([...roleAssignments, newAssignment]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
      setError('Failed to save assignment');
    }
  };
  
  // Handle quick role change
  const handleQuickRoleChange = async (assignmentId, roleId) => {
    try {
      const [oldRoleId, entityId] = assignmentId.split('-');
      const assignData = {
        userId: assignmentId.includes('user') ? entityId : null,
        groupId: assignmentId.includes('group') ? entityId : null,
      };
      
      await assignRole(roleId, assignData);
      
      const assignment = roleAssignments.find(a => a.id === assignmentId);
      const role = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
        headers: getAuthHeaders(),
      }).then(res => res.json());
      
      if (assignment && role) {
        const updatedAssignment = {
          ...assignment,
          roleId,
          roleName: role.roleName,
          assignedDate: new Date().toISOString().split("T")[0]
        };
        
        setRoleAssignments(
          roleAssignments.map((a) =>
            a.id === assignmentId ? updatedAssignment : a
          )
        );
        setEditingAssignment(null);
      }
    } catch (error) {
      console.error('Error changing role:', error);
      setError('Failed to change role');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setSelectedRole(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading role assignments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadRoleAssignments}>
          Try Again
        </Button>
      </div>
    );
  }

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
              <TableRow className="hover:bg-blue-600">
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
                sortedAndFilteredAssignments().map((assignment) => (
                  <TableRow key={assignment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {assignment.userName ? (
                        <div className="flex flex-col">
                          <span>{assignment.userName}</span>
                          <span className="text-xs text-gray-500">User</span>
                        </div>
                      ) : assignment.groupName ? (
                        <div className="flex flex-col">
                          <span>{assignment.groupName}</span>
                          <span className="text-xs text-gray-500">Group</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="flex items-center gap-1 px-2 py-1 bg-[#335aff]/10 text-[#335aff]">
                        <span>{assignment.roleName}</span>
                      </Badge>
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
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Change Role for {assignment.userName || assignment.groupName}
                                </h4>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-role-${assignment.id}`} className="text-sm">
                                    Select New Role
                                  </Label>
                                  <Select 
                                    defaultValue={assignment.roleId}
                                    onValueChange={(roleId) => setSelectedRole(roleId)}
                                  >
                                    <SelectTrigger className="border-gray-200 bg-gray-50">
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roles.map((role) => (
                                        <SelectItem key={role._id} value={role._id} className="py-2.5">
                                          <div className="flex items-center">
                                            <span>{role.roleName}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {selectedRole && selectedRole !== assignment.roleId && (
                                <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
                                  <p className="text-xs text-gray-500">
                                    Role will be changed to: 
                                    <span className="font-medium text-gray-700 ml-1">
                                      {roles.find(r => r._id === selectedRole)?.roleName}
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
                                  disabled={!selectedRole || selectedRole === assignment.roleId}
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
                                  Are you sure you want to remove the {assignment.roleName} role from {assignment.userName || assignment.groupName}?
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
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}