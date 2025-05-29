import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { Search, ArrowUp, ArrowDown, ArrowDownUp } from "lucide-react";

export const ColumnHeader = ({ 
  title, 
  column, 
  width, 
  sortable = true,
  handleSort, 
  sortColumn, 
  sortDirection,
  columnFilters,
  handleFilterChange 
}) => {
  const [open, setOpen] = useState(false);
  const isFilterable = column !== "revision" && column !== "action" && column !== "details" && column !== "reviewCycle" && column !== "linkedwith"

  return (
    <TableHead className={width}>
      <div className="flex items-center h-12">
        <div 
          className={sortable ? "cursor-pointer flex items-center" : "flex items-center"}
          onClick={sortable ? () => handleSort(column) : undefined}
        >
          <span className="font-medium text-sm text-center">{title}</span>
          
          {sortable && (
            <span className="ml-1">
              {sortColumn === column ? (
                sortDirection === "asc" ? (
                  <ArrowUp className="size-4" />
                ) : (
                  <ArrowDown className="size-4" />
                )
              ) : (
                <ArrowDownUp className="size-4 " />
              )}
            </span>
          )}
        </div>
        
        {isFilterable ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2" align="center" side="top">
              <div className="space-y-2">
                <Input
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={columnFilters[column] || ""}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                />
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="w-6"></div> // Empty spacer for consistent alignment
        )}
      </div>
    </TableHead>
  );
};