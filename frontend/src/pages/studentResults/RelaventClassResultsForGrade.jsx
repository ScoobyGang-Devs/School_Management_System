import React from 'react';
import { useParams, Outlet , useLocation} from 'react-router-dom'; // Keep Outlet for the next level
import ClassCard from '@/components/class-card'; // Import the new card
import ResultClassCard from './ResultClassCard';
import {useState,useEffect} from 'react';
import api from '../../api.js';

const RelaventClassResultsForGrade = () => {
    const { gradeLevel } = useParams();
    const location = useLocation(); 

    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(true);
        // This is the API call you provided from the student database page
        api
            .get(`student-summary-by-class-name/${gradeLevel}/`)
            .then((res) => res.data)
            .then((data) => {
                // Transform the object: { "6 A": 15, "6 B": 12, ... }
                const transformedData = Object.keys(data).map(key => {
                    // key is "6 A", "6 B", etc.
                    const keyParts = key.split(' '); 
                    const className = keyParts[1];    
                    const studentCount = data[key]; 

                    return {
                        name: className,
                        students: studentCount
                    };
                });

                setClasses(transformedData);
            })
            .catch((err) => {
                console.error("Failed to fetch class summary:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [gradeLevel]); 
    

    // Routing logic to switch to Roster view when a class is selected
    const pathSegments = location.pathname.split('/');
    const isRosterView = pathSegments.length > 4 && pathSegments[pathSegments.length - 1] !== gradeLevel;


    if (isRosterView) {
         return <Outlet />;
    }
 

    return (
        <>
            <h2 className="text-3xl font-bold mb-6">Classes in Grade {gradeLevel} Results</h2>
            
            {isLoading && (
                <div className="text-muted-foreground">Loading class list...</div>
            )}
            
            <div className="flex flex-wrap justify-start gap-8">
                {!isLoading && classes.length === 0 && (
                    <div className="text-red-500">No classes found for this grade.</div>
                )}
                
                {classes.map((classData) => (
                    <ResultClassCard 
                        key={classData.name}
                        gradeLevel={gradeLevel}
                        className={classData.name}
                        studentCount={classData.students} // Passed down the fetched count
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