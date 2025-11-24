import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js'; // Adjust path to your api helper
import { 
    Users, 
    UserPlus, 
    Search, 
    Mail, 
    Phone, 
    GraduationCap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'; 

const TeacherDatabase = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data on mount
    useEffect(() => {
        getTeachers();
    }, []);

    const getTeachers = () => {
        api
            .get('teachers/all/')
            .then((res) => {
                setTeachers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch teachers:", err);
                setLoading(false);
            });
    };

    // Simple search filter logic
    const filteredTeachers = teachers.filter(teacher => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = teacher.fullName?.toLowerCase().includes(searchLower) || '';
        const idMatch = teacher.teacherId?.toString().includes(searchLower) || '';
        const nicMatch = teacher.nic_number?.toString().toLowerCase().includes(searchLower) || '';
        return nameMatch || idMatch || nicMatch;
    });

    // Helper to format the assigned class safely
    const renderAssignedClass = (assignedClass) => {
        if (!assignedClass) return <span className="text-muted-foreground italic text-xs">Subject Teacher</span>;
        
        // Assuming your serializer returns an object like { grade: 10, className: 'A' }
        // If it returns just a string or ID, you might need to adjust this check
        if (typeof assignedClass === 'object') {
            return `Grade ${assignedClass.grade}-${assignedClass.className}`;
        }
        return assignedClass; // Fallback if it's just a string
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8" /> Teacher Database
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and view all academic staff members.
                    </p>
                </div>
                <div className="flex gap-3">
                </div>
            </div>

            {/* --- Search & Stats Bar --- */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by Name, ID or NIC..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Total Teachers: <span className="font-semibold text-foreground">{teachers.length}</span>
                </div>
            </div>

            {/* --- Teacher Table --- */}
            <div className="rounded-md border shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Teacher Name</TableHead>
                            <TableHead>Role / Class</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Loading staff details...
                                </TableCell>
                            </TableRow>
                        ) : filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No teachers found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <TableRow key={teacher.teacherId} className="group hover:bg-muted/20 transition-colors">
                                    {/* ID Column */}
                                    <TableCell className="font-mono text-xs font-medium">
                                        #{teacher.teacherId}
                                    </TableCell>

                                    {/* Name Column */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-base">
                                                {teacher.title} {teacher.fullName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Born: {teacher.dateOfBirth || 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Class/Role Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {teacher.assignedClass ? (
                                                <Badge variant="secondary" className="flex gap-1 items-center">
                                                    <GraduationCap className="w-3 h-3" />
                                                    {renderAssignedClass(teacher.assignedClass)}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground border-dashed">
                                                    Not Assigned
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Section Column */}
                                    <TableCell className="text-sm">
                                        {teacher.section || "General"}
                                    </TableCell>

                                    {/* Contact Column */}
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm">
                                            {teacher.email && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="w-3 h-3" /> {teacher.email}
                                                </div>
                                            )}
                                            {teacher.mobileNumber && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3 h-3" /> {teacher.mobileNumber}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Status/Gender (Visual Indicator) */}
                                    <TableCell className="text-center">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${teacher.gender === 'M' ? 'bg-blue-100 text-blue-800' : 
                                              teacher.gender === 'F' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {teacher.gender === 'M' ? 'Male' : teacher.gender === 'F' ? 'Female' : 'N/A'}
                                        </div>
                                    </TableCell>

                                    {/* Actions Column */}
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="hover:bg-primary/10 hover:text-primary"
                                            onClick={() => navigate(`/teacher-profile/${teacher.teacherId}`)}
                                        >
                                            View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TeacherDatabase;