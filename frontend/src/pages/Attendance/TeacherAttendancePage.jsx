// import React from 'react'

// const TeahcerAttendancePage = () => {
//   return (
//     <div>TeahcerAttendancePage</div>
//   )
// }

// export default TeahcerAttendancePage
import React, { useState, useMemo } from 'react';
import TeacherAttendanceTable from './TeacherAttendanceTable.jsx';
import AttendanceDatePicker from './AttedanceDatePicker.jsx';
import {Input} from '@/components/ui/input'

// --- MOCK DATA to demonstrate filtering functionality ---
// In a real app, this data would come from an API/Redux store.
const TEACHER_MOCK_DATA = [
  // --- Attendance for November 15, 2025 (Today) ---
  { id: 1, name: "Mr. Smith", date: "2025-11-15", status: "Present" },
  { id: 2, name: "Ms. Johnson", date: "2025-11-15", status: "Absent" },
  { id: 3, name: "Mr. Williams", date: "2025-11-15", status: "Late" },
  { id: 4, name: "Ms. Brown", date: "2025-11-15", status: "Present" },
  { id: 5, name: "Mr. Davis", date: "2025-11-15", status: "Present" },

  // --- Attendance for November 14, 2025 (Yesterday) ---
  { id: 6, name: "Mr. Smith", date: "2025-11-14", status: "Absent" },
  { id: 7, name: "Ms. Johnson", date: "2025-11-14", status: "Present" },
  { id: 8, name: "Mr. Williams", date: "2025-11-14", status: "Present" },
  { id: 9, name: "Ms. Brown", date: "2025-11-14", status: "Late" },
  { id: 10, name: "Mr. Davis", date: "2025-11-14", status: "Absent" },
];



// --- Main Component ---
const SchoolWideAttendance = () => {
    // 1. Initialize state for the selections
    const [selectedDate, setSelectedDate] = useState(null); 
    const [search, setSearch] = useState("")
    

    const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    // 2. Fetch or filter data based on the state variables using useMemo
    const attendanceData = useMemo(() => {
        // Filter the mock data based on current selections
        return TEACHER_MOCK_DATA.filter(teacher =>
            (dateString === null || teacher.date === dateString)
        );
    }, [selectedDate]);

    // 3. Handlers for your UI elements
    const handleDateChange = (newDate) => {
        // newDate will be the Date object provided by the date picker
        setSelectedDate(newDate);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">School-Wide Attendance</h1>
            
            <div className="flex items-center gap-4 mb-2">
              <AttendanceDatePicker onSelect={handleDateChange} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search student..."
                className="w-96"
                onChange = {(e) => setSearch(e.target.value)}
              />
            </div>

            {/* The table component receives the filtered data */}
            <TeacherAttendanceTable attendanceData={attendanceData} userSearch={search} />
        </div>
    );
};

export default SchoolWideAttendance;