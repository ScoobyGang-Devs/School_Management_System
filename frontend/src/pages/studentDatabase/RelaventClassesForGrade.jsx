import React from 'react';
import { useParams, Outlet, useLocation } from 'react-router-dom';
import ClassCard from '@/components/class-card';
import { useState, useEffect } from 'react'; // You're already importing these
import api from '../../api.js';

const RelaventClassesForGrade = () => {
    // Get the grade level from the URL (e.g., '6', '7')
    const { gradeLevel } = useParams();
    const location = useLocation(); // For the routing logic

    // --- THIS IS THE FIX ---
    // 1. Create state to hold your class data
    //    It starts as an empty array.
    const [classes, setClasses] = useState([]);

    // 2. Load the data when the component mounts (or gradeLevel changes)
    useEffect(() => {
        api
            .get(`student-summary-by-class-name/${gradeLevel}/`)
            .then((res) => res.data)
            .then((data) => {
                // 'data' is your object: { "6 A": 15, "6 B": 12, ... }

                // 3. Transform the object into an array
                const transformedData = Object.keys(data).map(key => {
                    // key is "6 A", "6 B", etc.
                    const keyParts = key.split(' '); // ["6", "A"]
                    const className = keyParts[1];    // "A"
                    const studentCount = data[key]; // 15

                    return {
                        name: className,
                        students: studentCount
                    };
                });

                // 4. Set the state with your new array
                setClasses(transformedData);
                console.log("Fetched and transformed data:", transformedData);
            })
            .catch((err) => {
                console.error("Failed to fetch class summary:", err);
                // alert(err); // Using console.error is safer than alert
            });
    }, [gradeLevel]); // Re-run if gradeLevel changes
    


    // --- This logic still works perfectly ---
    const pathSegments = location.pathname.split('/');
    // const currentClassId = pathSegments[pathSegments.length - 1];
    const isRosterView = pathSegments.length > 5;
    
    // Check if the current last path segment is one of our *fetched* class names
    // const isRosterView = classes.some(c => c.name === currentClassId);

    // If the path matches a deeper route (Level 3: /classes/6/A), render only the Outlet.
    if (isRosterView) {
         return <Outlet />;
    }
 
    // Render the list of ClassCards
    return (
        <>
            <h2 className="text-3xl font-bold mb-6">Classes in Grade {gradeLevel}</h2>
            
            {/* We'll use the 'classes' state variable to map */}
            <div className="flex flex-wrap justify-start gap-8">
                {classes.map((classData) => (
                    <ClassCard 
                        key={classData.name}
                        gradeLevel={gradeLevel}
                        className={classData.name}
                        studentCount={classData.students} // This now comes from the API
                    />
                ))}
            </div>
            
            <div className="mt-8 border-t pt-8">
                <Outlet />
            </div>
        </>
    );
};

export default RelaventClassesForGrade;