import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LayoutList } from "lucide-react"; // Changed icon for class context
import { Link } from 'react-router-dom';
import {useState,useEffect} from 'react';
import api from '../../api.js';

// --- Loading Placeholder Component ---
const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-2 pt-2">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-6 bg-muted rounded w-3/4 mt-4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
);


function ResultClassCard({ gradeLevel, className, studentCount }) {
    const [avgMark, setAvgMark] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // We assume Term 1 is required for this card
    const TERM_ID = 1; 

    useEffect(() => {
        setIsLoading(true);

        // NOTE: This API endpoint is currently hypothetical (class-specific average).
        // It needs to be implemented in your Django backend.
        const fetchAverageMark = api
            .get(`termtest/average/grade/${gradeLevel}/class/${className}/term/${TERM_ID}`)
            .then(res => {
                     console.log(res)
                // Backend returns data like: { "6 A": 70.26 }
                const dynamicKey = `${gradeLevel} ${className}`; 
                
                // FIX: Dynamically access the value using the constructed key
                const rawAvg = res.data[dynamicKey]; 
                
                return rawAvg ? parseFloat(rawAvg).toFixed(1) : 'N/A';
            });

        fetchAverageMark
            .then(avg => setAvgMark(avg))
            .catch(err => {
                console.error(`Error fetching average mark for ${gradeLevel}${className}:`, err);
                setAvgMark('Error');
            })
            .finally(() => {
                setIsLoading(false);
            });
            
    }, [gradeLevel, className]);

    const linkPath = `${className}`; 

    return (
        <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* Combines grade and class name */}
                <CardTitle className="text-3xl font-bold">{gradeLevel}{className}</CardTitle>
                <LayoutList className="h-6 w-6 text-primary" /> 
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <>
                        <CardDescription className="text-sm text-card-foreground">
                            {studentCount} Students
                        </CardDescription>
                        <div className="text-2xl font-bold mt-4">
                            <p>Avg. Mark: <span className="text-primary">{avgMark}%</span></p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Avg. of all students
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                <Link to={linkPath} className="w-full">
                    <Button 
                        className="w-full" 
                        variant="secondary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "View Roster"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

export default ResultClassCard;