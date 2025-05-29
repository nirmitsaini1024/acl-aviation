import React, { useCallback, useEffect, useRef, useState } from "react";
import WebViewerComponent from "./NewWebViewer";

export const WebViewerWrapper = React.memo(({ 
  setSelectedText, 
  searchText, 
  onLoadComplete, 
  initialPage, 
  onPageChange 
}) => {
  // Create stable callback refs
  const setSelectedTextRef = useRef(setSelectedText);
  const onLoadCompleteRef = useRef(onLoadComplete);
  const onPageChangeRef = useRef(onPageChange);
  const initialPageRef = useRef(initialPage);
  const searchTextRef = useRef(searchText);
  
  // Store the selectedPage locally to avoid re-renders
  const [selectedPageLocal, setSelectedPageLocal] = useState(null);
  
  // Update refs when props change
  useEffect(() => {
    setSelectedTextRef.current = setSelectedText;
    onLoadCompleteRef.current = onLoadComplete;
    onPageChangeRef.current = onPageChange;
    initialPageRef.current = initialPage;
    searchTextRef.current = searchText;
  }, [setSelectedText, onLoadComplete, onPageChange, initialPage, searchText]);
  
  // Create stable callbacks
  const stableSetSelectedPage = useCallback((page) => {
    setSelectedPageLocal(page);
  }, []);
  
  const stableSetSelectedText = useCallback((text) => {
    if (setSelectedTextRef.current) {
      setSelectedTextRef.current(text);
      console.log("Selected text:", text);
      setSelectedText(text);
    }
  }, []);
  
  const stableOnLoadComplete = useCallback(() => {
    if (onLoadCompleteRef.current) {
      onLoadCompleteRef.current();
    }
  }, []);
  
  const stableOnPageChange = useCallback((page) => {
    if (onPageChangeRef.current) {
      onPageChangeRef.current(page);
    }
  }, []);

  return (
    <div key="webviewer-container" className="h-full">
      <WebViewerComponent
        setSelectedText={stableSetSelectedText}
        setSelectedPage={stableSetSelectedPage}
        searchText={searchTextRef.current}
        onLoadComplete={stableOnLoadComplete}
        initialPage={initialPageRef.current}
        onPageChange={stableOnPageChange}
      />
    </div>
  );
}, () => true);