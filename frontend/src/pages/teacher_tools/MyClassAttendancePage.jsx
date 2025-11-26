import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 1. Import this to read URL
import StudentAttendanceTable from '../Attendance/StudentAttendanceTable.jsx';
import { Button } from '@/components/ui/button';
import AttendanceDatePicker from '../Attendance/AttedanceDatePicker.jsx'; // Check spelling!
import { Input } from '@/components/ui/input';
import api from "../../api.js";

const MyclassAttendance = () => {
    // 2. Get the Grade and Class from the URL
    const { grade, classId } = useParams(); 

    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [search, setSearch] = useState("");
    
    // State for fetched data
    const [roster, setRoster] = useState([]); 
    const [aggregateAttendance, setAggregateAttendance] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // --- HELPER FUNCTION ---
    const formatLocalISO = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 3. FIX: Define dateString here so it exists!
    const dateString = formatLocalISO(selectedDate);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    // 4. ADDED: Effect to actually fetch the data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Example API call - ADJUST URL TO MATCH YOUR BACKEND
                // We need both the list of students (roster) and today's attendance
                const rosterRes = await api.get(`/api/students/class/${grade}/${classId}/`);
                const attendanceRes = await api.get(`/api/attendance/${grade}/${classId}?date=${dateString}`);

                setRoster(rosterRes.data);
                setAggregateAttendance(attendanceRes.data); // Might be null or empty if not taken yet
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optional: Handle error (e.g., setRoster([]) if 404)
            } finally {
                setIsLoading(false);
            }
        };

        if (grade && classId && dateString) {
            fetchData();
        }
    }, [grade, classId, dateString]); // Re-run if date or class changes


    const attendanceData = useMemo(() => { 
        if (!roster || roster.length === 0) return []; // Safety check

        // Step 1: Initialize the data based on the full class roster
        const mergedData = roster.map(student => {
            const studentIndex = student.student_id || student.id; // Ensure we get the ID
            
            return {
                ...student, 
                status: 'Not Marked', 
                indexNumber: studentIndex, 
                date: dateString, // NOW THIS WORKS because dateString is defined
            };
        });

        // Step 2: Apply attendance status
        if (aggregateAttendance && aggregateAttendance.absentList) {
            const absentIDs = aggregateAttendance.absentList.map(String); 
            
            return mergedData.map(student => {
                // Check if this student is in the absent list
                if (absentIDs.includes(String(student.indexNumber))) {
                    return { ...student, status: 'Absent' };
                }
                // If record exists but not absent, they are Present
                return { ...student, status: 'Present' };
            });
        }
        
        // Step 3: Search Filter
        return mergedData.filter(student => {
             // Safety check in case name is missing
             const name = student.name ? student.name.toLowerCase() : "";
             const idx = student.indexNumber ? String(student.indexNumber) : "";
             
             return name.includes(search.toLowerCase()) || idx.includes(search);
        });
            
    }, [roster, aggregateAttendance, dateString, search]); 

    return (
        <div className="p-6"> {/* Added padding so it's not stuck to edge */}
            <h1 className="text-2xl font-bold mb-4">Class {grade} - {classId} Attendance</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <AttendanceDatePicker onSelect={handleDateChange} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search student..."
                className="w-96"
                onChange = {(e) => setSearch(e.target.value)}
              />
            </div>
            
            {isLoading && <p className="text-blue-500">Loading data...</p>}

            <StudentAttendanceTable 
                attendanceData={attendanceData} 
                userSearch={search} 
            />
        </div>
    )
}

export default MyclassAttendance;