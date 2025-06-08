import { useState } from "react";
import { Edit, Trash2, Search, Loader2, PlusCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// To-Do create seperate component for this file: role-form, role-table, role-context
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
    allowedLevels: ["view_access", "no_access"],
    isSubItem: true,
    subItemOf: "in-review",
    defaultLevel: "no_access",
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
    allowedLevels: ["view_access", "no_access"],
    defaultLevel: "view_access",
  },
  {
    id: "approved",
    title: "Approved",
    description: "Allow viewing of approved documents",
    category: "document-repository",
    section: "document-repository",
    allowedLevels: ["view_access", "no_access"],
    defaultLevel: "view_access",
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
    isSubItem: true,
    subItemOf: "review-administration-access",
    allowedLevels: ["admin_access", "write_access", "view_access", "no_access"],
  },
  {
    id: "upload-working-copy",
    title: "Upload Working Copy",
    description: "Allow uploading of working copy documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "upload",
    allowedLevels: ["admin_access", "write_access", "view_access", "no_access"],
  },
  {
    id: "upload-reference-document",
    title: "Upload Reference Document",
    description: "Allow uploading of reference documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "upload",
    allowedLevels: ["admin_access", "write_access", "view_access", "no_access"],
  },
  {
    id: "sign-off",
    title: "Sign-off",
    description: "Allow signing off on documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "review-administration-access",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "review-management",
    title: "Review Management",
    description: "Document review management permissions",
    category: "review-administration",
    section: "review-administration",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "document-view",
    title: "Admin Document Repository View",
    description: "Admin document repository viewing permissions",
    category: "review-administration",
    section: "review-administration",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "pending",
    title: "Pending",
    description: "Allow viewing of pending documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "document-view",
    allowedLevels: ["admin_access", "no_access"],
  },
  {
    id: "approved-view",
    title: "Approved",
    description: "Allow viewing of approved documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "document-view",
    allowedLevels: ["admin_access", "view_access", "no_access"],
  },
  {
    id: "final-copy",
    title: "Final Copy",
    description: "Allow viewing of final copy documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["view_access", "no_access"],
  },
  {
    id: "summary",
    title: "Summary",
    description: "Allow viewing of summary documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["view_access", "no_access"],
  },
  {
    id: "annotated-docs",
    title: "Annotated Docs",
    description: "Allow viewing of annotated documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "approved-view",
    allowedLevels: ["view_access", "no_access"],
  },
  {
    id: "deactivated-view",
    title: "Deactivated",
    description: "Allow viewing of deactivated documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "document-view",
    allowedLevels: ["view_access", "no_access"],
  },
  {
    id: "reference-documents",
    title: "Reference Documents",
    description: "Allow viewing of reference documents",
    category: "review-administration",
    section: "review-administration",
    isSubItem: true,
    subItemOf: "document-view",
    allowedLevels: ["view_access", "no_access"],
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
    id: "group-level",
    title: "Review  ",
    description: "Review permissions",
    category: "tasks",
    section: "tasks",
    isSubItem: true,
    subItemOf: "group",
  },
  {
    id: "approval-level",
    title: "Approval  ",
    description: "Approval permissions",
    category: "tasks",
    section: "tasks",
    isSubItem: true,
    subItemOf: "group",
  },
  {
    id: "review",
    title: "Review",
    description: "Allow reviewing of tasks",
    category: "tasks",
    section: "tasks",
    isSubItem: true,
    subItemOf: "group-level",
    allowedLevels: ["view_access", "no_access"],
  },
  {
    id: "write-approval",
    title: "Write Approval",
    description: "Allow writing approvals for tasks",
    category: "tasks",
    section: "tasks",
    isSubItem: true,
    subItemOf: "group-level",
    allowedLevels: ["write_access", "no_access"],
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
        title: "Admin Document Repository View",
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

// Mock initial roles data with domain, department, category (keeping existing data)
const initialRoles = [
  {
    id: "1",
    name: "System Administrator",
    description: "Full system access and control",
    domain: "Airport",
    department: "TSA",
    category: "ASP",
    roleName: "Administrator",
    roleDescription: "Full system access and control",
    effectiveDate: "2023-01-01",
    permissions: {
      "in-review": "admin_access",
      "reference-document-access": "view_access",
      "notify-in-review": "admin_access",
      "reference-document": "view_access",
      approved: "view_access",
      deactivated: "admin_access",
      "review-administration-access": "admin_access",
      upload: "admin_access",
      "upload-working-copy": "admin_access",
      "upload-reference-document": "admin_access",
      "sign-off": "admin_access",
      "review-management": "admin_access",
      "document-view": "admin_access",
      pending: "admin_access",
      "approved-view": "admin_access",
      "final-copy": "view_access",
      summary: "view_access",
      "annotated-docs": "view_access",
      "deactivated-view": "view_access",
      "reference-documents": "view_access",
      group: "admin_access",
      "group-level": "admin_access",
      review: "view_access",
      "write-approval": "write_access",
      user: "admin_access",
      "escalated-tasks-access": "admin_access",
      notify: "admin_access",
      assign: "admin_access",
    },
  },
  {
    id: "2",
    name: "Content Editor",
    description: "Content management and editing permissions",
    domain: "Airline",
    department: "Airline Security",
    category: "ADFP",
    roleName: "HR Manager",
    roleDescription: "Manage HR functions and employee records",
    effectiveDate: "2023-01-15",
    permissions: {
      "in-review": "write_access",
      "reference-document-access": "no_access",
      "notify-in-review": "no_access",
      "reference-document": "view_access",
      approved: "view_access",
      deactivated: "view_access",
      "review-administration-access": "admin_access",
      upload: "write_access",
      "upload-working-copy": "write_access",
      "upload-reference-document": "view_access",
      "sign-off": "no_access",
      "review-management": "admin_access",
      "document-view": "admin_access",
      pending: "admin_access",
      "approved-view": "admin_access",
      "final-copy": "view_access",
      summary: "view_access",
      "annotated-docs": "view_access",
      "deactivated-view": "view_access",
      "reference-documents": "view_access",
      group: "view_access",
      "group-level": "view_access",
      review: "view_access",
      "write-approval": "no_access",
      user: "view_access",
      "escalated-tasks-access": "no_access",
      notify: "no_access",
      assign: "no_access",
    },
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
      className={`px-2 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.default
        }`}
    >
      {children}
    </span>
  );
}

// Access Control Viewer Component
function AccessControlViewer({ permissions: rolePermissions }) {
  const [activeTab, setActiveTab] = useState("document-repository");

  // Get permission level display info
  const getPermissionDisplayInfo = (level) => {
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
      case "read_access":
        return {
          text: "Read Access",
          color: "text-amber-600",
          bg: "bg-amber-100",
        };
      case "view_access":
        return {
          text: "View Access",
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      case "edit_access":
        return {
          text: "Edit Access",
          color: "text-indigo-600",
          bg: "bg-indigo-100",
        };
      case "no_access":
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-200" };
      default:
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-100" };
    }
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

  // Filter permissions for current tab
  const getPermissionsForTab = (tabCategory) => {
    return permissions.filter((p) => p.category === tabCategory);
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {Object.keys(sections).map((category) => (
          <button
            key={category}
            type="button"
            className={`min-w-[200px] px-6 py-4 text-center font-bold transition-colors border-r border-gray-200 last:border-r-0 ${activeTab === category
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            onClick={() => setActiveTab(category)}
          >
            {sections[category].title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="divide-y divide-blue-100 max-h-100 overflow-y-auto">
        {/* Regular permissions (no parent) */}
        {permissions
          .filter(
            (p) =>
              p.category === activeTab &&
              !p.parent &&
              !p.isSubItem &&
              p.id !== "review-administration-access" &&
              p.id !== "escalated-tasks-access" &&
              p.id !== "review-management" &&
              p.id !== "document-view" &&
              rolePermissions[p.id]
          )
          .map((permission) => {
            const permissionLevel = rolePermissions[permission.id];
            const displayInfo = getPermissionDisplayInfo(permissionLevel);
            const subItems = getSubItems(permission.id, activeTab);
            const hasSubItems = subItems.length > 0;

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

                {/* Sub-items */}
                {hasSubItems && (
                  <div className="border-t border-blue-50">
                    <div className="bg-gray-100 p-2 pl-12 text-black">
                      <h4 className="font-medium">Actions</h4>
                    </div>
                    {subItems.map((subItem) => {
                      const subItemLevel = rolePermissions[subItem.id];
                      if (!subItemLevel) return null;
                      const subDisplayInfo =
                        getPermissionDisplayInfo(subItemLevel);

                      return (
                        <div
                          key={subItem.id}
                          className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                        >
                          <div className="flex items-center">
                            <div className="ml-8 mr-2 text-gray-400">→</div>
                            <div>
                              <h3 className="font-medium text-gray-700">
                                {subItem.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {subItem.description}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                          >
                            {subDisplayInfo.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        {/* Sections that need their own headers */}
        {activeTab === "review-administration" && (
          <>
            {/* Review Administration Access section with its sub-items */}
            <div className="border-t-2 border-blue-100">
              <div className="flex items-center justify-between bg-blue-50 p-4">
                <div>
                  <h3 className="font-bold text-blue-600">
                    Review Administration Access
                  </h3>
                  <p className="text-sm text-blue-500">
                    Top-level access control
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionDisplayInfo(
                    rolePermissions["review-administration-access"] ||
                    "no_access"
                  ).bg
                    } ${getPermissionDisplayInfo(
                      rolePermissions["review-administration-access"] ||
                      "no_access"
                    ).color
                    }`}
                >
                  {
                    getPermissionDisplayInfo(
                      rolePermissions["review-administration-access"] ||
                      "no_access"
                    ).text
                  }
                </span>
              </div>

              {/* Sub-items of Review Administration Access */}
              <div className="divide-y divide-blue-100">
                {permissions
                  .filter(
                    (p) =>
                      p.category === activeTab &&
                      p.isSubItem &&
                      p.subItemOf === "review-administration-access" &&
                      rolePermissions[p.id]
                  )
                  .map((permission) => {
                    const permissionLevel =
                      rolePermissions[permission.id] || "no_access";
                    const displayInfo =
                      getPermissionDisplayInfo(permissionLevel);
                    const subItems = getSubItems(permission.id, activeTab);
                    const hasSubItems = subItems.length > 0;

                    return (
                      <div key={permission.id}>
                        <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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

                        {/* Sub-items (third level) */}
                        {hasSubItems && (
                          <div className="border-t border-blue-50">
                            <div className="bg-gray-100 p-2 pl-12 text-black">
                              <h4 className="font-medium">Actions</h4>
                            </div>
                            {subItems.map((subItem) => {
                              const subItemLevel = rolePermissions[subItem.id];
                              if (!subItemLevel) return null;
                              const subDisplayInfo =
                                getPermissionDisplayInfo(subItemLevel);

                              return (
                                <div
                                  key={subItem.id}
                                  className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                >
                                  <div className="flex items-center">
                                    <div className="ml-8 mr-2 text-gray-400">
                                      →
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
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                  >
                                    {subDisplayInfo.text}
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

            {/* Review Management section */}
            {rolePermissions["review-management"] && (
              <div className="border-t-2 border-blue-100">
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Review Management
                    </h3>
                    <p className="text-sm text-blue-500">
                      Document review management permissions
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionDisplayInfo(
                      rolePermissions["review-management"] || "no_access"
                    ).bg
                      } ${getPermissionDisplayInfo(
                        rolePermissions["review-management"] || "no_access"
                      ).color
                      }`}
                  >
                    {
                      getPermissionDisplayInfo(
                        rolePermissions["review-management"] || "no_access"
                      ).text
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Admin Document Repository View section with its sub-items */}
            {rolePermissions["document-view"] && (
              <div className="border-t-2 border-blue-100">
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Admin Document Repository View
                    </h3>
                    <p className="text-sm text-blue-500">
                      Document viewing permissions
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionDisplayInfo(
                      rolePermissions["document-view"] || "no_access"
                    ).bg
                      } ${getPermissionDisplayInfo(
                        rolePermissions["document-view"] || "no_access"
                      ).color
                      }`}
                  >
                    {
                      getPermissionDisplayInfo(
                        rolePermissions["document-view"] || "no_access"
                      ).text
                    }
                  </span>
                </div>

                {/* Sub-items of Admin Document Repository View */}
                <div className="divide-y divide-blue-100">
                  {permissions
                    .filter(
                      (p) =>
                        p.category === activeTab &&
                        p.isSubItem &&
                        p.subItemOf === "document-view" &&
                        rolePermissions[p.id]
                    )
                    .map((permission) => {
                      const permissionLevel =
                        rolePermissions[permission.id] || "no_access";
                      const displayInfo =
                        getPermissionDisplayInfo(permissionLevel);
                      const subItems = getSubItems(permission.id, activeTab);
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={permission.id}>
                          <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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

                          {/* Sub-items (third level) */}
                          {hasSubItems && (
                            <div className="border-t border-blue-50">
                              <div className="bg-gray-100 p-2 pl-12 text-black">
                                <h4 className="font-medium">Actions</h4>
                              </div>
                              {subItems.map((subItem) => {
                                const subItemLevel =
                                  rolePermissions[subItem.id];
                                if (!subItemLevel) return null;
                                const subDisplayInfo =
                                  getPermissionDisplayInfo(subItemLevel);

                                return (
                                  <div
                                    key={subItem.id}
                                    className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                  >
                                    <div className="flex items-center">
                                      <div className="ml-8 mr-2 text-gray-400">
                                        →
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
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                    >
                                      {subDisplayInfo.text}
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
            )}
          </>
        )}

        {/* Header-level access control for Escalated Tasks */}
        {activeTab === "escalated-tasks" &&
          rolePermissions["escalated-tasks-access"] && (
            <div className="flex items-center justify-between bg-blue-50 p-4">
              <div>
                <h3 className="font-bold text-blue-600">
                  Escalated Tasks Access
                </h3>
                <p className="text-sm text-blue-500">
                  Top-level access control
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionDisplayInfo(
                  rolePermissions["escalated-tasks-access"]
                ).bg
                  } ${getPermissionDisplayInfo(
                    rolePermissions["escalated-tasks-access"]
                  ).color
                  }`}
              >
                {
                  getPermissionDisplayInfo(
                    rolePermissions["escalated-tasks-access"]
                  ).text
                }
              </span>
            </div>
          )}

        {/* Parent sections with child permissions (for Tasks and other tabs) */}
        {sections[activeTab].parents &&
          Object.entries(sections[activeTab].parents || {}).map(
            ([parentKey, parent]) => {
              // Don't filter out document-view, only filter out review-management
              // which will be displayed separately
              if (
                activeTab === "review-administration" &&
                (parentKey === "review-management" ||
                  parentKey === "document-view")
              ) {
                return null;
              }

              // Check if we should display this parent section
              const parentPermission = permissions.find(
                (p) => p.id === parentKey
              );
              const parentPermissionLevel =
                parentPermission && rolePermissions[parentKey];

              // Display the parent header with its permission level if applicable
              const childPermissions = permissions.filter(
                (p) =>
                  p.category === activeTab &&
                  p.parent === parentKey &&
                  !p.isSubItem &&
                  rolePermissions[p.id]
              );

              if (childPermissions.length === 0 && !parentPermissionLevel)
                return null;

              return (
                <div key={parentKey} className="border-t-2 border-blue-100">
                  <div className="bg-blue-50 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-blue-600">
                        {parent.title}
                      </h3>
                      <p className="text-sm text-blue-500">
                        {parent.description}
                      </p>
                    </div>
                    {parentPermissionLevel && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionDisplayInfo(parentPermissionLevel).bg
                          } ${getPermissionDisplayInfo(parentPermissionLevel).color
                          }`}
                      >
                        {getPermissionDisplayInfo(parentPermissionLevel).text}
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-blue-100">
                    {childPermissions.map((permission) => {
                      const permissionLevel = rolePermissions[permission.id];
                      const displayInfo =
                        getPermissionDisplayInfo(permissionLevel);
                      const subItems = getSubItems(
                        permission.id,
                        activeTab,
                        parentKey
                      );
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={permission.id}>
                          <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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

                          {/* Sub-items for items in parent sections */}
                          {hasSubItems && (
                            <div className="border-t border-blue-50">
                              <div className="bg-gray-100 p-2 pl-12 text-black">
                                <h4 className="font-medium">Actions</h4>
                              </div>
                              {subItems.map((subItem) => {
                                const subItemLevel =
                                  rolePermissions[subItem.id];
                                if (!subItemLevel) return null;
                                const subDisplayInfo =
                                  getPermissionDisplayInfo(subItemLevel);

                                return (
                                  <div
                                    key={subItem.id}
                                    className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                  >
                                    <div className="flex items-center">
                                      <div className="ml-8 mr-2 text-gray-400">
                                        →
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
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                    >
                                      {subDisplayInfo.text}
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
          )}
      </div>
    </div>
  );
}

// RoleForm Component with Access Control (Category Removed)
function RoleForm({ role, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: role?.id || "",
    name: role?.name || "",
    description: role?.description || "",
    domain: role?.domain || "",
    department: role?.department || "",
    roleName: role?.roleName || "",
    roleDescription: role?.roleDescription || "",
    effectiveDate:
      role?.effectiveDate || new Date().toISOString().split("T")[0],
    permissions: role?.permissions || {},
  });

  const [activeTab, setActiveTab] = useState("document-repository");
  const [expandedItems, setExpandedItems] = useState({
    "in-review": true,
    "approved-view": true,
    upload: true,
    group: true,
    "group-level": true,
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

  // Initialize default permission values if not already set
  const initializeDefaultPermissions = () => {
    const updatedPermissions = { ...formData.permissions };

    permissions.forEach((permission) => {
      if (permission.defaultLevel && !updatedPermissions[permission.id]) {
        updatedPermissions[permission.id] = permission.defaultLevel;
      }
    });

    if (!role) {
      setFormData((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    }
  };

  // Run initialization on component mount
  useState(() => {
    initializeDefaultPermissions();
  }, []);

  // Handle permission level change
  const handlePermissionLevelChange = (permissionId, level) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: level,
      },
    }));
  };

  // Toggle expanded state for an item
  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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

  // Get available permission levels for a permission
  const getAvailableLevels = (permission) => {
    if (permission.allowedLevels) {
      return permission.allowedLevels;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new role, generate a new ID
        const roleToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(roleToSave);
      }

      // Reset form only if it's a new role creation (not editing)
      if (!role) {
        setFormData({
          id: "",
          name: "",
          description: "",
          domain: "",
          department: "",
          roleName: "",
          roleDescription: "",
          effectiveDate: new Date().toISOString().split("T")[0],
          permissions: {},
        });
        initializeDefaultPermissions();
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
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <Card className="border-2 border-gray-200">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Basic Information
              </h2>
              <p className="text-sm text-blue-500">Define the role details</p>
            </div>
            <div className="p-6 space-y-2">
              {/* Domain and Department Row - Now positioned above name fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Domain - takes first name column width */}
                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                    Domain <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => handleSelectChange("domain", value)}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
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
                {/* Department - takes middle name column width */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleSelectChange("department", value)
                    }
                    disabled={!formData.domain}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100">
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
                {/* Empty third column to maintain grid layout */}
                <div></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter role name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Short Name*</Label>
                  <Input
                    id="roleName"
                    name="roleName"
                    placeholder="Enter role title"
                    required
                    value={formData.roleName}
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

          {/* Access Control Section */}
          <div className="border-2 border-gray-200 rounded-lg">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Access Control
              </h2>
              <p className="text-sm text-blue-500">
                Define permissions for this role
              </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200">
              {Object.keys(sections).map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`min-w-[200px] px-6 py-4 text-center font-bold transition-colors border-r border-gray-200 last:border-r-0 ${activeTab === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  onClick={() => setActiveTab(category)}
                >
                  {sections[category].title}
                </button>
              ))}
            </div>

            {/* Tab Content - Fixed height with internal scroll */}
            <div className="divide-y divide-blue-100 h-96 overflow-y-auto">
              {/* Regular permissions (no parent) */}
              {permissions
                .filter(
                  (p) =>
                    p.category === activeTab &&
                    !p.parent &&
                    !p.isSubItem &&
                    p.id !== "review-administration-access" &&
                    p.id !== "escalated-tasks-access" &&
                    p.id !== "review-management" &&
                    p.id !== "document-view"
                )
                .map((permission) => {
                  const permissionLevel =
                    formData.permissions[permission.id] ||
                    permission.defaultLevel ||
                    "no_access";
                  const availableLevels = getAvailableLevels(permission);
                  const subItems = getSubItems(permission.id, activeTab);
                  const hasSubItems = subItems.length > 0;
                  const isExpanded = expandedItems[permission.id] || false;

                  return (
                    <div key={permission.id}>
                      <div
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 ${hasSubItems ? "cursor-pointer" : ""
                          }`}

                      >
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
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={permissionLevel}
                            onValueChange={(value) =>
                              handlePermissionLevelChange(permission.id, value)
                            }
                          >
                            <SelectTrigger
                              className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                permissionLevel
                              )}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLevels.includes("admin_access") && (
                                <SelectItem
                                  value="admin_access"
                                  className="font-medium text-green-600"
                                >
                                  Admin Access
                                </SelectItem>
                              )}
                              {availableLevels.includes("write_access") && (
                                <SelectItem
                                  value="write_access"
                                  className="font-medium text-blue-600"
                                >
                                  Write Access
                                </SelectItem>
                              )}
                              {availableLevels.includes("view_access") && (
                                <SelectItem
                                  value="view_access"
                                  className="font-medium text-purple-600"
                                >
                                  View Access
                                </SelectItem>
                              )}
                              {availableLevels.includes("read_access") && (
                                <SelectItem
                                  value="read_access"
                                  className="font-medium text-amber-600"
                                >
                                  Read Access
                                </SelectItem>
                              )}
                              {availableLevels.includes("no_access") && (
                                <SelectItem
                                  value="no_access"
                                  className="font-medium text-gray-600"
                                >
                                  No Access
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {/* Sub-items */}
                      {hasSubItems && isExpanded && (
                        <div className="border-t border-blue-50">
                          <div className="bg-gray-100 p-2 pl-12 text-black">
                            <h4 className="font-medium">Actions</h4>
                          </div>
                          {subItems.map((subItem) => {
                            const subItemPermissionLevel =
                              formData.permissions[subItem.id] ||
                              subItem.defaultLevel ||
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
                                    →
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
                                    className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                      subItemPermissionLevel
                                    )}`}
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
                                          Admin Access
                                        </SelectItem>
                                      )}
                                    {subItemAvailableLevels.includes(
                                      "write_access"
                                    ) && (
                                        <SelectItem
                                          value="write_access"
                                          className="font-medium text-blue-600"
                                        >
                                          Write Access
                                        </SelectItem>
                                      )}
                                    {subItemAvailableLevels.includes(
                                      "view_access"
                                    ) && (
                                        <SelectItem
                                          value="view_access"
                                          className="font-medium text-purple-600"
                                        >
                                          View Access
                                        </SelectItem>
                                      )}
                                    {subItemAvailableLevels.includes(
                                      "read_access"
                                    ) && (
                                        <SelectItem
                                          value="read_access"
                                          className="font-medium text-amber-600"
                                        >
                                          Read Access
                                        </SelectItem>
                                      )}
                                    {subItemAvailableLevels.includes(
                                      "no_access"
                                    ) && (
                                        <SelectItem
                                          value="no_access"
                                          className="font-medium text-gray-600"
                                        >
                                          No Access
                                        </SelectItem>
                                      )}
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

              {/* Sections that need their own headers */}
              {activeTab === "review-administration" && (
                <>
                  {/* Review Administration Access section with its sub-items */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">
                          Review Administration Access
                        </h3>
                        <p className="text-sm text-blue-500">
                          Top-level access control
                        </p>
                      </div>
                      <Select
                        value={
                          formData.permissions[
                          "review-administration-access"
                          ] || "no_access"
                        }
                        onValueChange={(value) =>
                          handlePermissionLevelChange(
                            "review-administration-access",
                            value
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions[
                            "review-administration-access"
                            ] || "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="admin_access"
                            className="font-medium text-green-600"
                          >
                            Admin Access
                          </SelectItem>
                          <SelectItem
                            value="no_access"
                            className="font-medium text-gray-600"
                          >
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sub-items of Review Administration Access */}
                    <div className="divide-y divide-blue-100">
                      {permissions
                        .filter(
                          (p) =>
                            p.category === activeTab &&
                            p.isSubItem &&
                            p.subItemOf === "review-administration-access"
                        )
                        .map((permission) => {
                          const permissionLevel =
                            formData.permissions[permission.id] || "no_access";
                          const availableLevels =
                            getAvailableLevels(permission);
                          const subItems = getSubItems(
                            permission.id,
                            activeTab
                          );
                          const hasSubItems = subItems.length > 0;
                          const isExpanded =
                            expandedItems[permission.id] || false;

                          return (
                            <div key={permission.id}>
                              <div
                                className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${hasSubItems ? "cursor-pointer" : ""
                                  }`}

                              >
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
                                <div onClick={(e) => e.stopPropagation()}>
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
                                      className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                        permissionLevel
                                      )}`}
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
                                            Admin Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "write_access"
                                      ) && (
                                          <SelectItem
                                            value="write_access"
                                            className="font-medium text-blue-600"
                                          >
                                            Write Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "view_access"
                                      ) && (
                                          <SelectItem
                                            value="view_access"
                                            className="font-medium text-purple-600"
                                          >
                                            View Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "read_access"
                                      ) && (
                                          <SelectItem
                                            value="read_access"
                                            className="font-medium text-amber-600"
                                          >
                                            Read Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "no_access"
                                      ) && (
                                          <SelectItem
                                            value="no_access"
                                            className="font-medium text-gray-600"
                                          >
                                            No Access
                                          </SelectItem>
                                        )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Sub-items (third level) */}
                              {hasSubItems && isExpanded && (
                                <div className="border-t border-blue-50">
                                  <div className="bg-gray-100 p-2 pl-12 text-black">
                                    <h4 className="font-medium">Actions</h4>
                                  </div>
                                  {subItems.map((subItem) => {
                                    const subItemPermissionLevel =
                                      formData.permissions[subItem.id] ||
                                      subItem.defaultLevel ||
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
                                            →
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
                                            className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                              subItemPermissionLevel
                                            )}`}
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
                                                  Admin Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "write_access"
                                            ) && (
                                                <SelectItem
                                                  value="write_access"
                                                  className="font-medium text-blue-600"
                                                >
                                                  Write Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "view_access"
                                            ) && (
                                                <SelectItem
                                                  value="view_access"
                                                  className="font-medium text-purple-600"
                                                >
                                                  View Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "read_access"
                                            ) && (
                                                <SelectItem
                                                  value="read_access"
                                                  className="font-medium text-amber-600"
                                                >
                                                  Read Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "no_access"
                                            ) && (
                                                <SelectItem
                                                  value="no_access"
                                                  className="font-medium text-gray-600"
                                                >
                                                  No Access
                                                </SelectItem>
                                              )}
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

                  {/* Review Management section */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">
                          Review Management
                        </h3>
                        <p className="text-sm text-blue-500">
                          Document review management permissions
                        </p>
                      </div>
                      <Select
                        value={
                          formData.permissions["review-management"] ||
                          "no_access"
                        }
                        onValueChange={(value) =>
                          handlePermissionLevelChange(
                            "review-management",
                            value
                          )
                        }
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions["review-management"] ||
                            "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="admin_access"
                            className="font-medium text-green-600"
                          >
                            Admin Access
                          </SelectItem>
                          <SelectItem
                            value="no_access"
                            className="font-medium text-gray-600"
                          >
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Admin Document Repository View section with its sub-items */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">
                          Admin Document Repository View
                        </h3>
                        <p className="text-sm text-blue-500">
                          Document viewing permissions
                        </p>
                      </div>
                      <Select
                        value={
                          formData.permissions["document-view"] || "no_access"
                        }
                        onValueChange={(value) =>
                          handlePermissionLevelChange("document-view", value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions["document-view"] || "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="admin_access"
                            className="font-medium text-green-600"
                          >
                            Admin Access
                          </SelectItem>
                          <SelectItem
                            value="no_access"
                            className="font-medium text-gray-600"
                          >
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sub-items of Admin Document Repository View */}
                    <div className="divide-y divide-blue-100">
                      {permissions
                        .filter(
                          (p) =>
                            p.category === activeTab &&
                            p.isSubItem &&
                            p.subItemOf === "document-view"
                        )
                        .map((permission) => {
                          const permissionLevel =
                            formData.permissions[permission.id] || "no_access";
                          const availableLevels =
                            getAvailableLevels(permission);
                          const subItems = getSubItems(
                            permission.id,
                            activeTab
                          );
                          const hasSubItems = subItems.length > 0;
                          const isExpanded =
                            expandedItems[permission.id] || false;

                          return (
                            <div key={permission.id}>
                              <div
                                className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${hasSubItems ? "cursor-pointer" : ""
                                  }`}

                              >
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
                                <div onClick={(e) => e.stopPropagation()}>
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
                                      className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                        permissionLevel
                                      )}`}
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
                                            Admin Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "write_access"
                                      ) && (
                                          <SelectItem
                                            value="write_access"
                                            className="font-medium text-blue-600"
                                          >
                                            Write Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "view_access"
                                      ) && (
                                          <SelectItem
                                            value="view_access"
                                            className="font-medium text-purple-600"
                                          >
                                            View Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "read_access"
                                      ) && (
                                          <SelectItem
                                            value="read_access"
                                            className="font-medium text-amber-600"
                                          >
                                            Read Access
                                          </SelectItem>
                                        )}
                                      {availableLevels.includes(
                                        "no_access"
                                      ) && (
                                          <SelectItem
                                            value="no_access"
                                            className="font-medium text-gray-600"
                                          >
                                            No Access
                                          </SelectItem>
                                        )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Sub-items (third level) */}
                              {hasSubItems && isExpanded && (
                                <div className="border-t border-blue-50">
                                  <div className="bg-gray-100 p-2 pl-12 text-black">
                                    <h4 className="font-medium">Actions</h4>
                                  </div>
                                  {subItems.map((subItem) => {
                                    const subItemPermissionLevel =
                                      formData.permissions[subItem.id] ||
                                      subItem.defaultLevel ||
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
                                            →
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
                                            className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                              subItemPermissionLevel
                                            )}`}
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
                                                  Admin Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "write_access"
                                            ) && (
                                                <SelectItem
                                                  value="write_access"
                                                  className="font-medium text-blue-600"
                                                >
                                                  Write Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "view_access"
                                            ) && (
                                                <SelectItem
                                                  value="view_access"
                                                  className="font-medium text-purple-600"
                                                >
                                                  View Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "read_access"
                                            ) && (
                                                <SelectItem
                                                  value="read_access"
                                                  className="font-medium text-amber-600"
                                                >
                                                  Read Access
                                                </SelectItem>
                                              )}
                                            {subItemAvailableLevels.includes(
                                              "no_access"
                                            ) && (
                                                <SelectItem
                                                  value="no_access"
                                                  className="font-medium text-gray-600"
                                                >
                                                  No Access
                                                </SelectItem>
                                              )}
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
                </>
              )}

              {/* Header-level access control for Escalated Tasks */}
              {activeTab === "escalated-tasks" && (
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Escalated Tasks Access
                    </h3>
                    <p className="text-sm text-blue-500">
                      Top-level access control
                    </p>
                  </div>
                  <Select
                    value={
                      formData.permissions["escalated-tasks-access"] ||
                      "no_access"
                    }
                    onValueChange={(value) =>
                      handlePermissionLevelChange(
                        "escalated-tasks-access",
                        value
                      )
                    }
                  >
                    <SelectTrigger
                      className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                        formData.permissions["escalated-tasks-access"] ||
                        "no_access"
                      )}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="admin_access"
                        className="font-medium text-green-600"
                      >
                        Admin Access
                      </SelectItem>
                      <SelectItem
                        value="no_access"
                        className="font-medium text-gray-600"
                      >
                        No Access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Parent sections with child permissions (for Tasks tab) */}
              {sections[activeTab].parents &&
                Object.entries(sections[activeTab].parents || {}).map(
                  ([parentKey, parent]) => {
                    // Skip if we're already handling these as header-level items
                    if (
                      activeTab === "review-administration" &&
                      (parentKey === "review-management" ||
                        parentKey === "document-view")
                    ) {
                      return null;
                    }

                    const childPermissions = permissions.filter(
                      (p) =>
                        p.category === activeTab &&
                        p.parent === parentKey &&
                        !p.isSubItem
                    );
                    if (childPermissions.length === 0) return null;

                    return (
                      <div
                        key={parentKey}
                        className="border-t-2 border-blue-100"
                      >
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
                              formData.permissions[permission.id] ||
                              permission.defaultLevel ||
                              "no_access";
                            const availableLevels =
                              getAvailableLevels(permission);
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
                                  className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${hasSubItems ? "cursor-pointer" : ""
                                    }`}
                                  onClick={
                                    hasSubItems
                                      ? () => toggleExpanded(permission.id)
                                      : undefined
                                  }
                                >
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
                                  <div onClick={(e) => e.stopPropagation()}>
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
                                        className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                          permissionLevel
                                        )}`}
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
                                              Admin Access
                                            </SelectItem>
                                          )}
                                        {availableLevels.includes(
                                          "write_access"
                                        ) && (
                                            <SelectItem
                                              value="write_access"
                                              className="font-medium text-blue-600"
                                            >
                                              Write Access
                                            </SelectItem>
                                          )}
                                        {availableLevels.includes(
                                          "view_access"
                                        ) && (
                                            <SelectItem
                                              value="view_access"
                                              className="font-medium text-purple-600"
                                            >
                                              View Access
                                            </SelectItem>
                                          )}
                                        {availableLevels.includes(
                                          "read_access"
                                        ) && (
                                            <SelectItem
                                              value="read_access"
                                              className="font-medium text-amber-600"
                                            >
                                              Read Access
                                            </SelectItem>
                                          )}
                                        {availableLevels.includes(
                                          "no_access"
                                        ) && (
                                            <SelectItem
                                              value="no_access"
                                              className="font-medium text-gray-600"
                                            >
                                              No Access
                                            </SelectItem>
                                          )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Sub-items for items in parent sections */}
                                {hasSubItems && isExpanded && (
                                  <div className="border-t border-blue-50">
                                    <div className="bg-gray-100 p-2 pl-12 text-black">
                                      <h4 className="font-medium">Actions</h4>
                                    </div>
                                    {subItems.map((subItem) => {
                                      const subItemPermissionLevel =
                                        formData.permissions[subItem.id] ||
                                        subItem.defaultLevel ||
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
                                              →
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
                                              className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                                                subItemPermissionLevel
                                              )}`}
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
                                                    Admin Access
                                                  </SelectItem>
                                                )}
                                              {subItemAvailableLevels.includes(
                                                "write_access"
                                              ) && (
                                                  <SelectItem
                                                    value="write_access"
                                                    className="font-medium text-blue-600"
                                                  >
                                                    Write Access
                                                  </SelectItem>
                                                )}
                                              {subItemAvailableLevels.includes(
                                                "view_access"
                                              ) && (
                                                  <SelectItem
                                                    value="view_access"
                                                    className="font-medium text-purple-600"
                                                  >
                                                    View Access
                                                  </SelectItem>
                                                )}
                                              {subItemAvailableLevels.includes(
                                                "read_access"
                                              ) && (
                                                  <SelectItem
                                                    value="read_access"
                                                    className="font-medium text-amber-600"
                                                  >
                                                    Read Access
                                                  </SelectItem>
                                                )}
                                              {subItemAvailableLevels.includes(
                                                "no_access"
                                              ) && (
                                                  <SelectItem
                                                    value="no_access"
                                                    className="font-medium text-gray-600"
                                                  >
                                                    No Access
                                                  </SelectItem>
                                                )}
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
                    );
                  }
                )}
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
                {role ? "Updating..." : "Creating..."}
              </>
            ) : role ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

// Main Role Management App Component (for integration into existing pages)
function RoleManagementApp({ showAddForm, onToggleForm }) {
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [viewPermissionsRole, setViewPermissionsRole] = useState(null);

  const filteredRoles = roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      role.domain.toLowerCase().includes(searchLower) ||
      role.department.toLowerCase().includes(searchLower) ||
      role.name.toLowerCase().includes(searchLower) ||
      role.roleName.toLowerCase().includes(searchLower) ||
      role.description.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter((role) => role.id !== roleId));
    setOpenPopover(null);
  };

  const handleEditRole = (roleId) => {
    setEditingRole(roleId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveRole = (roleData) => {
    if (roleData.id && roles.find((role) => role.id === roleData.id)) {
      // Editing existing role
      setRoles(
        roles.map((role) => (role.id === roleData.id ? roleData : role))
      );
    } else {
      // Adding new role
      setRoles([...roles, roleData]);
    }
    setEditingRole(null);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  // Get permission level text with color
  const getPermissionDisplayInfo = (level) => {
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
      case "read_access":
        return {
          text: "Read Access",
          color: "text-amber-600",
          bg: "bg-amber-100",
        };
      case "view_access":
        return {
          text: "View Access",
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      case "edit_access":
        return {
          text: "Edit Access",
          color: "text-indigo-600",
          bg: "bg-indigo-100",
        };
      case "no_access":
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-100" };
      default:
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  // Get permission title by ID
  const getPermissionTitle = (permissionId) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.title : permissionId;
  };

  return (
    <div className="space-y-4">
      {showAddForm && (
        <RoleForm onSave={handleSaveRole} onCancel={handleCancelEdit} />
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
                <TableCell colSpan={5} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) =>
                editingRole === role.id ? (
                  <TableRow key={role.id}>
                    <TableCell colSpan={5}>
                      <RoleForm
                        role={role}
                        onSave={handleSaveRole}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{role.name}</div>
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
                        open={viewPermissionsRole === role.id}
                        onOpenChange={(open) =>
                          setViewPermissionsRole(open ? role.id : null)
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
                              Access Controls - {role.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {role.permissions &&
                              Object.keys(role.permissions).length > 0 ? (
                              <AccessControlViewer
                                permissions={role.permissions}
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
                          onClick={() => handleEditRole(role.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === role.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(role.id);
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
                                  onClick={() => handleDeleteRole(role.id)}
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