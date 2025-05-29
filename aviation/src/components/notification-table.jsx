import { useState } from "react";
import { Edit, Trash2, Search, ChevronUp, ChevronDown, Bell } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { NotificationForm } from "@/components/notification-form";

// Sample notification data
const initialNotifications = [
  {
    id: "1",
    documentCategory: "Financial Reports",
    role: "Finance Officer",
    cadence: "daily",
    specificTime: "09:00",
  },
  {
    id: "2",
    documentCategory: "HR Documents",
    role: "HR Specialist",
    cadence: "weekly",
    specificTime: "10:30",
  },
  {
    id: "3",
    documentCategory: "Compliance Updates",
    role: "Administrator",
    cadence: "monthly",
    specificTime: "08:00",
  },
  {
    id: "4",
    documentCategory: "Project Plans",
    role: "Manager",
    cadence: "weekly",
    specificTime: "14:00",
  },
  {
    id: "5",
    documentCategory: "Policy Changes",
    role: "Employee",
    cadence: "monthly",
    specificTime: "11:00",
  },
];

export function NotificationTable() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNotification, setEditingNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const columns = [
    {
      key: "documentCategory",
      label: "Document Category",
      sortValue: (notification) => notification.documentCategory.toLowerCase(),
    },
    {
      key: "role",
      label: "Role",
      sortValue: (notification) => notification.role.toLowerCase(),
    },
    {
      key: "cadence",
      label: "Cadence",
      sortValue: (notification) => notification.cadence.toLowerCase(),
    },
    {
      key: "specificTime",
      label: "Time",
      sortValue: (notification) => notification.specificTime,
    },
  ];

  const sortedAndFilteredNotifications = () => {
    const filtered = notifications.filter((notification) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.documentCategory.toLowerCase().includes(searchLower) ||
        notification.role.toLowerCase().includes(searchLower) ||
        notification.cadence.toLowerCase().includes(searchLower)
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
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

  const getCadenceBadge = (cadence) => {
    const variants = {
      daily: "bg-green-100 text-green-800 hover:bg-green-100",
      weekly: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      monthly: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    };
    
    return (
      <Badge className={variants[cadence] || "bg-gray-100 text-gray-800"} variant="outline">
        {cadence.charAt(0).toUpperCase() + cadence.slice(1)}
      </Badge>
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId));
    setOpenPopover(null);
  };

  const handleEditNotification = (notificationId) => {
    setEditingNotification(notificationId);
  };

  const handleSaveNotification = (updatedNotification) => {
    if (updatedNotification.id) {
      // Edit existing notification
      setNotifications(notifications.map((notification) => 
        notification.id === updatedNotification.id ? updatedNotification : notification
      ));
    } else {
      // Add new notification
      const newNotification = {
        ...updatedNotification,
        id: String(notifications.length + 1)
      };
      setNotifications([...notifications, newNotification]);
    }
    setEditingNotification(null);
  };

  const handleCancelEdit = () => {
    setEditingNotification(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#335aff]">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer"
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
            {sortedAndFilteredNotifications().length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No notifications found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredNotifications().map((notification) =>
                editingNotification === notification.id ? (
                  <TableRow key={notification.id}>
                    <TableCell colSpan={5}>
                      <NotificationForm
                        notification={notification}
                        onSave={handleSaveNotification}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        {notification.documentCategory}
                      </div>
                    </TableCell>
                    <TableCell>{notification.role}</TableCell>
                    <TableCell>
                      {getCadenceBadge(notification.cadence)}
                    </TableCell>
                    <TableCell>{notification.specificTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditNotification(notification.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Popover open={openPopover === notification.id} onOpenChange={(open) => {
                          if (open) {
                            setOpenPopover(notification.id);
                          } else {
                            setOpenPopover(null);
                          }
                        }}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-4 mr-4" side="bottom" >
                            <div className="space-y-4">
                              <div className="">
                              <h4 className="font-medium">Are you sure?</h4>
                              <p className="text-sm text-muted-foreground">
                                This will permanently delete this notification setting.
                              </p></div>
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
                                  onClick={() => handleDeleteNotification(notification.id)}
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