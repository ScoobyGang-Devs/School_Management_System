import React, { useState, useMemo } from 'react';
import StudentAttendanceTable from './StudentAttendanceTable.jsx';
import { Button } from '@/components/ui/button'; // Assuming you'll use Shadcn Buttons
import AttendanceDatePicker from './AttedanceDatePicker.jsx';
import {Input} from '@/components/ui/input'

// --- MOCK DATA to demonstrate filtering functionality ---
// In a real app, this data would come from an API/Redux store.
const MOCK_DATA = [
    // --- Attendance for November 15, 2025 (Today) ---
    { id: 1, name: "Alice", grade: "6", class: "A", date: "2025-11-15", status: "Present" },
    { id: 2, name: "Bob", grade: "6", class: "B", date: "2025-11-15", status: "Absent" },
    { id: 3, name: "Charlie", grade: "7", class: "A", date: "2025-11-15", status: "Late" },
    { id: 4, name: "Diana", grade: "6", class: "A", date: "2025-11-15", status: "Present" },
    { id: 5, name: "Eve", grade: "7", class: "B", date: "2025-11-15", status: "Absent" },
    { id: 6, name: "Frank", grade: "8", class: "C", date: "2025-11-15", status: "Present" },

    // --- Attendance for November 14, 2025 (Yesterday) ---
    { id: 7, name: "Alice", grade: "6", class: "A", date: "2025-11-14", status: "Absent" },
    { id: 8, name: "Bob", grade: "6", class: "B", date: "2025-11-14", status: "Late" },
    { id: 9, name: "Charlie", grade: "7", class: "A", date: "2025-11-14", status: "Present" },
    // ... additional students for the 14th ...
];
// --- Placeholder Components ---
// You will replace these with your actual Shadcn Menubar and ButtonBar components.

const GradeMenubar = ({ onSelect, currentGrade }) => {
    const grades = ['All', '6', '7', '8','9','10','11'];
    return (
        <div className="flex space-x-2 p-2 border-b">
            {grades.map(grade => (
                <Button 
                    key={grade}
                    variant={currentGrade === grade ? "default" : "outline"}
                    onClick={() => onSelect(grade)}
                >
                    Grade {grade}
                </Button>
            ))}
        </div>
    );
};

const ClassButtonBar = ({ onSelect, currentClass }) => {
    const classes = ['All', 'A', 'B', 'C','D'];
    return (
        <div className="flex space-x-2 p-2 mb-4">
            {classes.map(className => (
                <Button 
                    key={className}
                    variant={currentClass === className ? "default" : "secondary"}
                    onClick={() => onSelect(className)}
                >
                    Class {className}
                </Button>
            ))}
        </div>
    );
};


// --- Main Component ---
const SchoolWideAttendance = () => {
    // 1. Initialize state for the selections
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedDate, setSelectedDate] = useState(null); 
    

    const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    // 2. Fetch or filter data based on the state variables using useMemo
    const attendanceData = useMemo(() => {
        // Filter the mock data based on current selections
        return MOCK_DATA.filter(student =>
            (selectedGrade === 'All' || student.grade === selectedGrade) &&
            (selectedClass === 'All' || student.class === selectedClass) &&
            (dateString === null || student.date === dateString)
        );
    }, [selectedGrade, selectedClass,selectedDate]);

    // 3. Handlers for your UI elements
    const handleGradeChange = (newGrade) => {
        setSelectedGrade(newGrade);
    };

    const handleClassChange = (newClass) => {
        setSelectedClass(newClass);
    };

    const handleDateChange = (newDate) => {
        // newDate will be the Date object provided by the date picker
        setSelectedDate(newDate);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">School-Wide Attendance</h1>
            
            {/* The UI components (Menubar/Button Bar) call the handlers */}
            <GradeMenubar onSelect={handleGradeChange} currentGrade={selectedGrade} />
            <ClassButtonBar onSelect={handleClassChange} currentClass={selectedClass} />

            <div className="flex items-center gap-4 mb-2">
              <AttendanceDatePicker onSelect={handleDateChange} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search student..."
                className="w-96"
              />
            </div>
            
            

            {/* The table component receives the filtered data */}
            <StudentAttendanceTable attendanceData={attendanceData} />
            
            <p className="mt-4 text-sm text-muted-foreground">
                Showing attendance for Grade: **{selectedGrade}**, Class: **{selectedClass}**. ({attendanceData.length} records found)
            </p>
        </div>
    );
};

export default SchoolWideAttendance;