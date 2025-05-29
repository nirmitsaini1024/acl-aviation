
import { DocumentCategoryForm } from "@/components/document-category-form";
import { DocumentCategoryTable } from "@/components/document-category-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function DocumentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
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
            <BreadcrumbPage className="text-blue-600">Document Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Categories</h1>
          <p className="text-muted-foreground">
            Create and manage document categories
          </p>
        </div>
        <Button
          className="bg-[#335aff] hover:bg-[#335aff]/80 flex items-center"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
          }}
        >
          <Plus />
          Create New Document
        </Button>
      </div>
      {isFormOpen && <DocumentCategoryForm onCancel={() => setIsFormOpen((c) => !c)} />}
      <DocumentCategoryTable />
    </div>
  );
}

