import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import StudentAttendanceTable from '../Attendance/StudentAttendanceTable.jsx';
import AttendanceDatePicker from '../Attendance/AttedanceDatePicker.jsx'; 
import { Input } from '@/components/ui/input';
import api from "../../api.js";

const MyclassAttendance = () => {
    // 1. Get Grade (e.g., "6") and ClassLetter (e.g., "A") from URL
    const { grade, classId } = useParams(); 

    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [search, setSearch] = useState("");
    
    // Data States
    const [roster, setRoster] = useState([]); 
    const [dailyAttendanceList, setDailyAttendanceList] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    // --- Helper: Format Date as YYYY-MM-DD (Local Time) ---
    const formatLocalISO = (date) => {
        if (!date) return "";
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const dateString = formatLocalISO(selectedDate);

    // --- 2. Fetch Data ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // FETCH ROSTER: Matches 'student-list/<int:grade>/<str:class_letter>/'
                // Returns: [{ "index": 1001, "studentName": "Selith" }, ...]
                const rosterRes = await api.get(`/attendence/student-list/${grade}/${classId}/`);
                setRoster(rosterRes.data);

                // FETCH ATTENDANCE: Matches 'studentattendence/'
                // Returns a list of ALL classes' attendance for this date.
                const attendanceRes = await api.get(`/attendence/studentattendence/?date=${dateString}`);
                setDailyAttendanceList(attendanceRes.data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (grade && classId && dateString) {
            fetchData();
        }
    }, [grade, classId, dateString]); 


    // --- 3. Logic: Merge Roster with Daily Attendance Status ---
    const attendanceData = useMemo(() => { 
        if (!roster || roster.length === 0) return []; 

        // A. Identify the specific record for THIS class from the daily list
        // Your backend stores className like "6 A" (grade + space + letter)
        const currentClassString = `${grade} ${classId}`;
        
        // Find the object in the response list where className matches
        const classRecord = dailyAttendanceList.find(
            record => record.className === currentClassString
        );

        // B. Extract absent list (if record exists)
        const absentIDs = classRecord ? classRecord.absentList.map(String) : [];
        const isMarked = !!classRecord; // If we found a record, attendance was taken

        // C. Map over the Roster to assign status
        const mergedData = roster.map(student => {
            const studentIndex = String(student.index); // Use 'index' from roster API
            
            let status = 'Not Marked';
            
            if (isMarked) {
                // If ID is in absentList -> Absent, otherwise -> Present
                status = absentIDs.includes(studentIndex) ? 'Absent' : 'Present';
            }

            return {
                id: studentIndex,
                indexNumber: student.index, 
                name: student.studentName, 
                date: dateString, 
                status: status 
            };
        });

        // D. Filter by Search (Name or ID)
        return mergedData.filter(student => {
             const name = student.name ? student.name.toLowerCase() : "";
             const idx = String(student.indexNumber);
             const searchLower = search.toLowerCase();
             
             return name.includes(searchLower) || idx.includes(searchLower);
        });
            
    }, [roster, dailyAttendanceList, dateString, search, grade, classId]); 

    return (
        <div className="p-6"> 
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Class {grade} - {classId} Attendance View</h1>
                <p className="text-gray-500 text-sm">View daily attendance records</p>
            </div>
            
            {/* Controls: Date Picker & Search */}
            <div className="flex items-center gap-4 mb-4">
              <AttendanceDatePicker onSelect={setSelectedDate} date={selectedDate}  />
              <Input
                type="text" 
                placeholder="Search by name or index..."
                className="w-96"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            
            {isLoading && <p className="text-blue-500 text-sm animate-pulse mb-2">Loading records...</p>}

            {/* Read-Only Table */}
            <StudentAttendanceTable 
                attendanceData={attendanceData} 
                userSearch={search}
                readOnly={true} // Optional prop if you want to disable editing UI in table
            />
        </div>
    )
}

export default MyclassAttendance;