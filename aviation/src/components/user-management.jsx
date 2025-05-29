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
  Airline: ["Airline Security", "Airline Operations"],
};

// Reminder options
const reminderOptions = ["12 hours", "1 day", "3 days", "7 days"];

const initialUsers = [
  {
    id: "1",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    employeeId: "EMP001",
    domain: "Airport",
    department: "TSA",
    reminder: "1 day",
    email: "john.doe@example.com",
    title: "Software Engineer",
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "Marie",
    lastName: "Smith",
    employeeId: "EMP002",
    domain: "Airline",
    department: "Airline Security",
    reminder: "3 days",
    email: "jane.smith@example.com",
    title: "HR Manager",
  },
  {
    id: "3",
    firstName: "Robert",
    middleName: "",
    lastName: "Johnson",
    employeeId: "EMP003",
    domain: "Airport",
    department: "FAA",
    reminder: "7 days",
    email: "robert.johnson@example.com",
    title: "Financial Analyst",
  },
  {
    id: "4",
    firstName: "Emily",
    middleName: "Rose",
    lastName: "Williams",
    employeeId: "EMP004",
    domain: "Airport",
    department: "Airport Security",
    reminder: "12 hours",
    email: "emily.williams@example.com",
    title: "Marketing Specialist",
  },
  {
    id: "5",
    firstName: "Michael",
    middleName: "",
    lastName: "Brown",
    employeeId: "EMP005",
    domain: "Airline",
    department: "Airline Operations",
    reminder: "1 day",
    email: "michael.brown@example.com",
    title: "System Administrator",
  },
];

