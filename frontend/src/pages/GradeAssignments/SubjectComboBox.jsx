import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

// Your subject list
const subjects = [
  { value: "Mathematics", label: "Mathematics", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
  { value: "Science", label: "Science", color: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
  { value: "English Language", label: "English", color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" },
  { value: "Sinhala Language", label: "Sinhala", color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" },
  { value: "History", label: "History", color: "bg-stone-500/10 text-stone-500 hover:bg-stone-500/20" },
  { value: "Geography", label: "Geography", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
  { value: "Information Technology", label: "ICT", color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
  { value: "Art", label: "Art", color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20" },
]

export function SubjectPillSelector({ selectedSubject, setSubjectName }) {
  
  return (
    <div className="w-full max-w-4xl">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border p-1 bg-muted/30">
        <div className="flex w-max space-x-2 p-1">
          {subjects.map((subject) => {
             const isSelected = selectedSubject === subject.value;
             
             return (
              <button
                key={subject.value}
                onClick={() => setSubjectName(subject.value)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  // If selected: Solid distinctive color (White on dark mode)
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {subject.label}
              </button>
             )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

export default SubjectPillSelector;