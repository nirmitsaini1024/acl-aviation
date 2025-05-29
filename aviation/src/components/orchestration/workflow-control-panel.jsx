import React, { useState, useEffect } from "react";
import { Panel } from "@xyflow/react";
import { Plus, X } from "lucide-react";

const ControlPanels = ({ selectedNode, selectedEdge, deleteNode, deleteEdge, updateNodeData }) => {
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [attributes, setAttributes] = useState([]);

  // Update local attributes when selected node changes
  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      setAttributes(selectedNode.data.attributes || []);
    } else {
      setAttributes([]);
    }
  }, [selectedNode]);

  const isUserOrGroup = selectedNode && (selectedNode.type === "user" || selectedNode.type === "group");

  const addAttribute = () => {
    if (!newAttrName.trim()) return;
    
    const updatedAttributes = [
      ...attributes,
      { name: newAttrName, value: newAttrValue }
    ];
    
    // Update both local state and node data
    setAttributes(updatedAttributes);
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      attributes: updatedAttributes
    });
    
    setNewAttrName("");
    setNewAttrValue("");
  };

  const removeAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    
    // Update both local state and node data
    setAttributes(updatedAttributes);
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      attributes: updatedAttributes
    });
  };

  return (
    <>
      <Panel position="top-right" className="bg-white p-2 rounded shadow">
        <div className="text-sm">Document Workflow Details</div>
      </Panel>

      <Panel position="bottom-center" className="bg-white p-2 rounded shadow">
        {selectedNode ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="text-sm">Selected: {selectedNode.data.label}</div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                onClick={deleteNode}
              >
                Delete Node
              </button>
            </div>
            
            {isUserOrGroup && (
              <div className="border-t border-gray-200 pt-2 mt-1">
                <div className="text-xs font-medium mb-1">Attributes</div>
                
                {attributes.length > 0 ? (
                  <div className="grid gap-1 mb-2">
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-1 rounded text-xs">
                        <div>
                          <span className="font-medium">{attr.name}:</span> {attr.value}
                        </div>
                        <button 
                          className="text-red-500 text-xs ml-1"
                          onClick={() => removeAttribute(index)}
                        >
                          <X size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mb-1">No attributes yet</div>
                )}
                
                <div className="flex gap-1 mt-1">
                  <input
                    className="flex-1 border border-gray-300 rounded px-1 py-1 text-xs"
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    placeholder="Name"
                    size="small"
                  />
                  <input
                    className="flex-1 border border-gray-300 rounded px-1 py-1 text-xs"
                    value={newAttrValue}
                    onChange={(e) => setNewAttrValue(e.target.value)}
                    placeholder="Value"
                    size="small"
                  />
                  <button
                    className="bg-blue-500 text-white p-1 rounded text-xs flex items-center"
                    onClick={addAttribute}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : selectedEdge ? (
          <div className="flex gap-2">
            <div className="text-sm">
              Selected: {selectedEdge.data?.label || "Connection"}
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              onClick={deleteEdge}
            >
              Delete Connection
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-gray-500">
            <span>1. Drag & drop items from sidebar</span>
            <span className="mx-2">|</span>
            <span>2. Connect nodes by dragging from handles</span>
            <span className="mx-2">|</span>
            <span>3. Click nodes/connections to edit or delete</span>
          </div>
        )}
      </Panel>
    </>
  );
};

export default ControlPanels;