"use client"

import * as React from "react"
import { Check, ChevronsUpDown, BookOpen } from "lucide-react" // Added BookOpen icon

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// List of subjects based on the image provided
const subjects = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English Language", label: "English Language" },
  { value: "Sinhala Language", label: "Sinhala Language" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Art", label: "Art" },
]

// The component accepts a function to update the subject name in the parent component
export function SubjectComboBox({setSubjectName}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (currentValue) => {
    // 1. Determine the new value (toggle selection)
    const newValue = currentValue === value ? "" : currentValue;
    
    // 2. Update local state
    setValue(newValue);
    setOpen(false);

    // 3. Update the parent state with the selected Subject Name
    if (newValue) {
      setSubjectName(newValue);
    } else {
      setSubjectName(null); // Clear the subject name if deselected
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
            ? subjects.find((subject) => subject.value === value)?.label
            : "Select Subject..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Subject..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {subjects.map((subject) => (
                <CommandItem
                  key={subject.value}
                  value={subject.value}
                  onSelect={handleSelect} // Use the new handler function
                >
                  {subject.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === subject.value ? "opacity-100" : "opacity-0"
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

export default SubjectComboBox;