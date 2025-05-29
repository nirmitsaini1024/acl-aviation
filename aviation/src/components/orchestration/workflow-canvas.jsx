import React, { useState, useCallback, useRef } from "react";
import {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  ConnectionLineType,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeTypes from "./node-type";
import ControlPanels from "./workflow-control-panel";

const WorkflowCanvas = ({ nodes: initialNodes, setNodes: setParentNodes, edges: initialEdges, setEdges: setParentEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Update parent state when local state changes
  React.useEffect(() => {
    setParentNodes(nodes);
  }, [nodes, setParentNodes]);

  React.useEffect(() => {
    setParentEdges(edges);
  }, [edges, setParentEdges]);

  // Update node data (for attributes)
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...newData
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Connect nodes with edges
  const onConnect = useCallback(
    (params) => {
      // Default edge label
      let edgeLabel = "";

      // Check if source is an approval node to add appropriate label
      const sourceNode = nodes.find((node) => node.id === params.source);
      if (sourceNode && sourceNode.type === "approval") {
        // Set label based on which handle was used
        if (params.sourceHandle === "r") {
          edgeLabel = "Approved";
        } else if (params.sourceHandle === "b") {
          edgeLabel = "Rejected";
        }
      }

      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        data: { label: edgeLabel },
        label: edgeLabel,
        style: {
          stroke: edgeLabel === "Approved" ? "#22c55e" : edgeLabel === "Rejected" ? "#ef4444" : "#888",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  // Handle drag and drop interactions
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("label");

      if (!type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Add default attributes depending on node type
      const defaultAttributes = [];

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label,
          attributes: defaultAttributes
        },
      };

      setNodes((nds) => nds.concat(newNode));
      
      // Auto-select the newly created node if it's a user or group
      if (type === "user" || type === "group") {
        setTimeout(() => {
          setSelectedNode(newNode);
          setSelectedEdge(null);
        }, 100);
      }
    },
    [reactFlowInstance, setNodes]
  );

  // Reset selection when clicking canvas
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((_, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  // Delete selected edge
  const deleteEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedEdge, setEdges]);

  // Delete selected node and its connected edges
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      const nodeId = selectedNode.id;
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className="flex-1" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={NodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
        connectionMode="loose"
        connectionRadius={40}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        
        <ControlPanels 
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          deleteNode={deleteNode}
          deleteEdge={deleteEdge}
          updateNodeData={updateNodeData}
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;