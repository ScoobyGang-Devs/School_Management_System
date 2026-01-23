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
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Added React import
import api from "../api.js"

// --- Loading Placeholder Component (Skeleton) ---
// Copied exactly from ResultGradeCard for consistency
const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-2 mt-4">
        <div className="h-6 bg-muted rounded w-1/3"></div> {/* Adjusted sizes slightly for this card's layout */}
        <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
);


function GradeCard({ gradeLevel }) { // Removed unused studentCount prop

  const [length, setLength] = useState(0);
  // 1. Add isLoading state, initialized to true
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentsByGrade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added dependency warning suppression, or add gradeLevel if it can change dynamically

const getStudentsByGrade = () => {
    setIsLoading(true);
    
    // CHANGED URL: Point to the new 'count' endpoint
    api
        .get(`api/students/count/grade/${gradeLevel}/`) 
        .then((res) => {
            // The API now returns an object: { grade: 6, count: 120 }
            // So we set length directly from res.data.count
            setLength(res.data.count); 
        })
        .catch((err) => {
            console.error("Error fetching student count:", err);
        })
        .finally(() => {
            setIsLoading(false);
        });
  };


  return (
    <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-bold">Grade {gradeLevel}</CardTitle>
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          View all students and classes for Grade {gradeLevel}.
        </CardDescription>

        {/* 3. Conditional Rendering based on isLoading */}
        {isLoading ? (
            <LoadingSkeleton />
        ) : (
            <>
                <div className="text-2xl font-bold mt-4">
                  {length} Students
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently enrolled in this grade.
                </p>
            </>
        )}

      </CardContent>
      <CardFooter>
        <Link to={`/admin/students/classes/${gradeLevel}`} className="w-full">
        {/* 4. Update button state during loading */}
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "View Classes"}
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default GradeCard;