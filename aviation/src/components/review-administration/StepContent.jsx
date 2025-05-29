import { motion, AnimatePresence } from 'framer-motion';
import DocumentSignature from './sections/document-review-signature';
import UploadAndTableSection from './sections/uploadSection';
import { DocumentProvider } from './contexts/DocumentContext';
import ReviewRelated from '@/pages/dashboard/review-related-content';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

function StepContent({ activeStep }) {
  return (
    <DocumentProvider>
      <div className="bg-white rounded-lg shadow-soft px-6 py-8 md:py-6 md:px-0 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeStep === 0 && <UploadAndTableSection />}
            {activeStep === 1 && <ReviewRelated />}
            {activeStep === 2 && <DocumentSignature />}
          </motion.div>
        </AnimatePresence>
      </div>
    </DocumentProvider>
  );
}

export default StepContent;