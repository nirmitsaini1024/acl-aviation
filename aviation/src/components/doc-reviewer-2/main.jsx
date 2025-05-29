import React, { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer';

const PDFTextDiffViewer = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const initWebViewer = async () => {
      const instance = await WebViewer(
        {
          path: '/lib/webviewer', // make sure this points to your WebViewer lib directory
          fullAPI: true,
        },
        viewerRef.current
      );

      const { UI, Core } = instance;
      
      // Enable side-by-side view feature
      UI.enableFeatures([UI.Feature.SideBySideView]);
      
      // Enter multi-viewer mode programmatically
      UI.enterMultiViewerMode();
      
      // Wait for multi-viewer mode to be ready
      UI.addEventListener(UI.Events.MULTI_VIEWER_READY, async () => {
        // Get references to both document viewers
        const [documentViewer1, documentViewer2] = Core.getDocumentViewers();
        
        // Load the same document in both viewers (as per your original code)
        documentViewer1.loadDocument('/sample-1.pdf');
        documentViewer2.loadDocument('/sample-changes2.pdf');
        
        // Enable document comparison feature
        UI.enableFeatures([UI.Feature.ComparePages]);
        
        // Create a sync toggle button
        const syncButton = UI.createButton({
          title: 'Toggle Sync',
          img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
        });
        
        // Initialize sync state
        let isSyncEnabled = true;
        
        // Add button to the header
        UI.setHeaderItems(header => {
          header.push(syncButton);
        });
        
        // Set initial button style
        syncButton.element.style.backgroundColor = '#e1f5fe';
        
        // Toggle sync when button is clicked
        syncButton.addEventListener('click', () => {
          isSyncEnabled = !isSyncEnabled;
          
          // Update button appearance
          if (isSyncEnabled) {
            syncButton.title = 'Sync: ON (Click to disable)';
            syncButton.element.style.backgroundColor = '#e1f5fe';
            UI.enableMultiViewerSync();
          } else {
            syncButton.title = 'Sync: OFF (Click to enable)';
            syncButton.element.style.backgroundColor = '';
            UI.disableMultiViewerSync();
          }
        });
        
        // Enable sync by default
        UI.enableMultiViewerSync();
      });
    };

    initWebViewer();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div ref={viewerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default PDFTextDiffViewer;