import { useEffect, useRef, useState } from "react"
import WebViewer from "@pdftron/webviewer"

const KanbanPDFDiffViewer = () => {
  const viewerRef = useRef(null)
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [viewerInstance, setViewerInstance] = useState(null)
  const [isViewerReady, setIsViewerReady] = useState(false)
  const [showAllDocs, setShowAllDocs] = useState(true) // Always show all by default
  const [selectedFinalDoc, setSelectedFinalDoc] = useState(null) // Track selected final document
  const [isAllButtonSelected, setIsAllButtonSelected] = useState(true) // All button selected by default

  // Available documents for each section
  const [finalCopyDocs] = useState([
    { id: "final1", name: "sample1.pdf", path: "/sample-1.pdf" },
    { id: "final2", name: "sample2.pdf", path: "/sample-changes2.pdf" },
    { id: "final3", name: "sample3.pdf", path: "/sample-1.pdf" },
    { id: "final4", name: "sample4.pdf", path: "/sample-1.pdf" },
    { id: "final5", name: "sample5.pdf", path: "/sample-1.pdf" },
    { id: "final6", name: "sample6.pdf", path: "/sample-1.pdf" },
    { id: "final7", name: "sample7.pdf", path: "/sample-1.pdf" }
  ])

  const [workingCopyDocs] = useState([
    { id: "working1", name: "reference1.docs", path: "/sample-1.pdf", mappedTo: "final1" },
    { id: "working2", name: "reference2.docs", path: "/sample-changes2.pdf", mappedTo: "final1" },
    { id: "working3", name: "reference3.docs", path: "/sample-1.pdf", mappedTo: "final2" },
    { id: "working4", name: "reference4.docs", path: "/sample-1.pdf", mappedTo: "final2" },
    { id: "working5", name: "reference5.docs", path: "/sample-1.pdf", mappedTo: "final3" },
    { id: "working6", name: "reference6.docs", path: "/sample-1.pdf", mappedTo: "final4" },
    { id: "working7", name: "reference7.docs", path: "/sample-1.pdf", mappedTo: "final5" },
  ])

  // Document mapping - defines which working docs are related to which final docs
  const documentMapping = {
    "final1": ["working1", "working2"], // sample1.pdf maps to reference1 and reference2
    "final2": ["working3", "working4"], // sample2.pdf maps to reference3 and reference4
    "final3": ["working5"], // sample3.pdf maps to reference5
    "final4": ["working6"], // sample4.pdf maps to reference6
    "final5": ["working7"] // sample5.pdf maps to reference7
  }

  // Documents selected for comparison
  const [compareSlots, setCompareSlots] = useState([
    { id: "compare1", document: null, position: "left" },
    { id: "compare2", document: null, position: "right" },
  ])

  // Handle "All" button click to toggle showing all documents
  const handleAllClick = () => {
    // When clicking "All" button, set it as selected and clear document selection
    setIsAllButtonSelected(true)
    setSelectedFinalDoc(null)
    setShowAllDocs(true)
  }

  // Handle final document selection
  const handleFinalDocClick = (doc) => {
    const newSelectedDoc = selectedFinalDoc?.id === doc.id ? null : doc
    setSelectedFinalDoc(newSelectedDoc)

    // Update All button selection state based on document selection
    if (newSelectedDoc) {
      setIsAllButtonSelected(false) // Unselect All button when a document is selected
    } else {
      setIsAllButtonSelected(true) // Select All button when no document is selected
    }
  }

  // Get filtered documents based on showAllDocs state - always show all final docs
  const getDisplayedFinalDocs = () => {
    return finalCopyDocs // Always show all review documents
  }

  // Get working docs based on selected final doc - always show all when no selection
  const getDisplayedWorkingDocs = () => {
    // If a review document is selected, show only its mapped documents
    if (selectedFinalDoc) {
      const mappedWorkingIds = documentMapping[selectedFinalDoc.id] || []
      return workingCopyDocs.filter(doc => mappedWorkingIds.includes(doc.id))
    }

    // If no document is selected, show ALL working documents to fill space
    return workingCopyDocs // Show all 7 documents to fill the white space
  }

  // Get count of hidden working docs
  const getHiddenWorkingDocsCount = () => {
    // Always return 0 since we're showing all documents to fill space
    return 0
  }

  // Initialize the WebViewer
  useEffect(() => {
    const initWebViewer = async () => {
      try {
        const instance = await WebViewer(
          {
            path: "/lib/webviewer", // path to your WebViewer lib directory
            fullAPI: true,
          },
          viewerRef.current,
        )

        const { UI, Core } = instance
        setViewerInstance(instance)

        // Enable side-by-side view feature
        UI.enableFeatures([UI.Feature.SideBySideView])

        // Enter multi-viewer mode programmatically
        UI.enterMultiViewerMode()

        // Wait for multi-viewer mode to be ready
        UI.addEventListener(UI.Events.MULTI_VIEWER_READY, () => {
          console.log("Multi-viewer mode is ready")
          setIsViewerReady(true)

          // Enable document comparison feature
          UI.enableFeatures([UI.Feature.ComparePages])

          // Create a sync toggle button
          const syncButton = UI.createButton({
            title: "Toggle Sync",
            img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
          })

          // Initialize sync state
          let isSyncEnabled = true

          // Add button to the header
          UI.setHeaderItems((header) => {
            header.push(syncButton)
          })

          // Set initial button style
          syncButton.element.style.backgroundColor = "#e1f5fe"

          // Toggle sync when button is clicked
          syncButton.addEventListener("click", () => {
            isSyncEnabled = !isSyncEnabled

            // Update button appearance
            if (isSyncEnabled) {
              syncButton.title = "Sync: ON (Click to disable)"
              syncButton.element.style.backgroundColor = "#e1f5fe"
              UI.enableMultiViewerSync()
            } else {
              syncButton.title = "Sync: OFF (Click to enable)"
              syncButton.element.style.backgroundColor = ""
              UI.disableMultiViewerSync()
            }
          })

          // Enable sync by default
          UI.enableMultiViewerSync()
        })
      } catch (error) {
        console.error("Error initializing WebViewer:", error)
      }
    }

    initWebViewer()
  }, [])

  // Load documents when both compare slots are filled and user clicks compare
  const handleCompare = async () => {
    console.log("Compare button clicked")
    console.log("Is viewer ready:", isViewerReady)
    console.log("Compare slots:", compareSlots)

    if (!isViewerReady) {
      alert("PDF viewer is still initializing. Please wait.")
      return
    }

    const leftDoc = compareSlots.find(slot => slot.position === "left").document
    const rightDoc = compareSlots.find(slot => slot.position === "right").document

    console.log("Left doc:", leftDoc)
    console.log("Right doc:", rightDoc)

    if (!leftDoc || !rightDoc) {
      alert("Please drag two documents into the comparison area.")
      return
    }

    try {
      console.log("Fetching documents...")
      // Fetch the files from their paths
      const [leftFileData, rightFileData] = await Promise.all([
        fetch(leftDoc.path).then(res => {
          console.log("Left file response:", res)
          return res.blob()
        }),
        fetch(rightDoc.path).then(res => {
          console.log("Right file response:", res)
          return res.blob()
        })
      ])

      console.log("Files fetched successfully")

      // Create File objects
      const file1 = new File([leftFileData], leftDoc.name, { type: "application/pdf" })
      const file2 = new File([rightFileData], rightDoc.name, { type: "application/pdf" })

      setFile1(file1)
      setFile2(file2)

      console.log("Loading documents into viewer...")
      // Load the documents
      await loadDocuments(file1, file2)
    } catch (error) {
      console.error("Error fetching the PDFs:", error)
      alert(`Failed to load PDFs: ${error.message}`)
    }
  }

  // Function to load documents into viewers
  const loadDocuments = async (leftFile, rightFile) => {
    if (!viewerInstance || !leftFile || !rightFile) return

    try {
      const { UI, Core } = viewerInstance

      // Get references to both document viewers
      const [documentViewer1, documentViewer2] = Core.getDocumentViewers()

      // Create file data arrays from the files
      const file1Data = await leftFile.arrayBuffer()
      const file2Data = await rightFile.arrayBuffer()

      // Check if files are valid PDFs
      const isPDF1Valid = validatePDF(file1Data)
      const isPDF2Valid = validatePDF(file2Data)

      if (!isPDF1Valid || !isPDF2Valid) {
        throw new Error("One or both files are not valid PDF documents.")
      }

      // Load the documents directly using the array buffers
      await documentViewer1.loadDocument(new Uint8Array(file1Data), {
        filename: leftFile.name,
        extension: "pdf",
      })

      await documentViewer2.loadDocument(new Uint8Array(file2Data), {
        filename: rightFile.name,
        extension: "pdf",
      })

      console.log("Documents loaded successfully")
    } catch (error) {
      console.error("Error loading documents:", error)
      alert(`Failed to load PDFs: ${error.message}`)
    }
  }

  // Helper function to validate if a file is a PDF
  const validatePDF = (arrayBuffer) => {
    // Check for PDF signature at the beginning of the file
    // PDF files start with "%PDF-"
    const signature = new Uint8Array(arrayBuffer, 0, 5)
    const header = String.fromCharCode.apply(null, signature)
    return header.indexOf("%PDF-") === 0
  }

  // Handle drag start
  const handleDragStart = (e, doc, source) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      doc,
      source
    }))
  }

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = "#f0f9ff"
    e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1) inset"
  }

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = ""
    e.currentTarget.style.boxShadow = ""
  }

  // Handle drop into compare slot
  const handleDrop = (e, targetSlotId) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = ""
    e.currentTarget.style.boxShadow = ""

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))

      // Update the compare slots
      setCompareSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.id === targetSlotId ? { ...slot, document: data.doc } : slot
        )
      )
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  // Remove document from compare slot
  const removeFromCompare = (slotId) => {
    setCompareSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, document: null } : slot
      )
    )
  }

  // Render document card for Kanban board
  const renderDocCard = (doc, source) => {
    const isSelected = source === "final" && selectedFinalDoc?.id === doc.id
    return (
      <div
        key={doc.id}
        draggable
        onDragStart={(e) => handleDragStart(e, doc, source)}
        onClick={() => source === "final" && handleFinalDocClick(doc)}
        style={{
          padding: "10px", // Increased from 6px
          backgroundColor: isSelected ? "#e3f2fd" : "white",
          borderRadius: "6px", // Increased from 4px
          boxShadow: isSelected
            ? "0 2px 6px rgba(33, 150, 243, 0.3)" // Increased shadow
            : "0 2px 4px rgba(0,0,0,0.1)", // Increased shadow
          marginBottom: "6px", // Increased from 4px
          cursor: source === "final" ? "pointer" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: isSelected ? "1px solid #2196f3" : "1px solid transparent",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: "18px", // Increased from 16px
            height: "18px", // Increased from 16px
            marginRight: "6px", // Increased from 4px
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c"> {/* Increased from 12x12 */}
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <span style={{ fontSize: "14px" }}>{doc.name}</span> {/* Increased from 12px */}
        </div>
        {source === "final" && (
          <div style={{
            fontSize: "10px", // Increased from 8px
            color: "#666",
            backgroundColor: "#f0f0f0",
            padding: "2px 4px", // Increased from 1px 3px
            borderRadius: "8px", // Increased from 6px
            marginLeft: "6px" // Increased from 4px
          }}>
            {documentMapping[doc.id]?.length || 0} refs
          </div>
        )}
      </div>
    )
  }

  // Render compare slot
  const renderCompareSlot = (slot) => (
    <div
      key={slot.id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, slot.id)}
      style={{
        flex: 1,
        height: "50px", // Reduced from 80px
        border: "2px dashed #ccc",
        borderRadius: "4px", // Reduced from 6px
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px", // Reduced from 8px
        backgroundColor: slot.document ? "#f5f5f5" : "transparent",
        position: "relative",
        margin: "0 6px", // Reduced from 8px
      }}
    >
      {slot.document ? (
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px" // Reduced from 8px
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c" style={{ marginRight: "6px" }}> {/* Reduced from 20x20 */}
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <span style={{ fontSize: "12px" }}>{slot.document.name}</span> {/* Reduced font size */}
          </div>
          <button
            onClick={() => removeFromCompare(slot.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px", // Reduced from 4px
              borderRadius: "50%",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#999"> {/* Reduced from 16x16 */}
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      ) : (
        <span style={{ color: "#999", fontSize: "12px" }}> {/* Reduced font size */}
          Drop document here ({slot.position === "left" ? "Left" : "Right"} Panel)
        </span>
      )}
    </div>
  )

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Kanban Board */}
      <div style={{
        padding: "10px", // Reduced further from 12px
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "12px", // Reduced from 20px
          width: "100%"
        }}>
          {/* Final Copy Column */}
          <div style={{ flex: "0 0 250px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              // Reduced from 16px
            }} className="w-full bg-blue-600 p-2 text-white rounded-t-md">
              <h3 style={{
                margin: "0",
                color: "#fff",
                fontSize: "16px", // Increased from 14px to medium
                fontWeight: "500", // Changed to medium (500)
                display: "flex",
                alignItems: "center"
              }} >
                Review Documents
              </h3>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "12px", // Reduced from 16px
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)" // Reduced shadow
            }} className="rounded-t-none rounded-md">
              {/* Header Section */}


              {/* All Button */}
              <div
                onClick={handleAllClick}
                className="rounded-t-none"
                style={{
                  padding: "6px", // Reduced from 10px
                  backgroundColor: isAllButtonSelected ? "#e3f2fd" : "white",
                  borderRadius: "4px", // Reduced from 6px
                  boxShadow: isAllButtonSelected
                    ? "0 1px 4px rgba(33, 150, 243, 0.3)" // Reduced shadow
                    : "0 1px 2px rgba(0,0,0,0.1)", // Reduced shadow
                  marginBottom: "8px", // Reduced from 12px
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: isAllButtonSelected ? "1px solid #2196f3" : "1px solid transparent", // Reduced border
                  transition: "all 0.2s ease",
                  opacity: "1",
                }}
                onMouseEnter={(e) => {
                  if (!isAllButtonSelected) {
                    e.target.style.backgroundColor = "#f5f5f5"
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.15)" // Reduced shadow
                  } else {
                    e.target.style.backgroundColor = "#bbdefb"
                    e.target.style.boxShadow = "0 2px 4px rgba(33, 150, 243, 0.4)" // Reduced shadow
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isAllButtonSelected) {
                    e.target.style.backgroundColor = "white"
                    e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)" // Reduced shadow
                  } else {
                    e.target.style.backgroundColor = "#e3f2fd"
                    e.target.style.boxShadow = "0 1px 4px rgba(33, 150, 243, 0.3)" // Reduced shadow
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    width: "16px", // Reduced from 20px
                    height: "16px", // Reduced from 20px
                    marginRight: "4px", // Reduced from 6px
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={isAllButtonSelected ? "#2196f3" : "#999"}> {/* Reduced from 16x16 */}
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span style={{ color: isAllButtonSelected ? "#2196f3" : "#999", fontWeight: isAllButtonSelected ? "600" : "400", fontSize: "12px" }}> {/* Reduced from 14px */}
                    All
                  </span>
                </div>
                <div style={{
                  fontSize: "8px", // Reduced from 9px
                  color: isAllButtonSelected ? "#2196f3" : "#999",
                  backgroundColor: isAllButtonSelected ? "#e3f2fd" : "#f0f0f0",
                  padding: "1px 3px", // Reduced from 2px 4px
                  borderRadius: "6px", // Reduced from 8px
                  marginLeft: "4px" // Reduced from 6px
                }}>
                  All
                </div>
              </div>

              {/* Scrollable Documents Area */}
              <div style={{
                overflowY: "auto",
                height: "140px", // Reduced further from 174px
                border: "1px solid transparent"
              }}>
                {getDisplayedFinalDocs().map(doc => renderDocCard(doc, "final"))}
              </div>
            </div>
          </div>

          {/* Working Copy Column */}
          <div style={{ flex: "0 0 250px" }}>
            <div className="w-full bg-blue-600 p-2 text-white rounded-t-md">
              <h3 style={{
                margin: "0",
                color: "#fff",
                fontSize: "16px", // Increased from 14px to medium
                fontWeight: "500", // Changed to medium (500)
                display: "flex",
                alignItems: "center"
              }}>
                Reference Documents
              </h3>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "12px", // Reduced from 16px
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)" // Reduced shadow
            }} className="rounded-t-none rounded-md">

              {/* Combined scrollable area that covers the entire remaining space - starts from All button level */}
              <div style={{
                overflowY: "auto",
                height: "168px", // Reduced further: All button area (28px) + scrollable area (140px)
                border: "1px solid transparent"
              }}>
                {getDisplayedWorkingDocs().map(doc => renderDocCard(doc, "working"))}
                {selectedFinalDoc && getDisplayedWorkingDocs().length === 0 && (
                  <div style={{
                    padding: "12px", // Reduced from 16px
                    textAlign: "center",
                    color: "#999",
                    fontSize: "12px", // Reduced from 14px
                    fontStyle: "italic"
                  }}>
                    No reference documents mapped to {selectedFinalDoc.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compare Column */}
          <div style={{ flex: 1 }}>
            <div className="w-full bg-blue-600 p-2 text-white rounded-t-md">
              <h3 style={{
                margin: "0",
                color: "#fff",
                fontSize: "16px", // Increased from 14px to medium
                fontWeight: "500", // Changed to medium (500)
                display: "flex",
                alignItems: "center"
              }}>
                Compare
              </h3>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "12px", // Reduced from 16px
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)" // Reduced shadow
            }} className="rounded-t-none rounded-md">
              <div style={{
                display: "flex",
                gap: "12px", // Reduced from 16px
                marginBottom: "12px" // Reduced from 16px
              }}>
                {compareSlots.map(slot => renderCompareSlot(slot))}
              </div>
              <button
                onClick={handleCompare}
                disabled={!compareSlots.every(slot => slot.document) || !isViewerReady}
                style={{
                  width: "100%",
                  padding: "8px", // Reduced from 12px
                  backgroundColor: !isViewerReady || !compareSlots.every(slot => slot.document)
                    ? "#e0e0e0"
                    : "#2196f3",
                  color: !isViewerReady || !compareSlots.every(slot => slot.document)
                    ? "#757575"
                    : "white",
                  border: "none",
                  borderRadius: "4px", // Reduced from 6px
                  cursor: !isViewerReady || !compareSlots.every(slot => slot.document)
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "500",
                  fontSize: "12px", // Reduced from 14px
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)", // Reduced shadow
                }}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#1976d2"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#2196f3"
                  }
                }}
              >
                {!isViewerReady
                  ? "Initializing..."
                  : !compareSlots.every(slot => slot.document)
                    ? "Drop 2 documents to compare"
                    : "Compare Documents"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={viewerRef} style={{ flex: 1, overflow: "hidden" }} />
    </div>
  )
}

export default KanbanPDFDiffViewer