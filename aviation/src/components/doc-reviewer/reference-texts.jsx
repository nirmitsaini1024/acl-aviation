import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MinimalButton, Spinner, TextBox } from '@react-pdf-viewer/core';
import { NextIcon, PreviousIcon } from '@react-pdf-viewer/search';

// SearchStatus enum
const SearchStatus = {
  NotSearchedYet: 0,
  Searching: 1,
  FoundResults: 2
};

const ReferenceTexts = ({
  message,
  searchPluginInstance,
  wordViewerResults = [],
  onSearch,
  onNavigateToWordResult,
}) => {
  const [searchStatus, setSearchStatus] = useState(SearchStatus.NotSearchedYet);
  const [pdfMatches, setPdfMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const resultsContainerRef = useRef(null);

  // Combine PDF and Word results whenever either changes
  useEffect(() => {
    const combined = [...pdfMatches, ...wordViewerResults].sort((a, b) => {
      if (a.source !== b.source) {
        return a.source === 'pdf' ? -1 : 1;
      }
      return a.pageIndex - b.pageIndex;
    });
    setAllMatches(combined);
    setIsSearching(false);

    // Scroll to top of results when new matches are found
    setTimeout(() => {
      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollTop = 0;
      }
    }, 0);
  }, [pdfMatches, wordViewerResults]);

  const renderMatchSample = (match) => {
    if (!match) return null;
    
    if (match.source === "pdf") {
      const wordsBefore = match.pageText.substr(match.startIndex - 20, 20);
      let words = wordsBefore.split(' ');
      words.shift();
      const begin = words.length === 0 ? wordsBefore : words.join(' ');
      
      const wordsAfter = match.pageText.substr(match.endIndex, 60);
      words = wordsAfter.split(' ');
      words.pop();
      const end = words.length === 0 ? wordsAfter : words.join(' ');
      
      return (
        <div>
          {begin}
          <span style={{ backgroundColor: 'rgb(255, 255, 0)' }}>
            {match.pageText.substring(match.startIndex, match.endIndex)}
          </span>
          {end}
        </div>
      );
    } else {
      // Word document match formatting
      const text = match.text;
      const startIndex = match.startIndex;
      const endIndex = match.endIndex;
      const beforeText = text.substring(0, startIndex);
      const matchedText = text.substring(startIndex, endIndex);
      const afterText = text.substring(endIndex);
      
      return (
        <div>
          {beforeText}
          <span style={{ backgroundColor: 'rgb(255, 255, 0)' }}>
            {matchedText}
          </span>
          {afterText}
        </div>
      );
    }
  };

  // Use the Search component from the search plugin
  if (!searchPluginInstance || !searchPluginInstance.Search) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="text-center py-8 text-gray-500">
          PDF search plugin not available. Please reload the page.
        </div>
      </div>
    );
  }

  const { Search } = searchPluginInstance;

  return (
    <Search>
      {(renderSearchProps) => {
        const { 
          currentMatch, 
          keyword, 
          setKeyword, 
          jumpToMatch, 
          jumpToNextMatch, 
          jumpToPreviousMatch, 
          search 
        } = renderSearchProps;

        const handleSearchKeyDown = (e) => {
          if (e.key === 'Enter' && keyword) {
            setSearchStatus(SearchStatus.Searching);
            
            // Handle Word search through the callback
            if (onSearch) {
              onSearch(keyword);
            }
            
            // Use the search plugin's search functionality
            search().then((matches) => {
              setSearchStatus(SearchStatus.FoundResults);
              
              // Format PDF matches
              const formattedMatches = matches.map((match, index) => ({
                id: `pdf-${index}`,
                source: 'pdf',
                pageIndex: match.pageIndex,
                startIndex: match.startIndex,
                endIndex: match.endIndex,
                pageText: match.pageText || '',
                originalMatch: match,
                originalIndex: index + 1 // +1 because plugin uses 1-based indices
              }));
              
              setPdfMatches(formattedMatches);
            });
          }
        };

        return (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Input */}
            <div className="p-4 relative">
              <TextBox
                placeholder="Enter to search"
                value={keyword}
                onChange={setKeyword}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchStatus === SearchStatus.Searching && (
                <div className="absolute right-6 top-6 flex items-center justify-center">
                  <Spinner size="1.5rem" />
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchStatus === SearchStatus.FoundResults && (
              <>
                {allMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No results found</div>
                ) : (
                  <>
                    {/* Match Navigation */}
                    <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200">
                      <div className="text-sm text-gray-500">
                        Found {allMatches.length} results
                      </div>
                      <div className="flex space-x-2">
                        <MinimalButton onClick={jumpToPreviousMatch} title="Previous match (Shift+F3)">
                          <PreviousIcon />
                        </MinimalButton>
                        <MinimalButton onClick={jumpToNextMatch} title="Next match (F3)">
                          <NextIcon />
                        </MinimalButton>
                      </div>
                    </div>

                    {/* Results List */}
                    <div 
                      ref={resultsContainerRef}
                      className="flex-1 overflow-y-auto p-4 border-t border-gray-200"
                      style={{ 
                        maxHeight: 'calc(100vh - 200px)', // Adjust height based on available space
                      }}
                    >
                      {allMatches.map((match, index) => (
                        <div 
                          key={match.id} 
                          className="mb-4 last:mb-0"
                        >
                          <div className="flex justify-between mb-2">
                            <div>#{index + 1}</div>
                            <div className="text-xs text-gray-500">
                              {match.source === "pdf" ? "PDF" : "Word"} - Page {match.pageIndex + 1}
                            </div>
                          </div>
                          <div
                            className={`p-3 rounded-md border ${
                              currentMatch === (match.source === "pdf" ? match.originalIndex : null)
                                ? "bg-blue-50 border-blue-300"
                                : "bg-gray-50 border-gray-200"
                            } hover:border-blue-300 transition-colors cursor-pointer`}
                            onClick={() => {
                              if (match.source === "pdf") {
                                jumpToMatch(match.originalIndex);
                              } else if (onNavigateToWordResult) {
                                onNavigateToWordResult(match);
                              }
                            }}
                          >
                            <div className="text-sm overflow-hidden text-ellipsis">
                              {renderMatchSample(match)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {searchStatus === SearchStatus.NotSearchedYet && (
              <div className="text-center py-8 text-gray-500">
                {message}
              </div>
            )}
            
            {allMatches.length > 0 && (
              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                <p>Tip: Use F3 to go to next match, Shift+F3 to go to previous match</p>
              </div>
            )}
          </div>
        );
      }}
    </Search>
  );
};

export default ReferenceTexts;