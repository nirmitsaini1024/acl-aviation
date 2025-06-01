import { useState, useEffect } from "react";
import { Edit, Trash2, Search, Loader2, PlusCircle, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAuthHeaders, getTenantId } from "@/utils/auth";

// Table components (inline definitions)
const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm ${className}`}>
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b transition-colors data-[state=selected]:bg-muted ${className}`}
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

// Define Document Repository permissions only
const documentRepoPermissions = [
  {
    id: "inReview",
    title: "In Review",
    description: "Allow viewing of documents in review",
    category: "document-repository",
    hasActions: true,
    actions: [
      {
        id: "referenceDocumentAccess",
        title: "Reference Document Access",
        description: "Allow access to reference documents in review",
        allowedLevels: ["view_access", "no_access"],
        defaultLevel: "no_access",
      },
      {
        id: "notify",
        title: "Notify",
        description: "Allow notifications for documents in review",
        allowedLevels: ["admin_access", "no_access"],
        defaultLevel: "no_access",
      },
    ],
    allowedLevels: ["admin_access", "write_access", "view_access", "no_access"],
    defaultLevel: "no_access",
  },
  {
    id: "referenceDocument",
    title: "Reference Document",
    description: "Allow viewing of reference documents",
    category: "document-repository",
    allowedLevels: ["view_access", "no_access"],
    defaultLevel: "view_access",
  },
  {
    id: "approved",
    title: "Approved",
    description: "Allow viewing of approved documents",
    category: "document-repository",
    allowedLevels: ["view_access", "no_access"],
    defaultLevel: "view_access",
  },
  {
    id: "deactivated",
    title: "Deactivated",
    description: "Allow viewing of deactivated documents",
    category: "document-repository",
    allowedLevels: ["admin_access", "view_access", "no_access"],
    defaultLevel: "no_access",
  },
];

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

// Badge Component
function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    domain: "bg-blue-100 text-blue-800",
    department: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.default
        }`}
    >
      {children}
    </span>
  );
}

// API functions
const fetchRoles = async () => {
  try {
    console.log('Fetching roles from API...');
    const response = await fetch('http://localhost:3000/roles', {
      headers: getAuthHeaders()
    });
    if (response.status === 404) {
      // If no roles exist, return empty array instead of throwing error
      console.log('No roles found, returning empty array');
      return [];
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched roles:', data);
    return data.roleData || data || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    // Return empty array on error instead of throwing
    return [];
  }
};

const createRole = async (roleData) => {
  const tenant_id = getTenantId();
  const response = await fetch('http://localhost:3000/roles', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...roleData, tenant_id })
  });
  if (!response.ok) throw new Error('Failed to create role');
  return response.json();
};

const updateRole = async (id, roleData) => {
  const tenant_id = getTenantId();
  const response = await fetch(`http://localhost:3000/roles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...roleData, tenant_id })
  });
  if (!response.ok) throw new Error('Failed to update role');
  return response.json();
};

