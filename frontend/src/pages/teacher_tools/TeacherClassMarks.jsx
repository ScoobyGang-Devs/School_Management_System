import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom'; // IMPORT THIS
import api from '../../api'; 
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, BookOpen, Calendar } from 'lucide-react';

const TeacherClassMarks = () => {
    // 1. Get Grade and Class from the URL (clicked card)
    const { grade, classId } = useParams(); 

    // 2. Load User for subject preference (optional)
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch (e) {
            return {};
        }
    }, []);

    // 3. State Management
    const [selectedTerm, setSelectedTerm] = useState("1");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [resultData, setResultData] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 4. Fetch Marks Data
    useEffect(() => {
        if (!grade || !classId) return;

        const fetchMarks = async () => {
            setLoading(true);
            setError(null);
            try {
                // Endpoint: /marks/<int:grade>/<str:classname>/<int:term>/
                // NOTE: 'classId' from URL corresponds to 'classname' in API (e.g. "A", "B", "C")
                const response = await api.get(`/termtest/marks/${grade}/${classId}/${selectedTerm}/`);
                
                // Handle Dynamic Response Key
                const dataArray = Object.values(response.data)[0] || [];
                setResultData(dataArray);

                // Extract Unique Subjects
                if (dataArray.length > 0) {
                    const subjects = dataArray[0].subjects.map(sub => sub.subject_name);
                    setAvailableSubjects(subjects);

                    // Auto-select subject
                    if (!selectedSubject && subjects.length > 0) {
                        const teacherSubject = user.subject || ""; 
                        const defaultSub = subjects.find(s => s.toLowerCase() === teacherSubject.toLowerCase()) || subjects[0];
                        setSelectedSubject(defaultSub);
                    }
                } else {
                    // Reset if no data
                    setAvailableSubjects([]);
                    setResultData([]);
                }

            } catch (err) {
                console.error("Error fetching marks:", err);
                setError("No results found for this term.");
                setResultData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMarks();
    }, [grade, classId, selectedTerm]); // Re-run when URL changes

    // 5. Filter Data for Display
    const displayedRows = useMemo(() => {
        if (!selectedSubject) return [];

        return resultData.map(student => {
            const subjectData = student.subjects.find(s => s.subject_name === selectedSubject);
            
            return {
                student_id: student.student_id,
                student_name: student.student_name,
                mark: subjectData ? subjectData.mark : null
            };
        });
    }, [resultData, selectedSubject]);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Class Results</h1>
                    <p className="text-muted-foreground">
                        Viewing results for <span className="font-semibold text-primary">{grade} {classId}</span>
                    </p>
                </div>

                {/* Controls Area */}
                <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-lg border">
                    
                    {/* Term Selector */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                            <SelectTrigger className="w-[140px] bg-white">
                                <SelectValue placeholder="Select Term" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1st Term</SelectItem>
                                <SelectItem value="2">2nd Term</SelectItem>
                                <SelectItem value="3">3rd Term</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    {/* Subject Selector */}
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder={availableSubjects.length > 0 ? "Select Subject" : "No Subjects"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSubjects.map((sub, idx) => (
                                    <SelectItem key={idx} value={sub}>
                                        {sub}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{selectedSubject || "Subject"} Marks</span>
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                         <div className="text-center py-10 text-red-500 bg-red-50 rounded-md">
                            {error}
                        </div>
                    ) : displayedRows.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            {loading ? "Loading results..." : "Select a subject to view marks."}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[150px]">Index Number</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="text-right">Mark Obtained</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayedRows.map((row) => (
                                        <TableRow key={row.student_id}>
                                            <TableCell className="font-medium">{row.student_id}</TableCell>
                                            <TableCell>{row.student_name}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {row.mark === null ? (
                                                    <span className="text-red-400 text-xs uppercase">Absent</span>
                                                ) : (
                                                    row.mark
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherClassMarks;