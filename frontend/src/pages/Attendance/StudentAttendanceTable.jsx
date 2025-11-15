import React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'; // Using Badge for status, but your span styling works too
import { LayoutList } from 'lucide-react'; // For a nice icon in the header
import { Button } from '@/components/ui/button';

// Mock Data for students


const StudentAttendanceTable = ({attendanceData}) => {

    const dataToDisplay = attendanceData || [];
const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'Late': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 bg-card rounded-xl shadow-lg">
            {/* Simple Header */}
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <LayoutList className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl font-bold text-foreground">Student Attendance Overview</h2>
            </div>

            {/* Attendance Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataToDisplay.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium text-muted-foreground">{student.id}</TableCell>
                                <TableCell className="font-semibold">{student.name}</TableCell>
                                <TableCell>
                                    {/* Using your getStatusStyle for the badge/span */}
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(student.status)}`}>
                                        {student.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
                Displaying {dataToDisplay.length} student records.
            </div>
        </div>
    );}

export default StudentAttendanceTable