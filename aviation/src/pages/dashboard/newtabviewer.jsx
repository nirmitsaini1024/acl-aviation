import React, { useEffect } from 'react';
import {
    Worker,
    Viewer,
    SpecialZoomLevel,
    ScrollMode
} from '@react-pdf-viewer/core';
import { searchPlugin } from '@react-pdf-viewer/search';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const NewTabViewer = ({ onSetSearchPluginInstance }) => {
  // Replace with the correct URL or path to your PDF file
  const fileUrl = '/sample.pdf';

  // Create the search plugin instance
  const searchPluginInstance = searchPlugin({
    // Enable keyword highlighting
    enableHighlight: true
  });

  const toolbarPluginInstance = toolbarPlugin({
    searchPlugin: searchPluginInstance,
  });

  const { Toolbar } = toolbarPluginInstance;
 

  useEffect(() => {
    if (onSetSearchPluginInstance) {
      onSetSearchPluginInstance(searchPluginInstance);
    }
  }, [onSetSearchPluginInstance]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="border-b fixed w-full left-0  z-50 border-gray-300 bg-white p-2">
        <Toolbar>
          {(props) => {
            const {
              CurrentPageInput,
              Download,
              EnterFullScreen,
              NumberOfPages,
              Print,
              ShowSearchPopover,
              Zoom,
              ZoomIn,
              ZoomOut,
            } = props;
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <ZoomOut />
                    <Zoom />
                   <p className='w-auto'>
                     <ZoomIn />
                   </p>
                  </div>
                  <div className=" h-6 bg-gray-300" />
                  <div className="flex items-center space-x-1">
                    <CurrentPageInput />
                    <span className="text-sm text-gray-600 mr-2">of</span>
                    <NumberOfPages />
                  </div>
                </div>
                <div className="flex items-center space-x-2  mr-[3%]">
                  <ShowSearchPopover />
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <Print />
                  <Download />
                  <p className='w-auto'><EnterFullScreen /></p>
                </div>
              </div>
            );
          }}
        </Toolbar>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            defaultScale={0.99}
            scrollMode={ScrollMode.Vertical}
            plugins={[
              searchPluginInstance,
              toolbarPluginInstance,
            ]}
            onDocumentLoad={() => console.log("PDF document loaded successfully")}
          />
        </Worker>
      </div>
    </div>
  );
};

export default NewTabViewer;