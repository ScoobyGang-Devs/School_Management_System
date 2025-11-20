import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutList, UserPlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react'; // You're already importing these
import api from '../../api.js';
// Import all necessary Shadcn Table components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'; 

// const MOCK_STUDENTS = [ ... ]; // CHANGED: We don't need this anymore

const ClassDataPage = () => {
    const { gradeLevel, classId } = useParams();

    // CHANGED: Create state to hold your students
    const [students, setStudents] = useState([]);

    useEffect(() => {
        getStudentsByGrade();
    }, [gradeLevel, classId]); // CHANGED: Added dependencies. This is crucial!
  
  
    const getStudentsByGrade = () => {
        api
            .get(`roster/${gradeLevel}/${classId}/`)
            .then((res) => res.data)
            .then((data) => {
                console.log(data);
                setStudents(data); // CHANGED: Save the fetched data into state
            })
            .catch((err) => console.error(err)); // Use console.error instead of alert
    };


    const pageTitle = `Roster: Grade ${gradeLevel}${classId}`;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'Late': return 'bg-yellow-100 text-yellow-800';
            // CHANGED: Added a case for the data you're getting from the API
            case 'Not Marked': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div >
            {/* Header and Actions (No change) */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
                    <LayoutList className="w-6 h-6" /> {pageTitle}
                </h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Export Roster
                    </Button>
                    <Button className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </Button>
                </div>
            </div>

            {/* Student Data Table using Shadcn components */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            {/* CHANGED: Your API data doesn't have an ID, so let's call it "Index" */}
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Attendance Today</TableHead>
                            <TableHead>Score Avg.</TableHead>
                            {/* <TableHead>Last Activity</TableHead>  <-- This column was in your header but not your map, so I removed it to match. */}
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* CHANGED: Map over 'students' state instead of 'MOCK_STUDENTS' */}
                        {students.map((student, index) => (
                            // CHANGED: Use 'index' as key since we don't have a unique ID from the API.
                            // This is okay if the list doesn't get re-ordered.
                            <TableRow key={index}>
                                {/* CHANGED: Use index + 1 for a simple row number */}
                                <TableCell className="font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                                <TableCell className="font-medium cursor-pointer hover:underline">
                                    {student.name}
                                </TableCell>
                                <TableCell>
                                    {/* CHANGED: Use 'student.attendance_today' from your API data */}
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(student.attendance_today)}`}>
                                        {student.attendance_today}
                                    </span>
                                </TableCell>
                                {/* CHANGED: Check for null score_avg */}
                                <TableCell className="font-semibold">
                                    {student.score_avg ? `${student.score_avg}%` : 'N/A'}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
                {/* CHANGED: Use 'students.length' */}
                Displaying {students.length} students in class {gradeLevel}{classId}.
            </div>
        </div>
    );
};

export default ClassDataPage;