// import { columns} from "./ResultColumn"
import { DataTable } from "./ResultTable"
import ResultButtonBar from "./ExamButton"

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
// FIX 1: Assuming components are in a sibling directory (e.g., '@/components/ResultTable') 
// or adjusting the relative path based on the likely folder structure (e.g., '../components/ResultTable')
// Since the previous error suggested they are siblings, we will try correcting the path relative to the current file.
// FIX 3: Reverting to the previously established relative path for the API helper
import api from '../../api.js'; 

// Assuming columns are defined in this file for simplicity, 
// based on the user-provided code block structure.
// NOTE: We rely on the backend to provide the necessary data keys (id, name, result).



export const columns = [
    { accessorKey: "student_id", header: "Id" }, // Renamed from 'id' to match API
    { accessorKey: "student_name", header: "Name" }, // Renamed from 'name' to match API
    { accessorKey: "total_result", header: "Result" }, // The calculated overall result
];

// --- Data Fetching Component ---
const ResultClassPage = () => {
    // Get parameters from the URL (e.g., /results/6/A)
    const { gradeLevel, classId } = useParams(); // Assumes gradeLevel and classId are in route params

    console.log('ResultClassPage RENDERED with Params:', { gradeLevel, classId }); 

    const [tableData, setTableData] = useState([]);
    const [activeTerm, setActiveTerm] = useState(1); // Default to Term 1
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (termId) => {
        setIsLoading(true);
        // URL uses the GradeClassWiseResultsView endpoint
        const url = `termtest/marks/${gradeLevel}/${classId}/${termId}/`;
        
        try {
            const res = await api.get(url);
            const rawData = res.data;
            
            console.log(`API Response for Term ${termId}:`, rawData); // LOG FOR DEBUGGING

            // The backend returns an object keyed by the class name, 
            // containing an array of students (e.g., {"6 A students' results": [...]})
            const resultKey = `${gradeLevel} ${classId} students' results`;
            const studentsArray = rawData[resultKey] || [];

            // Transform data for the table component
            const transformedData = studentsArray.map(student => {
                // Calculate total marks and count valid subjects for the overall percentage
                const validSubjects = student.subjects.filter(s => s.mark !== null);
                const totalMarks = validSubjects.reduce((sum, s) => sum + parseFloat(s.mark), 0);
                const subjectCount = validSubjects.length;
                
                // Calculate the overall percentage result
                const totalResult = subjectCount > 0 
                    ? (totalMarks / subjectCount).toFixed(1) + '%'
                    : 'N/A';

                return {
                    student_id: student.student_id,
                    student_name: student.student_name,
                    // NOTE: API provides subject details, we compute the final result here:
                    total_result: totalResult, 
                };
            });
            
            setTableData(transformedData);

        } catch (err) {
            console.error("Error fetching class results:", err);
            setTableData([]); // Clear data on error
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and dependency on activeTerm
    useEffect(() => {
        // Need to ensure gradeLevel and classId are available before fetching
        if (gradeLevel && classId) {
            fetchData(activeTerm);
        }
    }, [activeTerm, gradeLevel, classId]); 
    
    // Handler to change the active term
    const handleTermChange = (termId) => {
        setActiveTerm(termId);
    };


    return (
        <>
            <ResultButtonBar activeTerm={activeTerm} onTermChange={handleTermChange} />
            <div classId="container mx-auto py-10">
                {isLoading ? (
                    <div classId="text-center text-muted-foreground">Loading results for Term {activeTerm}...</div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={tableData} 
                        // Show "No results" if data is empty
                        emptyMessage={`No results found for Term ${activeTerm}.`}
                    />
                )}
            </div>
        </>
    );
};

export default ResultClassPage;