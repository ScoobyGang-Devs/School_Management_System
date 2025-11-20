"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const grade = [
  {
    value: "6A",
    label: "6A",
  },
  {
    value: "6B",
    label: "6B",
  },
  {
    value: "6C",
    label: "6C",
  },
  {
    value: "6D",
    label: "6D",
  },
  {
    value: "7A",
    label: "7A",
  },
  {
    value: "7B",
    label: "7B",
  },
  {
    value: "7C",
    label: "7C",
  },
  {
    value: "7D",
    label: "7D",
  },
  {
    value: "8A",
    label: "8A",
  },
  {
    value: "8B",
    label: "8B",
  },
  {
    value: "8C",
    label: "8C",
  },
  {
    value: "8D",
    label: "8D",
  },
  {
    value: "9A",
    label: "9A",
  },
  {
    value: "9B",
    label: "9B",
  },
  {
    value: "9C",
    label: "9C",
  },
  {
    value: "9D",
    label: "9D",
  },
  {
    value: "10A",
    label: "10A",
  },
  {
    value: "10B",
    label: "10B",
  },
  {
    value: "10C",
    label: "10C",
  },
  {
    value: "10D",
    label: "10D",
  },
  {
    value: "11A",
    label: "11A",
  },
  {
    value: "11B",
    label: "11B",
  },
  {
    value: "11C",
    label: "11C",
  },
  {
    value: "11D",
    label: "11D",
  },
 
]

export function GradeComboBox({setGradeLevel,setClassName}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (currentValue) => {
    // 1. Update the local component state
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);

    if (newValue) {
      // 2. Extract Grade Level (numeric part, e.g., '6' or '10')
      const gradeMatch = newValue.match(/\d+/);
      const gradeLevel = gradeMatch ? gradeMatch[0] : null;

      // 3. Extract Class Name (last character, e.g., 'A' or 'B')
      const className = newValue.slice(-1);
      
      // 4. Update parent states
      if (gradeLevel) {
        setGradeLevel(gradeLevel);
      }
      // Assuming the last character is always the class name
      setClassName(className); 

    } else {
      // If deselected (cleared), reset parent states
      setGradeLevel(null); 
      setClassName(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? grade.find((framework) => framework.value === value)?.label
            : "Select Grade..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Grade..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {grade.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={handleSelect} // Use the new handler function
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default GradeComboBox;
