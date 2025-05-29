import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Save,
  X,
  FileText,
  Link,
  Plus,
  Edit2,
  Type,
  FileTextIcon,
  MousePointer2,
  Check,
  Upload,
  Eye,
  TriangleAlert,
  Pencil,
  File,
  Search,
  Link2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRight,
  Loader2,
} from "lucide-react";
import { SaveButton } from "@/components/review-related-content/save-button";
import WebViewerComponent from "./NewWebViewer";
import PDFViewer from "@/components/doc-reviewer/pdf-viewer";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentContext } from "@/components/review-administration/contexts/DocumentContext";
import { Badge } from "@/components/ui/badge";

// FullPagePopup component for document viewing
const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default function ReviewRelated() {
  const webViewerRef = useRef(null);

  const { documents, currentDocId } = useContext(DocumentContext);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setSHowLeftPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const currentDocument = documents.find((doc) => doc.id === currentDocId);
  console.log("in review related", currentDocument);
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);

  //   useEffect(() => {
  //   const savedPage = sessionStorage.getItem("currentPage");
  //   if (savedPage) {
  //     setCurrentPage(Number(savedPage));
  //   }

  // }, []);

  // Add this handler function
  const handleWebViewerLoad = useCallback(() => {
    setIsWebViewerLoaded(true);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    console.log("Current page changed to:", pageNumber);
    sessionStorage.setItem("currentPage", pageNumber);
  }, []);

  const isInReview = currentDocument?.reviewStatus == "in review";

  // Content state for current group being created
  const [reviewContent, setReviewContent] = useState([]);
  const openInNewTab = () => {
    window.open("/refdoc", "_blank");
  };
  // Add state for the group name
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  // New state for selecting entire document
  const [entireDocumentSelected, setEntireDocumentSelected] = useState(false);
  const [activeContentItem, setActiveContentItem] = useState(null);
  const [contentReferenceDocs, setContentReferenceDocs] = useState({});
  // State for entire document note
  const [entireDocumentNote, setEntireDocumentNote] = useState("");

  // State for entire document group name
  const [entireDocumentGroupName, setEntireDocumentGroupName] = useState(" ");

  // Document name state
  const [documentName, setDocumentName] = useState("Document.docx");

  // State for the image/document dialog
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for document viewer popup
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [viewerFileType, setViewerFileType] = useState(null);
  const [viewerFilePath, setViewerFilePath] = useState(null);

  // Add state for editing existing content
  const [editingContent, setEditingContent] = useState(null);

  // NEW: Add state for search text to pass to WebViewer
  const [searchText, setSearchText] = useState("");

  const [searchTextindocx, setSearchTextindocx] = useState("");

  // NEW: Add state to track which item is currently being searched
  const [activeSearchItem, setActiveSearchItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [referReviewDocuments, setReferReviewDocuments] = useState([]);
  const [showDocSelector, setShowDocSelector] = useState(false);

  // Mock documents data - replace with your actual data source
  const availableDocuments = [
    { id: "doc-1", name: "Document A.docx" },
    { id: "doc-2", name: "Document B.pdf" },
    { id: "doc-3", name: "Guidelines.docx" },
    { id: "doc-4", name: "sample.docx" },
    { id: "doc-5", name: "sample-2.docx" },
    { id: "doc-6", name: "Airport.docx" },
    { id: "doc-7", name: "Mickey-mouse.docx" },
    { id: "doc-8", name: "ProjectPlan_Q1.docx" },
    { id: "doc-9", name: "TeamRoster.pdf" },
    { id: "doc-10", name: "FinancialReport2024.docx" },
    { id: "doc-11", name: "Client-Proposal.docx" },
    { id: "doc-12", name: "UserManual.pdf" },
    { id: "doc-13", name: "MeetingNotes_March.docx" },
    { id: "doc-14", name: "Invoice_1098.pdf" },
    { id: "doc-15", name: "CompanyPolicy.docx" },
    { id: "doc-16", name: "Terms_Conditions.docx" },
    { id: "doc-17", name: "PrivacyPolicy.docx" },
    { id: "doc-18", name: "Resume_JohnDoe.pdf" },
    { id: "doc-19", name: "Checklist_Tasks.docx" },
    { id: "doc-20", name: "TrainingMaterials.pdf" },
    { id: "doc-21", name: "AnnualReview.docx" },
    { id: "doc-22", name: "Budget2025.pdf" },
    { id: "doc-23", name: "PerformanceReport.docx" },
    { id: "doc-24", name: "LegalAgreement.pdf" },
    { id: "doc-25", name: "OnboardingGuide.docx" },
  ];

  const handleIsLoaded = () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
  };

  const handlePanels = (panel) => {
    if (panel === "left") {
      if (showLeftPanel && showRightPanel) {
        setShowRightPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    } else if (panel === "right") {
      if (showLeftPanel && showRightPanel) {
        setSHowLeftPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    }
  };

  // Function to remove a reference document from a specific content item
  const removeContentReference = (contentId, docId) => {
    setContentReferenceDocs((prev) => ({
      ...prev,
      [contentId]: prev[contentId]?.filter((id) => id !== docId) || [],
    }));
  };
  const toggleDocumentSelection = (docId, contentId = null) => {
    if (contentId) {
      // Handle document selection for specific content item
      setContentReferenceDocs((prev) => ({
        ...prev,
        [contentId]: prev[contentId]?.includes(docId)
          ? prev[contentId].filter((id) => id !== docId)
          : [...(prev[contentId] || []), docId],
      }));
    } else {
      // Handle document selection for the main group
      setReferReviewDocuments((prev) =>
        prev.includes(docId)
          ? prev.filter((id) => id !== docId)
          : [...prev, docId]
      );
    }
  };
  // Saved groups
  const [savedGroups, setSavedGroups] = useState([
    {
      id: "sample-group-1",
      name: "Airline Defense Maintenance",
      documentName: "AircraftMaintenance.docx",
      reviewContent: [
        {
          id: "sample-review-1",
          content:
            "The aircraft maintenance manual states that visual inspections of the fuselage must be performed after every 500 flight hours or 3 months, whichever comes first.",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
        {
          id: "sample-review-2",
          content:
            "Section 4.2.3: Emergency procedures for cabin decompression include immediate deployment of oxygen masks and descent to 10,000 feet or the minimum safe altitude, whichever is higher.",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
        {
          id: "sample-review-3",
          content:
            "According to FAA regulation §121.359, cockpit voice recorders must retain the last 2 hours of recorded information instead of the previous 30-minute requirement.",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
      ],
      relatedContent: [],
    },
    {
      id: "sample-group-2",
      name: "Airport Safety and Compliance",
      documentName: "SafetyCompliance.docx",
      reviewContent: [
        {
          id: "sample-review-4",
          content:
            "FAA Advisory Circular 120-92B outlines the Safety Management System (SMS) framework, requiring operators to identify hazards, assess risk, and implement safety assurance practices.",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
        {
          id: "sample-review-5",
          content:
            "ICAO Annex 6 mandates that all commercial aircraft must be equipped with a Terrain Awareness and Warning System (TAWS) to prevent controlled flight into terrain (CFIT).",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
        {
          id: "sample-review-6",
          content:
            "Under Part 135, aircraft operators must perform weight and balance calculations prior to every flight to ensure compliance with center of gravity and structural limits.",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
      ],
      relatedContent: [],
    },
  ]);

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState({});

  // Track which content type is waiting for text selection
  const [addingTo, setAddingTo] = useState(null);

  // Track which saved group we're adding content to
  const [addingToGroupId, setAddingToGroupId] = useState(null);

  // Selected text from document
  const [selectedText, setSelectedText] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  console.log("seclected page", selectedPage);

  // State for tracking if we're writing content manually
  const [isWritingContent, setIsWritingContent] = useState(null);
  const [manualContent, setManualContent] = useState("");

  // Function to open the file dialog
  const openFileDialog = (file) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  // Function to open document viewer popup
  const openDocumentViewer = (file) => {
    setViewerFileType(file.fileType);
    setViewerFilePath(file.filePath || file.imageSrc);
    setIsViewerPopupOpen(true);
  };

  // Handle checkbox change for entire document selection
  const handleEntireDocumentChange = (checked) => {
    setEntireDocumentSelected(checked);

    // If selecting entire document, reset current editing states
    if (checked) {
      setAddingTo(null);
      setAddingToGroupId(null);
      setIsWritingContent(null);
      setManualContent("");
      setEditingContent(null);

      // NEW: Also reset search states
      setSearchText("");
      setActiveSearchItem(null);
    }
  };

  // Watch for selectedText changes and add to content when appropriate
  useEffect(() => {
    if (selectedText && !entireDocumentSelected) {
      // If we're editing existing content in a saved group
      if (editingContent) {
        const { groupId, contentId } = editingContent;
        // Update the content in the saved group - include the page information
        setSavedGroups(
          savedGroups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                reviewContent: group.reviewContent.map((item) => {
                  if (item.id === contentId) {
                    return {
                      ...item,
                      content: selectedText,
                      page: selectedPage ? `(Page ${currentPage})` : "",
                    };
                  }
                  return item;
                }),
              };
            }
            return group;
          })
        );

        // Reset the editing state
        setEditingContent(null);
        setSelectedText("");
        // selectedText.current("");
      }
      // If we're adding new content to a new group
      else if (addingTo === "review" && !addingToGroupId) {
        const newId = `review-${Date.now()}`;
        setReviewContent([
          ...reviewContent,
          {
            id: newId,
            content: selectedText,
            page: selectedPage ? `(Page ${selectedPage})` : "",
            fileName: "", // No file associated with text selection
            hasImage: false,
            fileType: null,
          },
        ]);

        // Reset states
        setAddingTo(null);
        // selectedText.current("");
      }
      // If we're adding new content to an existing saved group
      else if (addingTo === "review" && addingToGroupId) {
        const newId = `review-${Date.now()}`;
        const newItem = {
          id: newId,
          content: selectedText,
          page: selectedPage ? `(Page ${selectedPage})` : "",
          fileName: "",
          hasImage: false,
          fileType: null,
        };

        // Add the new content to the specified saved group
        setSavedGroups(
          savedGroups.map((group) => {
            if (group.id === addingToGroupId) {
              return {
                ...group,
                reviewContent: [...group.reviewContent, newItem],
              };
            }
            return group;
          })
        );

        // Reset states
        setAddingTo(null);
        setAddingToGroupId(null);
        setSelectedText("");
      }
    }
  }, [
    selectedText,
    addingTo,
    addingToGroupId,
    reviewContent,
    editingContent,
    savedGroups,
    selectedPage, // Add selectedPage to the dependency array
  ]);

  // 2. Now, let's modify how manual content is saved to include a placeholder for page
  // Modify the saveManualContent function

  const saveManualContent = () => {
    if (!manualContent.trim()) return;

    // If adding to a new group
    if (isWritingContent === "review" && !addingToGroupId) {
      const newId = `review-${Date.now()}`;
      setReviewContent([
        ...reviewContent,
        {
          id: newId,
          content: manualContent,
          page: "(Manually added)", // Add a note that this was manually added
          fileName: "", // No file associated with manually written content
          hasImage: false,
          fileType: null,
        },
      ]);
    }
    // If adding to an existing saved group
    else if (isWritingContent === "review" && addingToGroupId) {
      const newId = `review-${Date.now()}`;
      const newItem = {
        id: newId,
        content: manualContent,
        page: "(Manually added)", // Add a note that this was manually added
        fileName: "",
        hasImage: false,
        fileType: null,
      };

      // Add the new content to the specified saved group
      setSavedGroups(
        savedGroups.map((group) => {
          if (group.id === addingToGroupId) {
            return {
              ...group,
              reviewContent: [...group.reviewContent, newItem],
            };
          }
          return group;
        })
      );
    }

    // Reset states
    setIsWritingContent(null);
    setAddingToGroupId(null);
    setManualContent("");
  };

  // Request to add new review content by selection
  const addReviewContentBySelection = () => {
    console.log("I run");
    setSelectedPage(currentPage);
    if (entireDocumentSelected) return;
    setAddingTo("review");
    setAddingToGroupId(null);
    setIsWritingContent(null);
    setEditingContent(null);

    // NEW: Reset search states
    setSearchText("");
    setActiveSearchItem(null);
  };

  // Request to add new review content to a saved group by selection
  const addSavedGroupReviewContentBySelection = (groupId) => {
    if (entireDocumentSelected) return;
    setAddingTo("review");
    setAddingToGroupId(groupId);
    setIsWritingContent(null);
    setEditingContent(null);

    // NEW: Reset search states
    setSearchText("");
    setActiveSearchItem(null);
  };

  // Request to write new review content manually
  const writeReviewContent = () => {
    setIsWritingContent("review");
    setAddingToGroupId(null);
    setAddingTo(null);
    setEditingContent(null);
  };

  // Request to write new review content for a saved group manually
  const writeSavedGroupReviewContent = (groupId) => {
    setIsWritingContent("review");
    setAddingToGroupId(groupId);
    setAddingTo(null);
    setEditingContent(null);
  };

  // Handle manual content change
  const handleManualContentChange = (e) => {
    setManualContent(e.target.value);
  };

  // Handle entire document note change
  const handleEntireDocumentNoteChange = (e) => {
    setEntireDocumentNote(e.target.value);
  };

  // Handle entire document group name change
  const handleEntireDocumentGroupNameChange = (e) => {
    setEntireDocumentGroupName(e.target.value);
  };

  // Save manually written content
  // const saveManualContent = () => {
  //   if (!manualContent.trim()) return;

  //   // If adding to a new group
  //   if (isWritingContent === "review" && !addingToGroupId) {
  //     const newId = `review-${Date.now()}`;
  //     setReviewContent([
  //       ...reviewContent,
  //       {
  //         id: newId,
  //         content: manualContent,
  //         fileName: "", // No file associated with manually written content
  //         hasImage: false,
  //         fileType: null,
  //       },
  //     ]);
  //   }
  //   // If adding to an existing saved group
  //   else if (isWritingContent === "review" && addingToGroupId) {
  //     const newId = `review-${Date.now()}`;
  //     const newItem = {
  //       id: newId,
  //       content: manualContent,
  //       fileName: "",
  //       hasImage: false,
  //       fileType: null,
  //     };

  //     // Add the new content to the specified saved group
  //     setSavedGroups(
  //       savedGroups.map((group) => {
  //         if (group.id === addingToGroupId) {
  //           return {
  //             ...group,
  //             reviewContent: [...group.reviewContent, newItem],
  //           };
  //         }
  //         return group;
  //       })
  //     );
  //   }

  //   // Reset states
  //   setIsWritingContent(null);
  //   setAddingToGroupId(null);
  //   setManualContent("");
  // };

  // Save entire document group
  const saveEntireDocumentGroup = () => {
    if (!entireDocumentSelected || !entireDocumentNote.trim()) return;

    const newGroup = {
      id: `group-entire-${Date.now()}`,
      name: entireDocumentGroupName,
      documentName: documentName,
      reviewContent: [
        {
          id: `review-entire-${Date.now()}`,
          content: entireDocumentNote,
          fileName: "",
          hasImage: false,
          fileType: null,
          isEntireDocument: true,
        },
      ],
      relatedContent: [],
      isEntireDocument: true,
    };

    setSavedGroups([...savedGroups, newGroup]);

    // Reset entire document inputs
    setEntireDocumentNote("");
    setEntireDocumentGroupName("Entire Document Reference");
    setEntireDocumentSelected(false);

    // Expand the newly created group
    setExpandedGroups({
      ...expandedGroups,
      [newGroup.id]: true,
    });
  };

  // Cancel writing content
  const cancelWritingContent = () => {
    setIsWritingContent(null);
    setAddingToGroupId(null);
    setManualContent("");
  };

  // Remove content item
  const removeReviewItem = (id) => {
    if (entireDocumentSelected) return;
    setReviewContent(reviewContent.filter((item) => item.id !== id));
  };

  // Remove content item from a saved group
  const removeSavedGroupReviewItem = (groupId, itemId) => {
    if (entireDocumentSelected) return;

    setSavedGroups(
      savedGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            reviewContent: group.reviewContent.filter(
              (item) => item.id !== itemId
            ),
          };
        }
        return group;
      })
    );
  };

  // Helper function to get file type from file name
  const getFileTypeFromFileName = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension)) return "docx";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return "image";
    return "other";
  };

  // Handle file upload (images, PDFs, DOCXs)
  const handleFileUpload = (e) => {
    if (entireDocumentSelected) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      // For each uploaded file, create a new review content item
      Array.from(files).forEach((file) => {
        const newId = `review-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        const fileType = getFileTypeFromFileName(file.name);

        setReviewContent([
          ...reviewContent,
          {
            id: newId,
            content: "", // Can be empty or a default description
            fileName: file.name,
            hasImage: fileType === "image",
            fileType: fileType,
            filePath: URL.createObjectURL(file),
          },
        ]);
      });
    }
  };

  // Handle file upload for saved group
  const handleSavedGroupFileUpload = (e, groupId) => {
    if (entireDocumentSelected) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      // For each uploaded file, create a new review content item with the file
      const updatedGroups = [...savedGroups];
      const groupIndex = updatedGroups.findIndex(
        (group) => group.id === groupId
      );

      if (groupIndex !== -1) {
        Array.from(files).forEach((file) => {
          const newId = `review-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          const fileType = getFileTypeFromFileName(file.name);

          const newItem = {
            id: newId,
            content: "", // Can be empty or a default description
            fileName: file.name,
            hasImage: fileType === "image",
            fileType: fileType,
            filePath: URL.createObjectURL(file),
          };

          updatedGroups[groupIndex].reviewContent.push(newItem);
        });

        setSavedGroups(updatedGroups);
      }
    }
  };

  // Toggle editing mode for group name
  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };

  // Handle group name change
  const handleNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // Update the handleNameBlur function to handle empty state and placeholder
  const handleNameBlur = () => {
    setIsEditingName(false);
    // Don't set a default value, let the placeholder show instead
  };

  // Handle key press in name input
  const handleNameKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNameBlur();
    }
  };

  // Save current group
  // Save current group
  const saveGroup = () => {
    if (entireDocumentSelected || reviewContent.length === 0) return;

    // Map review content to include their references
    const contentWithReferences = reviewContent.map((item) => ({
      ...item,
      referencedDocuments: contentReferenceDocs[item.id] || [],
    }));

    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      documentName: documentName,
      reviewContent: contentWithReferences,
      relatedContent: [],
      referencedDocuments: [...referReviewDocuments],
    };

    setSavedGroups([...savedGroups, newGroup]);
    setReviewContent([]);
    setGroupName("");
    setReferReviewDocuments([]);
    setContentReferenceDocs({});

    setExpandedGroups({
      ...expandedGroups,
      [newGroup.id]: true,
    });
  };

  // Toggle group expansion
  const toggleGroup = (groupId) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: !expandedGroups[groupId],
    });
  };

  // Start editing saved content
  const startEditSavedContent = (groupId, contentId) => {
    if (entireDocumentSelected) return;

    // Reset other editing states
    setAddingTo(null);
    setAddingToGroupId(null);
    setIsWritingContent(null);
    setManualContent("");

    // Reset search states
    setSearchText("");
    setActiveSearchItem(null);

    // Set the editing content
    setEditingContent({ groupId, contentId });
  };

  // Cancel editing saved content
  const cancelEditSavedContent = () => {
    setEditingContent(null);
  };

  // NEW: Handle clicking on a review content item to search for it
  // Replace your existing handleSearchContent function with this simplified version:

  const handleSearchContent = (contentId, text) => {
    console.log("handleSearchContent called:", {
      contentId,
      text,
      activeSearchItem,
    });

    // Clear the search if clicking the same item again (toggle behavior)
    if (activeSearchItem === contentId) {
      console.log("Clearing search - same item clicked");
      setActiveSearchItem(null);
      setSearchText("");
    } else {
      console.log("Setting new search");
      // Clear previous search first
      setActiveSearchItem(null);
      setSearchText("");

      // Set new search immediately (removed complex timing logic)
      setTimeout(() => {
        setSearchText(text);
        setActiveSearchItem(contentId);
        console.log("Search set:", { text, contentId });
      }, 100); // Small delay to ensure state updates
    }
  };

  // Content Card Component for the current group
  // Content Card Component for the current group
  const ContentCard = ({ id, item, onRemove }) => (
    <div className="bg-white border border-gray-100 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-all duration-200">
      <button
        onClick={() => onRemove(id)}
        className={`absolute top-3 right-3 ${
          entireDocumentSelected
            ? "text-gray-200 cursor-not-allowed"
            : "text-gray-300 hover:text-red-400 transition-colors duration-200"
        }`}
        aria-label="Remove content"
        disabled={entireDocumentSelected}
      >
        <X size={16} />
      </button>

      {/* Add Reference Documents button */}
      {!item.hasImage && !item.fileType && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDocSelector(true);
            setActiveContentItem(id); // Track which content item we're adding docs to
          }}
          className={`absolute top-3 right-10 ${
            entireDocumentSelected
              ? "text-gray-200 cursor-not-allowed"
              : "text-blue-300 hover:text-blue-500 transition-colors duration-200"
          }`}
          aria-label="Add reference documents"
          disabled={entireDocumentSelected}
        >
          <Link2 size={16} />
        </button>
      )}

      {item.fileType && item.fileType !== "image" ? (
        // Document file (PDF or DOCX)
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <FileText
              className={`h-4 w-4 mr-2 ${
                item.fileType === "pdf" ? "text-red-500" : "text-blue-500"
              }`}
            />
            <span className="text-sm text-gray-600 flex-1">
              {item.fileName}
            </span>
            <button
              onClick={() => openDocumentViewer(item)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </button>
          </div>
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <File
                className={`w-12 h-12 mx-auto mb-2 ${
                  item.fileType === "pdf" ? "text-red-500" : "text-blue-500"
                }`}
              />
              <p className="text-sm text-gray-600">
                {item.fileType === "pdf" ? "PDF Document" : "Word Document"}
              </p>
            </div>
          </div>
        </div>
      ) : item.hasImage ? ( // Image file
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600 flex-1">
              {item.fileName}
            </span>
            <button
              onClick={() => openFileDialog(item)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </button>
          </div>
          <img
            src={item.filePath || item.imageSrc}
            alt={item.fileName}
            className="w-full h-32 object-cover rounded cursor-pointer"
            onClick={() => openFileDialog(item)}
          />
        </div>
      ) : (
        // Text content - Display the page info
        <div className="pr-6 text-gray-700">
          <div>
            {item.content}
            {/* Display the page information in a subtle format */}
            {item.page && (
              <span className="text-gray-500 text-sm ml-1 italic">
                {item.page}
              </span>
            )}
          </div>
          {/* Show referenced documents for this content */}
          {contentReferenceDocs[id] && contentReferenceDocs[id].length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {contentReferenceDocs[id].map((docId) => {
                const doc = availableDocuments.find((d) => d.id === docId);
                return doc ? (
                  <Badge
                    key={docId}
                    variant="outline"
                    className="text-xs px-2 py-0.5 flex items-center border-blue-200 bg-blue-50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInNewTab();
                      }}
                      className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                    >
                      <Eye className="h-3 w-3 text-blue-600" />
                    </button>
                    <span className="text-blue-700">{doc.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeContentReference(id, docId);
                      }}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
  return (
    <section>
      <style>
        {`
          .force-enabled {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
        `}
      </style>

      {isInReview && (
        <p className="flex w-full items-center justify-center -mt-4 mb-4 text-red-500 bg-red-100 py-2 rounded-md">
          {" "}
          <TriangleAlert size={16} className="mr-2" />
          You are editing in In-Review Content. This might affect the Review
          Cycle!!
        </p>
      )}
      <main className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row gap-8 h-full p-4">
            {/* MS Word Viewer Panel */}

            <div
              className={`transition-all duration-300 ${
                showLeftPanel
                  ? showRightPanel
                    ? "lg:w-1/2"
                    : "w-full"
                  : "lg:w-0 opacity-0 overflow-hidden"
              } relative`}
            >
              <div className="bg-white rounded-xl h-full shadow-lg overflow-hidden flex flex-col">
                <div className={`flex-1 overflow-hidden`}>
                  {!isWebViewerLoaded && (
                    <div className="absolute inset-0 bg-white flex top-[30%] justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-gray-600">
                          Loading document viewer...
                        </p>
                      </div>
                    </div>
                  )}

                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                        <p className="text-gray-600">
                          Loading document viewer...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WebViewer with opacity transition */}
                  <div
                    className={`transition-opacity duration-300 h-full ${
                      isWebViewerLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    ref={webViewerRef}
                  >
                    <WebViewerComponent
                      setSelectedText={setSelectedText}
                      searchText={searchText}
                      onLoadComplete={handleWebViewerLoad}
                      initialPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>

              {(addingTo || editingContent) && !entireDocumentSelected && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-center text-blue-700 font-medium animate-pulse">
                  {addingTo ? (
                    `Select text to add as ${
                      addingTo === "review" ? "review" : "related"
                    } content ${addingToGroupId ? "to saved group" : ""}`
                  ) : (
                    <div className="flex flex-col items-center">
                      <div>Select text to update the content</div>
                      <Button
                        onClick={cancelEditSavedContent}
                        variant="outline"
                        className="mt-2 hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Editing
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {activeSearchItem && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 font-medium ">
                  <Search className="h-4 w-4 inline-block mr-2" />
                  Searching for selected text in document...
                  <span className="block text-xs mt-1 text-green-600">
                    Click the highlighted text again to clear search
                  </span>
                </div>
              )}
            </div>

            <div className="relative flex items-center justify-center gap-y-5 flex-col">
              <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dotted border-gray-300 " />

             <div className={`absolute top-1/2 space-y-5`}>
                 <button
                  onClick={() => handlePanels("left")}
                  className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${showLeftPanel && !showRightPanel && ("opacity-0")}`}
                  title="Expand right panel"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>

              
              <button
                  onClick={() => handlePanels("right")}
                  className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${!showLeftPanel && showRightPanel && ("opacity-0")}`}
                  title="Expand right panel"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

             </div>
            </div>

            {/* Reference Group */}

            <div
              className={`transition-all  duration-300 flex flex-col ${
                showRightPanel
                  ? showLeftPanel
                    ? "lg:w-1/2"
                    : "w-full"
                  : "lg:w-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-1">
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg shadow-md">
                    <div className="flex items-center justify-between space-x-3">
                      <div className="flex gap-x-3 items-center">
                        <Checkbox
                          id="entire-document"
                          checked={entireDocumentSelected}
                          onCheckedChange={handleEntireDocumentChange}
                          className="h-5 w-5 border-2 border-blue-400"
                        />
                        <label
                          htmlFor="entire-document"
                          className="text-sm font-medium leading-none text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <span className="flex items-center font-semibold">
                            Select entire document
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* New section for entire document content */}
                    {entireDocumentSelected && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                        <div className="mb-4">
                          <label
                            htmlFor="entire-doc-group-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Reference Group Name
                          </label>
                          <Input
                            id="entire-doc-group-name"
                            value={entireDocumentGroupName}
                            onChange={handleEntireDocumentGroupNameChange}
                            className="w-full border border-gray-300"
                            placeholder="Enter a name for this reference group"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="entire-doc-note"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Write a Note
                          </label>
                          <textarea
                            id="entire-doc-note"
                            value={entireDocumentNote}
                            onChange={handleEntireDocumentNoteChange}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none"
                            placeholder="Write your note about the entire document here..."
                          />
                        </div>

                        <Button
                          onClick={saveEntireDocumentGroup}
                          className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          disabled={!entireDocumentNote.trim()}
                        >
                          <Save className="h-5 w-5 mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Regular content section - now shown even when entire document is selected, but with overlay */}
                  <div
                    className={`bg-white rounded-xl shadow-lg p-6 mb-6 ${
                      entireDocumentSelected ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                      <div className="flex items-center flex-1">
                        <span className="bg-blue-500 w-1 h-8 rounded mr-3"></span>
                        <Input
                          value={groupName}
                          onChange={handleNameChange}
                          onBlur={handleNameBlur}
                          onKeyPress={handleNameKeyPress}
                          className="font-medium text-3xl text-gray-800 focus:border-none focus:outline-none focus-visible:ring-blue-200 border border-gray-300"
                          placeholder="Write Change Control Title/Modification here..."
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex flex-col  md:flex-row gap-8">
                      {/* Review Content Column */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Change Control Title / Modification Conditions
                        </h3>

                        <div className="space-y-3">
                          {reviewContent.length > 0 ? (
                            reviewContent.map((item) => (
                              <ContentCard
                                key={item.id}
                                id={item.id}
                                item={item}
                                onRemove={removeReviewItem}
                              />
                            ))
                          ) : (
                            <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                              <FileTextIcon className="h-8 w-8 mb-2 opacity-50" />
                              <span>Please select your content here</span>
                            </div>
                          )}
                        </div>

                        {/* Manual content writing for Review */}
                        {isWritingContent === "review" && !addingToGroupId && (
                          <div className="mt-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                            <textarea
                              value={manualContent}
                              onChange={handleManualContentChange}
                              className="w-full p-2 border border-blue-100 rounded bg-white text-gray-700 min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none"
                              placeholder="Write your content here..."
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                onClick={saveManualContent}
                                variant="default"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                disabled={!manualContent.trim()}
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                onClick={cancelWritingContent}
                                variant="outline"
                                className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Add content buttons for Review */}
                        {!isWritingContent &&
                          !editingContent &&
                          !addingToGroupId && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              <Button
                                onClick={addReviewContentBySelection}
                                variant="outline"
                                className={`rounded-lg border ${
                                  addingTo === "review"
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                }`}
                                disabled={
                                  addingTo === "review" || entireDocumentSelected
                                }
                              >
                                {addingTo === "review" ? (
                                  "Waiting..."
                                ) : (
                                  <>
                                    <MousePointer2 className="h-4 w-4 mr-2" />
                                    Select
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={writeReviewContent}
                                variant="outline"
                                className="rounded-lg border hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                disabled={addingTo === "review"}
                              >
                                <Type className="h-4 w-4 mr-2" />
                                Note
                              </Button>
                              <div className="relative">
                                <input
                                  type="file"
                                  id="file-upload"
                                  className="hidden"
                                  accept="image/*,.pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                  multiple
                                  disabled={entireDocumentSelected}
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="rounded-lg border w-full h-full flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload
                                </label>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="mt-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Link size={16} className="text-blue-600" />
                          <h3 className="text-sm font-medium">
                            Reference Documents
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          className="hover:bg-blue-500 hover:text-white"
                          size="sm"
                          onClick={() => setShowDocSelector(!showDocSelector)}
                        >
                          {showDocSelector ? "Hide" : "Link Ref-Doc"}
                        </Button>
                      </div>

                      {/* Selected documents chips */}
                      {referReviewDocuments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {referReviewDocuments.map((docId) => {
                            const doc = availableDocuments.find(
                              (d) => d.id === docId
                            );
                            return (
                              <Badge
                                key={docId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openInNewTab();
                                  }}
                                  className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                                >
                                  <Eye className="h-3 w-3 text-blue-600" />
                                </button>
                                <span className="text-blue-800">{doc?.name}</span>
                                <button
                                  onClick={() => toggleDocumentSelection(docId)}
                                  className="ml-1 rounded-full p-0.5 hover:bg-accent"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      {/* Document selection options */}
                      {/* Document selection options */}
                      {showDocSelector && (
                        <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-muted/50">
                          {/* Add header to show context */}
                          {activeContentItem && (
                            <div className="text-sm text-blue-600 font-medium mb-2 flex items-center">
                              <Link2 className="h-4 w-4 mr-1" />
                              Selecting reference documents
                            </div>
                          )}

                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search documents..."
                              className="pl-9 mb-2 border border-gray-200"
                              onChange={(e) => setSearchTextindocx(e.target.value)}
                            />
                          </div>
                          <div className="max-h-52 overflow-y-auto">
                            {availableDocuments
                              .filter((doc) =>
                                doc.name
                                  .toLowerCase()
                                  .includes(searchTextindocx.toLowerCase())
                              )
                              .map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                                  onClick={() =>
                                    toggleDocumentSelection(
                                      doc.id,
                                      activeContentItem
                                    )
                                  }
                                >
                                  <div
                                    className={`w-4 h-4 border rounded-sm flex items-center justify-center 
              ${
                (
                  activeContentItem
                    ? contentReferenceDocs[activeContentItem]?.includes(doc.id)
                    : referReviewDocuments.includes(doc.id)
                )
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}
                                  >
                                    {(activeContentItem
                                      ? contentReferenceDocs[
                                          activeContentItem
                                        ]?.includes(doc.id)
                                      : referReviewDocuments.includes(doc.id)) && (
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <span className="text-sm">{doc.name}</span>
                                </div>
                              ))}
                          </div>
                          <Button
                            onClick={() => {
                              setShowDocSelector(false);
                              setActiveContentItem(null);
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 mt-2"
                            size="sm"
                          >
                            Select
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Save Group Button */}
                    <div className="mt-8">
                      <Button
                        onClick={saveGroup}
                        className="w-full py-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        disabled={
                          entireDocumentSelected || reviewContent.length === 0
                        }
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  {/* Saved Groups Section - now always shown but with overlay when entire document is selected */}
                  {savedGroups.length > 0 && (
                    <div
                      className={`bg-white rounded-xl shadow-lg p-6 ${
                        entireDocumentSelected
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      <h2 className="text-xl font-medium mb-6 text-gray-800 flex items-center border-b pb-4">
                        <span className="bg-green-500 w-1 h-8 rounded mr-3"></span>
                        Change Control Title / Modification for Review
                      </h2>

                      <div className="space-y-4">
                        {savedGroups.map((group, index) => (
                          <div
                            key={group.id}
                            className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div
                              className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center cursor-pointer"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <div className="flex flex-1 items-center">
                                <h3 className="font-semibold text-gray-700 flex items-center">
                                  <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                                    {index + 1}
                                  </span>
                                  {group.name}
                                  {group.isEntireDocument && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                      Entire Document
                                    </span>
                                  )}
                                </h3>
                              </div>
                              {expandedGroups[group.id] ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            {expandedGroups[group.id] && (
                              <div className="p-4 bg-white">
                                {/* Add Reference Documents Section */}
                                {group.referencedDocuments &&
                                  group.referencedDocuments.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="font-medium text-sm text-gray-500 flex items-center mb-2">
                                        <Link2 className="h-4 w-4 mr-2 text-blue-500" />
                                        Reference Documents
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {group.referencedDocuments.map((docId) => {
                                          const doc = availableDocuments.find(
                                            (d) => d.id === docId
                                          );
                                          return doc ? (
                                            <Badge
                                              key={docId}
                                              variant="outline"
                                              className="border-none px-2 py-1 bg-blue-100 text-sm flex items-center text-blue-600"
                                            >
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  openInNewTab();
                                                }}
                                                className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                                              >
                                                <Eye className="h-4 w-4 text-blue-500" />
                                              </button>
                                              {doc.name}
                                            </Badge>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}

                                <div className="flex flex-col gap-6">
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="font-medium text-sm text-gray-500 flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                        Change Control Title / Modification Contents
                                      </h4>
                                      {!group.isEntireDocument && (
                                        <div className="flex space-x-1">
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              addSavedGroupReviewContentBySelection(
                                                group.id
                                              );
                                            }}
                                            variant="outline"
                                            size="icon"
                                            className={`h-7 w-7 p-1 rounded-full ${
                                              addingTo === "review" &&
                                              addingToGroupId === group.id
                                                ? "bg-blue-100 text-blue-600"
                                                : "hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                                            }`}
                                            disabled={
                                              entireDocumentSelected ||
                                              (addingTo === "review" &&
                                                addingToGroupId === group.id) ||
                                              editingContent !== null
                                            }
                                            title="Select text from document"
                                          >
                                            <MousePointer2 className="h-4 w-4" />
                                          </Button>

                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              writeSavedGroupReviewContent(
                                                group.id
                                              );
                                            }}
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7 p-1 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                                            disabled={
                                              isWritingContent !== null ||
                                              editingContent !== null
                                            }
                                            title="Write a note"
                                          >
                                            <Type className="h-4 w-4" />
                                          </Button>

                                          <div className="relative">
                                            <input
                                              type="file"
                                              id={`file-upload-${group.id}`}
                                              className="hidden"
                                              accept="image/*,.pdf,.doc,.docx"
                                              onChange={(e) =>
                                                handleSavedGroupFileUpload(
                                                  e,
                                                  group.id
                                                )
                                              }
                                              multiple
                                              disabled={entireDocumentSelected}
                                            />
                                            <label
                                              htmlFor={`file-upload-${group.id}`}
                                              className="flex items-center justify-center h-7 w-7 p-1 rounded-full border cursor-pointer hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                                              title="Upload files (images, PDF, DOCX)"
                                            >
                                              <Upload className="h-4 w-4" />
                                            </label>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {isWritingContent === "review" &&
                                      addingToGroupId === group.id && (
                                        <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                                          <textarea
                                            value={manualContent}
                                            onChange={handleManualContentChange}
                                            className="w-full p-2 border border-blue-100 rounded bg-white text-gray-700 min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none"
                                            placeholder="Write your content here..."
                                            autoFocus
                                          />
                                          <div className="flex gap-2 mt-2">
                                            <Button
                                              onClick={saveManualContent}
                                              variant="default"
                                              className="bg-blue-500 hover:bg-blue-600 text-white"
                                              disabled={!manualContent.trim()}
                                            >
                                              <Save className="h-4 w-4 mr-2" />
                                              Save
                                            </Button>
                                            <Button
                                              onClick={cancelWritingContent}
                                              variant="outline"
                                              className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>
                                      )}

                                    <div className="space-y-2">
                                      {group.reviewContent.map((item) => (
                                        <div
                                          key={item.id}
                                          className={`p-2 ${
                                            activeSearchItem === item.id
                                              ? "bg-green-100 border-green-200 shadow-sm"
                                              : editingContent &&
                                                editingContent.groupId ===
                                                  group.id &&
                                                editingContent.contentId === item.id
                                              ? "bg-blue-200 border-blue-300 shadow-sm" // Highlight when editing
                                              : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                                          } rounded-lg border text-sm text-gray-700 relative group cursor-pointer`}
                                          onClick={() =>
                                            !item.hasImage &&
                                            !item.fileType &&
                                            !item.isEntireDocument
                                              ? handleSearchContent(
                                                  item.id,
                                                  item.content
                                                )
                                              : null
                                          }
                                        >
                                          {!item.hasImage &&
                                            !item.fileType &&
                                            !item.isEntireDocument &&
                                            !group.isEntireDocument && (
                                              <div className="absolute top-2 right-2 flex flex-row space-x-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditSavedContent(
                                                      group.id,
                                                      item.id
                                                    );
                                                  }}
                                                  className={`p-1 rounded ${
                                                    editingContent &&
                                                    editingContent.groupId ===
                                                      group.id &&
                                                    editingContent.contentId ===
                                                      item.id
                                                      ? "bg-blue-200 text-blue-600"
                                                      : "hover:bg-blue-100 text-blue-500"
                                                  }`}
                                                  disabled={
                                                    entireDocumentSelected ||
                                                    editingContent !== null
                                                  }
                                                  aria-label="Edit content"
                                                >
                                                  <Pencil size={16} />
                                                </button>

                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSavedGroupReviewItem(
                                                      group.id,
                                                      item.id
                                                    );
                                                  }}
                                                  className="p-1 rounded hover:bg-red-100 text-red-500"
                                                  disabled={entireDocumentSelected}
                                                  aria-label="Delete content"
                                                >
                                                  <X size={16} />
                                                </button>
                                              </div>
                                            )}

                                          {item.isEntireDocument ? (
                                            <div className="pr-6">
                                              <div className="flex items-center mb-2">
                                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="text-blue-600 font-medium">
                                                  Entire Document Note
                                                </span>
                                              </div>
                                              {item.content}
                                            </div>
                                          ) : item.fileType === "pdf" ? (
                                            <div className="flex flex-col">
                                              <div className="flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-red-500" />
                                                <span className="text-sm flex-1">
                                                  {item.fileName}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDocumentViewer(item);
                                                  }}
                                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                                >
                                                  <Eye className="h-4 w-4 text-red-500" />
                                                </button>
                                              </div>
                                              <div className="mt-2 h-16 bg-red-50 rounded flex items-center justify-center">
                                                <p className="text-red-600 text-xs">
                                                  PDF Document
                                                </p>
                                              </div>
                                            </div>
                                          ) : item.fileType === "docx" ||
                                            item.fileType === "doc" ? (
                                            <div className="flex flex-col">
                                              <div className="flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                                <span className="text-sm flex-1">
                                                  {item.fileName}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDocumentViewer(item);
                                                  }}
                                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                                >
                                                  <Eye className="h-4 w-4 text-blue-500" />
                                                </button>
                                              </div>
                                              <div className="mt-2 h-16 bg-blue-50 rounded flex items-center justify-center">
                                                <p className="text-blue-600 text-xs">
                                                  Word Document
                                                </p>
                                              </div>
                                            </div>
                                          ) : item.hasImage ? (
                                            <div className="flex flex-col">
                                              <div className="flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-green-500" />
                                                <span className="text-sm flex-1">
                                                  {item.fileName}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    openFileDialog(item);
                                                  }}
                                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                                >
                                                  <Eye className="h-4 w-4 text-green-500" />
                                                </button>
                                              </div>
                                              <img
                                                src={item.filePath || item.imageSrc}
                                                alt={item.fileName || "Image"}
                                                className="mt-2 w-full h-16 object-cover rounded cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  openFileDialog(item);
                                                }}
                                              />
                                            </div>
                                          ) : (
                                            // In the saved groups section where content is displayed:
                                            <div className="pr-6">
                                              <div className="flex items-center">
                                                {activeSearchItem === item.id && (
                                                  <Search className="h-3 w-3 text-green-600 mr-1 inline-block" />
                                                )}
                                                <span>
                                                  {item.content}
                                                  {/* Display the page information */}
                                                  {item.page && (
                                                    <span className="text-gray-500 text-sm ml-1 italic">
                                                      {item.page}
                                                    </span>
                                                  )}
                                                </span>
                                              </div>
                                              {/* Show referenced documents for this content */}
                                              {item.referencedDocuments &&
                                                item.referencedDocuments.length >
                                                  0 && (
                                                  <div className="mt-2 flex flex-wrap gap-1">
                                                    {item.referencedDocuments.map(
                                                      (docId) => {
                                                        const doc =
                                                          availableDocuments.find(
                                                            (d) => d.id === docId
                                                          );
                                                        return doc ? (
                                                          <Badge
                                                            key={docId}
                                                            variant="outline"
                                                            className="text-xs px-2 py-0.5 flex items-center"
                                                          >
                                                            <button
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                openInNewTab();
                                                              }}
                                                              className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                                                            >
                                                              <Eye className="h-3 w-3 text-blue-600" />
                                                            </button>
                                                            <span className="text-blue-700">
                                                              {doc.name}
                                                            </span>
                                                            {/* Note: For saved groups, you may want to implement editing functionality
                to allow removing references from saved content */}
                                                          </Badge>
                                                        ) : null;
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          )}
                                          {editingContent &&
                                            editingContent.groupId === group.id &&
                                            editingContent.contentId ===
                                              item.id && (
                                              <div className="mt-2 text-blue-600 text-xs flex items-center">
                                                <MousePointer2 className="h-3 w-3 mr-1 animate-pulse" />
                                                Select new text to replace this
                                                content
                                              </div>
                                            )}
                                        </div>
                                      ))}
                                      {group.reviewContent.length === 0 && (
                                        <div className="text-gray-400 text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 italic">
                                          No review content
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Image/File Preview Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {selectedFile?.fileName || "File Preview"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedFile && selectedFile.hasImage && (
                <img
                  src={selectedFile.filePath || selectedFile.imageSrc}
                  alt={selectedFile.fileName || "Image preview"}
                  className="w-full rounded"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Document Viewer Popup */}
        <FullPagePopup
          isOpen={isViewerPopupOpen}
          onClose={() => setIsViewerPopupOpen(false)}
        >
          {viewerFileType === "pdf" ? (
            <div className="h-full">
              <h2 className="text-xl font-bold mb-4">PDF Viewer</h2>
              <PDFViewer initialDoc={viewerFilePath} />
            </div>
          ) : viewerFileType === "docx" || viewerFileType === "doc" ? (
            <div className="h-full">
              <WebViewerComponent
                initialDoc={viewerFilePath}
                // setSelectedText={() => {}}
                searchText=""
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <p>Cannot preview this file type.</p>
            </div>
          )}
        </FullPagePopup>

        {/* Fixed Save Button */}
        <SaveButton title={currentDocument?.name} isInReview={isInReview} />
      </main>
    </section>
  );
}
