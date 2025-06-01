import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  Loader2,
  UserPlus,
  X,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAuthHeaders, getTenantId } from "@/utils/auth";

// Table components with grid borders added
const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm border border-gray-400 ${className}`}>
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b [&_tr]:border-gray-400">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="[&_tr]:border-b [&_tr]:border-gray-400 [&_tr:last-child]:border-b [&_tr:last-child]:border-gray-400">{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b border-gray-400 transition-colors data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = "", onClick }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "", colSpan }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </td>
);

// Domain and department options
const domains = ["Airport", "Airline"];

const departmentOptions = {
  Airport: [
    "TSA",
    "FAA",
    "Airport Security",
    "Airport Operations",
    "Public Safety",
  ],
  Airline: ["Airline Security", "Airline Operations", "TSC"],
};

// API functions
const API_BASE_URL = "http://localhost:3000";

const fetchGroups = async () => {
  try {
    console.log('Fetching groups from API...');
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched groups:', data);
    return data.GroupData || data || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    console.log('Fetching users from API...');
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched users:', data);
    return data.UserData || data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createGroup = async (groupData) => {
  const tenant_id = getTenantId();
  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...groupData, tenant_id }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const updateGroup = async (groupId, groupData) => {
  const tenant_id = getTenantId();
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...groupData, tenant_id }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const deleteGroup = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return true;
};

// Badge Component
function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    domain: "bg-blue-100 text-blue-800",
    department: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// GroupForm Component
function GroupForm({ group, onSave, onCancel, availableUsers = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    _id: group?._id || "",
    groupName: group?.groupName || "",
    description: group?.description || "",
    domain: group?.domain || "",
    department: group?.department || "",
    users: group?.users || [],
  });
  const [userSearch, setUserSearch] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset dependent fields when domain changes
      if (name === "domain") {
        newData.department = "";
      }

      return newData;
    });
  };

  const handleAddUser = (user) => {
    if (!formData.users.includes(user._id)) {
      setFormData((prev) => ({
        ...prev,
        users: [...prev.users, user._id],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      users: prev.users.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data in the required format
      const apiData = {
        domain: formData.domain,
        department: formData.department,
        groupName: formData.groupName,
        description: formData.description,
        users: formData.users,
      };

      let savedGroup;
      if (group && group._id) {
        // Update existing group
        savedGroup = await updateGroup(group._id, apiData);
      } else {
        // Create new group
        savedGroup = await createGroup(apiData);
      }

      if (onSave) {
        onSave(savedGroup);
      }

      // Reset form only if it's a new group creation (not editing)
      if (!group) {
        setFormData({
          _id: "",
          groupName: "",
          description: "",
          domain: "",
          department: "",
          users: [],
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setError(error.message || "Failed to save group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users for the search
  const filteredUsers = availableUsers.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const searchLower = userSearch.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      (user.domain && user.domain.toLowerCase().includes(searchLower)) ||
      (user.department && user.department.toLowerCase().includes(searchLower)) ||
      (user.jobTitle && user.jobTitle.toLowerCase().includes(searchLower))
    );
  });

  // Get selected users details for display
  const selectedUsers = availableUsers.filter(user => formData.users.includes(user._id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group ? "Edit Group" : "Create Group"}</CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Domain and Department Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => handleSelectChange("domain", value)}
              >
                <SelectTrigger className="border border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleSelectChange("department", value)
                }
                disabled={!formData.domain}
              >
                <SelectTrigger className="border border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {formData.domain &&
                    departmentOptions[formData.domain]?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                name="groupName"
                placeholder="Enter group name"
                required
                value={formData.groupName}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter group description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Group Members Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Group Members</h3>
              <p className="text-sm text-muted-foreground">
                Add users to this group
              </p>
            </div>

            {/* User Search */}
            <div className="relative">
              <Input
                placeholder="Search users by name, domain, department, or title..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* User Selection List */}
            {userSearch && (
              <div className="border border-gray-400 rounded-md max-h-56 overflow-y-auto">
                <Table>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          className="cursor-pointer hover:bg-muted"
                        >
                          <TableCell onClick={() => handleAddUser(user)}>
                            <div className="space-y-2">
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="domain">{user.domain}</Badge>
                                <Badge variant="department">
                                  {user.department}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleAddUser(user)}>
                            {user.jobTitle}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddUser(user)}
                            >
                              <UserPlus className="h-4 w-4" />
                              <span className="sr-only">Add User</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Added Members */}
            {selectedUsers.length > 0 && (
              <div className="border border-gray-400 rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-600">
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Title</TableHead>
                      <TableHead className="w-16 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUsers.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="domain">{member.domain}</Badge>
                              <Badge variant="department">
                                {member.department}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.jobTitle}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(member._id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-[#335aff] hover:bg-[#335aff]/80"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {group ? "Updating..." : "Creating..."}
              </>
            ) : group ? (
              "Update Group"
            ) : (
              "Create Group"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

// Main Group Management App Component (for integration into existing pages)
export function GroupManagementApp({ showAddForm, onToggleForm }) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [membersSearchTerm, setMembersSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [openMembersPopover, setOpenMembersPopover] = useState(null);
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showMembersSearch, setShowMembersSearch] = useState(false);
  const [showDescriptionSearch, setShowDescriptionSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for the search popups to detect clicks outside
  const namePopupRef = useRef(null);
  const membersPopupRef = useRef(null);
  const descriptionPopupRef = useRef(null);

  // Load groups and users on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both groups and users
      const [groupsData, usersData] = await Promise.all([
        fetchGroups(),
        fetchUsers()
      ]);
      
      console.log('Groups loaded:', groupsData);
      console.log('Users loaded:', usersData);
      
      setGroups(Array.isArray(groupsData) ? groupsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError("Failed to load data. Please check if the server is running on localhost:3000");
      console.error("Error loading data:", err);
      setGroups([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle clicks outside the search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (namePopupRef.current && !namePopupRef.current.contains(event.target)) {
        setShowNameSearch(false);
        setNameSearchTerm("");
      }
      if (membersPopupRef.current && !membersPopupRef.current.contains(event.target)) {
        setShowMembersSearch(false);
        setMembersSearchTerm("");
      }
      if (descriptionPopupRef.current && !descriptionPopupRef.current.contains(event.target)) {
        setShowDescriptionSearch(false);
        setDescriptionSearchTerm("");
      }
    };

    if (showNameSearch || showMembersSearch || showDescriptionSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameSearch, showMembersSearch, showDescriptionSearch]);

  const columns = [
    {
      key: "groupName",
      label: "Group Name",
      sortValue: (group) => (group.groupName || '').toLowerCase(),
    },
    {
      key: "users",
      label: "Members",
      sortValue: (group) => (group.users || []).length,
    },
    {
      key: "description",
      label: "Description",
      sortValue: (group) => (group.description || '').toLowerCase(),
    },
  ];

  // Helper function to get user details from user IDs
  const getUsersFromIds = (userIds) => {
    if (!Array.isArray(userIds)) return [];
    return userIds.map(id => users.find(user => user._id === id)).filter(Boolean);
  };

  const sortedAndFilteredGroups = () => {
    if (!Array.isArray(groups)) {
      console.warn('Groups is not an array:', groups);
      return [];
    }

    let filtered = groups.filter((group) => {
      const searchLower = searchTerm.toLowerCase();
      const groupUsers = getUsersFromIds(group.users || []);

      // Check if any member's name contains the search term
      const memberMatch = groupUsers.some(
        (member) =>
          `${member.firstName || ''} ${member.lastName || ''}`
            .toLowerCase()
            .includes(searchLower) ||
          (member.domain && member.domain.toLowerCase().includes(searchLower)) ||
          (member.department && member.department.toLowerCase().includes(searchLower))
      );

      // Apply global search filter
      const globalMatch = (
        (group.groupName && group.groupName.toLowerCase().includes(searchLower)) ||
        (group.description && group.description.toLowerCase().includes(searchLower)) ||
        (group.domain && group.domain.toLowerCase().includes(searchLower)) ||
        (group.department && group.department.toLowerCase().includes(searchLower)) ||
        memberMatch
      );

      // Apply specific search filters if active
      const nameMatch = nameSearchTerm ?
        (group.groupName && group.groupName.toLowerCase().includes(nameSearchTerm.toLowerCase())) ||
        (group.domain && group.domain.toLowerCase().includes(nameSearchTerm.toLowerCase())) ||
        (group.department && group.department.toLowerCase().includes(nameSearchTerm.toLowerCase()))
        : true;

      const membersMatch = membersSearchTerm ?
        groupUsers.some((member) =>
          `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          (member.domain && member.domain.toLowerCase().includes(membersSearchTerm.toLowerCase())) ||
          (member.department && member.department.toLowerCase().includes(membersSearchTerm.toLowerCase())) ||
          (member.jobTitle && member.jobTitle.toLowerCase().includes(membersSearchTerm.toLowerCase()))
        ) : true;

      const descriptionMatch = descriptionSearchTerm ?
        (group.description && group.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase())) : true;

      return globalMatch && nameMatch && membersMatch && descriptionMatch;
    });

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a);
          const bValue = column.sortValue(b);
          if (aValue < bValue)
            return sortConfig.direction === "ascending" ? -1 : 1;
          if (aValue > bValue)
            return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Handle name sorting and search
  const handleNameSort = () => {
    requestSort("groupName");
  };

  const handleNameSearchToggle = () => {
    setShowNameSearch(!showNameSearch);
    if (showNameSearch) {
      setNameSearchTerm("");
    }
  };

  const clearNameSearch = () => {
    setNameSearchTerm("");
    setShowNameSearch(false);
  };

  // Handle members sorting and search
  const handleMembersSort = () => {
    requestSort("users");
  };

  const handleMembersSearchToggle = () => {
    setShowMembersSearch(!showMembersSearch);
    if (showMembersSearch) {
      setMembersSearchTerm("");
    }
  };

  const clearMembersSearch = () => {
    setMembersSearchTerm("");
    setShowMembersSearch(false);
  };

  // Handle description sorting and search
  const handleDescriptionSort = () => {
    requestSort("description");
  };

  const handleDescriptionSearchToggle = () => {
    setShowDescriptionSearch(!showDescriptionSearch);
    if (showDescriptionSearch) {
      setDescriptionSearchTerm("");
    }
  };

  const clearDescriptionSearch = () => {
    setDescriptionSearchTerm("");
    setShowDescriptionSearch(false);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      await loadData(); // Refresh data from server
      setOpenPopover(null);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const handleEditGroup = (groupId) => {
    setEditingGroup(groupId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveGroup = async (groupData) => {
    try {
      // Always reload from database after save to ensure consistency
      await loadData();
      setEditingGroup(null);
      if (onToggleForm) onToggleForm(); // Close the form after saving
    } catch (error) {
      console.error("Failed to save group:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading groups...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <div className="flex items-center justify-between">
          <span>{error}</span>
          <Button onClick={loadData} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showAddForm && (
        <GroupForm 
          onSave={handleSaveGroup} 
          onCancel={handleCancelEdit}
          availableUsers={users}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border border-gray-400">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-blue-600">
              {/* Group Name Column */}
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Group Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={handleNameSort}
                      title="Sort by group name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showNameSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleNameSearchToggle}
                        title="Search by group name and tags"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Name search popup */}
                      {showNameSearch && (
                        <div
                          ref={namePopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by name or tags..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={nameSearchTerm}
                                onChange={(e) => setNameSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearNameSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("groupName")}
                </div>
              </TableHead>

              {/* Members Column */}
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Members</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={handleMembersSort}
                      title="Sort by member count"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showMembersSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleMembersSearchToggle}
                        title="Search by members"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Members search popup */}
                      {showMembersSearch && (
                        <div
                          ref={membersPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by member names..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={membersSearchTerm}
                                onChange={(e) => setMembersSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearMembersSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("users")}
                </div>
              </TableHead>

              {/* Description Column */}
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Description</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={handleDescriptionSort}
                      title="Sort by description"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDescriptionSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDescriptionSearchToggle}
                        title="Search by description"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Description search popup */}
                      {showDescriptionSearch && (
                        <div
                          ref={descriptionPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by description..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={descriptionSearchTerm}
                                onChange={(e) => setDescriptionSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearDescriptionSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("description")}
                </div>
              </TableHead>

              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredGroups().length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No groups found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredGroups().map((group) =>
                editingGroup === group._id ? (
                  <TableRow key={group._id}>
                    <TableCell colSpan={4}>
                      <GroupForm
                        group={group}
                        onSave={handleSaveGroup}
                        onCancel={handleCancelEdit}
                        availableUsers={users}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={group._id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{group.groupName}</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="domain">{group.domain}</Badge>
                          <Badge variant="department">{group.department}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover
                        open={openMembersPopover === group._id}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenMembersPopover(group._id);
                          } else {
                            setOpenMembersPopover(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-2 hover:bg-white hover:text-black">
                            <div className="flex items-center cursor-pointer">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{(group.users || []).length}</span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80 p-4 bg-white border border-gray-300 shadow-lg"
                          side="right"
                          align="start"
                        >
                          <div className="space-y-3">
                            <div className="font-medium text-black border-b border-gray-200 pb-2">
                              Group Members ({(group.users || []).length})
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {getUsersFromIds(group.users || []).map((member, index) => (
                                <div key={member._id} className={`text-sm ${index !== 0 ? 'pt-2' : ''} ${index !== getUsersFromIds(group.users || []).length - 1 ? 'pb-2' : ''}`}>
                                  <div className="font-medium text-black">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {member.jobTitle}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="domain">
                                      {member.domain}
                                    </Badge>
                                    <Badge variant="department">
                                      {member.department}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {group.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditGroup(group._id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === group._id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(group._id);
                            } else {
                              setOpenPopover(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-60 p-4 mr-4"
                            side="bottom"
                          >
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this group.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOpenPopover(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteGroup(group._id)}
                                >
                                  Delete
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
      </div>
    </div>
  );
}

// Export individual components for backward compatibility
export { GroupForm };