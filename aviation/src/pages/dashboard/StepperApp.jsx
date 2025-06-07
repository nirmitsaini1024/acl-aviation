import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentSignature from "../../components/review-administration/sections/document-review-signature";
import UploadAndTableSection from "../../components/review-administration/sections/uploadSection";
import ReviewRelated from "@/pages/dashboard/review-related-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Stepper from "../../components/review-administration/Stepper";
import { DocumentProvider } from "@/components/review-administration/contexts/DocumentContext";
import DocumentReviewTable from "@/components/review-administration/documentreviewtable";
import DocumentApprovedTable from "@/components/review-administration/documentapprovedtable";
import DeactivatedDocumentsTable from "@/components/review-administration/documentrejectedtable";
import { CircleArrowLeft } from "lucide-react";
import { AbilityContext } from "@/abilityContext";

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

function StepperApp({ setIsBotOpen }) {
  const [activeStep, setActiveStep] = useState(3);
  const [showUploadSection, setShowUploadSection] = useState(false);

  const ability = useContext(AbilityContext);

  const steps = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Review Management" },
    { number: 3, title: "Start Review Process" },
  ];

  const handleStepClick = (index) => {
    if (index === 0 && activeStep === 0) {
      showUploadSection === true ? setActiveStep(3) : setActiveStep(0);
      setShowUploadSection(!showUploadSection);
    } else {
      setActiveStep(index);
      setShowUploadSection(index === 0);
    }
  };

  useEffect(() => {
    setShowUploadSection(false);
  }, []);

  const handleDocumentStore = () => {
    setActiveStep(3);
    setShowUploadSection(false);
  };

  // Basic permission checks
  const canReadReviewManagement = ability.can('read', 'reviewAdministration.reviewManagement');


  // Permission level constants
  const PERMISSION_LEVELS = {
    NO_ACCESS: 'no_access',
    VIEW_ACCESS: 'view_access',
    WRITE_ACCESS: 'write_access', 
    ADMIN_ACCESS: 'admin_access'
  };

  // Extract permission level from various formats
  const getPermissionLevel = (permissionValue) => {
    if (!permissionValue) return PERMISSION_LEVELS.NO_ACCESS;
    
    if (typeof permissionValue === 'string') {
      return permissionValue;
    }
    
    if (typeof permissionValue === 'object' && permissionValue.permission) {
      return permissionValue.permission;
    }
    
    return PERMISSION_LEVELS.NO_ACCESS;
  };

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

  // Individual permission checks using CASL ability
  const checkTabPermission = (tabName) => {
    const resourceName = `reviewAdministration.adminDocumentRepositoryView.${tabName}`;
    
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

  // Check approved document action permissions
  const checkActionPermission = (actionName) => {
    const resourceName = `reviewAdministration.adminDocumentRepositoryView.approved.${actionName}`;
    
    const canViewAction = ability?.can('read', resourceName) || false;
    const canManageAction = ability?.can('manage', resourceName) || false;
    
    if (!canViewAction && !canManageAction) {
      return PERMISSION_LEVELS.NO_ACCESS;
    } else if (canViewAction && !canManageAction) {
      return PERMISSION_LEVELS.VIEW_ACCESS;
    } else if (canViewAction && canManageAction) {
      return PERMISSION_LEVELS.WRITE_ACCESS;
    }
    
    return PERMISSION_LEVELS.NO_ACCESS;
  };

  // Get permission levels for all tabs
  const pendingAccess = checkTabPermission('pending');
  const approvedAccess = checkTabPermission('approved');
  const deactivatedAccess = checkTabPermission('deactivated');
  const referenceDocumentsAccess = checkTabPermission('referenceDocuments');

  // Get permission levels for approved document actions
  const finalCopyAccess = checkActionPermission('finalCopy');
  const summaryAccess = checkActionPermission('summary');
  const annotatedDocsAccess = checkActionPermission('annotatedDocs');

  // Generate available tabs based on permissions
  const getAvailableTabs = () => {
    const tabs = [];

    if (canView(pendingAccess)) {
      tabs.push({
        value: 'pending',
        label: 'Pending',
        accessLevel: pendingAccess
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

    if (canView(referenceDocumentsAccess)) {
      tabs.push({
        value: 'refdoc',
        label: 'Reference Documents',
        accessLevel: referenceDocumentsAccess
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
      'pending': 'data-[state=active]:bg-blue-500 data-[state=active]:text-white',
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

  // Main render function
  const renderTabsWithPermissions = () => {
    if (availableTabs.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No document access permissions available.</p>
        </div>
      );
    }

    return (
      <Tabs defaultValue={defaultTab} className="w-full">
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

        {/* Pending Tab */}
        {canView(pendingAccess) && (
          <TabsContent value="pending">
            <DocumentReviewTable
              setActiveStep={setActiveStep}
              status="pending"
              setIsBotOpen={setIsBotOpen}
              {...generatePermissionProps(pendingAccess)}
            />
          </TabsContent>
        )}

        {/* Approved Tab */}
        {canView(approvedAccess) && (
          <TabsContent value="approved">
            <DocumentApprovedTable
              setIsBotOpen={setIsBotOpen}
              {...generatePermissionProps(approvedAccess)}
              actionPermissions={{
                finalCopy: generatePermissionProps(finalCopyAccess),
                summary: generatePermissionProps(summaryAccess),
                annotatedDocs: generatePermissionProps(annotatedDocsAccess)
              }}
            />
          </TabsContent>
        )}

        {/* Deactivated Tab */}
        {canView(deactivatedAccess) && (
          <TabsContent value="disapproved">
            <DeactivatedDocumentsTable
              {...generatePermissionProps(deactivatedAccess)}
            />
          </TabsContent>
        )}

        {/* Reference Documents Tab */}
        {canView(referenceDocumentsAccess) && (
          <TabsContent value="refdoc">
            <DocumentReviewTable
              setActiveStep={setActiveStep}
              status="reference"
              setIsBotOpen={setIsBotOpen}
              {...generatePermissionProps(referenceDocumentsAccess)}
            />
          </TabsContent>
        )}
      </Tabs>
    );
  };

  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== PERMISSION DEBUG ===');
    console.log('CASL Ability:', ability);
    console.log('Tab Access Levels:', {
      pending: pendingAccess,
      approved: approvedAccess,
      deactivated: deactivatedAccess,
      referenceDocuments: referenceDocumentsAccess
    });
    console.log('Action Access Levels:', {
      finalCopy: finalCopyAccess,
      summary: summaryAccess,
      annotatedDocs: annotatedDocsAccess
    });
    console.log('Available Tabs:', availableTabs);
  }

  return (
    <DocumentProvider>
      <div className="container mx-auto p-6">
        <div className="space-y-10 px-6">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          <button
            onClick={handleDocumentStore}
            className="flex border-none font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer px-5 py-2 rounded-md"
          >
            <CircleArrowLeft />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-soft px-6 py-8 md:py-6 md:px-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeStep}`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeStep === 0 && (
                <>
                  {showUploadSection && (
                    <motion.div
                      key="upload"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-8 border-b pb-8"
                    >
                      <UploadAndTableSection />
                    </motion.div>
                  )}

                  <motion.div
                    key="document-list"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-6">
                      {renderTabsWithPermissions()}
                    </div>
                  </motion.div>
                </>
              )}

              {activeStep === 1 && canReadReviewManagement && <ReviewRelated />}
              {activeStep === 2 && <DocumentSignature />}
              {activeStep === 3 && (
                <div key="document-list">
                  <div className="mb-6">
                    {renderTabsWithPermissions()}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DocumentProvider>
  );
}

export default StepperApp;