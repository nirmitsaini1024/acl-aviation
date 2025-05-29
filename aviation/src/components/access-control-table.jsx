import { useState, useMemo } from "react";
import { 
  Check, 
  X, 
  Save, 
  Loader2, 
  Search, 
  ShieldAlert, 
  Code, 
  HelpCircle, 
  UserCog, 
  User, 
  BarChart, 
  DollarSign, 
  Megaphone, 
  Presentation, 
  Briefcase, 
  ClipboardList 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// All roles in a flat array without department association
const allRoles = [
  { id: "1", name: "Administrator", icon: "ShieldAlert", color: "red" },
  { id: "2", name: "Developer", icon: "Code", color: "blue" },
  { id: "3", name: "Support", icon: "HelpCircle", color: "purple" },
  { id: "4", name: "HR Manager", icon: "UserCog", color: "green" },
  { id: "5", name: "HR Specialist", icon: "User", color: "emerald" },
  { id: "6", name: "Finance Manager", icon: "BarChart", color: "amber" },
  { id: "7", name: "Finance Analyst", icon: "DollarSign", color: "yellow" },
  { id: "8", name: "Marketing Manager", icon: "Megaphone", color: "orange" },
  { id: "9", name: "Marketing Specialist", icon: "Presentation", color: "rose" },
  { id: "10", name: "Operations Manager", icon: "Briefcase", color: "indigo" },
  { id: "11", name: "Operations Analyst", icon: "ClipboardList", color: "sky" },
];

// Mock data for access control matrix
const initialAccessMatrix = {
  Administrator: {
    "Page 1": "RW",
    "Page 2": "R",
    "Page 3": "RW",
    "Page 4": "W",
  },
  Developer: {
    "Page 1": "R",
    "Page 2": "W",
    "Page 3": "R",
    "Page 4": "R",
  },
  "HR Manager": {
    "Page 1": "RW",
    "Page 2": "R",
    "Page 3": "RW",
    "Page 4": "W",
  },
  "Finance Manager": {
    "Page 1": "R",
    "Page 2": "W",
    "Page 3": "R",
    "Page 4": "R",
  },
};

const pages = ["Page 1", "Page 2", "Page 3", "Page 4"];

// Updated access types for display in dropdown
const accessTypes = [
  { value: "None", label: "None" },
  { value: "R", label: "Read" },
  { value: "W", label: "Write" },
  { value: "RW", label: "Read & Write" },
];

export function AccessControlTable() {
  const [accessMatrix, setAccessMatrix] = useState(initialAccessMatrix);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter roles based on search query
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return allRoles;

    const query = searchQuery.toLowerCase();
    return allRoles.filter((role) => role.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleAccessChange = (role, page, access) => {
    setAccessMatrix((prev) => {
      const updatedMatrix = { ...prev };
      if (!updatedMatrix[role]) {
        updatedMatrix[role] = {};
      }
      updatedMatrix[role] = { ...updatedMatrix[role], [page]: access };
      return updatedMatrix;
    });
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    // Simulate API call
    try {
      // In a real application, you would make an API call to save the access matrix
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasChanges(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessIcon = (access) => {
    if (access === "R" || access === "RW") {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getWriteAccessIcon = (access) => {
    if (access === "W" || access === "RW") {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <X className="h-4 w-4 text-red-500" />;
  };

  // Function to render the appropriate icon based on role
  const getRoleIcon = (iconName) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="h-3.5 w-3.5" />;
      case "Code":
        return <Code className="h-3.5 w-3.5" />;
      case "HelpCircle":
        return <HelpCircle className="h-3.5 w-3.5" />;
      case "UserCog":
        return <UserCog className="h-3.5 w-3.5" />;
      case "User":
        return <User className="h-3.5 w-3.5" />;
      case "BarChart":
        return <BarChart className="h-3.5 w-3.5" />;
      case "DollarSign":
        return <DollarSign className="h-3.5 w-3.5" />;
      case "Megaphone":
        return <Megaphone className="h-3.5 w-3.5" />;
      case "Presentation":
        return <Presentation className="h-3.5 w-3.5" />;
      case "Briefcase":
        return <Briefcase className="h-3.5 w-3.5" />;
      case "ClipboardList":
        return <ClipboardList className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Function to get badge color class based on role color
  const getBadgeColorClass = (color) => {
    switch (color) {
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "purple":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "emerald":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "rose":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "indigo":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "sky":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center w-full justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {hasChanges && (
              <div className="flex justify-between">
                <Button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-blue-600 bg-blue-600">
                  <TableHead className="w-[200px] text-white">Role</TableHead>
                  {pages.map((page) => (
                    <TableHead key={page} className="text-center text-white">
                      {page}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={pages.length + 1}
                      className="text-center"
                    >
                      No roles found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Badge 
                          className={`flex items-center gap-1.5 px-2 py-1 border ${getBadgeColorClass(role.color)}`}
                        >
                          {getRoleIcon(role.icon)}
                          <span>{role.name}</span>
                        </Badge>
                      </TableCell>
                      {pages.map((page) => {
                        const access =
                          accessMatrix[role.name]?.[page] || "None";
                        return (
                          <TableCell key={page} className="text-center">
                            <Select
                              value={access}
                              onValueChange={(value) =>
                                handleAccessChange(role.name, page, value)
                              }
                            >
                              <SelectTrigger className="w-[120px] mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {accessTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex justify-center mt-2 gap-4">
                              <div className="flex items-center">
                                <span className="text-xs mr-1">R:</span>
                                {getAccessIcon(access)}
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs mr-1">W:</span>
                                {getWriteAccessIcon(access)}
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}