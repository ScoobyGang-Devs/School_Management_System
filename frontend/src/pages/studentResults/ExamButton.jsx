import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react"; // Get the icon from lucide-react

function ResultButtonBar() {
  return (
    // 1. Container for the Button Bar
    <div className="flex space-x-2 p-4 border-b"> 
      
      {/* 2. Fixed Buttons */}
      <Button variant="outline">First Term Test</Button>
      <Button variant="outline">Second Term Test</Button>
      <Button variant="outline">Third Term Test</Button> {/* Highlight the active one */}
      
      {/* 3. "More" Button with Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Use a plain button for the icon */}
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