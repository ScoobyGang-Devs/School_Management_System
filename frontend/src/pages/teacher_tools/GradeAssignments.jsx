import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label"; 
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import api from '../../api.js'; 
import GradeComboBox from '../GradeAssignments/GradeComboBox.jsx';
import SubjectPillSelector from '../GradeAssignments/SubjectComboBox.jsx';


// --- 1. Editable Cell Component (Unchanged) ---
const EditableMarkCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue || '');

    useEffect(() => {
        setValue(initialValue || '');
    }, [initialValue]);

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

    const [gradeLevel, setGradeLevel] = useState("6");
    const [className, setClassName] = useState("A");
    
    // --- NEW: Dynamic Term State ---
    const [selectedTerm, setSelectedTerm] = useState(1); 

    const TEACHER_ID = 42; 
    // const TERM_ID = 1; // REMOVED: No longer hardcoded

    const [selectedSubjectName, setSelectedSubjectName] = useState('Mathematics'); 
    
    const [marksData, setMarksData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState('');


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
        const fetchRoster = async () => {
            setIsLoading(true);
            try {
                const rosterUrl = `/roster/${gradeLevel}/${className}/`; 
                const res = await api.get(rosterUrl);
                
                // console.log(res)
                const students = res.data.students || res.data || []; 

                const initialMarks = students.map(student => ({
                    student_id: student.indexNumber || student.student_id, 
                    student_name: student.name || student.student_name,
                    mark: '', 
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
    }, [gradeLevel, className]); // Note: If you want to refetch *existing marks* when term changes, add selectedTerm here.

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
            cell: (props) => (
                <div className="flex justify-center">
                    <EditableMarkCell {...props} />
                </div>
            ),
            id: 'mark', 
        },
    ], [selectedSubjectName]);

    // --- Submission Logic ---
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionMessage('');

        const bulkPayload = marksData
            .filter(item => item.mark !== '' && item.mark !== null) 
            .map(item => ({
                subjectName: selectedSubjectName,
                studentID: item.student_id,
                term: selectedTerm, // --- UPDATED: Uses state variable ---
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

            if (res.status === 201) {
                 setSubmissionMessage(`Successfully submitted ${res.data.length || bulkPayload.length} marks for Term ${selectedTerm}!`);
            } else if (res.status === 207 && res.data.errors) {
                 setSubmissionMessage(`Partial success: ${res.data.created.length} created. ${res.data.errors.length} failed. See console.`);
            } else {
                 setSubmissionMessage(`Submission received, but check server logs (Status ${res.status}).`);
            }

        } catch (error) {
            console.error("Submission Error:", error.response?.data || error.message);
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
        meta: {
            updateData: updateMarksData,
        },
    });

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading class roster...</div>;
    }

return (
    <div className="p-4 space-y-6">
      
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold tracking-tight">
                Mark Entry: Grade {gradeLevel}{className} <span className="text-muted-foreground font-normal">({selectedSubjectName})</span>
            </h3>
            <p className="text-muted-foreground text-sm">
                Select a grade, term, and subject to begin entering marks.
            </p>
        </div>

        <div>
            <GradeComboBox 
                setGradeLevel={setGradeLevel} 
                setClassName={setClassName}
            />
        </div>

        {/* --- Control Bar: Term & Subject Selection --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-6 pt-2">
            
            <div className="flex flex-col md:flex-row gap-6 w-full">
                
                {/* --- NEW: Term Selector --- */}
                <div className="space-y-2 shrink-0">
                    <Label className="text-sm font-medium ml-1">Select Term:</Label>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((term) => (
                            <Button
                                key={term}
                                variant={selectedTerm === term ? "default" : "outline"}
                                onClick={() => setSelectedTerm(term)}
                                size="sm"
                                className={`w-12 transition-all ${selectedTerm === term ? "ring-2 ring-primary ring-offset-1" : ""}`}
                            >
                                {term}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full overflow-hidden space-y-2">
                    <Label className="text-sm font-medium ml-1">Select Subject:</Label>
                    <SubjectPillSelector 
                        selectedSubject={selectedSubjectName}
                        setSubjectName={setSelectedSubjectName}
                    />
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 shrink-0">
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || marksData.length === 0}
                    className="font-bold min-w-[180px]"
                    size="lg" 
                >
                    {isSubmitting ? (
                        <>Submitting...</>
                    ) : (
                        // --- UPDATED: Dynamic Button Text ---
                        <>Submit Marks (Term {selectedTerm})</>
                    )}
                </Button>
                
                {submissionMessage && (
                    <p className={`text-xs font-medium ${
                        submissionMessage.includes('Successfully') ? 'text-green-600' : 'text-destructive'
                    }`}>
                        {submissionMessage}
                    </p>
                )}
            </div>
        </div>

        {/* --- Table Section (Unchanged) --- */}
        <div className="overflow-hidden rounded-md border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-muted/50">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-bold">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/5">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                {marksData.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                                        <p>No students found for this class.</p>
                                        <p className="text-xs">Try selecting a different Grade or Class.</p>
                                    </div>
                                ) : (
                                    "No results."
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </div>
);
}

export default MarkEntryTable;