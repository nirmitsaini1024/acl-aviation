import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  UserPlus,
  FileText,
  Shield,
  Settings,
  UserCog,
  Lock,
  PanelLeft,
  FileSignature,
  File,
  Mail,
  Plane,
  Bell,
  ClipboardCheck,
  GitBranch,
  CheckSquare,
  Link2,
  FileCheck,
  User,
  Building,
  ListTodo,
  FileStack,
  TriangleAlert,
  FolderKanban,
  UserPen,
  NotebookPen,
  FileDiff,
  LayoutDashboard,
  User2,
  FolderPlus,
  UserRoundPen,
  BriefcaseBusiness,
  ClockAlert,
  Wrench,
  BookOpenCheck,
  SquareKanban,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Sidebar({ collapsed, setCollapsed, user }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [openMenus, setOpenMenus] = useState({
    "aviation-dashboard": false,
    admin: false,
    onboarding: false,
    "access-control": false,
    tools: false,
  });

  // Toggle submenu open/closed state
  const toggleSubmenu = (key) => {
    if (collapsed) {
      setCollapsed(false);
      // Wait for expand animation to complete before opening submenu
      setTimeout(() => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
      }, 300);
    } else {
      setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Define menu structure with submenus
  const mainMenuItems = [
    {
      name: "Micky Mouse Doc Home",
      key: "aviation-dashboard",
      icon: <Plane className="h-5 w-5" />,
      type: "group",
      items: [
        {
          name: "Review Administration",
          path: "/doc-review-management-center",
          icon: <NotebookPen className="h-5 w-5" />,
          type: "single",
        },
        {
          name: "Document Repositories",
          path: "/doc-center",
          icon: <BriefcaseBusiness className="h-5 w-5" />,
          type: "single",
        },
        {
          name: "Review Board",
          key: "review-board",
          icon: <SquareKanban className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "My Review Tasks",
              path: "/navigate-document",
              icon: <ListTodo className="h-5 w-5" />,
              type: "single",
            },
            {
              name: "Escalated Task",
              path: "/escalation-center",
              icon: <ClockAlert className="h-5 w-5" />,
              type: "single",
            },
          ],
        },
        {
          name: "My Actions",
          path: "/my-activities",
          icon: <UserRoundPen className="h-5 w-5" />,
          type: "single",
        },
        {
          name: "My Profile",
          path: "/personal-page",
          icon: <UserCog className="h-5 w-5" />,
          type: "single",
        },

        {
          name: "Smart Tools",
          key: "my-utility",
          icon: <Wrench className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "DocComparison Studio",
              path: "/doc-diff-center",
              icon: <BookOpenCheck className="h-5 w-5" />,
              type: "single",
            },
          ],
        },
      ],
    },
  ];

  const adminMenuItems = [
    {
      name: "System Admin",
      key: "admin",
      icon: <Shield className="h-5 w-5" />,
      type: "group",
      items: [
        {
          name: "Admin Dashboard",
          path: "/admin-dashboard",
          icon: <PanelLeft className="h-5 w-5" />,
          type: "single",
        },
        {
          name: "Onboarding",
          key: "onboarding",
          icon: <Users className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "User Management",
              path: "/admin-dashboard/users",
              icon: <User className="h-5 w-5" />,
            },
            {
              name: "Role Management",
              path: "/admin-dashboard/roles",
              icon: <UserCog className="h-5 w-5" />,
            },
            {
              name: "Group Management",
              path: "/admin-dashboard/groups",
              icon: <Users className="h-5 w-5" />,
            },
            {
              name: "Departments",
              path: "/admin-dashboard/departments",
              icon: <Building className="h-5 w-5" />,
            },
            {
              name: "Document Categories",
              path: "/admin-dashboard/documents",
              icon: <FileText className="h-5 w-5" />,
              type: "single",
            },
          ],
        },
        {
          name: "Access Control",
          key: "access-control",
          icon: <Lock className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "Role Assignment",
              path: "/admin-dashboard/assign-user",
              icon: <UserCog className="h-5 w-5" />,
            },
            {
              name: "Docs Assignment",
              path: "/admin-dashboard/assign-docs",
              icon: <FileCheck className="h-5 w-5" />,
            },
            {
              name: "Access Page",
              path: "/admin-dashboard/access-page",
              icon: <Lock className="h-5 w-5" />,
            },
          ],
        },
        {
          name: "Integration Center",
          key: "tools",
          icon: <Settings className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "Email",
              path: "/admin-dashboard/tools/email",
              icon: <Mail className="h-5 w-5" />,
            },
            {
              name: "Office 365",
              path: "/admin-dashboard/tools/office365",
              icon: <File className="h-5 w-5" />,
            },
            {
              name: " E-signature",
              path: "/admin-dashboard/tools/docusign",
              icon: <FileSignature className="h-5 w-5" />,
            },
          ],
        },
        {
          name: "Approval Center",
          key: "approval-center",
          icon: <CheckSquare className="h-5 w-5" />,
          type: "group",
          items: [
            {
              name: "Orchestration",
              path: "/admin-dashboard/approval-center/orchestration",
              icon: <GitBranch className="h-5 w-5" />,
            },
            {
              name: "Approval view",
              path: "/admin-dashboard/tools/office365",
              icon: <ClipboardCheck className="h-5 w-5" />,
            },
          ],
        },
        {
          name: "Configure Page",
          path: "/admin-dashboard/configure-page",
          icon: <Link2 className="h-5 w-5" />,
          type: "single",
        },
        {
          name: "Notification center",
          path: "/admin-dashboard/notification-center",
          icon: <Bell className="h-5 w-5" />,
          type: "single",
        },
      ],
    },
  ];

  // Combine menu items based on admin prop
  const menuStructure =
    user?.role === "admin" || user?.email === "admin@gmail.com"
      ? [...mainMenuItems, ...adminMenuItems]
      : [...mainMenuItems];

  // Check if the current path is active or has active children
  const isActive = (item) => {
    if (item.type === "single") {
      return pathname === item.path;
    }

    if (item.type === "group" && item.items) {
      return item.items.some((subItem) => {
        if (subItem.type === "single") {
          return pathname === subItem.path;
        }

        if (subItem.type === "group") {
          return isActive(subItem);
        }

        // Only do exact path matching, not partial
        return pathname === subItem.path;
      });
    }

    return false;
  };

  // Auto-expand menus that contain the active page
  useEffect(() => {
    const newOpenMenus = { ...openMenus };

    // Function to check if a menu contains the current path
    const checkAndOpenParentMenus = (items, parentKeys = []) => {
      items.forEach((item) => {
        if (item.type === "group" && item.items) {
          const containsActivePage = item.items.some((subItem) => {
            if (subItem.type === "single") {
              return pathname === subItem.path;
            }
            if (subItem.type === "group") {
              return subItem.items.some(
                (nestedItem) =>
                  nestedItem.path === pathname ||
                  pathname.includes(nestedItem.path)
              );
            }
            return pathname === subItem.path;
          });

          if (containsActivePage) {
            newOpenMenus[item.key] = true;
            parentKeys.forEach((key) => {
              newOpenMenus[key] = true;
            });
          }

          if (item.items) {
            checkAndOpenParentMenus(item.items, [...parentKeys, item.key]);
          }
        }
      });
    };

    checkAndOpenParentMenus(menuStructure);
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  // Render a menu item (either a link or submenu parent)
  const renderMenuItem = (item, level = 0) => {
    // For single menu items (direct links)
    if (item.type === "single") {
      return (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#335aff]/80 hover:text-white",
            pathname === item.path ? "bg-[#335aff] text-white" : "transparent",
            collapsed ? "justify-center px-0" : ""
          )}
        >
          {item.icon}
          {!collapsed && <span className="ml-3">{item.name}</span>}
        </Link>
      );
    }

    // For menu groups with submenus
    if (item.type === "group") {
      const isMenuActive = isActive(item);
      const isMenuOpen = openMenus[item.key];

      return (
        <div key={item.key}>
          <button
            onClick={() => toggleSubmenu(item.key)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#335aff]/80 hover:text-white",
              isMenuActive ? "text-[#335aff] font-semibold" : "transparent",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </span>
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isMenuOpen ? "rotate-180" : ""
                )}
              />
            )}
          </button>

          {/* Submenu items */}
          {!collapsed && isMenuOpen && (
            <div
              className={cn("mt-1 space-y-1", level === 0 ? "ml-6" : "ml-4")}
            >
              {item.items.map((subItem) => {
                // If this is a nested submenu
                if (subItem.type === "group") {
                  return renderMenuItem(subItem, level + 1);
                }

                // If this is a link
                const isSubItemActive = pathname === subItem.path;
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#335aff]/80 hover:text-white",
                      isSubItemActive
                        ? "bg-[#335aff] text-white"
                        : "transparent"
                    )}
                  >
                    {subItem.icon}
                    <span className="ml-3">{subItem.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`flex h-screen flex-col border-r bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-screen md:w-72"
      }`}
    >
      <div className="flex h-14 items-center border-b px-3">
        {!collapsed && (
          <div className="hidden gap-2 md:flex items-center ml-6">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.profilePic || "/profile.avif "} // Replace with actual path or URL
              alt="User Avatar"
            />
            <div className="flex flex-col">
              <Link to="/landing-page" className="font-semibold">
                {user?.name ? user?.name : "John Doe"}
              </Link>
              <p className="text-xs text-gray-800">Airport Security Coordinator</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={collapsed ? "ml-0" : "ml-auto"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {menuStructure.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
}
