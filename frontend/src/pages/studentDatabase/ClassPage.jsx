import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutList, UserPlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Import all necessary Shadcn Table components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'; 

const MOCK_STUDENTS = [
    { id: 1001, name: "Emily Johnson", attendance_status: "Present", score_avg: 92,  },
    { id: 1002, name: "Liam Chen", attendance_status: "Absent", score_avg: 78,  },
    { id: 1003, name: "Sofia Rodriguez", attendance_status: "Present", score_avg: 95,  },
    { id: 1004, name: "Noah Williams", attendance_status: "Late", score_avg: 85, },
    { id: 1005, name: "Aisha Khan", attendance_status: "Present", score_avg: 88,  },
    { id: 1006, name: "Jacob Brown", attendance_status: "Absent", score_avg: 65, }
];

const ClassDataPage = () => {
    // 1. Get parameters from the URL
    const { gradeLevel, classId } = useParams();

    // Determine the title based on the URL
    const pageTitle = `Roster: Grade ${gradeLevel}${classId}`;

    // Helper function for styling attendance status (Kept the same)
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'Late': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div >

            {/* Header and Actions */}
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
                            <TableHead className="w-[100px]">Student ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Attendance Today</TableHead>
                            <TableHead>Score Avg.</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_STUDENTS.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                                <TableCell className="font-medium cursor-pointer hover:underline">
                                    {student.name}
                                </TableCell>
                                <TableCell>
                                    {/* Applying the status style here */}
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(student.attendance_status)}`}>
                                        {student.attendance_status}
                                    </span>
                                </TableCell>
                                <TableCell className="font-semibold">{student.score_avg}%</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
                Displaying {MOCK_STUDENTS.length} students in class {gradeLevel}{classId}.
            </div>
        </div>
    );
};

export default ClassDataPage;