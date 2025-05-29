import WebViewer from "@pdftron/webviewer";
import { useEffect, useRef } from "react";

export default function WebViewerComponent({ setSelectedText, searchText, setSelectedPage, onLoadComplete }) {
  const ref = useRef(null);
  const viewerInstance = useRef(null);
  const selectionBuffer = useRef({
    pageTexts: {},
    timeout: null,
    isSelecting: false,
    processedSelections: {},
    startSelection: null,
    endSelection: null
  });

 
  useEffect(() => {
    WebViewer(
      {
        path: "/lib/webviewer",
        enableOfficeEditing: true,
        initialDoc: "/sample.docx",
        licenseKey: "demo:1745783371265:611dd9f60300000000f53ccc859bd9dbdd9cc80649258f285c88bfd5f3",
        enableScrollOnlyMode: true,
      },
      ref.current
    ).then((instance) => {
      viewerInstance.current = instance;
      const { documentViewer } = instance.Core;

      
      documentViewer.addEventListener("documentLoaded", () => {
        onLoadComplete(); 
        documentViewer.zoomTo(0.50);
        documentViewer.setDisplayMode(documentViewer.DisplayModes.Single); 
        documentViewer.enableScrollOnlyMode(true); 
      });

      documentViewer.addEventListener('mouseLeftDown', () => {
        if (selectionBuffer.current.timeout) {
          clearTimeout(selectionBuffer.current.timeout);
        }
        selectionBuffer.current.isSelecting = true;
        selectionBuffer.current.pageTexts = {};
        selectionBuffer.current.processedSelections = {};
        selectionBuffer.current.startSelection = null;
        selectionBuffer.current.endSelection = null;
      });

      documentViewer.addEventListener('textSelected', (quads, selectedText, pageNumber) => {
        if (!selectionBuffer.current.isSelecting) return;

        const selectionKey = `${pageNumber}:${selectedText}`;
        if (selectionBuffer.current.processedSelections[selectionKey]) return;

        selectionBuffer.current.processedSelections[selectionKey] = true;

        if (selectedText && selectedText.trim() !== '') {
          selectionBuffer.current.pageTexts[pageNumber] = selectedText;

          if (!selectionBuffer.current.startSelection) {
            selectionBuffer.current.startSelection = { pageNumber, text: selectedText, quads };
          }
          selectionBuffer.current.endSelection = { pageNumber, text: selectedText, quads };
        }
      });

      documentViewer.addEventListener('mouseLeftUp', () => {
        if (!selectionBuffer.current.isSelecting) return;

        selectionBuffer.current.timeout = setTimeout(() => {
          if (selectionBuffer.current.startSelection &&
            selectionBuffer.current.endSelection &&
            selectionBuffer.current.startSelection.pageNumber !== selectionBuffer.current.endSelection.pageNumber) {
            handleLargeSelection(documentViewer);
          } else {
            const pageNumbers = Object.keys(selectionBuffer.current.pageTexts)
              .map(Number)
              .sort((a, b) => a - b);

            let finalText = '';
            pageNumbers.forEach(page => {
              const pageText = selectionBuffer.current.pageTexts[page];
              finalText = finalText ? finalText + '\n' + pageText : pageText;
            });

            if (finalText) {setSelectedText(finalText); setSelectedPage(pageNumbers[0])};
          }
          selectionBuffer.current.isSelecting = false;
        }, 2000);
      });

      const handleLargeSelection = async (docViewer) => {
        try {
          const { startSelection, endSelection } = selectionBuffer.current;
          if (!startSelection || !endSelection) return fallbackToStandardSelection();

          const startPage = startSelection.pageNumber;
          const endPage = endSelection.pageNumber;

          if (endPage - startPage > 3) {
            let combinedText = selectionBuffer.current.pageTexts[startPage] || '';

            for (let page = startPage + 1; page < endPage; page++) {
              try {
                const pageText = await getFullPageText(page, docViewer);
                combinedText += '\n' + pageText;
              } catch {
                if (selectionBuffer.current.pageTexts[page]) {
                  combinedText += '\n' + selectionBuffer.current.pageTexts[page];
                }
              }
            }

            if (selectionBuffer.current.pageTexts[endPage]) {
              combinedText += '\n' + selectionBuffer.current.pageTexts[endPage];
            }

            if (combinedText) {setSelectedText(combinedText), setSelectedPage(startPage)}
            else fallbackToStandardSelection();
          } else {
            fallbackToStandardSelection();
          }
        } catch {
          fallbackToStandardSelection();
        }
      };

      const getFullPageText = (pageNumber, docViewer) => {
        return new Promise((resolve, reject) => {
          docViewer.getPageText(pageNumber, (text) => {
            text ? resolve(text) : reject();
          });
        });
      };

      const fallbackToStandardSelection = () => {
        const pageNumbers = Object.keys(selectionBuffer.current.pageTexts)
          .map(Number)
          .sort((a, b) => a - b);

        let finalText = '';
        pageNumbers.forEach(page => {
          const pageText = selectionBuffer.current.pageTexts[page];
          finalText = finalText ? finalText + '\n' + pageText : pageText;
        });

        if (finalText){ setSelectedText(finalText), setSelectedPage(pageNumbers[0])};
      };
    });
  }, [setSelectedText]);

  useEffect(() => {
    if (viewerInstance.current) {
      if (searchText) {
        performSearch(searchText);
      } else {
        viewerInstance.current.Core.documentViewer.clearSearchResults();
      }
    }
  }, [searchText]);

  const performSearch = (text) => {
    if (!text || !viewerInstance.current) return;

    const { documentViewer } = viewerInstance.current.Core;
    documentViewer.setSearchHighlightColors({
      searchResult: 'rgba(255, 255, 0, 0.5)',
      activeSearchResult: 'rgba(255, 255, 0, 0.5)',
    });
    documentViewer.clearSearchResults();

    setTimeout(() => {
      const textPortions = prepareSearchText(text);
      if (textPortions.length === 0) return;
      if (textPortions.length === 1) {
        performSingleSearch(textPortions[0]);
        return;
      }
      searchMultiplePortions(textPortions);
    }, 300);
  };

  const searchMultiplePortions = async (portions) => {
    const { documentViewer, Search } = viewerInstance.current.Core;
    const searchModes = [Search.Mode.HIGHLIGHT, Search.Mode.PAGE_STOP];
    documentViewer.clearSearchResults();

    const allResults = [];
    for (let i = 0; i < portions.length; i++) {
      const result = await new Promise((resolve) => {
        documentViewer.textSearchInit(portions[i], searchModes, {
          fullSearch: true,
          onResult: resolve,
          onDocumentEnd: () => resolve(null),
          onError: () => resolve(null)
        });
      });
      if (result) allResults.push(result);
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    if (allResults.length > 0) {
      documentViewer.displaySearchResult(allResults[0]);
      for (let i = 1; i < allResults.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        documentViewer.displayAdditionalSearchResult(allResults[i]);
      }
    }
  };

  const performSingleSearch = (searchText) => {
    const { documentViewer, Search } = viewerInstance.current.Core;
    const searchModes = [Search.Mode.HIGHLIGHT, Search.Mode.PAGE_STOP];

    documentViewer.textSearchInit(searchText, searchModes, {
      fullSearch: true,
      onResult: (result) => documentViewer.displaySearchResult(result),
      onError: () => {
        if (searchText.includes(' ')) {
          const firstFewWords = searchText.split(' ').slice(0, 3).join(' ');
          setTimeout(() => {
            documentViewer.clearSearchResults();
            documentViewer.textSearchInit(firstFewWords, searchModes, {
              fullSearch: true,
              onError: () => {
                const firstWord = searchText.split(' ')[0];
                setTimeout(() => {
                  documentViewer.clearSearchResults();
                  documentViewer.textSearchInit(firstWord, searchModes, {
                    fullSearch: true
                  });
                }, 200);
              }
            });
          }, 200);
        }
      }
    });
  };

  const prepareSearchText = (text, portionSize = 100) => {
    if (!text) return [];
    const portions = [];
    let currentIndex = 0;
    const textLength = text.length;

    while (currentIndex < textLength) {
      let portion;
      if (currentIndex + portionSize >= textLength) {
        portion = text.substring(currentIndex);
      } else {
        portion = text.substring(currentIndex, currentIndex + portionSize);
        const lastSpaceIndex = portion.lastIndexOf(' ');
        if (lastSpaceIndex > 20) portion = portion.substring(0, lastSpaceIndex);
      }

      portion = portion.replace(/\s+/g, ' ').trim();
      if (portion) portions.push(portion);
      currentIndex += portion.length + 1;
    }

    return portions;
  };

  return <div ref={ref} style={{ height: "100%" }}></div>;
}