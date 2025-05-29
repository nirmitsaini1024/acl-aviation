import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, User, Users } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const documentCategories = [
  "Financial",
  "Legal",
  "HR",
  "Marketing",
  "Operations",
];

// Sample users and groups data (in a real app, this would come from an API)
const allUsers = [
  "User 1",
  "User 2",
  "User 3",
  "User 4",
];

const allGroups = [
  "Group 1",
  "Group 2",
  "Group 3",
  "Group 4",
  "Group 5",
];

const workflowComponents = [
  { type: "start", label: "START" },
  { type: "end", label: "END" },
  { type: "approval", label: "Approval" },
];

const WorkflowSidebar = ({
  documentCategory,
  setDocumentCategory,
  saveWorkflow,
  workflowName,
  setWorkflowName
}) => {
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("label", data.label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <ScrollArea className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Workflow Builder</h2>

        {/* Document Category */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Document Category
          </Label>
          <Select
            value={documentCategory}
            onValueChange={setDocumentCategory}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {documentCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
        {/* Users Section */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="users">
            <AccordionTrigger className="text-sm font-medium text-gray-700">
              Users
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 ">
                {allUsers.map((user) => (
                  <div
                    key={user}
                    className="p-2 border border-gray-200 rounded bg-blue-50 cursor-move flex items-center space-x-2"
                    draggable
                    onDragStart={(e) => onDragStart(e, "user", { label: user })}
                  >
                    <User size={14} />
                    <span>{user}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Groups Section */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="groups">
            <AccordionTrigger className="text-sm font-medium text-gray-700">
              Groups
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                {allGroups.map((group) => (
                  <div
                    key={group}
                    className="p-2 border border-gray-200 rounded bg-green-50 cursor-move flex items-center space-x-2"
                    draggable
                    onDragStart={(e) => onDragStart(e, "group", { label: group })}
                  >
                    <Users size={14} />
                    <span>{group}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Workflow Components Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Components
          </label>
          <div className="space-y-2 mt-2">
                {workflowComponents.map((component) => (
                  <div
                    key={component.type}
                    className={`p-1 border font-medium border-gray-200 rounded cursor-move ${
                      component.type === "approval" ? "bg-yellow-50" : "bg-gray-50"
                    }`}
                    draggable
                    onDragStart={(e) =>
                      onDragStart(e, component.type, { label: component.label })
                    }
                  >
                    {component.label}
                  </div>
                ))}
              </div>
        </div>
        </div>

        {/* Workflow Name and Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <Label className="text-sm font-medium text-gray-700">
            Document Approval Name
          </Label>
          <Input
            className="w-full mt-2"
            placeholder="Enter workflow name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <Button
            className="w-full mt-4"
            onClick={saveWorkflow}
          >
            Save Workflow
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default WorkflowSidebar;