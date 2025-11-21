import React, { useState, useMemo, useEffect } from 'react';
import TeacherAttendanceTable from './TeacherAttendanceTable.jsx';
import AttendanceDatePicker from './AttedanceDatePicker.jsx';
import { Input } from '@/components/ui/input';
import api from "../../api.js";

// --- Helper for Date Formatting ---
const formatLocalISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TeacherAttendancePage = () => {
    // 1. Initialize state
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
    const [search, setSearch] = useState("");
    
    // Data State
    const [teacherRoster, setTeacherRoster] = useState([]); 
    const [attendanceRecords, setAttendanceRecords] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    // Format date for API
    const dateString = formatLocalISO(selectedDate);

    // --- EFFECT 1: Fetch All Teachers (Runs once on mount) ---
    useEffect(() => {
        const fetchTeachers = async () => {
            setIsLoading(true);
            try {
                // API Call: teachers/all/
                const response = await api.get('teachers/all/');
                setTeacherRoster(response.data);
            } catch (err) {
                console.error("Error fetching teacher roster:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []); 

    // --- EFFECT 2: Fetch Attendance for Selected Date ---
    useEffect(() => {
        const fetchAttendance = async () => {
            if (dateString) {
                try {
                    // API Call: attendence/teacherattendence/?date=YYYY-MM-DD
                    const response = await api.get(`attendence/teacherattendence/?date=${dateString}`);
                    setAttendanceRecords(response.data);
                } catch (err) {
                    console.error("Error fetching teacher attendance:", err);
                    setAttendanceRecords([]);
                }
            }
        };
        fetchAttendance();
    }, [dateString]); // Runs whenever the date changes


    // 2. Compute final merged data using useMemo
    const attendanceData = useMemo(() => {
        // Create a quick lookup map for attendance: { teacher_id: "Present/Absent" }
        // Note: Check your API response to see if it uses 'teacher_id' (integer) or an object.
        const attendanceMap = {};
        
        attendanceRecords.forEach(record => {
            // Assuming the serializer returns the ID in 'teacher_id'
            attendanceMap[record.teacher_id] = record.status;
        });

        // Merge Roster with Attendance Status
        const mergedData = teacherRoster.map(teacher => {
            // Defensive check for name
            const name = teacher.fullName || teacher.nameWithInitials || "Unknown Teacher";
            
            return {
                id: teacher.teacherId, 
                name: name,
                title: teacher.title, // 'Mr', 'Ms', etc.
                date: dateString,
                // Look up status, default to 'Not Marked' if not found
                status: attendanceMap[teacher.teacherId] || 'Not Marked' 
            };
        });
        
        // Apply Client-side Search Filter
        return mergedData.filter(teacher => 
            teacher.name.toLowerCase().includes(search.toLowerCase()) ||
            String(teacher.id).includes(search)
        );
        
    }, [teacherRoster, attendanceRecords, dateString, search]); 

    // 3. Handlers
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const recordsFoundText = isLoading 
        ? "Loading..." 
        : `(${attendanceData.length} records found)`;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Teacher Attendance</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <AttendanceDatePicker onSelect={handleDateChange} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search teacher name or ID..."
                className="w-96"
                onChange = {(e) => setSearch(e.target.value)}
              />
            </div>

            {isLoading && <p className="text-blue-500 mb-2">Fetching data...</p>}

            {/* The table component receives the processed data */}
            <TeacherAttendanceTable 
                attendanceData={attendanceData} 
                userSearch={search} 
            />
             <p className="mt-4 text-sm text-muted-foreground">
                Showing attendance for: **{dateString}** {recordsFoundText}
            </p>
        </div>
    );
};

export default TeacherAttendancePage;