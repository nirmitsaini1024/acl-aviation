import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Save, X, FileText, Link, Plus, Edit2, Type, FileTextIcon, MousePointer2, } from "lucide-react";
import { SaveButton } from "@/components/review-related-content/save-button";
import WebViewerComponent from "@/components/docx-viewer";
import { Input } from "@/components/ui/input";

export default function ReviewRelated1() {
  // Content state for current group being created
  const [reviewContent, setReviewContent] = useState([]);
  const [relatedContent, setRelatedContent] = useState([]);
  // Add state for the group name
  const [groupName, setGroupName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  // Saved groups
  const [savedGroups, setSavedGroups] = useState([]);

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState({});

  // Track which content type is waiting for text selection
  const [addingTo, setAddingTo] = useState(null);
  
  // Selected text from document
  const [selectedText, setSelectedText] = useState("");

  // State for tracking if we're writing content manually
  const [isWritingContent, setIsWritingContent] = useState(null);
  const [manualContent, setManualContent] = useState("");

  // Watch for selectedText changes and add to content when appropriate
  useEffect(() => {
    if (selectedText && addingTo) {
      if (addingTo === 'review') {
        const newId = `review-${Date.now()}`;
        setReviewContent([...reviewContent, { id: newId, content: selectedText }]);
      } else if (addingTo === 'related') {
        const newId = `related-${Date.now()}`;
        setRelatedContent([...relatedContent, { id: newId, content: selectedText }]);
      }
      
      // Reset states
      setAddingTo(null);
      setSelectedText("");
    }
  }, [selectedText, addingTo, reviewContent, relatedContent]);

  // Request to add new review content by selection
  const addReviewContentBySelection = () => {
    setAddingTo('review');
    setIsWritingContent(null);
  };

  // Request to add new related content by selection
  const addRelatedContentBySelection = () => {
    setAddingTo('related');
    setIsWritingContent(null);
  };

  // Request to write new review content manually
  const writeReviewContent = () => {
    setIsWritingContent('review');
    setAddingTo(null);
  };

  // Request to write new related content manually
  const writeRelatedContent = () => {
    setIsWritingContent('related');
    setAddingTo(null);
  };

  // Handle manual content change
  const handleManualContentChange = (e) => {
    setManualContent(e.target.value);
  };

  // Save manually written content
  const saveManualContent = () => {
    if (!manualContent.trim()) return;
    
    if (isWritingContent === 'review') {
      const newId = `review-${Date.now()}`;
      setReviewContent([...reviewContent, { id: newId, content: manualContent }]);
    } else if (isWritingContent === 'related') {
      const newId = `related-${Date.now()}`;
      setRelatedContent([...relatedContent, { id: newId, content: manualContent }]);
    }
    
    // Reset states
    setIsWritingContent(null);
    setManualContent("");
  };

  // Cancel writing content
  const cancelWritingContent = () => {
    setIsWritingContent(null);
    setManualContent("");
  };

  // Remove content item
  const removeReviewItem = (id) => {
    setReviewContent(reviewContent.filter(item => item.id !== id));
  };

  const removeRelatedItem = (id) => {
    setRelatedContent(relatedContent.filter(item => item.id !== id));
  };

  // Toggle editing mode for group name
  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };

  // Handle group name change
  const handleNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // Handle name input blur
  const handleNameBlur = () => {
    setIsEditingName(false);
    // Ensure we don't have an empty name
    if (!groupName.trim()) {
      setGroupName("New Reference Group");
    }
  };

  // Handle key press in name input
  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  // Save current group
  const saveGroup = () => {
    if (reviewContent.length === 0 && relatedContent.length === 0) return;

    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName, // Include the custom name in the group
      reviewContent: [...reviewContent],
      relatedContent: [...relatedContent],
    };

    setSavedGroups([...savedGroups, newGroup]);

    // Reset current group
    setReviewContent([]);
    setRelatedContent([]);
    setGroupName("New Reference Group"); // Reset the group name too

    // Expand the newly created group
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

  // Content Card Component
  const ContentCard = ({ id, content, onRemove }) => (
    <div className="bg-white border border-gray-100 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-all duration-200">
      <button 
        onClick={() => onRemove(id)} 
        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors duration-200"
        aria-label="Remove content"
      >
        <X size={16} />
      </button>
      <div className="pr-6 text-gray-700">{content}</div>
    </div>
  );

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* MS Word Viewer Panel */}
          <div className="lg:w-1/2 relative">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <WebViewerComponent setSelectedText={setSelectedText} />
              </div>
              {addingTo && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-center text-blue-700 font-medium animate-pulse">
                  Select text to add as {addingTo === 'review' ? 'review' : 'related'} content
                </div>
              )}
            </div>
          </div>

          {/* Reference Group */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div className="flex items-center flex-1">
                    <span className="bg-blue-500 w-1 h-8 rounded mr-3"></span>
                    <Input
                      value={groupName}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      onKeyPress={handleNameKeyPress}
                      className="font-medium text-3xl text-gray-800 focus:border-none focus:outline-none focus-visible:ring-blue-200 "
                      autoFocus
                    />
                  </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Review Content Column */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    Review Content
                  </h3>

                  <div className="space-y-3">
                    {reviewContent.length > 0 ? (
                      reviewContent.map((item) => (
                        <ContentCard
                          key={item.id}
                          id={item.id}
                          content={item.content}
                          onRemove={removeReviewItem}
                        />
                      ))
                    ) : (
                      <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <FileTextIcon className="h-8 w-8 mb-2 opacity-50" />
                        <span>No Content Yet</span>
                      </div>
                    )}
                  </div>

                  {/* Manual content writing for Review */}
                  {isWritingContent === 'review' && (
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
                  {!isWritingContent && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button 
                        onClick={addReviewContentBySelection} 
                        variant="outline" 
                        className={`rounded-lg border ${addingTo === 'review' 
                          ? 'bg-blue-50 border-blue-200 text-blue-600' 
                          : 'hover:bg-blue-50 hover:text-blue-600 transition-all duration-200'}`}
                        disabled={addingTo === 'review'}
                      >
                        {addingTo === 'review' ? 'Waiting...' : (
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
                        disabled={addingTo === 'review'}
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Write
                      </Button>
                    </div>
                  )}
                </div>

                {/* Related Content Column */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                    <Link className="h-5 w-5 mr-2 text-purple-500" />
                    Related Content
                  </h3>

                  <div className="space-y-3">
                    {relatedContent.length > 0 ? (
                      relatedContent.map((item) => (
                        <ContentCard
                          key={item.id}
                          id={item.id}
                          content={item.content}
                          onRemove={removeRelatedItem}
                        />
                      ))
                    ) : (
                      <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <Link className="h-8 w-8 mb-2 opacity-50" />
                        <span>No Content Yet</span>
                      </div>
                    )}
                  </div>

                  {/* Manual content writing for Related */}
                  {isWritingContent === 'related' && (
                    <div className="mt-4 border border-purple-200 rounded-lg p-3 bg-purple-50">
                      <textarea
                        value={manualContent}
                        onChange={handleManualContentChange}
                        className="w-full p-2 border border-purple-100 rounded bg-white text-gray-700 min-h-24 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 focus:outline-none"
                        placeholder="Write your content here..."
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button 
                          onClick={saveManualContent} 
                          variant="default" 
                          className="bg-purple-500 hover:bg-purple-600 text-white"
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

                  {/* Add content buttons for Related */}
                  {!isWritingContent && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button 
                        onClick={addRelatedContentBySelection} 
                        variant="outline" 
                        className={`rounded-lg border ${addingTo === 'related' 
                          ? 'bg-purple-50 border-purple-200 text-purple-600' 
                          : 'hover:bg-purple-50 hover:text-purple-600 transition-all duration-200'}`}
                        disabled={addingTo === 'related'}
                      >
                        {addingTo === 'related' ? 'Waiting...' : (
                          <>
                            <MousePointer2 className="h-4 w-4 mr-2" />
                            Select
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={writeRelatedContent} 
                        variant="outline" 
                        className="rounded-lg border hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        disabled={addingTo === 'related'}
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Write
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Group Button */}
              <div className="mt-8">
                <Button 
                  onClick={saveGroup} 
                  className="w-full py-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 "
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Saved Groups Section */}
            {savedGroups.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-medium mb-6 text-gray-800 flex items-center border-b pb-4">
                  <span className="bg-green-500 w-1 h-8 rounded mr-3"></span>
                  Saved Groups
                </h2>

                <div className="space-y-4">
                  {savedGroups.map((group, index) => (
                    <div key={group.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      <div
                        className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleGroup(group.id)}
                      >
                        <h3 className="font-semibold text-gray-700 flex items-center">
                          <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </span>
                          {group.name}
                        </h3>
                        {expandedGroups[group.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      {expandedGroups[group.id] && (
                        <div className="p-4 bg-white">
                          <div className="flex flex-col gap-6">
                          <div className="flex-1">
                              <h4 className="font-medium mb-3 text-sm text-gray-500 flex items-center">
                                <Link className="h-4 w-4 mr-2 text-purple-500" />
                                Related Content
                              </h4>
                              <div className="space-y-2">
                                {group.relatedContent.map((item) => (
                                  <div key={item.id} className="p-2 bg-purple-50 rounded-lg border border-purple-100 text-sm text-gray-700">
                                    {item.content}
                                  </div>
                                ))}
                                {group.relatedContent.length === 0 && (
                                  <div className="text-gray-400 text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 italic">
                                    No related content
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-3 text-sm text-gray-500 flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                Review Content
                              </h4>
                              <div className="space-y-2">
                                {group.reviewContent.map((item) => (
                                  <div key={item.id} className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-sm text-gray-700">
                                    {item.content}
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

      {/* Fixed Save Button */}
      <SaveButton />
    </main>
  );
}