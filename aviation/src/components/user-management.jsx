import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  Loader2,
  ArrowUpDown,
  X,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
// Table components (inline definitions) - Updated with borders (no column borders)
const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm border border-gray-400 ${className}`}>
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b [&_tr]:border-gray-400">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-gray-400">{children}</tbody>
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Reminder options
const reminderOptions = ["12 hours", "1 day", "3 days", "7 days"];

// API functions
const API_BASE_URL = "http://localhost:3000/api";

const fetchUsers = async () => {
  try {
    console.log('Fetching users from API...');
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched users:', data);
    
    // Extract the UserData array from the response
    // Your API returns: { message: "...", UserData: [...] }
    // We need just the UserData array
    return data.UserData || data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// UserForm Component
function UserForm({ user, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    _id: user?._id || "",
    firstName: user?.firstName || "",
    middlename: user?.middlename || "",
    lastName: user?.lastName || "",
    employeeId: user?.employeeId || "",
    domain: user?.domain || "",
    department: user?.department || "",
    reminder: user?.reminder || "",
    email: user?.email || "",
    jobTitle: user?.jobTitle || "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data in the required format
      const apiData = {
        domain: formData.domain,
        department: formData.department,
        firstName: formData.firstName,
        middlename: formData.middlename,
        lastName: formData.lastName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        reminder: formData.reminder,
      };

      let savedUser;
      if (user && user._id) {
        // Update existing user
        savedUser = await updateUser(user._id, apiData);
      } else {
        // Create new user
        savedUser = await createUser(apiData);
      }

      if (onSave) {
        onSave(savedUser);
      }

      // Reset form only if it's a new user creation (not editing)
      if (!user) {
        setFormData({
          _id: "",
          firstName: "",
          middlename: "",
          lastName: "",
          employeeId: "",
          domain: "",
          department: "",
          reminder: "",
          email: "",
          jobTitle: "",
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setError(error.message || "Failed to save user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Create User"}</CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middlename">Middle Name</Label>
              <Input
                id="middlename"
                name="middlename"
                placeholder="Enter middle name (optional)"
                value={formData.middlename}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Enter job title"
                required
                value={formData.jobTitle}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder *</Label>
              <Select
                value={formData.reminder}
                onValueChange={(value) => handleSelectChange("reminder", value)}
              >
                <SelectTrigger className="border border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Select reminder frequency" />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                {user ? "Updating..." : "Creating..."}
              </>
            ) : user ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

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

// Main User Management App Component (for integration into existing pages)
export function UserManagementApp({ showAddForm, onToggleForm }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [reminderSearchTerm, setReminderSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showEmailSearch, setShowEmailSearch] = useState(false);
  const [showTitleSearch, setShowTitleSearch] = useState(false);
  const [showReminderSearch, setShowReminderSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for the search popups to detect clicks outside
  const searchPopupRef = useRef(null);
  const emailPopupRef = useRef(null);
  const titlePopupRef = useRef(null);
  const reminderPopupRef = useRef(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading users...');
      const userData = await fetchUsers();
      console.log('Users loaded:', userData);
      // Ensure userData is always an array
      const usersArray = Array.isArray(userData) ? userData : [];
      setUsers(usersArray);
      console.log('Users set to state:', usersArray);
    } catch (err) {
      setError("Failed to load users. Please check if the server is running on localhost:3000");
      console.error("Error loading users:", err);
      // Set empty array on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle clicks outside the search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target)) {
        setShowNameSearch(false);
        setNameSearchTerm("");
      }
      if (emailPopupRef.current && !emailPopupRef.current.contains(event.target)) {
        setShowEmailSearch(false);
        setEmailSearchTerm("");
      }
      if (titlePopupRef.current && !titlePopupRef.current.contains(event.target)) {
        setShowTitleSearch(false);
        setTitleSearchTerm("");
      }
      if (reminderPopupRef.current && !reminderPopupRef.current.contains(event.target)) {
        setShowReminderSearch(false);
        setReminderSearchTerm("");
      }
    };

    if (showNameSearch || showEmailSearch || showTitleSearch || showReminderSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameSearch, showEmailSearch, showTitleSearch, showReminderSearch]);

  const columns = [
    {
      key: "name",
      label: "Name",
      sortValue: (user) => `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase(),
    },
    {
      key: "email",
      label: "Email",
      sortValue: (user) => (user.email || '').toLowerCase(),
    },
    {
      key: "jobTitle",
      label: "Job Title",
      sortValue: (user) => (user.jobTitle || '').toLowerCase(),
    },
    {
      key: "reminder",
      label: "Reminder",
      sortValue: (user) => (user.reminder || '').toLowerCase(),
    },
  ];

  const sortedAndFilteredUsers = () => {
    // Ensure users is always an array
    if (!Array.isArray(users)) {
      console.warn('Users is not an array:', users);
      return [];
    }

    let filtered = users.filter((user) => {
      const fullName =
        `${user.firstName || ''} ${user.middlename || ''} ${user.lastName || ''}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      const globalMatch = (
        fullName.includes(searchLower) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(searchLower)) ||
        (user.domain && user.domain.toLowerCase().includes(searchLower)) ||
        (user.department && user.department.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.jobTitle && user.jobTitle.toLowerCase().includes(searchLower)) ||
        (user.reminder && user.reminder.toLowerCase().includes(searchLower))
      );

      const nameMatch = nameSearchTerm ?
        fullName.includes(nameSearchTerm.toLowerCase()) ||
        (user.domain && user.domain.toLowerCase().includes(nameSearchTerm.toLowerCase())) ||
        (user.department && user.department.toLowerCase().includes(nameSearchTerm.toLowerCase()))
        : true;
      const emailMatch = emailSearchTerm ?
        (user.email && user.email.toLowerCase().includes(emailSearchTerm.toLowerCase())) : true;
      const titleMatch = titleSearchTerm ?
        (user.jobTitle && user.jobTitle.toLowerCase().includes(titleSearchTerm.toLowerCase())) : true;
      const reminderMatch = reminderSearchTerm ?
        (user.reminder && user.reminder.toLowerCase().includes(reminderSearchTerm.toLowerCase())) : true;

      return globalMatch && nameMatch && emailMatch && titleMatch && reminderMatch;
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

  const handleEmailSort = () => {
    requestSort("email");
  };

  const handleEmailSearchToggle = () => {
    setShowEmailSearch(!showEmailSearch);
    if (showEmailSearch) {
      setEmailSearchTerm("");
    }
  };

  const clearEmailSearch = () => {
    setEmailSearchTerm("");
    setShowEmailSearch(false);
  };

  const handleTitleSort = () => {
    requestSort("jobTitle");
  };

  const handleTitleSearchToggle = () => {
    setShowTitleSearch(!showTitleSearch);
    if (showTitleSearch) {
      setTitleSearchTerm("");
    }
  };

  const clearTitleSearch = () => {
    setTitleSearchTerm("");
    setShowTitleSearch(false);
  };

  const handleReminderSort = () => {
    requestSort("reminder");
  };

  const handleReminderSearchToggle = () => {
    setShowReminderSearch(!showReminderSearch);
    if (showReminderSearch) {
      setReminderSearchTerm("");
    }
  };

  const clearReminderSearch = () => {
    setReminderSearchTerm("");
    setShowReminderSearch(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      // Refresh the entire user list from database
      await loadUsers();
      setOpenPopover(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleEditUser = (userId) => {
    setEditingUser(userId);
    if (onToggleForm) onToggleForm(); // Close add form if open
  };

  const handleSaveUser = async (userData) => {
    try {
      // Always reload from database after save to ensure consistency
      await loadUsers();
      setEditingUser(null);
      if (onToggleForm) onToggleForm(); // Close the form after saving
    } catch (error) {
      console.error("Failed to save user:", error);
      // Error handling is done in the form component
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <div className="flex items-center justify-between">
          <span>{error}</span>
          <Button onClick={loadUsers} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showAddForm && (
        <UserForm onSave={handleSaveUser} onCancel={handleCancelEdit} />
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={loadUsers}
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
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600">
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={handleNameSort}
                      title="Sort by name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showNameSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleNameSearchToggle}
                        title="Search by name and tags"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {showNameSearch && (
                        <div
                          ref={searchPopupRef}
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
              {columns.slice(1).map((column) => (
                <TableHead
                  key={column.key}
                  className="text-white relative"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                        onClick={() => requestSort(column.key)}
                        title={`Sort by ${column.label.toLowerCase()}`}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${(column.key === 'email' && showEmailSearch) ||
                            (column.key === 'jobTitle' && showTitleSearch) ||
                            (column.key === 'reminder' && showReminderSearch)
                            ? 'bg-blue-700' : ''
                            }`}
                          onClick={() => {
                            if (column.key === 'email') handleEmailSearchToggle();
                            else if (column.key === 'jobTitle') handleTitleSearchToggle();
                            else if (column.key === 'reminder') handleReminderSearchToggle();
                          }}
                          title={`Search by ${column.label.toLowerCase()}`}
                        >
                          <Search className="h-3 w-3" />
                        </Button>

                        {column.key === 'email' && showEmailSearch && (
                          <div
                            ref={emailPopupRef}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                          >
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by email..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                  value={emailSearchTerm}
                                  onChange={(e) => setEmailSearchTerm(e.target.value)}
                                  autoFocus
                                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearEmailSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                            </div>
                          </div>
                        )}

                        {column.key === 'jobTitle' && showTitleSearch && (
                          <div
                            ref={titlePopupRef}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                          >
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by job title..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                  value={titleSearchTerm}
                                  onChange={(e) => setTitleSearchTerm(e.target.value)}
                                  autoFocus
                                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearTitleSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                            </div>
                          </div>
                        )}

                        {column.key === 'reminder' && showReminderSearch && (
                          <div
                            ref={reminderPopupRef}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                          >
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by reminder..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                  value={reminderSearchTerm}
                                  onChange={(e) => setReminderSearchTerm(e.target.value)}
                                  autoFocus
                                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearReminderSearch}
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
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredUsers().length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredUsers().map((user) =>
                editingUser === user._id ? (
                  <TableRow key={user._id}>
                    <TableCell colSpan={5}>
                      <UserForm
                        user={user}
                        onSave={handleSaveUser}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">
                          {user.firstName} {user.middlename && user.middlename + ' '}{user.lastName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="domain">{user.domain}</Badge>
                          <Badge variant="department">{user.department}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email || ''}</TableCell>
                    <TableCell>{user.jobTitle || ''}</TableCell>
                    <TableCell>{user.reminder || ''}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditUser(user._id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === user._id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(user._id);
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
                                  This will permanently delete this user.
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
                                  onClick={() => handleDeleteUser(user._id)}
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
export { UserForm };