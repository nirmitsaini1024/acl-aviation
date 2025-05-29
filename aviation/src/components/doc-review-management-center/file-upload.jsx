import { useState, useRef, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"
import { Upload, FileText, FileIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DocumentContext } from "../review-administration/contexts/DocumentContext"

export function FileUpload({ onAddDocument }) {
  const { handleAddMultipleDocuments } = useContext(DocumentContext);
  const [file, setFile] = useState(null)
  const [documentName, setDocumentName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [domain, setDomain] = useState("")
  const [department, setDepartment] = useState("")
  const [category, setCategory] = useState("")
  const [isFinal, setIsFinal] = useState(false)
  const [isReference, setIsReference] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [isPdfFile, setIsPdfFile] = useState(false)
  const [isDocxFile, setIsDocxFile] = useState(false)
  
  const fileInputRef = useRef(null)

  // Default owner values
  const defaultOwner = {
    officer: "Officer 2",
    department: "Airline Operations",
    title: "Regulations Expert",
  };

  // Default owner values
  const defaultLastActionTS = {
    
  };

  const domains = ["Airport", "Airline"];

  const departmentOptions = {
    "Airport": ["TSA", "FAA", "Airport Security", "Airport Operations", "Public Safety"],
    "Airline": ["Airline Security", "Airline Operations"]
  }

  const categoryOptions = {
    "Airport": ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
    "Airline": ["ASP", "ADFP"]
  }

  // Helper function to map category to document type
  const getDocumentType = (category) => {
    const typeMapping = {
      "ASP": "Security",
      "AEP": "Policy", 
      "ACM": "Strategy",
      "SMS": "Manual",
      "ADFAP (Airport)": "Reference",
      "ADFP": "Report"
    };
    return typeMapping[category] || "Document";
  };

  useEffect(() => {
    if (domain) {
      setDepartment("")
      setCategory("")
    }
  }, [domain])

  useEffect(() => {
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      setIsPdfFile(false)
      setIsDocxFile(false)

      if (fileExtension === "pdf") {
        setIsPdfFile(true)
        setIsFinal(true)
        setIsWorking(false)
      } else if (fileExtension === "docx" || fileExtension === "doc") {
        setIsDocxFile(true)
        setIsWorking(true)
      }
    }
  }, [file])

  // Effect to handle Reference document selection
  useEffect(() => {
    if (isReference) {
      // When Reference is selected, uncheck others if they were checked
      // as a reference document should not also be a working or final document
      setIsFinal(false);
      setIsWorking(false);
    }
  }, [isReference]);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile)
    setDocumentName(selectedFile.name)
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFinalChange = (checked) => {
    setIsFinal(checked);
    // If Final is checked, uncheck Reference since they are mutually exclusive
    if (checked && isReference) {
      setIsReference(false);
    }
  }

  const handleWorkingChange = (checked) => {
    setIsWorking(checked);
    // If Working is checked, uncheck Reference since they are mutually exclusive
    if (checked && isReference) {
      setIsReference(false);
    }
  }

  const handleReferenceChange = (checked) => {
    setIsReference(checked);
    // If Reference is checked, uncheck others since they are mutually exclusive
    if (checked) {
      setIsFinal(false);
      setIsWorking(false);
    }
  }

 const handleSubmit = (e) => {
  e.preventDefault()

  if (!file || !domain || !department || !category) {
    alert("Please fill in all required fields and upload a file")
    return
  }

  if (!isFinal && !isWorking && !isReference) {
    alert("Please select at least one document type (Final, Working, or Reference)")
    return
  }

  const actualFileExtension = file.name.split(".").pop()?.toLowerCase()
  const commonDocId = uuidv4();

  const documentData = {
    id: commonDocId,
    name: documentName,
    domain,
    department,
    category,
    file,
    actualExtension: actualFileExtension,
    isFinal,
    isWorking,
    isReference,
    owner: {
      officer: defaultOwner.officer,
      department: department, // Use selected department instead of defaultOwner.department
      title: defaultOwner.title,
    },
    // Add these new properties for table display
    type: getDocumentType(category),
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long", 
      year: "numeric"
    }),
    createdAtTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    lastActionTS: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long", 
      year: "numeric"
    }),

    // Add details object for Final vs Working Copy column
    details: {
      summary: `${getDocumentType(category)} document for ${domain} ${department}`,
    }
  };

  // Count how many document types are selected
  const selectedTypes = [isFinal, isWorking, isReference].filter(Boolean).length;

  console.log("Selected types count:", selectedTypes, { isFinal, isWorking, isReference });

  if (selectedTypes > 1) {
    // Multiple document types selected - use the multiple documents handler
    console.log("Creating multiple documents");
    handleAddMultipleDocuments(documentData);
  } else {
    // Single document type selected
    let fileType, status, reviewStatus;

    if (isReference) {
      fileType = actualFileExtension;
      status = "N/A";
      reviewStatus = "reference";
    } else if (isFinal) {
      fileType = "pdf";
      status = "Approved";
      reviewStatus = "approved";
    } else if (isWorking) {
      fileType = "docx";
      status = "In Review";
      reviewStatus = "in-review";
    }

    const singleDocument = {
      ...documentData,
      fileType,
      status,
      reviewStatus,
      // Ensure the boolean flags are correctly set
      isFinal: isFinal,
      isWorking: isWorking,
      isReference: isReference
    };

    console.log("Creating single document:", singleDocument);
    onAddDocument(singleDocument);
  }

  // Reset form
  setFile(null)
  setDocumentName("")
  setDomain("")
  setDepartment("")
  setCategory("")
  setIsFinal(false)
  setIsWorking(false)
  setIsReference(false)
  setIsPdfFile(false)
  setIsDocxFile(false)
  if (fileInputRef.current) {
    fileInputRef.current.value = ""
  }
}

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card className="border border-blue-100 shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-blue-800">Upload Document</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 bg-red">
              <Label htmlFor="domain">Domain</Label>
              <Select value={domain} onValueChange={setDomain} required>
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder="Select Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domainOption) => (
                    <SelectItem key={domainOption} value={domainOption}>
                      {domainOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={department}
                onValueChange={setDepartment}
                required
                disabled={!domain}
              >
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder={domain ? "Select Department" : "Select Domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {domain && departmentOptions[domain].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Document Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
                disabled={!domain}
              >
                <SelectTrigger className="border-blue-100 w-full focus:border-blue-300">
                  <SelectValue placeholder={domain ? "Select Category" : "Select Domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {domain && categoryOptions[domain].map((categoryOption) => (
                    <SelectItem key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300"
              }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                {file.name.toLowerCase().endsWith('.pdf') ? (
                  <FileIcon className="h-12 w-12 text-red-500 mb-2" />
                ) : (
                  <FileText className="h-12 w-12 text-blue-500 mb-2" />
                )}
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-blue-300 mb-2" />
                <p className="text-lg font-medium">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                <p className="text-xs text-gray-400 mt-4">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            )}
          </div>

          {file && (
            <>
              <div className="space-y-2">
                <Label htmlFor="documentName" className="text-sm font-medium">
                  Document Name
                </Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Document name (defaults to file name)"
                  className="border-blue-100 focus:border-blue-300"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Document Type</Label>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="final"
                      checked={isFinal}
                      onCheckedChange={handleFinalChange}
                      disabled={isPdfFile ? false : false}
                    />
                    <Label
                      htmlFor="final"
                      className={`cursor-pointer ${isPdfFile ? '' : ''}`}
                    >
                      Final Version (.pdf)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="working"
                      checked={isWorking}
                      onCheckedChange={handleWorkingChange}
                      disabled={isPdfFile}
                    />
                    <Label
                      htmlFor="working"
                      className={`cursor-pointer ${isPdfFile ? 'text-gray-900' : ''}`}
                    >
                      Working Copy (.docx)
                      {isPdfFile && <span className="ml-1 text-xs text-gray-700">(Not available for PDF)</span>}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reference"
                      checked={isReference}
                      onCheckedChange={handleReferenceChange}
                    />
                    <Label
                      htmlFor="reference"
                      className="cursor-pointer"
                    >
                      Reference Document
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {
                    isReference
                      ? "Reference documents will be shown in the Reference Documents tab"
                      : isPdfFile
                        ? "PDF files can be marked as Final Version or Reference Document"
                        : "You can select multiple options if needed"
                  }
                </p>
              </div>
            </>
          )}

          {file && (
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Upload Document
              </Button>
            </div>
          )}
        </form>
      </div>
    </Card>
  )
}