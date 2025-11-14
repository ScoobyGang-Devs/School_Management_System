import React from 'react';
import { useParams, Outlet , useLocation } from 'react-router-dom'; // Keep Outlet for the next level
import ClassCard from '@/components/class-card'; // Import the new card
import ResultClassCard from './ResultClassCard';

const RelaventClassResultsForGrade = () => {
    // Get the grade level from the URL (e.g., '6', '7')
    const { gradeLevel } = useParams();
    
    // --- MOCK DATA ---
    // In a real app, you would fetch this from your API based on gradeLevel
    const classes = [
        { name: 'A', students: 32 },
        { name: 'B', students: 30 },
        { name: 'C', students: 28 },
        { name: 'D', students: 31 },
    ];
        const pathSegments = location.pathname.split('/');
    const currentClassId = pathSegments[pathSegments.length - 1];
    
    // Check if the current last path segment is one of our class names
    const isRosterView = classes.some(c => c.name === currentClassId);


    // If the path matches a deeper route (Level 3: /classes/6/A), render only the Outlet.
    if (isRosterView) {
         return <Outlet />;
    }
 

    return (
        <>

            <h2 className="text-3xl font-bold mb-6">Classes in Grade {gradeLevel}</h2>
            

            
            <div className="flex flex-wrap justify-start gap-8">
                {classes.map((classData) => (
                    <ResultClassCard 
                        key={classData.name}
                        gradeLevel={gradeLevel}
                        className={classData.name}
                        studentCount={classData.students}
                    />
                ))}
            </div>
            
            <div className="mt-8 border-t pt-8">

                <Outlet />
            </div>
        </>
    );
};

export default RelaventClassResultsForGrade;