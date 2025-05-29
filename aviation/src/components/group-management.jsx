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
  Airline: ["Airline Security", "Airline Operations"],
};

// Mock users data for the user selection
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    domain: "Airport",
    department: "TSA",
    title: "Software Engineer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    domain: "Airline",
    department: "Airline Security",
    title: "HR Manager",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    domain: "Airport",
    department: "FAA",
    title: "Financial Analyst",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    domain: "Airport",
    department: "Airport Security",
    title: "Marketing Specialist",
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    domain: "Airline",
    department: "Airline Operations",
    title: "System Administrator",
  },
];

// Mock initial groups data with domain and department
const initialGroups = [
  {
    id: "1",
    name: "IT Department",
    description:
      "All IT staff including developers, system administrators, and support",
    domain: "Airport",
    department: "TSA",
    members: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        domain: "Airport",
        department: "TSA",
        title: "Software Engineer",
      },
      {
        id: "5",
        firstName: "Michael",
        lastName: "Brown",
        domain: "Airline",
        department: "Airline Operations",
        title: "System Administrator",
      },
    ],
  },
  {
    id: "2",
    name: "HR Team",
    description: "Human Resources team responsible for employee management",
    domain: "Airline",
    department: "Airline Security",
    members: [
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        domain: "Airline",
        department: "Airline Security",
        title: "HR Manager",
      },
    ],
  },
  {
    id: "3",
    name: "Finance Department",
    description: "Financial analysts and accountants",
    domain: "Airport",
    department: "FAA",
    members: [
      {
        id: "3",
        firstName: "Robert",
        lastName: "Johnson",
        domain: "Airport",
        department: "FAA",
        title: "Financial Analyst",
      },
    ],
  },
  {
    id: "4",
    name: "Marketing Team",
    description: "Marketing specialists and coordinators",
    domain: "Airport",
    department: "Airport Security",
    members: [
      {
        id: "4",
        firstName: "Emily",
        lastName: "Williams",
        domain: "Airport",
        department: "Airport Security",
        title: "Marketing Specialist",
      },
    ],
  },
  {
    id: "5",
    name: "Website Redesign Project",
    description: "Cross-functional team working on the website redesign",
    domain: "Airport",
    department: "Public Safety",
    members: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        domain: "Airport",
        department: "TSA",
        title: "Software Engineer",
      },
      {
        id: "4",
        firstName: "Emily",
        lastName: "Williams",
        domain: "Airport",
        department: "Airport Security",
        title: "Marketing Specialist",
      },
    ],
  },
];

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
function GroupForm({ group, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: group?.id || "",
    name: group?.name || "",
    description: group?.description || "",
    domain: group?.domain || "",
    department: group?.department || "",
    members: group?.members || [],
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
    if (!formData.members.some((member) => member.id === user.id)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, user],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new group, generate a new ID
        const groupToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(groupToSave);
      }

      // Reset form only if it's a new group creation (not editing)
      if (!group) {
        setFormData({
          id: "",
          name: "",
          description: "",
          domain: "",
          department: "",
          members: [],
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users for the search
  const filteredUsers = mockUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = userSearch.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      user.domain.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower) ||
      user.title.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group ? "Edit Group" : "Create Group"}</CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
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
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter group name"
                required
                value={formData.name}
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
                          key={user.id}
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
                            {user.title}
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
            {formData.members.length > 0 && (
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
                    {formData.members.map((member) => (
                      <TableRow key={member.id}>
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
                        <TableCell>{member.title}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(member.id)}
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
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState(""); // New state for name-specific search
  const [membersSearchTerm, setMembersSearchTerm] = useState(""); // New state for members-specific search
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState(""); // New state for description-specific search
  const [editingGroup, setEditingGroup] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [openMembersPopover, setOpenMembersPopover] = useState(null); // Added for members popover
  const [showNameSearch, setShowNameSearch] = useState(false); // Toggle for name search input
  const [showMembersSearch, setShowMembersSearch] = useState(false); // Toggle for members search input
  const [showDescriptionSearch, setShowDescriptionSearch] = useState(false); // Toggle for description search input

  // Refs for the search popups to detect clicks outside
  const namePopupRef = useRef(null);
  const membersPopupRef = useRef(null);
  const descriptionPopupRef = useRef(null);

  // Effect to handle clicks outside the search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check name search popup
      if (namePopupRef.current && !namePopupRef.current.contains(event.target)) {
        setShowNameSearch(false);
        setNameSearchTerm("");
      }
      // Check members search popup
      if (membersPopupRef.current && !membersPopupRef.current.contains(event.target)) {
        setShowMembersSearch(false);
        setMembersSearchTerm("");
      }
      // Check description search popup
      if (descriptionPopupRef.current && !descriptionPopupRef.current.contains(event.target)) {
        setShowDescriptionSearch(false);
        setDescriptionSearchTerm("");
      }
    };

    // Add event listener when any popup is open
    if (showNameSearch || showMembersSearch || showDescriptionSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameSearch, showMembersSearch, showDescriptionSearch]);

  const columns = [
    {
      key: "name",
      label: "Group Name",
      sortValue: (group) => group.name.toLowerCase(),
    },
    {
      key: "members",
      label: "Members",
      sortValue: (group) => group.members.length,
    },
    {
      key: "description",
      label: "Description",
      sortValue: (group) => group.description.toLowerCase(),
    },
  ];

  const sortedAndFilteredGroups = () => {
    let filtered = groups.filter((group) => {
      const searchLower = searchTerm.toLowerCase();

      // Check if any member's name contains the search term
      const memberMatch = group.members.some(
        (member) =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          member.domain.toLowerCase().includes(searchLower) ||
          member.department.toLowerCase().includes(searchLower)
      );

      // Apply global search filter
      const globalMatch = (
        group.name.toLowerCase().includes(searchLower) ||
        group.description.toLowerCase().includes(searchLower) ||
        group.domain.toLowerCase().includes(searchLower) ||
        group.department.toLowerCase().includes(searchLower) ||
        memberMatch
      );

      // Apply specific search filters if active
      // Updated name search to include group's domain and department tags
      const nameMatch = nameSearchTerm ?
        group.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        group.domain.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        group.department.toLowerCase().includes(nameSearchTerm.toLowerCase())
        : true;

      const membersMatch = membersSearchTerm ?
        group.members.some((member) =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.domain.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.title.toLowerCase().includes(membersSearchTerm.toLowerCase())
        ) : true;

      const descriptionMatch = descriptionSearchTerm ?
        group.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true;

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
    requestSort("name");
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
    requestSort("members");
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

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter((group) => group.id !== groupId));
    setOpenPopover(null);
  };

  const handleEditGroup = (groupId) => {
    setEditingGroup(groupId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveGroup = (groupData) => {
    if (groupData.id && groups.find((group) => group.id === groupData.id)) {
      // Editing existing group
      setGroups(
        groups.map((group) => (group.id === groupData.id ? groupData : group))
      );
    } else {
      // Adding new group
      setGroups([...groups, groupData]);
    }
    setEditingGroup(null);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  return (
    <div className="space-y-4">
      {showAddForm && (
        <GroupForm onSave={handleSaveGroup} onCancel={handleCancelEdit} />
      )}

      <div className="flex items-center">
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
                  {getSortIcon("name")}
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
                  {getSortIcon("members")}
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
                editingGroup === group.id ? (
                  <TableRow key={group.id}>
                    <TableCell colSpan={4}>
                      <GroupForm
                        group={group}
                        onSave={handleSaveGroup}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{group.name}</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="domain">{group.domain}</Badge>
                          <Badge variant="department">{group.department}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover
                        open={openMembersPopover === group.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenMembersPopover(group.id);
                          } else {
                            setOpenMembersPopover(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-2 hover:bg-white hover:text-black">
                            <div className="flex items-center cursor-pointer">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{group.members.length}</span>
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
                              Group Members ({group.members.length})
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {group.members.map((member, index) => (
                                <li key={member.id} className={`text-sm ${index !== 0 ? 'pt-2' : ''} ${index !== group.members.length - 1 ? 'pb-2' : ''}`}>
                                  <div className="font-medium text-black">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {member.title}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="domain">
                                      {member.domain}
                                    </Badge>
                                    <Badge variant="department">
                                      {member.department}
                                    </Badge>
                                  </div>
                                </li>  // This was the missing closing tag
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
                          onClick={() => handleEditGroup(group.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === group.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(group.id);
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
                                  onClick={() => handleDeleteGroup(group.id)}
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
    </div >
  );
}

// Export individual components for backward compatibility
export { GroupForm };