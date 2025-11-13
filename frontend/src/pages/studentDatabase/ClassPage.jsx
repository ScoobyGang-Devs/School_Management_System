import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutList, UserPlus, FileText } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

const MOCK_STUDENTS = [
    { id: 1001, name: "Emily Johnson", attendance_status: "Present", score_avg: 92, last_active: "Today" },
    { id: 1002, name: "Liam Chen", attendance_status: "Absent", score_avg: 78, last_active: "2 days ago" },
    { id: 1003, name: "Sofia Rodriguez", attendance_status: "Present", score_avg: 95, last_active: "Today" },
    { id: 1004, name: "Noah Williams", attendance_status: "Late", score_avg: 85, last_active: "Yesterday" },
    { id: 1005, name: "Aisha Khan", attendance_status: "Present", score_avg: 88, last_active: "Today" },
    { id: 1006, name: "Jacob Brown", attendance_status: "Absent", score_avg: 65, last_active: "1 week ago" },
];

const ClassDataPage = () => {
    // 1. Get parameters from the URL
    const { gradeLevel, classId } = useParams();

    // Determine the title based on the URL
    const pageTitle = `Roster: Grade ${gradeLevel}${classId}`;

    // Helper function for styling attendance status
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

            {/* Student Data Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr className="text-left text-sm font-semibold text-muted-foreground">
                            <th className="py-3 px-4">Student ID</th>
                            <th className="py-3 px-4">Full Name</th>
                            <th className="py-3 px-4">Attendance Today</th>
                            <th className="py-3 px-4">Score Avg.</th>
                            <th className="py-3 px-4">Last Activity</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {MOCK_STUDENTS.map((student) => (
                            <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-4 text-sm text-muted-foreground">{student.id}</td>
                                <td className="py-3 px-4 text-base font-medium text-primary cursor-pointer hover:underline">
                                    {/* In a real app, this would link to /profile/1001 */}
                                    {student.name}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(student.attendance_status)}`}>
                                        {student.attendance_status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold">{student.score_avg}%</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{student.last_active}</td>
                                <td className="py-3 px-4 text-center">
                                    <Button variant="ghost" size="sm">Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
                Displaying {MOCK_STUDENTS.length} students in class {gradeLevel}{classId}.
            </div>
        </div>
    );
};

export default ClassDataPage;