// UserForm Component
function UserForm({ user, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    employeeId: user?.employeeId || "",
    domain: user?.domain || "",
    department: user?.department || "",
    reminder: user?.reminder || "",
    email: user?.email || "",
    title: user?.title || "",
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new user, generate a new ID
        const userToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(userToSave);
      }

      // Reset form only if it's a new user creation (not editing)
      if (!user) {
        setFormData({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          employeeId: "",
          domain: "",
          department: "",
          reminder: "",
          email: "",
          title: "",
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
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
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                placeholder="Enter middle name (optional)"
                value={formData.middleName}
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter job title"
                required
                value={formData.title}
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
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState(""); // New state for name-specific search
  const [emailSearchTerm, setEmailSearchTerm] = useState(""); // New state for email-specific search
  const [titleSearchTerm, setTitleSearchTerm] = useState(""); // New state for title-specific search
  const [reminderSearchTerm, setReminderSearchTerm] = useState(""); // New state for reminder-specific search
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [showNameSearch, setShowNameSearch] = useState(false); // Toggle for name search input
  const [showEmailSearch, setShowEmailSearch] = useState(false); // Toggle for email search input
  const [showTitleSearch, setShowTitleSearch] = useState(false); // Toggle for title search input
  const [showReminderSearch, setShowReminderSearch] = useState(false); // Toggle for reminder search input

  // Refs for the search popups to detect clicks outside
  const searchPopupRef = useRef(null);
  const emailPopupRef = useRef(null);
  const titlePopupRef = useRef(null);
  const reminderPopupRef = useRef(null);

  // Effect to handle clicks outside the search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check name search popup
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target)) {
        setShowNameSearch(false);
        setNameSearchTerm("");
      }
      // Check email search popup
      if (emailPopupRef.current && !emailPopupRef.current.contains(event.target)) {
        setShowEmailSearch(false);
        setEmailSearchTerm("");
      }
      // Check title search popup
      if (titlePopupRef.current && !titlePopupRef.current.contains(event.target)) {
        setShowTitleSearch(false);
        setTitleSearchTerm("");
      }
      // Check reminder search popup
      if (reminderPopupRef.current && !reminderPopupRef.current.contains(event.target)) {
        setShowReminderSearch(false);
        setReminderSearchTerm("");
      }
    };

    // Add event listener when any popup is open
    if (showNameSearch || showEmailSearch || showTitleSearch || showReminderSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameSearch, showEmailSearch, showTitleSearch, showReminderSearch]);

  const columns = [
    {
      key: "name",
      label: "Name",
      sortValue: (user) => `${user.firstName} ${user.lastName}`.toLowerCase(),
    },
    {
      key: "email",
      label: "Email",
      sortValue: (user) => user.email.toLowerCase(),
    },
    {
      key: "title",
      label: "Title",
      sortValue: (user) => user.title.toLowerCase(),
    },
    {
      key: "reminder",
      label: "Reminder",
      sortValue: (user) => user.reminder.toLowerCase(),
    },
  ];

  const sortedAndFilteredUsers = () => {
    let filtered = users.filter((user) => {
      const fullName =
        `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      // Apply global search filter
      const globalMatch = (
        fullName.includes(searchLower) ||
        user.employeeId.toLowerCase().includes(searchLower) ||
        user.domain.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.title.toLowerCase().includes(searchLower) ||
        user.reminder.toLowerCase().includes(searchLower)
      );

      // Apply specific search filters if active
      // Updated name search to include user's domain and department tags
      const nameMatch = nameSearchTerm ?
        fullName.includes(nameSearchTerm.toLowerCase()) ||
        user.domain.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(nameSearchTerm.toLowerCase())
        : true;
      const emailMatch = emailSearchTerm ?
        user.email.toLowerCase().includes(emailSearchTerm.toLowerCase()) : true;
      const titleMatch = titleSearchTerm ?
        user.title.toLowerCase().includes(titleSearchTerm.toLowerCase()) : true;
      const reminderMatch = reminderSearchTerm ?
        user.reminder.toLowerCase().includes(reminderSearchTerm.toLowerCase()) : true;

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

  // Handle name sorting specifically
  const handleNameSort = () => {
    requestSort("name");
  };

  // Handle name search toggle
  const handleNameSearchToggle = () => {
    setShowNameSearch(!showNameSearch);
    if (showNameSearch) {
      // If closing, clear the search term
      setNameSearchTerm("");
    }
  };

  // Clear name search
  const clearNameSearch = () => {
    setNameSearchTerm("");
    setShowNameSearch(false);
  };

  // Handle email sorting and search
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

  // Handle title sorting and search
  const handleTitleSort = () => {
    requestSort("title");
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

  // Handle reminder sorting and search
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

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setOpenPopover(null);
  };

  const handleEditUser = (userId) => {
    setEditingUser(userId);
    setShowAddForm(false);
  };

  const handleSaveUser = (userData) => {
    if (userData.id && users.find((user) => user.id === userData.id)) {
      // Editing existing user
      setUsers(
        users.map((user) => (user.id === userData.id ? userData : user))
      );
    } else {
      // Adding new user
      setUsers([...users, userData]);
    }
    setEditingUser(null);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  return (
    <div className="space-y-4">
      {showAddForm && (
        <UserForm onSave={handleSaveUser} onCancel={handleCancelEdit} />
      )}

      <div className="flex items-center">
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

                      {/* Name-specific search popup - positioned above the search icon */}
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
                            {/* Small arrow pointing down to the search icon */}
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
                            (column.key === 'title' && showTitleSearch) ||
                            (column.key === 'reminder' && showReminderSearch)
                            ? 'bg-blue-700' : ''
                            }`}
                          onClick={() => {
                            if (column.key === 'email') handleEmailSearchToggle();
                            else if (column.key === 'title') handleTitleSearchToggle();
                            else if (column.key === 'reminder') handleReminderSearchToggle();
                          }}
                          title={`Search by ${column.label.toLowerCase()}`}
                        >
                          <Search className="h-3 w-3" />
                        </Button>

                        {/* Email search popup */}
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

                        {/* Title search popup */}
                        {column.key === 'title' && showTitleSearch && (
                          <div
                            ref={titlePopupRef}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                          >
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by title..."
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

                        {/* Reminder search popup */}
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
                editingUser === user.id ? (
                  <TableRow key={user.id}>
                    <TableCell colSpan={5}>
                      <UserForm
                        user={user}
                        onSave={handleSaveUser}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">
                          {user.firstName} {user.middleName} {user.lastName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="domain">{user.domain}</Badge>
                          <Badge variant="department">{user.department}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>{user.reminder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === user.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(user.id);
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
                                  onClick={() => handleDeleteUser(user.id)}
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