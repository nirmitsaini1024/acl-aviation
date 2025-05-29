import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

const DocumentContext = createContext();

const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [showReviewPopover, setShowReviewPopover] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [domain, setDomain] = useState("");
  const [signature, setSignature] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [approvedDocuments, setApprovedDocuments] = useState([]);
  const [disapprovedDocuments, setDisapprovedDocuments] = useState([]);
  const [referenceDocuments, setReferenceDocuments] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    // Update to filter out reference documents from pending documents
    setPendingDocuments(
      documents.filter(
        (doc) =>
          (doc.reviewStatus === "pending" || !doc.reviewStatus) &&
          !doc.isReference
      )
    );
    setApprovedDocuments(
      documents.filter((doc) => doc.reviewStatus === "approved")
    );
    setDisapprovedDocuments(
      documents.filter((doc) => doc.reviewStatus === "disapproved")
    );
    // Add filter for reference documents
    setReferenceDocuments(documents.filter((doc) => doc.isReference === true));
  }, [documents]);

  const handleAddDocument = useCallback((newDocument) => {
    if (Array.isArray(newDocument)) {
      const docsWithReviewStatus = newDocument.map((doc) => ({
        ...doc,
        reviewStatus: doc.isReference ? "reference" : "pending",
        uploadedAt: new Date().toLocaleString(),
      }));
      setDocuments((prev) => [...prev, ...docsWithReviewStatus]);
      return;
    }

    const fileExtension =
      newDocument.file?.name?.split(".").pop()?.toLowerCase() ||
      newDocument.fileType ||
      (newDocument.status === "final" ? "pdf" : "docx");

    const isFinalByDefault = fileExtension === "pdf";
    const isWorkingByDefault =
      fileExtension === "docx" || fileExtension === "doc";

    // Fix: Determine initial status based on document type
    let initialStatus;
    if (newDocument.isReference) {
      initialStatus = "reference";
    } else if (newDocument.isFinal) {
      initialStatus = "final"; // This ensures it shows in kanban
    } else if (newDocument.isWorking) {
      initialStatus = "working"; // This ensures it shows in kanban
    } else {
      initialStatus = isFinalByDefault ? "final" : "working";
    }

    // Fix: Determine initial reviewStatus based on document type
    let initialReviewStatus;
    if (newDocument.isReference) {
      initialReviewStatus = "reference";
    } else if (newDocument.isFinal) {
      initialReviewStatus = "approved"; // Final documents start as approved
    } else {
      initialReviewStatus = "draft review"; // Working documents start as draft review
    }

    const documentWithStatus = {
      ...newDocument,
      id: newDocument.id || uuidv4(),
      status: initialStatus,
      fileType: newDocument.fileType || fileExtension,
      isFinal:
        newDocument.isFinal !== undefined
          ? newDocument.isFinal
          : isFinalByDefault,
      isWorking:
        newDocument.isWorking !== undefined
          ? newDocument.isWorking
          : isWorkingByDefault,
      reviewStatus: initialReviewStatus,
      approvalProgress: newDocument.approvalProgress || 0,
      uploadedAt: newDocument.uploadedAt || new Date().toLocaleString(),
    };

    setDocuments((prev) => [...prev, documentWithStatus]);
  }, []);

  const handleAddMultipleDocuments = useCallback((documentData) => {
    const { isFinal, isWorking, isReference, file, ...commonData } =
      documentData;
    const documentsToAdd = [];
    const uploadTimestamp = new Date().toLocaleString();

    if (isReference) {
      documentsToAdd.push({
        ...commonData,
        id: commonData.id + "-reference",
        file,
        status: "reference",
        isFinal: false,
        isWorking: false,
        isReference: true,
        fileType: file.name.split(".").pop()?.toLowerCase() || "pdf",
        reviewStatus: "reference",
        approvalProgress: 0,
        uploadedAt: uploadTimestamp,
      });
    }

    // Create both documents when both checkboxes are selected
    if (isFinal && isWorking) {
      // Add final version
      documentsToAdd.push({
        ...commonData,
        id: commonData.id + "-final",
        file,
        status: "final",
        isFinal: true,
        isWorking: false,
        isReference: false,
        fileType: "pdf",
        reviewStatus: "approved", // Final documents start as approved
        approvalProgress: 0,
        uploadedAt: uploadTimestamp,
      });

      // Add working copy
      documentsToAdd.push({
        ...commonData,
        id: commonData.id + "-working",
        file,
        status: "working",
        isFinal: false,
        isWorking: true,
        isReference: false,
        fileType: "docx",
        reviewStatus: "draft review", // Working documents start as draft review
        approvalProgress: 0,
        uploadedAt: uploadTimestamp,
      });
    }
    // Handle single selection cases
    else if (isFinal && !isWorking) {
      documentsToAdd.push({
        ...commonData,
        id: commonData.id + "-final",
        file,
        status: "final",
        isFinal: true,
        isWorking: false,
        isReference: false,
        fileType: "pdf",
        reviewStatus: "approved", // Final documents start as approved
        approvalProgress: 0,
        uploadedAt: uploadTimestamp,
      });
    } else if (isWorking && !isFinal) {
      documentsToAdd.push({
        ...commonData,
        id: commonData.id + "-working",
        file,
        status: "working",
        isFinal: false,
        isWorking: true,
        isReference: false,
        fileType: "docx",
        reviewStatus: "draft review", // Working documents start as draft review
        approvalProgress: 0,
        uploadedAt: uploadTimestamp,
      });
    }

    setDocuments((prev) => [...prev, ...documentsToAdd]);
  }, []);

