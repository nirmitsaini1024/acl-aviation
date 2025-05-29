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

  return (
    <DocumentProvider>
      <div className="container mx-auto p-6">
        <div className="space-y-10   px-6">
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

                  {/* Always show document list table */}
                  <motion.div
                    key="document-list"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-6">
                      <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="mb-4 bg-blue-50 w-full">
                          <TabsTrigger
                            value="pending"
                            className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                          >
                            Pending
                          </TabsTrigger>
                          <TabsTrigger
                            value="approved"
                            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                          >
                            Approved
                          </TabsTrigger>
                          <TabsTrigger
                            value="disapproved"
                            className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                          >
                            Deactivated
                          </TabsTrigger>
                           <TabsTrigger
                            value="refdoc"
                            className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                          >
                            Reference Documents
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                          <DocumentReviewTable setActiveStep={setActiveStep} status="pending" setIsBotOpen={setIsBotOpen}/>
                        </TabsContent>

                        <TabsContent value="approved">
                        <DocumentApprovedTable setIsBotOpen={setIsBotOpen}/>
                        </TabsContent>

                        <TabsContent value="disapproved">
                          <DeactivatedDocumentsTable/>
                        </TabsContent>
                       
                        <TabsContent value="refdoc">
                          <DocumentReviewTable setActiveStep={setActiveStep} status="reference" />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </motion.div>
                </>
              )}

              {activeStep === 1 && <ReviewRelated />}
              {activeStep === 2 && <DocumentSignature />}
              {activeStep === 3 && (
                <div
                  key="document-list"
                >
                  <div className="mb-6">
                    {/* <h1 className="text-2xl mb-4 font-medium text-blue-600">Document Store</h1> */}
                    <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="mb-4 bg-blue-50 w-full">
                        <TabsTrigger
                          value="pending"
                          className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                          Pending
                        </TabsTrigger>
                        <TabsTrigger
                          value="approved"
                          className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                        >
                          Approved
                        </TabsTrigger>
                        <TabsTrigger
                          value="disapproved"
                          className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                        >
                          Deactivated
                        </TabsTrigger>
                        <TabsTrigger
                          value="refdoc"
                          className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                        >
                          Reference Documents
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pending">
                        <DocumentReviewTable setActiveStep={setActiveStep} status="pending" setIsBotOpen={setIsBotOpen}/>
                      </TabsContent>

                      <TabsContent value="approved">
                      <DocumentApprovedTable setIsBotOpen={setIsBotOpen}/>
                      </TabsContent>

                      <TabsContent value="disapproved">
                      <DeactivatedDocumentsTable/>
                      </TabsContent>
                      
                      <TabsContent value="refdoc">
                        <DocumentReviewTable setActiveStep={setActiveStep} status="reference" setIsBotOpen={setIsBotOpen}/>
                      </TabsContent>
                    </Tabs>
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