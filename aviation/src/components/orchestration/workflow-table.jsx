import { ListCheck } from "lucide-react";
import React from "react";

// Component to display the workflow as a single combined table
const WorkflowTable = ({ workflow }) => {
  // Function to determine the status of each node
  const calculateNodeStatuses = (nodes, edges) => {
    // Find the start node
    const startNode = nodes.find((node) => node.type === "start");
    if (!startNode) return {};

    // Find nodes directly connected to the start node
    const activeNodeIds = edges
      .filter((edge) => edge.source === startNode.id)
      .map((edge) => edge.target);

    // Create a map of node id to status
    const statusMap = {};
    
    // All nodes except start and end are either active or pending
    nodes.forEach((node) => {
      if (node.type !== "start" && node.type !== "end") {
        statusMap[node.id] = {
          id: node.id,
          label: node.data.label,
          type: node.type,
          status: activeNodeIds.includes(node.id) ? "Active" : "Pending",
          // Add attributes to the node status object
          attributes: node.data.attributes || []
        };
      }
    });

    return statusMap;
  };

  // No workflow data provided
  if (!workflow || !workflow.nodes || !workflow.edges) {
    return <div className="p-4">No workflow data available</div>;
  }

  // Calculate the status of each node
  const nodeStatuses = calculateNodeStatuses(workflow.nodes, workflow.edges);
  
  // Get all approval nodes (both users and groups)
  const approvalNodes = Object.values(nodeStatuses);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{workflow.name || "Unnamed Workflow"}</h2>
          {workflow.documentCategory && (
            <div className="mt-1 text-sm text-gray-600">
              Category: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                {workflow.documentCategory}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b font-medium text-blue-800 flex items-center">
          <ListCheck size={20} className="mr-2"/>
          Approval Status
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attributes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvalNodes.length > 0 ? (
              approvalNodes.map((node, index) => (
                <tr key={node.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        node.type === "user" ? "bg-blue-500" : 
                        node.type === "group" ? "bg-green-500" : 
                        "bg-yellow-500"
                      }`}></div>
                      <div className="text-sm font-medium text-gray-900">{node.label}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      node.type === "user" 
                        ? "bg-blue-100 text-blue-800 border border-blue-200" 
                        : node.type === "group"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}>
                      {node.type === "user" ? "User" : node.type === "group" ? "Group" : "Approval"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md ${
                        node.status === "Active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        node.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                      }`}></span>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {node.attributes && node.attributes.length > 0 ? (
                      <div>
                        {node.attributes.length > 3 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {node.attributes.slice(0, 2).map((attr, index) => (
                              <div key={index} className="flex items-center group">
                                <span className={`bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-blue-200 group-hover:bg-blue-100 transition-colors`}>
                                  {attr.name}
                                </span>
                                <span className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border border-blue-100 border-l-0 group-hover:border-blue-200 transition-colors`}>
                                  {attr.value}
                                </span>
                              </div>
                            ))}
                            <div className="relative group">
                              <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
                                +{node.attributes.length - 2} more
                              </div>
                              <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg p-2 hidden group-hover:block min-w-max">
                                <div className="flex flex-col gap-1.5 max-w-xs">
                                  {node.attributes.slice(2).map((attr, index) => (
                                    <div key={index} className="flex items-center">
                                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-gray-300 whitespace-nowrap">
                                        {attr.name}
                                      </span>
                                      <span className="bg-gray-50 text-gray-700 text-xs px-2 py-0.5 rounded-r-md max-w-[150px] truncate">
                                        {attr.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {node.attributes.map((attr, index) => (
                              <div key={index} className="flex items-center group">
                                <span className={`bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-blue-200 group-hover:bg-blue-100 transition-colors ${
                                  index % 3 === 1 ? 'bg-green-50 text-green-800 border-green-200 group-hover:bg-green-100' :
                                  index % 3 === 2 ? 'bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100' : ''
                                }`}>
                                  {attr.name}
                                </span>
                                <span className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border ${
                                  index % 3 === 1 ? 'border-green-100 border-l-0 group-hover:border-green-200' :
                                  index % 3 === 2 ? 'border-purple-100 border-l-0 group-hover:border-purple-200' :
                                  'border-blue-100 border-l-0 group-hover:border-blue-200'
                                } transition-colors`}>
                                  {attr.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded-md inline-block">No attributes</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">No approval nodes in this workflow</span>
                    <p className="text-xs text-gray-400 mt-1">Drag and drop nodes from the sidebar to build your workflow</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Add a footer with summary information */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
          <div>
            {approvalNodes.length} {approvalNodes.length === 1 ? 'node' : 'nodes'} in workflow
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
            <span className="mr-3">Active</span>
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTable;