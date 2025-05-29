import { useState } from "react";
import { Edit, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

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
import { DepartmentForm } from "@/components/department-form";

// Mock initial departments data
const initialDepartments = [
  {
    id: "1",
    name: "Information Technology",
    description: "Manages all IT infrastructure and software development",
  },
  {
    id: "2",
    name: "Human Resources",
    description: "Manages recruitment, employee relations, and benefits",
  },
  {
    id: "3",
    name: "Finance",
    description: "Manages company finances, accounting, and budgeting",
  },
  {
    id: "4",
    name: "Marketing",
    description: "Manages brand, marketing campaigns, and communications",
  },
  {
    id: "5",
    name: "Sales",
    description: "Manages client relationships and sales processes",
  },
  {
    id: "6",
    name: "Research & Development",
    description: "Manages product innovation and development",
  },
  {
    id: "7",
    name: "Customer Support",
    description: "Manages customer inquiries and technical support",
  },
];

export function DepartmentTable() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const columns = [
    {
      key: "name",
      label: "Department Name",
      sortValue: (dept) => dept.name.toLowerCase(),
    },
    {
      key: "description",
      label: "Description",
      sortValue: (dept) => dept.description.toLowerCase(),
    },
  ];



  const sortedAndFilteredDepartments = () => {
    const filtered = departments.filter((dept) => {
      const searchLower = searchTerm.toLowerCase();
      
      return (
        dept.name.toLowerCase().includes(searchLower) ||
        dept.description.toLowerCase().includes(searchLower)
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

  const handleDeleteDepartment = (deptId) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId));
    setOpenPopover(null);
  };

  const handleEditDepartment = (deptId) => {
    setEditingDepartment(deptId);
  };

  const handleSaveDepartment = (updatedDept) => {
    setDepartments(departments.map((dept) => (dept.id === updatedDept.id ? updatedDept : dept)));
    setEditingDepartment(null);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#335aff]">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredDepartments().length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredDepartments().map((dept) =>
                editingDepartment === dept.id ? (
                  <TableRow key={dept.id}>
                    <TableCell colSpan={columns.length + 1}>
                      <DepartmentForm
                        department={dept}
                        onSave={handleSaveDepartment}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dept.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDepartment(dept.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Popover 
                          open={openPopover === dept.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(dept.id);
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
                          <PopoverContent className="w-60 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this department.
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
                                  onClick={() => handleDeleteDepartment(dept.id)}
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