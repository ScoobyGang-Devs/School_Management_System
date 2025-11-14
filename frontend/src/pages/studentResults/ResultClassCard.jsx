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

function ResultClassCard({ gradeLevel, className, studentCount }) {
  
  // The link path must be RELATIVE to its parent route!
  // Parent route path: /admin/students/classes/:gradeLevel
  // Child route path: :classId (which is className here)
  const linkPath = `${className}`; 

  return (
    <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Combines grade and class name */}
        <CardTitle className="text-3xl font-bold">{gradeLevel}{className}</CardTitle>
        <LayoutList className="h-6 w-6 text-muted-foreground" /> 
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          View all student records and details.
        </CardDescription>
        <div className="text-2xl font-bold mt-4">
          {studentCount} Students
        </div>
        <p className="text-xs text-muted-foreground">
          Current enrollment for this class.
        </p>
      </CardContent>
      <CardFooter>
        <Link to={linkPath} className="w-full">
          <Button className="w-full" variant="secondary">
            View Roster
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ResultClassCard;