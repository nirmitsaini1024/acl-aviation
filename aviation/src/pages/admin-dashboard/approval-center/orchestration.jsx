import React, { useState } from "react";
import WorkflowCanvas from "@/components/orchestration/workflow-canvas";
import WorkflowSidebar from "@/components/orchestration/workflow-sidebar";
import WorkflowTable from "@/components/orchestration/workflow-table";
import { toast } from "sonner";
// import { toast } from "@/components/ui/use-toast";

const Orchestration = () => {
  // State management for the orchestration component
  const [nodes, setNodes] = useState([
    {
      id: "start",
      type: "start",
      data: { label: "Start" },
      position: { x: 250, y: 50 },
      connectable: true,
    },
  ]);
  const [edges, setEdges] = useState([]);
  const [documentCategory, setDocumentCategory] = useState("");
  const [viewMode, setViewMode] = useState("canvas"); // "canvas" or "table"
  const [savedWorkflow, setSavedWorkflow] = useState(null);
  const [workflowName, setWorkflowName] = useState("");

  // Save workflow function
  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      // Display a toast notification instead of an alert
      toast("OOPS!! : Workflow Name Required !!",
        {variant : "destructive",}
      );
      return;
    }
    
    const workflow = {
      nodes,
      edges,
      documentCategory,
      name: workflowName,
    };
    console.log("Saving workflow:", workflow);
    
    // Save the workflow to state to display in table view
    setSavedWorkflow(workflow);
    
    // Switch to table view
    setViewMode("table");
    
    // Success notification
    toast("Workflow Saved Successfully !!");
  };

  return (
    <div className="flex flex-col h-[90vh] bg-gray-100 rounded border-gray-300 -m-6">
      {/* View Toggle Buttons */}
      <div className="bg-white p-3 border-b border-gray-300 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Document Approval Workflow</h1>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "canvas"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewMode("canvas")}
          >
            Canvas View
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewMode("table")}
            disabled={!savedWorkflow}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Canvas View */}
      {viewMode === "canvas" && (
        <div className="flex flex-1 overflow-hidden">
          <WorkflowSidebar 
            documentCategory={documentCategory}
            setDocumentCategory={setDocumentCategory}
            saveWorkflow={saveWorkflow}
            workflowName={workflowName}
            setWorkflowName={setWorkflowName}
          />
          <WorkflowCanvas 
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
          />
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && savedWorkflow && (
        <div className="flex-1 overflow-auto">
          <WorkflowTable workflow={savedWorkflow} />
        </div>
      )}
    </div>
  );
};

export default Orchestration;