import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label"; // Used for labels/dropdowns
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
// FIX: Changing path to a commonly successful absolute alias
import api from '../../api.js'; 
import GradeComboBox from '../GradeAssignments/GradeComboBox.jsx';
import SubjectComboBox from '../GradeAssignments/SubjectComboBox.jsx';


// --- 1. Editable Cell Component ---
// This component renders the input field inside the table cell
const EditableMarkCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue || '');

    // Update state when the prop changes (e.g., if a new class is selected)
    useEffect(() => {
        setValue(initialValue || '');
    }, [initialValue]);

    // When focus leaves the input, update the parent state (the marks data)
    const onBlur = () => {
        table.options.meta.updateData(row.index, column.id, value);
    };

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="w-20 h-8 text-center"
        />
    );
};

// --- 2. Main Mark Entry Component ---
function MarkEntryTable() {
    // We assume the URL provides the necessary context: /admin/marks/6/A/Maths
    // const { gradeLevel, className } = useParams(); 

    const [gradeLevel,setGradeLevel] = useState("6");
    const [className,setClassName] = useState("A");
    // const className 
    
    // Hardcoded for Teacher context and initial term
    // NOTE: In a real app, TEACHER_ID would come from authentication context.
    const TEACHER_ID = 42; 
    const TERM_ID = 1; 

    // Dynamic state for selected subject (would be controlled by a dropdown)
    const [selectedSubjectName, setSelectedSubjectName] = useState('Mathematics'); 
    
    const [marksData, setMarksData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');


    // Helper function to update the array state when a cell input changes
    const updateMarksData = (rowIndex, columnId, value) => {
        setMarksData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    };
    
    // --- API Fetch: Get Class Roster ---
    useEffect(() => {
        // You have a GradeRosterAPIView that returns students by grade/class.
        // Assuming this endpoint exists: /roster/6/A/
        const fetchRoster = async () => {
            setIsLoading(true);
            try {
                // API call to get the list of students in the class
                // NOTE: The endpoint should return a list of students in the format: 
                // [{indexNumber: 10001, fullName: 'Student X'}, ...]
                const rosterUrl = `/roster/${gradeLevel}/${className}/`; 
                const res = await api.get(rosterUrl);
                
                console.log(res)
                // MOCK DATA Structure Assumption:
                // If the backend returns an array of students directly:
                const students = res.data.students || res.data || []; 

                // Initialize marks state: each student gets a placeholder mark field
                const initialMarks = students.map(student => ({
                    // Ensure these keys match the student model keys
                    student_id: student.indexNumber || student.student_id, 
                    student_name: student.name || student.student_name,
                    mark: '', // This will hold the mark input
                }));
                setMarksData(initialMarks);

            } catch (error) {
                console.error("Failed to fetch class roster:", error);
                setSubmissionMessage('Failed to load roster.');
            } finally {
                setIsLoading(false);
            }
        };

        if (gradeLevel && className) {
             fetchRoster();
        }
    }, [gradeLevel, className]);

    // --- Column Definition ---
    const columns = React.useMemo(() => [
        {
            accessorKey: 'student_id',
            header: () => <div className="text-center">ID</div>,
        },
        {
            accessorKey: 'student_name',
            header: 'Student Name',
        },
        {
            accessorKey: 'mark',
            header: () => <div className="text-center text-primary font-semibold">{selectedSubjectName} Mark</div>,
            cell: EditableMarkCell, // Renders the Input component
            // Ensure the column ID matches the state field ('mark')
            id: 'mark', 
        },
    ], [selectedSubjectName]);

    // --- Submission Logic ---
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionMessage('');

        // 1. Map the state data into the required bulk JSON schema
        const bulkPayload = marksData
            .filter(item => item.mark !== '' && item.mark !== null) // Only submit records with marks
            .map(item => ({
                subjectName: selectedSubjectName,
                studentID: item.student_id,
                term: TERM_ID,
                // Ensure marks are valid numbers between 0 and 100 before conversion/submission
                marksObtained: parseFloat(item.mark), 
                teacherID: TEACHER_ID,
            }));

        if (bulkPayload.length === 0) {
            setSubmissionMessage('No marks entered to submit.');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = 'termtest/subject-wise-marks/create/';
            const res = await api.post(url, bulkPayload);

            // Handle both HTTP 201 (full success) and HTTP 207 (partial success)
            if (res.status === 201) {
                 setSubmissionMessage(`Successfully submitted ${res.data.length || bulkPayload.length} marks!`);
            } else if (res.status === 207 && res.data.errors) {
                 setSubmissionMessage(`Partial success: ${res.data.created.length} created. ${res.data.errors.length} failed. See console.`);
            } else {
                 setSubmissionMessage(`Submission received, but check server logs (Status ${res.status}).`);
            }


        } catch (error) {
            console.error("Submission Error:", error.response?.data || error.message);
            // Display serializer validation errors if available
            const errorMsg = error.response?.data?.errors?.[0]?.errors?.[0] || error.message;
            setSubmissionMessage(`Submission Failed: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- Table Setup ---
    const table = useReactTable({
        data: marksData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Pass the update function via table meta to the cell component
        meta: {
            updateData: updateMarksData,
        },
    });

    // --- Render ---
    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading class roster...</div>;
    }

    return (
        <div className="p-4 space-y-6">
          
            <h3 className="text-2xl font-bold">Mark Entry: Grade {gradeLevel}{className} ({selectedSubjectName})</h3>

            <GradeComboBox  setGradeLevel={setGradeLevel} setClassName={setClassName}/>

            {/* Controls Row (Subject Selector & Submission) */}
            <div className="flex justify-between items-end border-b pb-4">
                <div className="space-y-1">
                    <Label htmlFor="subject-select">Select Subject:</Label>
                    {/* Placeholder for a dynamic Subject Select/Dropdown */}
                    <SubjectComboBox  setSubjectName={setSelectedSubjectName}/>
                </div>
                
                <div className="space-y-2">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || marksData.length === 0}
                        className="font-bold"
                    >
                        {isSubmitting ? "Submitting..." : `Submit ${marksData.length} Marks (Term ${TERM_ID})`}
                    </Button>
                    {submissionMessage && (
                        <p className={`text-sm text-center ${submissionMessage.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
                            {submissionMessage}
                        </p>
                    )}
                </div>
            </div>


            {/* Data Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {marksData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No students found in this class roster.
                </div>
            )}
        </div>
    );
}

export default MarkEntryTable;