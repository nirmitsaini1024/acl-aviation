import React from 'react';
import { Upload, List } from 'lucide-react';

// This component provides a toggle button to switch between upload and review modes
function ToggleActionButton({ showUpload, setShowUpload }) {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => setShowUpload(!showUpload)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          showUpload
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showUpload ? (
          <>
            <List className="h-5 w-5" />
            <span>Show Document Review</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span>Upload Documents</span>
          </>
        )}
      </button>
    </div>
  );
}

export default ToggleActionButton;