const handleDragEnd = useCallback((event) => {
  const { active, over } = event;
  
  // Add safety checks
  if (!active || !over) {
    console.log('Drag cancelled - no active or over element');
    return;
  }
  
  if (active.id === over.id) {
    console.log('Drag cancelled - same position');
    return;
  }

  console.log(`Dragging ${active.id} to ${over.id}`);
  
  setDocuments(prevDocuments => {
    // Find the document being dragged first
    const draggedDoc = prevDocuments.find(doc => doc.id === active.id);
    
    if (!draggedDoc) {
      console.error(`Document with id ${active.id} not found`);
      return prevDocuments; // Return unchanged if document not found
    }

    return prevDocuments.map(doc => {
      if (doc.id === active.id) {
        const newStatus = over.id;
        console.log(`Updating document ${doc.name} from status: ${doc.status} to: ${newStatus}`);
        
        // Reference documents should not be draggable to kanban columns
        if (doc.isReference) {
          console.log(`Reference document ${doc.name} - keeping as reference`);
          return {
            ...doc,
            status: "reference",
            isFinal: false,
            isWorking: false,
            isReference: true,
            reviewStatus: "reference"
          };
        }
        
        // Validate drop target
        const validDropTargets = ['final', 'working', 'review'];
        if (!validDropTargets.includes(newStatus)) {
          console.warn(`Invalid drop target: ${newStatus}. Keeping original status.`);
          return doc; // Return unchanged for invalid drop targets
        }
        
        // For PDF documents (final copies) - preserve their final nature
        if (doc.fileType === "pdf") {
          console.log(`PDF document ${doc.name} - keeping as final copy`);
          return {
            ...doc,
            status: newStatus,
            isFinal: true, // Always keep PDF as final
            isWorking: false,
            isReference: false,
            // reviewStatus stays the same during drag/drop
          };
        }
        // For DOCX documents (working copies)
        else if (doc.fileType === "docx" || doc.fileType === "doc") {
          console.log(`DOCX document ${doc.name} - keeping as working copy`);
          return {
            ...doc,
            status: newStatus,
            isFinal: false,
            isWorking: true, // Always keep DOCX as working
            isReference: false,
            // reviewStatus stays the same during drag/drop
          };
        }
        // Fallback for other document types
        else {
          console.log(`Other document type: ${doc.fileType} for ${doc.name}`);
          return {
            ...doc,
            status: newStatus,
            isReference: false,
            // Preserve existing isFinal/isWorking values
            isFinal: doc.isFinal,
            isWorking: doc.isWorking
          };
        }
      }
      return doc; // Return unchanged for other documents
    });
  });
}, []);

  const toggleDocumentStatus = useCallback((id, targetStatus) => {
    setDocuments((prevDocuments) => {
      return prevDocuments.map((doc) => {
        if (doc.id === id) {
          if (doc.isReference) {
            return {
              ...doc,
              status: "reference",
              reviewStatus: "reference",
              isReference: true,
            };
          } else if (doc.fileType === "pdf" && targetStatus === "review") {
            return {
              ...doc,
              status: "review",
              reviewStatus: "pending",
              isFinal: true,
              isReference: false,
            };
          } else if (doc.fileType === "pdf") {
            return {
              ...doc,
              status: "approved",
              reviewStatus: "submitted",
              isReference: false,
            };
          } else {
            const currentStatus = doc.status;
            if (currentStatus === targetStatus) {
              const newStatus = targetStatus === "final" ? "working" : "final";
              return {
                ...doc,
                status: newStatus,
                isFinal: newStatus === "final",
                isWorking: newStatus === "working",
                isReference: false,
              };
            } else {
              return {
                ...doc,
                status: targetStatus,
                isFinal: targetStatus === "final",
                isWorking: targetStatus === "working",
                isReference: false,
              };
            }
          }
        }
        return doc;
      });
    });
  }, []);

  const updateDocumentReviewStatus = useCallback(
    (id, reviewStatus, progress = null) => {
      setDocuments((prevDocuments) => {
        return prevDocuments.map((doc) => {
          if (doc.id === id) {
            if (doc.isReference) {
              return {
                ...doc,
                status: "reference",
                isReference: true,
                reviewStatus: "reference",
                approvalProgress: 0,
              };
            } else if (doc.fileType === "pdf") {
              return {
                ...doc,
                status: doc.status,
                isFinal: true,
                isReference: false,
                reviewStatus: reviewStatus,
                approvalProgress:
                  progress !== null
                    ? progress
                    : reviewStatus === "approved"
                    ? 100
                    : reviewStatus === "disapproved"
                    ? 0
                    : doc.approvalProgress || 50,
              };
            } else {
              return {
                ...doc,
                isReference: false,
                reviewStatus,
                approvalProgress:
                  progress !== null
                    ? progress
                    : reviewStatus === "approved"
                    ? 100
                    : reviewStatus === "disapproved"
                    ? 0
                    : doc.approvalProgress || 50,
              };
            }
          }
          return doc;
        });
      });
    },
    []
  );

  const deactivateDocument = useCallback((id) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== id)
    );
  }, []);

  const handleSignatureSave = useCallback((signatureURL) => {
    setSignature(signatureURL);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsSubmitted(true);
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) => {
        if (doc.isReference) {
          return {
            ...doc,
            reviewStatus: "reference",
            status: "reference",
          };
        }
        // Fix: Only change reviewStatus for documents that are in "review" status
        else if (doc.status === "review") {
          return {
            ...doc,
            reviewStatus: "in review", // This happens ONLY when button is clicked
            status: "review", // Keep status as review
            isFinal: doc.fileType === "pdf" ? true : doc.isFinal,
            isReference: false,
          };
        }
        return doc;
      })
    );
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        setDocuments,
        pendingDocuments,
        approvedDocuments,
        disapprovedDocuments,
        referenceDocuments,
        showReviewPopover,
        setShowReviewPopover,
        selectedDepartment,
        setSelectedDepartment,
        selectedCategory,
        setSelectedCategory,
        signature,
        setSignature,
        isSubmitted,
        triggerRef,
        handleAddDocument,
        handleAddMultipleDocuments,
        handleDragEnd,
        toggleDocumentStatus,
        updateDocumentReviewStatus,
        deactivateDocument,
        handleSignatureSave,
        handleConfirm,
        currentDocId,
        setCurrentDocId,
        domain,
        setDomain,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentProvider };
export default DocumentProvider;
