import React, { Suspense, useState } from "react";
import WordViewer from "./web-viewer";
import ReferenceTexts from "./reference-texts";
import PDFViewer from "./pdf-viewer";


export default function App() { 
  const [searchPluginInstance1, setSearchPluginInstance1] = useState(null);
  const [searchPluginInstance, setSearchPluginInstance] = useState(null);
  const [wordSearchResults, setWordSearchResults] = useState([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  // Callback for handling search in the Word viewer
  const handleSearch = (searchQuery) => {
    console.log(`Searching for: ${searchQuery} in Word documents`);
    setCurrentSearchTerm(searchQuery);
    
    // Here you would implement actual Word document search
    setWordSearchResults([]);
  };

  // Callback for navigating to Word result
  const onNavigateToWordResult = (match) => {
    console.log("Navigating to Word result: ", match);
  };

  // Main content render function
  const renderMainContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-800">
      <header className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-blue-500">Compare Final vs working copy</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-0 h-full overflow-hidden">
          {/* PDF Viewer Panel */}
          <div className="border-r border-gray-200 h-full overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Final Copy</h2>
              {currentSearchTerm && (
                <div className="text-xs text-gray-500 mt-1">
                  Showing highlights for: "{currentSearchTerm}"
                </div>
              )}
            </div>
            <div className="h-[calc(100%-57px)]">
              <PDFViewer
                onSetSearchPluginInstance={setSearchPluginInstance}
              />
            </div>
          </div>

          {/* WebViewer Panel */}
          <div className="h-full overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Working Copy</h2>
            </div>
            <div className="h-[calc(100%-57px)]">
              <WordViewer onSetSearchPluginInstance={setSearchPluginInstance1}/>
            </div>
          </div>

          {/* Reference Text Panel */}
          <div className="h-full">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Search</h2>
              <div className="text-xs text-gray-500 mt-1">
                Search in PDF document
              </div>
            </div>
            <div className="h-[calc(100%-57px)] overflow-hidden">
              <Suspense fallback={<div className="p-4">Loading search panel...</div>}>
                {searchPluginInstance ? (
                  <div className="">
                  <ReferenceTexts
                    searchPluginInstance={searchPluginInstance}
                    wordViewerResults={wordSearchResults}
                    onSearch={handleSearch}
                    onNavigateToWordResult={onNavigateToWordResult}
                  />
                  {/* <ReferenceTexts
                    searchPluginInstance={searchPluginInstance1}
                    wordViewerResults={wordSearchResults}
                    onSearch={handleSearch}
                    onNavigateToWordResult={onNavigateToWordResult}
                  /> */}
                  </div>
                ) : (
                  <div className="p-4">Loading search plugin...</div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    renderMainContent()
  );
}