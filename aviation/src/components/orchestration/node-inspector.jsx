import React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const NodeInspector = ({ selectedNode, onUpdateNode, onClose }) => {
  // If no node is selected, don't render anything
  if (!selectedNode) return null;

  // Only show for user and group nodes
  if (selectedNode.type !== "user" && selectedNode.type !== "group") return null;

  // Function to update a specific attribute
  const updateAttribute = (key, value) => {
    const updatedAttributes = {
      ...(selectedNode.data.attributes || {}),
      [key]: value,
    };
    
    onUpdateNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        attributes: updatedAttributes,
      },
    });
  };

  // Default attributes if none exist yet
  const attributes = selectedNode.data.attributes || {};

  return (
    <div className="absolute right-0 top-0 w-72 bg-white border-l border-gray-200 h-full p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          {selectedNode.type === "user" ? "User" : "Group"} Properties
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Information */}
        <div>
          <Label>Name</Label>
          <Input
            value={selectedNode.data.label}
            onChange={(e) => 
              onUpdateNode({
                ...selectedNode,
                data: { ...selectedNode.data, label: e.target.value },
              })
            }
            className="mt-1"
          />
        </div>

        {/* User-specific attributes */}
        {selectedNode.type === "user" && (
          <>
            <div>
              <Label>Email</Label>
              <Input
                value={attributes.email || ""}
                onChange={(e) => updateAttribute("email", e.target.value)}
                className="mt-1"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={attributes.role || ""}
                onValueChange={(value) => updateAttribute("role", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approver">Approver</SelectItem>
                  <SelectItem value="Reviewer">Reviewer</SelectItem>
                  <SelectItem value="Observer">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notification Method</Label>
              <Select
                value={attributes.notificationMethod || ""}
                onValueChange={(value) => updateAttribute("notificationMethod", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select notification method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="System">System Notification</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Group-specific attributes */}
        {selectedNode.type === "group" && (
          <>
            <div>
              <Label>Department</Label>
              <Select
                value={attributes.department || ""}
                onValueChange={(value) => updateAttribute("department", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Approval Type</Label>
              <Select
                value={attributes.approvalType || ""}
                onValueChange={(value) => updateAttribute("approvalType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select approval type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AnyOne">Any One Member</SelectItem>
                  <SelectItem value="Majority">Majority</SelectItem>
                  <SelectItem value="All">All Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={attributes.priority || ""}
                onValueChange={(value) => updateAttribute("priority", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Common attributes for both users and groups */}
        <div>
          <Label>Required Signature</Label>
          <Select
            value={attributes.requiresSignature || ""}
            onValueChange={(value) => updateAttribute("requiresSignature", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Comments</Label>
          <Input
            value={attributes.comments || ""}
            onChange={(e) => updateAttribute("comments", e.target.value)}
            className="mt-1"
            placeholder="Additional comments..."
          />
        </div>
      </div>
    </div>
  );
};

export default NodeInspector;