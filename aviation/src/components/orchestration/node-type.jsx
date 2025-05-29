import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const NodeTypes = {
  start: ({ data }) => (
    <div className="p-2 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center w-16 h-16 relative">
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: "#555" }}
      />
      <div className="text-sm font-medium">{data.label}</div>
    </div>
  ),
  end: ({ data }) => (
    <div className="p-2 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center w-16 h-16 relative">
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        style={{ background: "#555" }}
      />
      <div className="text-sm font-medium">{data.label}</div>
    </div>
  ),
  user: ({ data, selected }) => {
    const attributes = data.attributes || [];

    return (
      <div
        className={`p-2 rounded bg-white border-2 ${
          selected ? "border-blue-500" : "border-blue-200"
        } flex flex-col items-center justify-center relative`}
        style={{ minWidth: "160px" }}
      >
        <Handle
          type="target"
          position={Position.Top}
          id="t"
          style={{ background: "#555" }}
        />
        <div className="text-sm font-medium mb-1 flex items-center">{data.label}
          {attributes.length > 0 ? <span className="text-xs text-blue-600 ml-6">
            {`(${attributes.length})`}
          </span>: ""}
        </div>

        {selected && (
          <div className="w-full pt-2 border-gray-200">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center border-t text-xs mb-1 px-1 pt-2 ">
                <span className="font-medium mr-1">{attr.name}:</span>
                <span className="text-gray-600">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{ background: "#555" }}
        />
      </div>
    );
  },
  group: ({ data, selected }) => {
    const attributes = data.attributes || [];

    return (
      <div
        className={`p-2 rounded w-32 bg-white border-2 ${
          selected ? "border-green-500" : "border-green-200"
        } flex flex-col items-center justify-center relative`}
      >
        <Handle
          type="target"
          position={Position.Top}
          id="t"
          style={{ background: "#555" }}
        />
        <div className="text-sm font-medium mb-1 flex items-center">{data.label}
          {attributes.length > 0 ? <span className="text-xs text-blue-600 ml-6">
            {`(${attributes.length})`}
          </span>: ""}
        </div>

        {selected && (
          <div className="w-full pt-2  border-gray-200">
            {attributes.map((attr, index) => (
              <div key={index} className="flex items-center text-xs mb-1 px-1 border-t pt-2">
                <span className="font-medium mr-1">{attr.name}:</span>
                <span className="text-gray-600">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{ background: "#555" }}
        />
      </div>
    );
  },
  approval: ({ data }) => (
    <div className="p-2 transform rotate-45 bg-white border-2 border-yellow-200 flex items-center justify-center w-16 h-16 relative">
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        style={{ top: "0%", right: "50%", transform: "rotate(-45deg)" }}
      />
      <div className="transform -rotate-45 text-sm font-medium">
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="r"
        style={{
          top: "50%",
          right: "0%",
          transform: "rotate(-45deg)",
          background: "#22c55e",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{
          bottom: "0%",
          left: "50%",
          transform: "rotate(-45deg)",
          background: "#ef4444",
        }}
      />
    </div>
  ),
};

export default NodeTypes;
