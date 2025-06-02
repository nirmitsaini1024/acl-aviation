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

// ✅ CORRECT imports for StepperApp
import { Can, AbilityContext } from "@/components/review-administration/sections/Can";
import { useAbility } from '@casl/react'; // ✅ useAbility comes from @casl/react

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
  const [activeStep, setActiveStep] = useState(null); // Changed from 3 to null
  const [showUploadSection, setShowUploadSection] = useState(false);

  // Add CASL ability hook
  const ability = useAbility(AbilityContext);

  // Define steps based on user permissions
  const getAvailableSteps = () => {
    // Only show Review Management if user can edit documents
    if (ability.can('edit', 'Document')) {
      return [
        { number: 1, title: "Upload" },
        { number: 2, title: "Review Management" },
        { number: 3, title: "Start Review Process" },
      ];
    }

    // For users who can't edit, skip Review Management
    return [
      { number: 1, title: "Upload" },
      { number: 3, title: "Start Review Process" },
    ];
  };

  const steps = getAvailableSteps();

  // Handle step click in the stepper
  const handleStepClick = (index) => {
    const availableSteps = getAvailableSteps();
    const clickedStep = availableSteps[index];
    
    if (!clickedStep) return;
    
    const stepNumber = clickedStep.number;
    
    // If clicking on the Upload step (number 1)
    if (stepNumber === 1) {
      if (activeStep === 1) {
        // If already on step 1, toggle the upload section visibility
        setShowUploadSection(!showUploadSection);
      } else {
        // If not on step 1, go to step 1 and show upload section
        setActiveStep(1);
        setShowUploadSection(true);
      }
    }
    // For other steps, just set the active step normally
    else {
      setActiveStep(stepNumber);
      setShowUploadSection(false);
    }
  };

  // When the component first mounts, we want to show the document list, not the upload section
  useEffect(() => {
    setShowUploadSection(false);
  }, []);

  const handleDocumentStore = () => {
    setActiveStep(null); // Changed from 3 to null to close all steps
    setShowUploadSection(false);
  };

  // Component to render tabs with role-based permissions
  const RoleBasedTabs = () => {
    return (
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4 bg-blue-50 w-full">
          {/* Pending Tab - Always visible */}
          <Can I="view" a="PendingTab">
            <TabsTrigger
              value="pending"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Pending
            </TabsTrigger>
          </Can>
          
          {/* Approved Tab - Admin and Manager only */}
          <Can I="view" a="ApprovedTab">
            <TabsTrigger
              value="approved"
              className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Approved
            </TabsTrigger>
          </Can>
          
          {/* Deactivated Tab - Admin only */}
          <Can I="view" a="DeactivatedTab">
            <TabsTrigger
              value="disapproved"
              className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
            >
              Deactivated
            </TabsTrigger>
          </Can>
          
          {/* Reference Documents Tab - All roles can see */}
          <Can I="view" a="ReferenceTab">
            <TabsTrigger
              value="refdoc"
              className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              Reference Documents
            </TabsTrigger>
          </Can>
        </TabsList>

        {/* Tab Contents */}
        <Can I="view" a="PendingTab">
          <TabsContent value="pending">
            <DocumentReviewTable setActiveStep={setActiveStep} status="pending" setIsBotOpen={setIsBotOpen}/>
          </TabsContent>
        </Can>

        <Can I="view" a="ApprovedTab">
          <TabsContent value="approved">
            <DocumentApprovedTable setIsBotOpen={setIsBotOpen}/>
          </TabsContent>
        </Can>

        <Can I="view" a="DeactivatedTab">
          <TabsContent value="disapproved">
            <DeactivatedDocumentsTable/>
          </TabsContent>
        </Can>
        
        <Can I="view" a="ReferenceTab">
          <TabsContent value="refdoc">
            <DocumentReviewTable setActiveStep={setActiveStep} status="reference" setIsBotOpen={setIsBotOpen}/>
          </TabsContent>
        </Can>
      </Tabs>
    );
  };

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
              key={`content-${activeStep || 'none'}`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeStep === 1 && (
                <div>
                  {/* When Upload step is active and showUploadSection is true, show upload section */}
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

                  {/* Always show document list table with role-based tabs */}
                  <motion.div
                    key="document-list"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-6">
                      <RoleBasedTabs />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Only show Review Management if user can edit documents */}
              {activeStep === 2 && ability.can('edit', 'Document') && (
                <ReviewRelated />
              )}
              
              {/* Step 3 content */}
              {activeStep === 3 && (
                <>
                  {/* If user can edit, show DocumentSignature, otherwise show document list */}
                  {ability.can('edit', 'Document') ? (
                    <DocumentSignature />
                  ) : (
                    <div key="document-list">
                      <div className="mb-6">
                        <RoleBasedTabs />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Default state - no step active, show document store */}
              {activeStep === null && (
                <div key="default-document-list">
                  <div className="mb-6">
                    <RoleBasedTabs />
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