const deleteRole = async (id) => {
  const response = await fetch(`http://localhost:3000/roles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete role');
  return response.json();
};

// Access Control Viewer Component
function AccessControlViewer({ documentRepoAccess }) {
  // Get permission level display info
  const getPermissionDisplayInfo = (level, permissionId) => {
    switch (level) {
      case "admin_access":
        return {
          text: "Admin Access",
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "write_access":
        return {
          text: "Write Access",
          color: "text-blue-600",
          bg: "bg-blue-100",
        };
      case "view_access":
        return {
          text: "View Access",
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      case "no_access":
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-200" };
      default:
        return { text: level || "No Access", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold">
        Document Repository
      </div>

      {/* Content */}
      <div className="divide-y divide-blue-100 max-h-100 overflow-y-auto">
        {documentRepoPermissions.map((permission) => {
          const permissionValue = documentRepoAccess[permission.id];
          let displayValue = permissionValue;

          if (typeof permissionValue === 'object' && permissionValue?.permission) {
            displayValue = permissionValue.permission;
          }

          const displayInfo = getPermissionDisplayInfo(displayValue, permission.id);

          return (
            <div key={permission.id}>
              {/* Main permission item */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {permission.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {permission.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                >
                  {displayInfo.text}
                </span>
              </div>

              {/* Actions (sub-items) */}
              {permission.hasActions && permissionValue?.actions && (
                <div className="border-t border-blue-50">
                  <div className="bg-gray-100 p-2 pl-12 text-black">
                    <h4 className="font-medium">Actions</h4>
                  </div>
                  {permission.actions.map((action) => {
                    const actionValue = permissionValue.actions[action.id];
                    const actionDisplayInfo = getPermissionDisplayInfo(actionValue, action.id);

                    return (
                      <div
                        key={action.id}
                        className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="ml-8 mr-2 text-gray-400">→</div>
                          <div>
                            <h3 className="font-medium text-gray-700">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${actionDisplayInfo.bg} ${actionDisplayInfo.color}`}
                        >
                          {actionDisplayInfo.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// RoleForm Component
function RoleForm({ role, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    domain: role?.domain || "",
    department: role?.department || "",
    roleName: role?.roleName || "",
    roleTitle: role?.roleTitle || "",
    description: role?.description || "",
    documentRepoAccess: role?.documentRepoAccess || {
      inReview: {
        permission: "no_access",
        actions: {
          referenceDocumentAccess: "no_access",
          notify: "no_access"
        }
      },
      referenceDocument: "view_access",
      approved: "view_access",
      deactivated: "no_access"
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset department when domain changes
      if (name === "domain") {
        newData.department = "";
      }

      return newData;
    });
  };

  // Handle permission level change
  const handlePermissionLevelChange = (permissionId, level) => {
    setFormData((prev) => ({
      ...prev,
      documentRepoAccess: {
        ...prev.documentRepoAccess,
        [permissionId]: permissionId === "inReview"
          ? {
            permission: level,
            actions: prev.documentRepoAccess.inReview?.actions || {
              referenceDocumentAccess: "no_access",
              notify: "no_access"
            }
          }
          : level,
      },
    }));
  };

  // Handle action level change
  const handleActionLevelChange = (permissionId, actionId, level) => {
    setFormData((prev) => ({
      ...prev,
      documentRepoAccess: {
        ...prev.documentRepoAccess,
        [permissionId]: {
          ...prev.documentRepoAccess[permissionId],
          actions: {
            ...prev.documentRepoAccess[permissionId].actions,
            [actionId]: level
          }
        },
      },
    }));
  };

  // Get permission level color
  const getPermissionLevelColor = (level, permissionId) => {
    switch (level) {
      case "admin_access":
        return "bg-green-100 text-green-800 border-green-200";
      case "write_access":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "view_access":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "no_access":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);

      // Reset form only if it's a new role creation (not editing)
      if (!role) {
        setFormData({
          domain: "",
          department: "",
          roleName: "",
          roleTitle: "",
          description: "",
          documentRepoAccess: {
            inReview: {
              permission: "none",
              actions: {
                referenceDocumentAccess: "denied",
                notify: "none"
              }
            },
            referenceDocument: "read",
            approved: "true",
            deactivated: "false"
          },
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>{role ? "Edit Role" : "Create Role"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <Card className="border-2 border-gray-200">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Basic Information
              </h2>
              <p className="text-sm text-blue-500">Define the role details</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Domain, Department Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain *</Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) =>
                      handleSelectChange("domain", value)
                    }
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
                  <Label htmlFor="roleName">Role Name *</Label>
                  <Input
                    id="roleName"
                    name="roleName"
                    placeholder="Enter role name"
                    required
                    value={formData.roleName}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleTitle">Role Title *</Label>
                  <Input
                    id="roleTitle"
                    name="roleTitle"
                    placeholder="Enter role title"
                    required
                    value={formData.roleTitle}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this role"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Document Repository Access Control Section */}
          <div className="border-2 border-gray-200 rounded-lg">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Document Repository Access
              </h2>
              <p className="text-sm text-blue-500">
                Define document repository permissions for this role
              </p>
            </div>

            {/* Document Repository Permissions */}
            <div className="divide-y divide-blue-100 h-96 overflow-y-auto">
              {documentRepoPermissions.map((permission) => {
                let permissionLevel;
                if (permission.id === "inReview") {
                  permissionLevel = formData.documentRepoAccess.inReview?.permission || permission.defaultLevel;
                } else {
                  permissionLevel = formData.documentRepoAccess[permission.id] || permission.defaultLevel;
                }

                return (
                  <div key={permission.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {permission.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                      <Select
                        value={permissionLevel}
                        onValueChange={(value) =>
                          handlePermissionLevelChange(permission.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            permissionLevel,
                            permission.id
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {permission.allowedLevels.map((level) => (
                            <SelectItem
                              key={level}
                              value={level}
                              className="font-medium"
                            >
                              {level === "admin_access" ? "Admin Access" :
                                level === "write_access" ? "Write Access" :
                                  level === "view_access" ? "View Access" :
                                    level === "no_access" ? "No Access" :
                                      level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions for In Review */}
                    {permission.hasActions && permission.id === "inReview" && (
                      <div className="border-t border-blue-50">
                        <div className="bg-gray-100 p-2 pl-12 text-black">
                          <h4 className="font-medium">Actions</h4>
                        </div>
                        {permission.actions.map((action) => {
                          const actionLevel =
                            formData.documentRepoAccess.inReview?.actions?.[action.id] || action.defaultLevel;

                          return (
                            <div
                              key={action.id}
                              className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                            >
                              <div className="flex items-center">
                                <div className="ml-8 mr-2 text-gray-400">
                                  →
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-700">
                                    {action.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {action.description}
                                  </p>
                                </div>
                              </div>
                              <Select
                                value={actionLevel}
                                onValueChange={(value) =>
                                  handleActionLevelChange("inReview", action.id, value)
                                }
                              >
                                <SelectTrigger
                                  className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                    actionLevel,
                                    action.id
                                  )}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {action.allowedLevels.map((level) => (
                                    <SelectItem
                                      key={level}
                                      value={level}
                                      className="font-medium"
                                    >
                                      {level === "admin_access" ? "Admin Access" :
                                        level === "view_access" ? "View Access" :
                                          level === "no_access" ? "No Access" :
                                            level.charAt(0).toUpperCase() + level.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {role ? "Updating..." : "Creating..."}
              </>
            ) : role ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Main Role Management App Component
function RoleManagementApp({ showAddForm, onToggleForm }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [viewPermissionsRole, setViewPermissionsRole] = useState(null);

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to load roles...');

      const rolesData = await fetchRoles();
      console.log('Received roles data:', rolesData);

      // Ensure we always have an array
      if (Array.isArray(rolesData)) {
        console.log('Data is array, setting roles:', rolesData);
        setRoles(rolesData);
      } else if (rolesData && Array.isArray(rolesData.roleData)) {
        // If the response is wrapped in a roleData property (your API format)
        console.log('Data wrapped in roleData property:', rolesData.roleData);
        setRoles(rolesData.roleData);
      } else if (rolesData && Array.isArray(rolesData.data)) {
        // If the response is wrapped in a data property
        console.log('Data wrapped in data property:', rolesData.data);
        setRoles(rolesData.data);
      } else if (rolesData && Array.isArray(rolesData.roles)) {
        // If the response is wrapped in a roles property
        console.log('Data wrapped in roles property:', rolesData.roles);
        setRoles(rolesData.roles);
      } else {
        // If we get a single role object, wrap it in an array
        console.log('Single object or empty, wrapping:', rolesData);
        setRoles(rolesData ? [rolesData] : []);
      }
    } catch (err) {
      console.error('Load roles error:', err);
      setError(`Failed to load roles: ${err.message}`);
      setRoles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Ensure roles is always an array before filtering
  const safeRoles = Array.isArray(roles) ? roles : [];
  console.log('Safe roles for filtering:', safeRoles);

  const filteredRoles = safeRoles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      role.domain?.toLowerCase().includes(searchLower) ||
      role.department?.toLowerCase().includes(searchLower) ||
      role.roleName?.toLowerCase().includes(searchLower) ||
      role.roleTitle?.toLowerCase().includes(searchLower) ||
      role.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId);
      setRoles(safeRoles.filter((role) => (role._id || role.id) !== roleId));
      setOpenPopover(null);
    } catch (err) {
      console.error('Error deleting role:', err);
      setError('Failed to delete role');
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveRole = async (roleData) => {
    try {
      if (editingRole) {
        // Update existing role
        const roleId = editingRole._id || editingRole.id;
        const updatedRole = await updateRole(roleId, roleData);
        setRoles(safeRoles.map((role) => ((role._id || role.id) === roleId ? updatedRole : role)));
      } else {
        // Create new role
        const newRole = await createRole(roleData);
        setRoles([...safeRoles, newRole]);
      }
      setEditingRole(null);
      if (onToggleForm) onToggleForm();
    } catch (err) {
      console.error('Error saving role:', err);
      setError('Failed to save role');
    }
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    if (onToggleForm) onToggleForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading roles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="text-sm text-gray-500 mb-4">
          Check the browser console for more details
        </div>
        <Button onClick={loadRoles}>
          Try Again
        </Button>
      </div>
    );
  }

  console.log('Rendering with filtered roles:', filteredRoles);

  return (
    <div className="space-y-4">
      {showAddForm && (
        <RoleForm
          role={editingRole}
          onSave={handleSaveRole}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600">
              <TableHead className="text-white">Role Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Access Controls</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role._id || role.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-medium">{role.roleName}</div>
                      <div className="text-sm text-gray-500">{role.roleTitle}</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="domain">{role.domain}</Badge>
                        <Badge variant="department">{role.department}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={viewPermissionsRole === (role._id || role.id)}
                      onOpenChange={(open) =>
                        setViewPermissionsRole(open ? (role._id || role.id) : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">View Permissions</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="max-h-[80vh] overflow-y-auto"
                        style={{
                          width: "80vw",
                          height: "75vh",
                          maxWidth: "none",
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>
                            Access Controls - {role.roleName}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {role.documentRepoAccess ? (
                            <AccessControlViewer
                              documentRepoAccess={role.documentRepoAccess}
                            />
                          ) : (
                            <p className="text-gray-500 text-center py-8">
                              No permissions assigned to this role.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>

                      <Popover
                        open={openPopover === (role._id || role.id)}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenPopover(role._id || role.id);
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
                                This will permanently delete this role.
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
                                onClick={() => handleDeleteRole(role._id || role.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Export individual components for backward compatibility
export { RoleForm };
export { RoleManagementApp };

// Default export
export default function App() {
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          <Button
            onClick={toggleForm}
            className="bg-[#335aff] hover:bg-[#335aff]/80"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {showAddForm ? "View Roles" : "Add New Role"}
          </Button>
        </div>

        <RoleManagementApp
          showAddForm={showAddForm}
          onToggleForm={toggleForm}
        />
      </div>
    </div>
  );
}