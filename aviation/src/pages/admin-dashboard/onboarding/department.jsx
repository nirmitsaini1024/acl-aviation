import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { DepartmentForm } from "@/components/department-form";
import { DepartmentTable } from "@/components/department-table";

export default function DepartmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin-dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            Onboarding
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-blue-600">Departments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-muted-foreground">
            Create and manage company departments
          </p>
        </div>
        <Button
          className="bg-[#335aff] hover:bg-[#335aff]/80 flex items-center"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Department
        </Button>
      </div>
      {isFormOpen && <DepartmentForm onCancel={() => setIsFormOpen(false)} />}
      <DepartmentTable />
    </div>
  );
}