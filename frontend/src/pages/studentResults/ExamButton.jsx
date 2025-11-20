import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Component accepts the current active term and a handler function
function ResultButtonBar({ activeTerm, onTermChange }) {

  const terms = [
    { id: 1, name: "First Term Test" },
    { id: 2, name: "Second Term Test" },
    { id: 3, name: "Third Term Test" },
  ];
  
  const getVariant = (termId) => (termId === activeTerm ? "default" : "outline");


  return (
    // 1. Container for the Button Bar
    <div className="flex space-x-2 p-4 border-b">
      
      {/* 2. Fixed Buttons */}
      {terms.map((term) => (
        <Button 
          key={term.id}
          variant={getVariant(term.id)}
          onClick={() => onTermChange(term.id)}
        >
          {term.name}
        </Button>
      ))}
      
      {/* 3. "More" Button with Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Annual Exam</DropdownMenuItem>
          <DropdownMenuItem>Mid-Year Test</DropdownMenuItem>
          <DropdownMenuItem>Unit Quiz 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ResultButtonBar;