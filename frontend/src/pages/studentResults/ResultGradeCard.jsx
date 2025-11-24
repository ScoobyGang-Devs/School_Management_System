import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// FIX: Changed import path from absolute ('/api') to simple module import ('api') 
// to resolve the "Could not resolve /api" compilation error, assuming 'api' 
// is correctly aliased or globally available in the project structure.
import api from '../../api.js'; 

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react"; 

// --- Loading Placeholder Component (Skeleton) ---
// Uses background and text colors appropriate for Shadcn's theme
const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-2">
        {/* Using bg-muted for the skeleton placeholder bars */}
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
);


function ResultGradeCard({ gradeLevel }) { 
    const [studentCount, setStudentCount] = useState(null);
    const [averageMark, setAverageMark] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const TERM_ID = 1; // Fixed to Term 1 as requested

    useEffect(() => {
        setIsLoading(true);

        // 1. Fetch Student Count (based on array length)
        const fetchStudentCount = api
            .get(`api/students/grade/${gradeLevel}/`)
            .then(res => res.data.length);

        // 2. Fetch Grade Average (using the specific term ID)
        const fetchAverageMark = api
            .get(`termtest/average/grade/${gradeLevel}/term/${TERM_ID}`)
            .then(res => {
              console.log(res)
                // The API returns data like: {"grade 7": 76.8}
                const key = `grade ${gradeLevel}`;
                const avg = res.data[key];
                return avg ? parseFloat(avg).toFixed(1) : 'N/A';
            });

        // Run both promises concurrently
        Promise.all([fetchStudentCount, fetchAverageMark])
            .then(([count, avg]) => {
                setStudentCount(count);
                setAverageMark(avg);
            })
            .catch(err => {
                console.error("Error fetching grade data:", err);
                // Optionally set error state here
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [gradeLevel]);


    // Determine the route for the "View Results" button
    const resultLink = `/admin/results/classes/${gradeLevel}`;

    return (
        <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-3xl font-bold">Grade {gradeLevel}</CardTitle>
                {/* text-primary for the icon color */}
                <BookOpen className="h-6 w-6 text-primary" /> 
            </CardHeader>
            <CardContent>
                {/* text-muted-foreground for description/secondary text */}
                <CardDescription className="text-sm text-muted-foreground space-y-2">

                    {/* Conditional rendering based on loading state */}
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <p className="text-card-foreground">
                                {studentCount} Students
                            </p>

                            <p className="text-lg">
                                {/* text-primary for emphasis */}
                                <span className="font-bold text-primary">Avg. Mark:</span> {averageMark}%
                            </p>
                            <p className="text-xs pt-2 text-muted-foreground">
                                <span className="font-semibold">Last Exam:</span> Term {TERM_ID} 2025
                            </p>
                        </>
                    )}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Link to={resultLink} className="w-full">
                    {/* The Button component relies on shadcn/ui primary colors by default */}
                    <Button 
                        className="w-full font-bold"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? "Loading..." : "View Results"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

export default ResultGradeCard;