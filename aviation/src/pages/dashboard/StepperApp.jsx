import { useState, useEffect } from "react";
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
import { ArrowBigLeft, ChevronLeft, CircleArrowLeft } from "lucide-react";
import { Can, useAbility } from "@/AbilityProvider"; // Import Can and useAbility

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

function StepperApp({setIsBotOpen}) {
  const [activeStep, setActiveStep] = useState(3);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const { ability, can } = useAbility();
  
  // Debug permissions
  useEffect(() => {
    const permissionsStr = localStorage.getItem('permissions');
    const permissions = permissionsStr ? JSON.parse(permissionsStr) : null;
    console.log('StepperApp - Raw permissions:', JSON.stringify(permissions, null, 2));
    
    // Check specific tab permissions
    const tabPermissions = {
      pending: can('view', 'PendingTab'),
      reference: can('view', 'ReferenceTab'),
      approved: can('view', 'ApprovedTab'),
      deactivated: can('view', 'DeactivatedTab')
    };
    
    console.log('StepperApp - Tab permissions:', tabPermissions);
    console.log('StepperApp - CASL rules:', ability?.rules);
  }, [ability, can]);

  const steps = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Review Management" },
    { number: 3, title: "Start Review Process" },
  ];

  // Handle step click in the stepper
  const handleStepClick = (index) => {
    // If clicking on the Upload step (index 0) that's already active
    if (index === 0 && activeStep === 0) {
      // Toggle the upload section visibility
      showUploadSection === true ? setActiveStep(3) : setActiveStep(0);
      setShowUploadSection(!showUploadSection);
    }
    // Otherwise, set the active step normally
    else {
      setActiveStep(index);

      // Only show upload section when Upload step is explicitly clicked
      if (index === 0) {
        setShowUploadSection(true);
      } else {
        setShowUploadSection(false);
      }
    }
  };

  // When the component first mounts, we want to show the document list, not the upload section
  useEffect(() => {
    setShowUploadSection(false);
  }, []);

  const handleDocumentStore = () => {
    setActiveStep(3);
    setShowUploadSection(false);
  };
  
  // Function to get the default tab value based on permissions
  const getDefaultTabValue = () => {
    const tabPermissions = {
      pending: can('view', 'PendingTab'),
      reference: can('view', 'ReferenceTab'),
      approved: can('view', 'ApprovedTab'),
      deactivated: can('view', 'DeactivatedTab')
    };
    
    console.log('Checking permissions for default tab:', tabPermissions);
    
    if (tabPermissions.pending) return "pending";
    if (tabPermissions.approved) return "approved";
    if (tabPermissions.deactivated) return "disapproved";
    if (tabPermissions.reference) return "refdoc";
    return "pending"; // Fallback to pending if no tabs are visible
  };

  // Count visible tabs for styling
  const getVisibleTabCount = () => {
    const tabPermissions = {
      pending: can('view', 'PendingTab'),
      reference: can('view', 'ReferenceTab'),
      approved: can('view', 'ApprovedTab'),
      deactivated: can('view', 'DeactivatedTab')
    };
    
    const count = Object.values(tabPermissions).filter(Boolean).length;
    console.log('Number of visible tabs:', count, 'Permissions:', tabPermissions);
    return count;
  };
  
  // If no tabs are visible, we'll show a message
  const noTabsVisible = getVisibleTabCount() === 0;
  console.log('No tabs visible:', noTabsVisible);

  // Get the actual permissions from localStorage for debugging
  useEffect(() => {
    const permissions = localStorage.getItem('permissions');
    if (permissions) {
      const parsedPermissions = JSON.parse(permissions);
      console.log('Actual permissions in localStorage:', JSON.stringify(parsedPermissions, null, 2));
      
      // Log specific permission checks
      const adminView = parsedPermissions.reviewAdministration?.adminDocumentRepositoryView;
      console.log('Permission details:', {
        pending: adminView?.pending,
        approved: adminView?.approved?.permission,
        deactivated: adminView?.deactivated,
        reference: adminView?.referenceDocuments
      });
    }
  }, []);

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
            className={`flex border-none font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer px-5 py-2 rounded-md`}
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
                  {/* When Upload step is clicked, show upload section above document list */}
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

                  {/* Document list table with permission-based tabs */}
                  <motion.div
                    key="document-list"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-6">
                      {noTabsVisible ? (
                        <div className="p-8 text-center text-gray-500">
                          <p>You don't have permission to view any document tabs.</p>
                        </div>
                      ) : (
                        <Tabs defaultValue={getDefaultTabValue()} className="w-full">
                          <TabsList className="mb-4 bg-blue-50 w-full">
                            {can('view', 'PendingTab') && (
                              <TabsTrigger
                                value="pending"
                                className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                              >
                                Pending
                              </TabsTrigger>
                            )}
                            
                            {can('view', 'ApprovedTab') && (
                              <TabsTrigger
                                value="approved"
                                className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                              >
                                Approved
                              </TabsTrigger>
                            )}
                            
                            {can('view', 'DeactivatedTab') && (
                              <TabsTrigger
                                value="disapproved"
                                className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                              >
                                Deactivated
                              </TabsTrigger>
                            )}
                            
                            {can('view', 'ReferenceTab') && (
                              <TabsTrigger
                                value="refdoc"
                                className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                              >
                                Reference Documents
                              </TabsTrigger>
                            )}
                          </TabsList>

                          {can('view', 'PendingTab') && (
                            <TabsContent value="pending">
                              <DocumentReviewTable setActiveStep={setActiveStep} status="pending" setIsBotOpen={setIsBotOpen} />
                            </TabsContent>
                          )}

                          {can('view', 'ApprovedTab') && (
                            <TabsContent value="approved">
                              <DocumentApprovedTable setIsBotOpen={setIsBotOpen} />
                            </TabsContent>
                          )}

                          {can('view', 'DeactivatedTab') && (
                            <TabsContent value="disapproved">
                              <DeactivatedDocumentsTable />
                            </TabsContent>
                          )}
                          
                          {can('view', 'ReferenceTab') && (
                            <TabsContent value="refdoc">
                              <DocumentReviewTable setActiveStep={setActiveStep} status="reference" setIsBotOpen={setIsBotOpen} />
                            </TabsContent>
                          )}
                        </Tabs>
                      )}
                    </div>
                  </motion.div>
                </>
              )}

              {activeStep === 1 && <ReviewRelated />}
              {activeStep === 2 && <DocumentSignature />}
              {activeStep === 3 && (
                <div key="document-list">
                  <div className="mb-6">
                    {noTabsVisible ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>You don't have permission to view any document tabs.</p>
                      </div>
                    ) : (
                      <Tabs defaultValue={getDefaultTabValue()} className="w-full">
                        <TabsList className="mb-4 bg-blue-50 w-full">
                          {can('view', 'PendingTab') && (
                            <TabsTrigger
                              value="pending"
                              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                            >
                              Pending
                            </TabsTrigger>
                          )}
                          
                          {can('view', 'ApprovedTab') && (
                            <TabsTrigger
                              value="approved"
                              className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                            >
                              Approved
                            </TabsTrigger>
                          )}
                          
                          {can('view', 'DeactivatedTab') && (
                            <TabsTrigger
                              value="disapproved"
                              className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                            >
                              Deactivated
                            </TabsTrigger>
                          )}
                          
                          {can('view', 'ReferenceTab') && (
                            <TabsTrigger
                              value="refdoc"
                              className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                            >
                              Reference Documents
                            </TabsTrigger>
                          )}
                        </TabsList>

                        {can('view', 'PendingTab') && (
                          <TabsContent value="pending">
                            <DocumentReviewTable setActiveStep={setActiveStep} status="pending" setIsBotOpen={setIsBotOpen} />
                          </TabsContent>
                        )}

                        {can('view', 'ApprovedTab') && (
                          <TabsContent value="approved">
                            <DocumentApprovedTable setIsBotOpen={setIsBotOpen} />
                          </TabsContent>
                        )}

                        {can('view', 'DeactivatedTab') && (
                          <TabsContent value="disapproved">
                            <DeactivatedDocumentsTable />
                          </TabsContent>
                        )}
                        
                        {can('view', 'ReferenceTab') && (
                          <TabsContent value="refdoc">
                            <DocumentReviewTable setActiveStep={setActiveStep} status="reference" setIsBotOpen={setIsBotOpen} />
                          </TabsContent>
                        )}
                      </Tabs>
                    )}
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