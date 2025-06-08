// Modified grid layout to put date filters on a new line
// Main change: Split the grid into two separate grid sections

import { useState, useEffect, useContext } from "react";
import { DocumentTable } from "@/components/document-table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Tag,
  Layers,
  Search,
  Funnel,
  RefreshCcw,
  LayoutGrid,
  SendToBack,
  Menu,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { documents } from "@/mock-data/doc-center";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AbilityContext } from "@/abilityContext";

// Domain and Department Options
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

const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
};

// Permission level constants
const PERMISSION_LEVELS = {
  NO_ACCESS: 'no_access',
  VIEW_ACCESS: 'view_access',
  WRITE_ACCESS: 'write_access', 
  ADMIN_ACCESS: 'admin_access'
};

export default function DocCenter({setIsBotOpen}) {
  // Get URL search params and navigation
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ability = useContext(AbilityContext);

  // Filter states
  const [documentType, setDocumentType] = useState("all_types");
  const [documentName, setDocumentName] = useState("all_documents");
  const [cct, setCct] = useState("all_cct");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [domain, setDomain] = useState("all_domains");
  const [department, setDepartment] = useState("all_departments");
  const [category, setCategory] = useState("all_categories");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [IsresetFilters, setIsResetFilters] = useState(true);

  // Extract tab from URL params or default to "active"
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam &&
      ["active", "refdoc", "approved", "disapproved"].includes(tabParam)
      ? tabParam
      : "active"
  );

  // Check if user has any access to a resource
  const hasAccess = (permissionLevel) => {
    return permissionLevel && permissionLevel !== PERMISSION_LEVELS.NO_ACCESS;
  };

  // Check specific permission capabilities
  const canView = (permissionLevel) => {
    return [
      PERMISSION_LEVELS.VIEW_ACCESS,
      PERMISSION_LEVELS.WRITE_ACCESS, 
      PERMISSION_LEVELS.ADMIN_ACCESS
    ].includes(permissionLevel);
  };

  const canEdit = (permissionLevel) => {
    return [
      PERMISSION_LEVELS.WRITE_ACCESS,
      PERMISSION_LEVELS.ADMIN_ACCESS
    ].includes(permissionLevel);
  };

  const canManage = (permissionLevel) => {
    return permissionLevel === PERMISSION_LEVELS.ADMIN_ACCESS;
  };

  // Check tab permissions using CASL ability
  const checkTabPermission = (tabName) => {
    const resourceName = `documentRepoAccess.${tabName}`;
    
    const canViewTab = ability?.can('read', resourceName) || false;
    const canManageTab = ability?.can('manage', resourceName) || false;
    
    // Determine permission level based on CASL abilities
    if (!canViewTab && !canManageTab) {
      return PERMISSION_LEVELS.NO_ACCESS;
    } else if (canViewTab && !canManageTab) {
      return PERMISSION_LEVELS.VIEW_ACCESS;
    } else if (canViewTab && canManageTab) {
      // Could be write or admin - check for admin-specific permissions
      const canAdminTab = ability?.can('admin', resourceName) || false;
      return canAdminTab ? PERMISSION_LEVELS.ADMIN_ACCESS : PERMISSION_LEVELS.WRITE_ACCESS;
    }
    
    return PERMISSION_LEVELS.NO_ACCESS;
  };

  // Get permission levels for all tabs
  const inReviewAccess = checkTabPermission('inReview');
  const referenceDocumentAccess = checkTabPermission('referenceDocument');
  const approvedAccess = checkTabPermission('approved');
  const deactivatedAccess = checkTabPermission('deactivated');

  // Generate available tabs based on permissions
  const getAvailableTabs = () => {
    const tabs = [];

    if (canView(inReviewAccess)) {
      tabs.push({
        value: 'active',
        label: 'In Review',
        accessLevel: inReviewAccess
      });
    }

    if (canView(referenceDocumentAccess)) {
      tabs.push({
        value: 'refdoc',
        label: 'Reference Documents',
        accessLevel: referenceDocumentAccess
      });
    }

    if (canView(approvedAccess)) {
      tabs.push({
        value: 'approved',
        label: 'Approved',
        accessLevel: approvedAccess
      });
    }

    if (canView(deactivatedAccess)) {
      tabs.push({
        value: 'disapproved',
        label: 'Deactivated',
        accessLevel: deactivatedAccess
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();
  const defaultTab = availableTabs.length > 0 ? availableTabs[0].value : null;

  const getTabTriggerStyles = (tabValue, accessLevel) => {
    const baseStyles = 'flex-1';
    
    const accessStyles = {
      [PERMISSION_LEVELS.VIEW_ACCESS]: 'opacity-80',
      [PERMISSION_LEVELS.WRITE_ACCESS]: '',
      [PERMISSION_LEVELS.ADMIN_ACCESS]: 'font-semibold'
    };
    
    const colorStyles = {
      'active': 'data-[state=active]:bg-blue-500 data-[state=active]:text-white',
      'approved': 'data-[state=active]:bg-green-600 data-[state=active]:text-white',
      'disapproved': 'data-[state=active]:bg-red-400 data-[state=active]:text-white', 
      'refdoc': 'data-[state=active]:bg-yellow-500 data-[state=active]:text-white'
    };
    
    return `${baseStyles} ${accessStyles[accessLevel] || ''} ${colorStyles[tabValue] || ''}`;
  };

  // Generate permission props for table components
  const generatePermissionProps = (accessLevel) => {
    return {
      accessLevel: accessLevel,
      canView: canView(accessLevel),
      canEdit: canEdit(accessLevel),
      canManage: canEdit(accessLevel), // canManage for compatibility
      isViewOnly: accessLevel === PERMISSION_LEVELS.VIEW_ACCESS,
      hasWriteAccess: accessLevel === PERMISSION_LEVELS.WRITE_ACCESS,
      hasAdminAccess: accessLevel === PERMISSION_LEVELS.ADMIN_ACCESS,
      canAdminister: canManage(accessLevel)
    };
  };

  // Extract unique document types and names for dropdowns
  const documentTypes = [...new Set(documents.map((doc) => doc.type))];

  // Filter document names based on current tab
  const getDocumentNames = () => {
    if (activeTab === "refdoc") {
      // Only show reference documents
      return [...new Set(documents.filter(doc => doc.type === "Reference").map((doc) => doc.name))];
    }
    // For all other tabs, show all documents
    return [...new Set(documents.map((doc) => doc.name))];
  };

  const documentNames = getDocumentNames();

  // CCT categories
  const cctCategories = [
    "Airline Defense Maintenance",
    "Airport Safety and Compliance",
  ];

  // Get available departments based on selected domain
  const availableDepartments =
    domain && domain !== "all_domains"
      ? departmentOptions[domain] || []
      : [...Object.values(departmentOptions).flat()];

  // Get available categories based on selected domain
  const availableCategories =
    domain && domain !== "all_domains"
      ? categoryOptions[domain] || []
      : [...Object.values(categoryOptions).flat()];

  // Check for tab parameter in URL when component mounts or URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["active", "refdoc", "approved", "disapproved"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Reset document name when switching to/from reference documents tab
    setDocumentName("all_documents");
    
    // Create a new URLSearchParams object based on current params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);

    // Update the URL without reloading the page
    navigate(
      {
        pathname: location.pathname,
        search: newParams.toString(),
      },
      { replace: true }
    );
  };

  // Reset dependent filters when domain changes
  useEffect(() => {
    if (domain && domain !== "all_domains") {
      // Reset department if current selection doesn't belong to the selected domain
      if (
        department !== "all_departments" &&
        !departmentOptions[domain].includes(department)
      ) {
        setDepartment("all_departments");
      }

      // Reset category if current selection doesn't belong to the selected domain
      if (
        category !== "all_categories" &&
        !categoryOptions[domain].includes(category)
      ) {
        setCategory("all_categories");
      }
    }
  }, [domain, department, category]);

  // Function to apply filters
  const applyFilters = () => {
    setAppliedFilters({
      documentType: documentType !== "all_types" ? documentType : null,
      documentName: documentName !== "all_documents" ? documentName : null,
      cct: cct !== "all_cct" ? cct : null,
      domain: domain !== "all_domains" ? domain : null,
      department: department !== "all_departments" ? department : null,
      category: category !== "all_categories" ? category : null,
      dateFrom,
      dateTo,
    });
    setIsResetFilters(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setDocumentType("all_types");
    setDocumentName("all_documents");
    if (activeTab !== "refdoc") {
      setCct("all_cct");
    }
    setDomain("all_domains");
    setDepartment("all_departments");
    setCategory("all_categories");
    setDateFrom(null);
    setDateTo(null);
    setAppliedFilters({});
    setIsResetFilters(true);
  };

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== PERMISSION DEBUG ===');
    console.log('CASL Ability:', ability);
    console.log('Tab Access Levels:', {
      inReview: inReviewAccess,
      referenceDocument: referenceDocumentAccess,
      approved: approvedAccess,
      deactivated: deactivatedAccess
    });
    console.log('Available Tabs:', availableTabs);
  }

  return (
    <div className="space-y-6">
      {/* Filter Dropdowns */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Document Repositories</h3>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 shadow-sm p-6 mb-8">
        {/* First row of filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full mb-4">
          {/* Domain Filter */}
          <div className="space-y-2 lg:col-span-2">
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-blue-700"
            >
              Document Owner
            </label>
            <div className="w-full">
              <Select
                id="domain"
                value={domain}
                onValueChange={(value) => {
                  setDomain(value);
                  // Reset dependent filters handled in useEffect
                }}
              >
                <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                  <div className="flex items-center">
                    <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Domain" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_domains">All Domains</SelectItem>
                  {domains.map((dom) => (
                    <SelectItem key={dom} value={dom}>
                      {dom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department Filter - dependent on domain */}
          <div className="space-y-2 lg:col-span-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-blue-700"
            >
              Department
            </label>
            <div className="w-full">
              <Select
                id="department"
                value={department}
                onValueChange={setDepartment}
              >
                <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                  <div className="flex items-center">
                      <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_departments">
                    All Departments
                  </SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filter - dependent on domain */}
          <div className="space-y-2 lg:col-span-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-blue-700"
            >
              Document Category
            </label>
            <div className="w-full">
              <Select
                id="category"
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_categories">
                    All Categories
                  </SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Name Filter */}
          <div className="space-y-2 lg:col-span-3">
            <label
              htmlFor="document-name"
              className="block text-sm font-medium text-blue-700"
            >
              {activeTab === "refdoc" ? "Reference Document Name" : "Document Name"}
            </label>
            <div className="w-full">
              <Select
                id="document-name"
                value={documentName}
                onValueChange={setDocumentName}
              >
                <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={activeTab === "refdoc" ? "Reference Document Name" : "Document Name"} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_documents">
                    {activeTab === "refdoc" ? "All Reference Documents" : "All Documents"}
                  </SelectItem>
                  {documentNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Layout based on activeTab */}
          {activeTab === "refdoc" ? (
            // Layout for Reference Documents tab - Date filters and Actions in first row
            <>
              {/* Date Filters - Compact side by side with individual labels */}
              <div className="space-y-2 lg:col-span-3">
                <div className="flex gap-2 w-full">
                  {/* Date From */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Date From
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                        >
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {dateFrom ? format(dateFrom, "dd/MM/yy") : "Select date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Date To */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Date To
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                        >
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {dateTo ? format(dateTo, "dd/MM/yy") : "Select date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Layout for other tabs - CCT Filter
            <div className="space-y-2 lg:col-span-3">
              <label
                htmlFor="cct-category"
                className="block text-sm font-medium text-blue-700"
              >
                Change Control Title
              </label>
              <div className="w-full">
                <Select id="cct-category" value={cct} onValueChange={setCct}>
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center truncate">
                      <SendToBack className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <SelectValue
                        className="truncate"
                        placeholder="CCT Category"
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_cct">
                      All Change Control Title
                    </SelectItem>
                    {cctCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Second row - conditional based on activeTab */}
        {activeTab !== "refdoc" ? (
          // For non-refdoc tabs: Date filters and Actions
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full">
            {/* Date From Filter */}
            <div className="space-y-2 lg:col-span-2">
              <label
                htmlFor="date-from"
                className="block text-sm font-medium text-blue-700"
              >
                Date From
              </label>
              <div className="w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-from"
                      variant="outline"
                      className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date To Filter */}
            <div className="space-y-2 lg:col-span-2">
              <label
                htmlFor="date-to"
                className="block text-sm font-medium text-blue-700"
              >
                Date To
              </label>
              <div className="w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-to"
                      variant="outline"
                      className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {dateTo ? format(dateTo, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Search Button */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium text-blue-700">
                Actions
              </label>
              <div className="flex gap-1">
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={applyFilters}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={resetFilters}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Empty columns to balance the layout */}
            <div className="lg:col-span-6"></div>
          </div>
        ) : (
          // For refdoc tab: Only Actions (since dates are already in first row)
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full">
            {/* Search Button */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium text-blue-700">
                Actions
              </label>
              <div className="flex gap-1">
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={applyFilters}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button
                  className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={resetFilters}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Empty columns to balance the layout */}
            <div className="lg:col-span-10"></div>
          </div>
        )}
        </div>
      </div>

      {/* Document Status Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {availableTabs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No document access permissions available.</p>
          </div>
        ) : (
        <Tabs
            defaultValue={defaultTab}
          className="w-full duration-300 transition-all ease-in-out"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-4 bg-blue-50 w-full">
              {availableTabs.map((tab) => (
            <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={getTabTriggerStyles(tab.value, tab.accessLevel)}
            >
                  {tab.label}
            </TabsTrigger>
              ))}
          </TabsList>

          {/* In Review Tab */}
            {canView(inReviewAccess) && (
          <TabsContent value="active">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="active"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
                  {...generatePermissionProps(inReviewAccess)}
            />
          </TabsContent>
            )}

          {/* Reference Documents Tab */}
            {canView(referenceDocumentAccess) && (
          <TabsContent value="refdoc">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="refdoc"
              IsresetFilters={true}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
                  {...generatePermissionProps(referenceDocumentAccess)}
            />
          </TabsContent>
            )}

          {/* Approved Tab */}
            {canView(approvedAccess) && (
          <TabsContent value="approved">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="approved"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
                  {...generatePermissionProps(approvedAccess)}
            />
          </TabsContent>
            )}

          {/* Deactivated Tab */}
            {canView(deactivatedAccess) && (
          <TabsContent value="disapproved">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="disapproved"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
                  {...generatePermissionProps(deactivatedAccess)}
            />
          </TabsContent>
            )}
        </Tabs>
        )}
      </div>
    </div>
  );
}
