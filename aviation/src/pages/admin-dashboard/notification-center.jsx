import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationForm } from "@/components/notification-form";
import { NotificationTable } from "@/components/notification-table";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";

export default function NotificationCenterPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* shadcn Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin-dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-blue-600">Notification Center</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="text-muted-foreground">
            Configure document notification settings for different roles
          </p>
        </div>
        <Button
          className="bg-[#335aff] hover:bg-[#335aff]/80 flex items-center"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Notification
        </Button>
      </div>
      {isFormOpen && <NotificationForm onCancel={() => setIsFormOpen((c) => !c)} />}
      <NotificationTable />
    </div>
  );
}