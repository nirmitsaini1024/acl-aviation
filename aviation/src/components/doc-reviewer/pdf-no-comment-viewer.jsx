import React, { useEffect } from 'react';
import { 
  Worker, 
  Viewer, 
  SpecialZoomLevel, 
  ScrollMode
} from '@react-pdf-viewer/core';
import { searchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

const PDFTableViewer = ({ onSetSearchPluginInstance, onLoadComplete }) => {
  // Replace with the correct URL or path to your PDF file
  
  const fileUrl = '/sample-table-no-comments.pdf';

  // Create the search plugin instance
  const searchPluginInstance = searchPlugin({
    // Enable keyword highlighting
    enableHighlight: true
  });

  // Pass the search plugin instance to the parent component
  useEffect(() => {
    if (onSetSearchPluginInstance) {
      onSetSearchPluginInstance(searchPluginInstance);
    }
  }, [onSetSearchPluginInstance]);

  const handleError = (error) => {
    console.error("Error loading PDF:", error);
  };

  return (
    <div className="h-full w-full overflow-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          defaultScale={SpecialZoomLevel.PageWidth}
          scrollMode={ScrollMode.Vertical}
          plugins={[searchPluginInstance]}
           onError={handleError}
          onDocumentLoad={() => {console.log("PDF document loaded successfully"), onLoadComplete()}}
        />
      </Worker>
    </div>
  );
};

export default PDFTableViewer;