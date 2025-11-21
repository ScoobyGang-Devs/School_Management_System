import React, { useState, useMemo, useEffect } from 'react';
import StudentAttendanceTable from './StudentAttendanceTable.jsx';
import { Button } from '@/components/ui/button';
import AttendanceDatePicker from './AttedanceDatePicker.jsx';
import { Input } from '@/components/ui/input';
import api from "../../api.js";

// --- Placeholder Components (GradeMenubar, ClassButtonBar remain the same) ---
const GradeMenubar = ({ onSelect, currentGrade }) => {
    const grades = [ '6', '7', '8','9','10','11'];
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
    const classes = [ 'A', 'B', 'C','D'];
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

const formatLocalISO = (date) => {
    if (!date) return null;
    // Get year, month, and day based on local time
    const year = date.getFullYear();
    // Month is 0-indexed, so add 1
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    
    // Concatenate to YYYY-MM-DD format, which is what Django expects
    return `${year}-${month}-${day}`;
};


// --- Main Component ---
const SchoolWideAttendance = () => {
    // 1. Initialize state
    const [selectedGrade, setSelectedGrade] = useState('6');
    const [selectedClass, setSelectedClass] = useState('A');
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
    const [search, setSearch] = useState("");
    
    // New state for fetched data
    const [roster, setRoster] = useState([]); // List of students in the selected class
    const [aggregateAttendance, setAggregateAttendance] = useState(null); // The single attendance record for the selected class/date
    const [isLoading, setIsLoading] = useState(false);

    // Helper to format the selected date for API calls
    const dateString = formatLocalISO(selectedDate);
    console.log(dateString)

    // --- EFFECT 1: Fetch Roster (triggered by Grade or Class change) ---
    useEffect(() => {
        const fetchRoster = async () => {
            if (selectedGrade && selectedClass) {
                setIsLoading(true);
                try {
                    // API Call: roster/<int:grade>/<str:classname>/
                    const response = await api.get(`roster/${selectedGrade}/${selectedClass}/`);
                    setRoster(response.data);
                    console.log(response.data);
                } catch (err) {
                    console.error("Error fetching roster:", err);
                    setRoster([]);
                }
            }
        };
        fetchRoster();
        // Dependency array ensures this runs whenever the selected class/grade changes
    }, [selectedGrade, selectedClass]); 

    // --- EFFECT 2: Fetch Aggregate Attendance (triggered by Grade, Class, or Date change) ---
    useEffect(() => {
        const fetchAggregateAttendance = async () => {
            if (selectedGrade && selectedClass && dateString) {
                setIsLoading(true);
                // Construct the expected class name string (e.g., "6 A")
                const fullClassName = `${selectedGrade} ${selectedClass}`;
                
                try {
                    // API Call: studentattendence/?date=YYYY-MM-DD
                    // We must filter the entire list response manually to find our class/date record
                    const response = await api.get(`attendence/studentattendence/?date=${dateString}`);
                    
                    // Filter the 24+ records to find the one matching the current class
                    const classRecord = response.data.find(
                        record => record.className === fullClassName
                    );

                    console.log(classRecord)

                    setAggregateAttendance(classRecord || null);
                    
                } catch (err) {
                    console.error("Error fetching aggregate attendance:", err);
                    setAggregateAttendance(null);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchAggregateAttendance();
        // Dependency array includes class/grade (for className string) and dateString
    }, [selectedGrade, selectedClass, dateString]);


    // 2. Compute the final merged attendance data using useMemo
    const attendanceData = useMemo(() => {
        // Step 1: Initialize the data based on the full class roster
        const mergedData = roster.map(student => {
            // Ensure student objects have an indexNumber field from the roster API
            const studentIndex = student.student_id; 
            
            return {
                ...student, // Includes name, grade, class, indexNumber, etc.
                status: 'Not Marked', // Default status
                indexNumber: studentIndex, // Use a consistent key
                date: dateString, // The date being viewed
            };
        });

        // Step 2: Apply attendance status using the aggregate record
        if (aggregateAttendance && aggregateAttendance.absentList) {
            const absentIDs = aggregateAttendance.absentList.map(String); // Ensure IDs are strings for comparison
            
            return mergedData.map(student => {
                if (absentIDs.includes(String(student.indexNumber))) {
                    return { ...student, status: 'Absent' };
                }
                // If a record exists (aggregateAttendance is not null) and the student ID 
                // is NOT in the absent list, they are marked Present.
                return { ...student, status: 'Present' };
            });
        }
        
        // Step 3: Apply client-side search filter
        return mergedData.filter(student => 
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            String(student.indexNumber).includes(search)
        );
        
    }, [roster, aggregateAttendance, dateString, search]); 


    // 3. Handlers for your UI elements
    const handleGradeChange = (newGrade) => {
        // Reset class selection if "All" is selected in the Menubar (optional)
        // If your Menubar only has specific grades, this is fine.
        setSelectedGrade(newGrade);
    };

    const handleClassChange = (newClass) => {
        setSelectedClass(newClass);
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };


    // Helper for display text
    const recordsFoundText = isLoading 
        ? "Loading attendance..." 
        : `(${attendanceData.length} records found)`;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">School-Wide Attendance</h1>
            
            <GradeMenubar onSelect={handleGradeChange} currentGrade={selectedGrade} />
            <ClassButtonBar onSelect={handleClassChange} currentClass={selectedClass} />

            <div className="flex items-center gap-4 mb-2">
              <AttendanceDatePicker onSelect={handleDateChange} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search student..."
                className="w-96"
                onChange = {(e) => setSearch(e.target.value)}
              />
            </div>
            
            {isLoading && <p className="text-blue-500">Fetching data...</p>}

            {/* The table component receives the filtered data */}
            <StudentAttendanceTable 
                attendanceData={attendanceData} 
                userSearch={search} 
            />
            
            <p className="mt-4 text-sm text-muted-foreground">
                Showing attendance for Grade: **{selectedGrade}**, Class: **{selectedClass}**. {recordsFoundText}
            </p>
        </div>
    );
};

export default SchoolWideAttendance;