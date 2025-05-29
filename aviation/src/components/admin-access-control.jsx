"use client";

import { useState } from "react";
import {
  ChevronDown,
  Shield,
  FileText,
  X,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define all permissions
const permissions = [
  // Document Repository
  {
    id: "in-review",
    title: "In Review",
    description: "Allow viewing of documents in review",
    category: "document-repository",
    section: "document-repository",
  },
  {
    id: "reference-document-access",
    title: "Reference Document Access",
    description: "Allow access to reference documents in review",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["admin_access", "view_access", "no_access"],
    isSubItem: true,
    subItemOf: "in-review",
  },
  {
    id: "notify-in-review",
    title: "Notify",
    description: "Allow notifications for documents in review",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["admin_access", "no_access"],

    isSubItem: true,
    subItemOf: "in-review",
  },
  {
    id: "reference-document",
    title: "Reference Document",
    description: "Allow viewing of reference documents",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "approved",
    title: "Approved",
    description: "Allow viewing of approved documents",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "deactivated",
    title: "Deactivated",
    description: "Allow viewing of deactivated documents",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },

  // Review Administration
  {
    id: "review-administration-access",
    title: "Review Administration Access",
    description: "Top-level access to review administration",
    category: "review-administration",
    section: "review-administration",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "upload",
    title: "Upload",
    description: "Allow uploading of documents",
    category: "review-administration",
    section: "review-administration",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "read",
    title: "Read",
    description: "Allow reading of documents",
    category: "review-administration",
    section: "review-administration",
    parent: "review-management",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "create",
    title: "Create",
    description: "Allow creation of documents",
    category: "review-administration",
    section: "review-administration",
    parent: "review-management",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "update",
    title: "Update",
    description: "Allow updating of documents",
    category: "review-administration",
    section: "review-administration",
    parent: "review-management",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "deactivate",
    title: "Deactivate",
    description: "Allow deactivation of documents",
    category: "review-administration",
    section: "review-administration",
    parent: "review-management",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "sign-off",
    title: "Sign-off",
    description: "Allow signing off on documents",
    category: "review-administration",
    section: "review-administration",
    allowedLevels: ["admin_access", "no_access"],
  },

  // Document View (now inside Review Administration)
  {
    id: "pending",
    title: "Pending",
    description: "Allow viewing of pending documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "approved-view",
    title: "Approved",
    description: "Allow viewing of approved documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
  },
  {
    id: "final-copy",
    title: "Final Copy",
    description: "Allow viewing of final copy documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "summary",
    title: "Summary",
    description: "Allow viewing of summary documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "annotated-docs",
    title: "Annotated Docs",
    description: "Allow viewing of annotated documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "deactivated-view",
    title: "Deactivated",
    description: "Allow viewing of deactivated documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "reference-documents",
    title: "Reference Documents",
    description: "Allow viewing of reference documents",
    category: "review-administration",
    section: "review-administration",
    parent: "document-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },

  // Tasks
  {
    id: "group",
    title: "Group",
    description: "Allow management of groups",
    category: "tasks",
    section: "tasks",
  },
  {
    id: "user",
    title: "User",
    description: "Allow management of users",
    category: "tasks",
    section: "tasks",
  },

  // Escalated Tasks
  {
    id: "escalated-tasks-access",
    title: "Escalated Tasks Access",
    description: "Top-level access to escalated tasks",
    category: "escalated-tasks",
    section: "escalated-tasks",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "notify",
    title: "Notify",
    description: "Allow sending notifications",
    category: "escalated-tasks",
    section: "escalated-tasks",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "assign",
    title: "Assign",
    description: "Allow assigning tasks",
    category: "escalated-tasks",
    section: "escalated-tasks",
    allowedLevels: ["admin_access", "no_access"],
  },
];

// Define sections with parent-child relationships
const sections = {
  "document-repository": {
    title: "Document Repository",
    description: "Document repository permissions",
    parents: {},
  },
  "review-administration": {
    title: "Review Administration",
    description: "Review administration permissions",
    parents: {
      "review-management": {
        title: "Review Management",
        description: "Document review management permissions",
      },
      "document-view": {
        title: "Document View",
        description: "Document viewing permissions",
      },
    },
  },
  tasks: {
    title: "Tasks",
    description: "Task management permissions",
  },
  "escalated-tasks": {
    title: "Escalated Tasks",
    description: "Escalated task permissions",
  },
};

export default function RbacAdminPanel() {
  // Sample roles data with updated permission levels
  const [roles, setRoles] = useState([
    {
      id: "admin",
      name: "Admin",
      permissions: {
        "in-review": "admin_access",
        "reference-document-access": "admin_access",
        "notify-in-review": "admin_access",
        "reference-document": "admin_access",
        approved: "admin_access",
        deactivated: "admin_access",
        "review-administration-access": "admin_access",
        upload: "admin_access",
        read: "admin_access",
        create: "admin_access",
        update: "admin_access",
        deactivate: "admin_access",
        "sign-off": "admin_access",
        pending: "admin_access",
        "approved-view": "admin_access",
        "final-copy": "admin_access",
        summary: "admin_access",
        "annotated-docs": "admin_access",
        "deactivated-view": "admin_access",
        "reference-documents": "admin_access",
        group: "admin_access",
        user: "admin_access",
        "escalated-tasks-access": "admin_access",
        notify: "admin_access",
        assign: "admin_access",
      },
    },
    {
      id: "editor",
      name: "Editor",
      permissions: {
        "in-review": "write_access",
        "reference-document-access": "view_access",
        "notify-in-review": "write_access",
        "reference-document": "view_access",
        approved: "view_access",
        deactivated: "view_access",
        "review-administration-access": "admin_access",
        upload: "admin_access",
        read: "admin_access",
        create: "admin_access",
        update: "admin_access",
        deactivate: "no_access",
        "sign-off": "no_access",
        pending: "admin_access",
        "approved-view": "admin_access",
        "final-copy": "view_access",
        summary: "view_access",
        "annotated-docs": "view_access",
        "deactivated-view": "view_access",
        "reference-documents": "view_access",
        group: "view_access",
        user: "view_access",
        "escalated-tasks-access": "no_access",
        notify: "no_access",
        assign: "no_access",
      },
    },
    {
      id: "reviewer",
      name: "Reviewer",
      permissions: {
        "in-review": "view_access",
        "reference-document-access": "view_access",
        "notify-in-review": "view_access",
        "reference-document": "view_access",
        approved: "view_access",
        deactivated: "view_access",
        "review-administration-access": "no_access",
        upload: "no_access",
        read: "no_access",
        create: "no_access",
        update: "no_access",
        deactivate: "no_access",
        "sign-off": "no_access",
        pending: "no_access",
        "approved-view": "admin_access",
        "final-copy": "view_access",
        summary: "view_access",
        "annotated-docs": "view_access",
        "deactivated-view": "view_access",
        "reference-documents": "view_access",
        group: "no_access",
        user: "no_access",
        "escalated-tasks-access": "no_access",
        notify: "no_access",
        assign: "no_access",
      },
    },
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState("admin");
  const [activePermissions, setActivePermissions] = useState({});
  const [activeTab, setActiveTab] = useState("document-repository");
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    "in-review": true, // Start with In Review expanded
    "approved-view": true, // Start with Approved expanded
  });

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Find the selected role
  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  // Update permissions when role changes
  useState(() => {
    if (selectedRole) {
      setActivePermissions(selectedRole.permissions);
    }
  });

  // Handle role change
  const handleRoleChange = (value) => {
    const role = roles.find((r) => r.id === value);
    if (role) {
      setSelectedRoleId(value);
      setActivePermissions(role.permissions);
      setHasChanges(false);
    }
  };

  // Handle permission level change
  const handlePermissionLevelChange = (permissionId, level) => {
    setActivePermissions((prev) => ({
      ...prev,
      [permissionId]: level,
    }));
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = () => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === selectedRoleId) {
          return {
            ...role,
            permissions: { ...activePermissions },
          };
        }
        return role;
      })
    );
    setHasChanges(false);
  };

  // Toggle expanded state for an item
  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Get permission level text
  const getPermissionLevelText = (level) => {
    switch (level) {
      case "admin_access":
        return "Admin Access";
      case "write_access":
        return "Write Access";
      case "read_access":
        return "Read Access";
      case "view_access":
        return "View Access";
      case "edit_access":
        return "Edit Access";
      case "no_access":
        return "No Access";
      default:
        return "No Access";
    }
  };

  // Get permission level color
  const getPermissionLevelColor = (level) => {
    switch (level) {
      case "admin_access":
        return "bg-green-100 text-green-800 border-green-200";
      case "write_access":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "read_access":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "view_access":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "edit_access":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "no_access":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get permission level icon
  const getPermissionLevelIcon = (level) => {
    switch (level) {
      case "admin_access":
        return <Shield className="mr-2 h-4 w-4" />;
      case "write_access":
        return <FileText className="mr-2 h-4 w-4" />;
      case "read_access":
        return <FileText className="mr-2 h-4 w-4" />;
      case "view_access":
        return <Eye className="mr-2 h-4 w-4" />;
      case "edit_access":
        return <FileText className="mr-2 h-4 w-4" />;
      case "no_access":
        return <X className="mr-2 h-4 w-4" />;
      default:
        return <X className="mr-2 h-4 w-4" />;
    }
  };

  // Get available permission levels for a permission
  const getAvailableLevels = (permission) => {
    if (permission.allowedLevels) {
      return permission.allowedLevels;
    }

    // Default levels if not specified
    return ["admin_access", "write_access", "view_access", "no_access"];
  };

  // Get sub-items for a given item
  const getSubItems = (itemId, category, parent) => {
    return permissions.filter(
      (p) =>
        p.isSubItem &&
        p.subItemOf === itemId &&
        p.category === category &&
        (parent ? p.parent === parent : true)
    );
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header Section */}
      <h1 className="mb-6 text-3xl font-bold text-blue-600">Access Control</h1>

      {/* Top Form Section */}
      <Card className="mb-8 overflow-hidden border-2 border-gray-200">
        <div className="bg-blue-50 p-4">
          <h2 className="text-xl font-bold text-blue-600">Information</h2>
          <p className="text-sm text-blue-500">
            Define the access control details
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-blue-600"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border-2 border-gray-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-blue-600"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this access control"
              className="border-2 border-gray-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6 flex overflow-x-auto rounded-t-lg border-2 border-b-0 border-blue-200">
        {Object.keys(sections).map((category) => (
          <button
            key={category}
            className={cn(
              "min-w-[200px] border-r-2 border-blue-200 px-6 py-4 text-center font-bold transition-colors last:border-r-0",
              activeTab === category
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 hover:bg-blue-50"
            )}
            onClick={() => setActiveTab(category)}
          >
            {sections[category].title}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="overflow-hidden rounded-b-lg border-2 border-gray-200">
        <div className="flex items-center justify-between bg-blue-50 p-4">
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              {sections[activeTab].title}
            </h2>
            <p className="text-sm text-blue-500">
              {sections[activeTab].description}
            </p>
          </div>

          {/* Header-level access control for Review Administration */}
          {activeTab === "review-administration" && (
            <div className="relative">
              <Select
                value={
                  activePermissions["review-administration-access"] ||
                  "no_access"
                }
                onValueChange={(value) =>
                  handlePermissionLevelChange(
                    "review-administration-access",
                    value
                  )
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[168px] border-2 font-medium",
                    getPermissionLevelColor(
                      activePermissions["review-administration-access"] ||
                        "no_access"
                    )
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="admin_access"
                    className="font-medium text-green-600"
                  >
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Access</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="no_access"
                    className="font-medium text-gray-600"
                  >
                    <div className="flex items-center">
                      <X className="mr-2 h-4 w-4" />
                      <span>No Access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Header-level access control for Escalated Tasks */}
          {activeTab === "escalated-tasks" && (
            <div className="relative">
              <Select
                value={
                  activePermissions["escalated-tasks-access"] || "no_access"
                }
                onValueChange={(value) =>
                  handlePermissionLevelChange("escalated-tasks-access", value)
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[168px] border-2 font-medium",
                    getPermissionLevelColor(
                      activePermissions["escalated-tasks-access"] || "no_access"
                    )
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="admin_access"
                    className="font-medium text-green-600"
                  >
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Access</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="no_access"
                    className="font-medium text-gray-600"
                  >
                    <div className="flex items-center">
                      <X className="mr-2 h-4 w-4" />
                      <span>No Access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="divide-y divide-blue-100">
          {/* Regular permissions (no parent) and their visual sub-items */}
          {permissions
            .filter(
              (p) =>
                p.category === activeTab &&
                !p.parent &&
                !p.isSubItem &&
                p.id !== "review-administration-access" &&
                p.id !== "escalated-tasks-access"
            )
            .map((permission) => {
              const permissionLevel =
                activePermissions[permission.id] || "no_access";
              const availableLevels = getAvailableLevels(permission);
              const subItems = getSubItems(permission.id, activeTab);
              const hasSubItems = subItems.length > 0;
              const isExpanded = expandedItems[permission.id] || false;

              return (
                <div key={permission.id}>
                  {/* Main permission item */}
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-gray-50",
                      hasSubItems && "cursor-pointer"
                    )}
                    onClick={
                      hasSubItems
                        ? () => toggleExpanded(permission.id)
                        : undefined
                    }
                  >
                    <div className="flex items-center">
                      {hasSubItems && (
                        <div className="mr-2 text-blue-500">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4 -rotate-90 transform" />
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {permission.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={permissionLevel}
                        onValueChange={(value) =>
                          handlePermissionLevelChange(permission.id, value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-[168px] border-2 font-medium",
                            getPermissionLevelColor(permissionLevel)
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLevels.includes("admin_access") && (
                            <SelectItem
                              value="admin_access"
                              className="font-medium text-green-600"
                            >
                              <div className="flex items-center">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Access</span>
                              </div>
                            </SelectItem>
                          )}
                          {availableLevels.includes("write_access") && (
                            <SelectItem
                              value="write_access"
                              className="font-medium text-blue-600"
                            >
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Write Access</span>
                              </div>
                            </SelectItem>
                          )}
                          {availableLevels.includes("edit_access") && (
                            <SelectItem
                              value="edit_access"
                              className="font-medium text-indigo-600"
                            >
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Edit Access</span>
                              </div>
                            </SelectItem>
                          )}
                          {availableLevels.includes("view_access") && (
                            <SelectItem
                              value="view_access"
                              className="font-medium text-purple-600"
                            >
                              <div className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Access</span>
                              </div>
                            </SelectItem>
                          )}
                          {availableLevels.includes("read_access") && (
                            <SelectItem
                              value="read_access"
                              className="font-medium text-amber-600"
                            >
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Read Access</span>
                              </div>
                            </SelectItem>
                          )}
                          {availableLevels.includes("no_access") && (
                            <SelectItem
                              value="no_access"
                              className="font-medium text-gray-600"
                            >
                              <div className="flex items-center">
                                <X className="mr-2 h-4 w-4" />
                                <span>No Access</span>
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>
                  </div>

                  {/* Actions and Sub-items */}
                  {hasSubItems && isExpanded && (
                    <div className="border-t border-blue-50">
                      {/* Actions label */}
                      <div className="bg-gray-100 p-2 pl-12 text-black">
                        <h4 className="font-medium">Actions</h4>
                      </div>

                      {/* Sub-items */}
                      {subItems.map((subItem) => {
                        const subItemPermissionLevel =
                          activePermissions[subItem.id] || "no_access";
                        const subItemAvailableLevels =
                          getAvailableLevels(subItem);

                        return (
                          <div
                            key={subItem.id}
                            className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                          >
                            <div className="flex items-center">
                              <div className="ml-8 mr-2 text-gray-400">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-700">
                                  {subItem.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {subItem.description}
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <Select
                                value={subItemPermissionLevel}
                                onValueChange={(value) =>
                                  handlePermissionLevelChange(subItem.id, value)
                                }
                              >
                                <SelectTrigger
                                  className={cn(
                                    "w-[168px] border-2 font-medium",
                                    getPermissionLevelColor(
                                      subItemPermissionLevel
                                    )
                                  )}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {subItemAvailableLevels.includes(
                                    "admin_access"
                                  ) && (
                                    <SelectItem
                                      value="admin_access"
                                      className="font-medium text-green-600"
                                    >
                                      <div className="flex items-center">
                                        <Shield className="mr-2 h-4 w-4" />
                                        <span>Admin Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                  {subItemAvailableLevels.includes(
                                    "write_access"
                                  ) && (
                                    <SelectItem
                                      value="write_access"
                                      className="font-medium text-blue-600"
                                    >
                                      <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Write Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                  {subItemAvailableLevels.includes(
                                    "edit_access"
                                  ) && (
                                    <SelectItem
                                      value="edit_access"
                                      className="font-medium text-indigo-600"
                                    >
                                      <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Edit Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                  {subItemAvailableLevels.includes(
                                    "view_access"
                                  ) && (
                                    <SelectItem
                                      value="view_access"
                                      className="font-medium text-purple-600"
                                    >
                                      <div className="flex items-center">
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>View Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                  {subItemAvailableLevels.includes(
                                    "read_access"
                                  ) && (
                                    <SelectItem
                                      value="read_access"
                                      className="font-medium text-amber-600"
                                    >
                                      <div className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Read Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                  {subItemAvailableLevels.includes(
                                    "no_access"
                                  ) && (
                                    <SelectItem
                                      value="no_access"
                                      className="font-medium text-gray-600"
                                    >
                                      <div className="flex items-center">
                                        <X className="mr-2 h-4 w-4" />
                                        <span>No Access</span>
                                      </div>
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Parent sections with child permissions */}
          {sections[activeTab].parents &&
            Object.entries(sections[activeTab].parents || {}).map(
              ([parentKey, parent]) => {
                const childPermissions = permissions.filter(
                  (p) =>
                    p.category === activeTab &&
                    p.parent === parentKey &&
                    !p.isSubItem
                );
                if (childPermissions.length === 0) return null;

                return (
                  <div key={parentKey} className="border-t-2 border-blue-100">
                    <div className="bg-blue-50 p-4">
                      <h3 className="font-bold text-blue-600">
                        {parent.title}
                      </h3>
                      <p className="text-sm text-blue-500">
                        {parent.description}
                      </p>
                    </div>
                    <div className="divide-y divide-blue-100">
                      {childPermissions.map((permission) => {
                        const permissionLevel =
                          activePermissions[permission.id] || "no_access";
                        const availableLevels = getAvailableLevels(permission);
                        const subItems = getSubItems(
                          permission.id,
                          activeTab,
                          parentKey
                        );
                        const hasSubItems = subItems.length > 0;
                        const isExpanded =
                          expandedItems[permission.id] || false;

                        return (
                          <div key={permission.id}>
                            <div
                              className={cn(
                                "flex items-center justify-between p-4 pl-8 hover:bg-gray-50",
                                hasSubItems && "cursor-pointer"
                              )}
                              onClick={
                                hasSubItems
                                  ? () => toggleExpanded(permission.id)
                                  : undefined
                              }
                            >
                              <div className="flex items-center">
                                {hasSubItems && (
                                  <div className="mr-2 text-blue-500">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 -rotate-90 transform" />
                                    )}
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-bold text-gray-800">
                                    {permission.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="relative"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Select
                                  value={permissionLevel}
                                  onValueChange={(value) =>
                                    handlePermissionLevelChange(
                                      permission.id,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    className={cn(
                                      "w-[168px] border-2 font-medium",
                                      getPermissionLevelColor(permissionLevel)
                                    )}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableLevels.includes(
                                      "admin_access"
                                    ) && (
                                      <SelectItem
                                        value="admin_access"
                                        className="font-medium text-green-600"
                                      >
                                        <div className="flex items-center">
                                          <Shield className="mr-2 h-4 w-4" />
                                          <span>Admin Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                    {availableLevels.includes(
                                      "write_access"
                                    ) && (
                                      <SelectItem
                                        value="write_access"
                                        className="font-medium text-blue-600"
                                      >
                                        <div className="flex items-center">
                                          <FileText className="mr-2 h-4 w-4" />
                                          <span>Write Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                    {availableLevels.includes(
                                      "edit_access"
                                    ) && (
                                      <SelectItem
                                        value="edit_access"
                                        className="font-medium text-indigo-600"
                                      >
                                        <div className="flex items-center">
                                          <FileText className="mr-2 h-4 w-4" />
                                          <span>Edit Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                    {availableLevels.includes(
                                      "view_access"
                                    ) && (
                                      <SelectItem
                                        value="view_access"
                                        className="font-medium text-purple-600"
                                      >
                                        <div className="flex items-center">
                                          <Eye className="mr-2 h-4 w-4" />
                                          <span>View Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                    {availableLevels.includes(
                                      "read_access"
                                    ) && (
                                      <SelectItem
                                        value="read_access"
                                        className="font-medium text-amber-600"
                                      >
                                        <div className="flex items-center">
                                          <FileText className="mr-2 h-4 w-4" />
                                          <span>Read Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                    {availableLevels.includes("no_access") && (
                                      <SelectItem
                                        value="no_access"
                                        className="font-medium text-gray-600"
                                      >
                                        <div className="flex items-center">
                                          <X className="mr-2 h-4 w-4" />
                                          <span>No Access</span>
                                        </div>
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                              </div>
                            </div>

                            {/* Sub-items for items in parent sections */}
                            {hasSubItems && isExpanded && (
                              <div className="border-t border-blue-50">
                                {/* Actions label */}
                                <div className="bg-gray-100 p-2 pl-12 text-black">
                                  <h4 className="font-medium">Actions</h4>
                                </div>

                                {/* Sub-items */}
                                {subItems.map((subItem) => {
                                  const subItemPermissionLevel =
                                    activePermissions[subItem.id] ||
                                    "no_access";
                                  const subItemAvailableLevels =
                                    getAvailableLevels(subItem);

                                  return (
                                    <div
                                      key={subItem.id}
                                      className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                    >
                                      <div className="flex items-center">
                                        <div className="ml-8 mr-2 text-gray-400">
                                          <ArrowRight className="h-4 w-4" />
                                        </div>
                                        <div>
                                          <h3 className="font-medium text-gray-700">
                                            {subItem.title}
                                          </h3>
                                          <p className="text-sm text-gray-500">
                                            {subItem.description}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="relative">
                                        <Select
                                          value={subItemPermissionLevel}
                                          onValueChange={(value) =>
                                            handlePermissionLevelChange(
                                              subItem.id,
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger
                                            className={cn(
                                              "w-[168px] border-2 font-medium",
                                              getPermissionLevelColor(
                                                subItemPermissionLevel
                                              )
                                            )}
                                          >
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {subItemAvailableLevels.includes(
                                              "admin_access"
                                            ) && (
                                              <SelectItem
                                                value="admin_access"
                                                className="font-medium text-green-600"
                                              >
                                                <div className="flex items-center">
                                                  <Shield className="mr-2 h-4 w-4" />
                                                  <span>Admin Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                            {subItemAvailableLevels.includes(
                                              "write_access"
                                            ) && (
                                              <SelectItem
                                                value="write_access"
                                                className="font-medium text-blue-600"
                                              >
                                                <div className="flex items-center">
                                                  <FileText className="mr-2 h-4 w-4" />
                                                  <span>Write Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                            {subItemAvailableLevels.includes(
                                              "edit_access"
                                            ) && (
                                              <SelectItem
                                                value="edit_access"
                                                className="font-medium text-indigo-600"
                                              >
                                                <div className="flex items-center">
                                                  <FileText className="mr-2 h-4 w-4" />
                                                  <span>Edit Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                            {subItemAvailableLevels.includes(
                                              "view_access"
                                            ) && (
                                              <SelectItem
                                                value="view_access"
                                                className="font-medium text-purple-600"
                                              >
                                                <div className="flex items-center">
                                                  <Eye className="mr-2 h-4 w-4" />
                                                  <span>View Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                            {subItemAvailableLevels.includes(
                                              "read_access"
                                            ) && (
                                              <SelectItem
                                                value="read_access"
                                                className="font-medium text-amber-600"
                                              >
                                                <div className="flex items-center">
                                                  <FileText className="mr-2 h-4 w-4" />
                                                  <span>Read Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                            {subItemAvailableLevels.includes(
                                              "no_access"
                                            ) && (
                                              <SelectItem
                                                value="no_access"
                                                className="font-medium text-gray-600"
                                              >
                                                <div className="flex items-center">
                                                  <X className="mr-2 h-4 w-4" />
                                                  <span>No Access</span>
                                                </div>
                                              </SelectItem>
                                            )}
                                          </SelectContent>
                                        </Select>
                                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                                      </div>
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
            )}
        </div>
      </Card>
    </div>
  );
}
