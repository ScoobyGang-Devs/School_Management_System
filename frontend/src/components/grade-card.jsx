import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react"; // Assuming you use lucide-react for icons
import { Link } from 'react-router-dom';

// You might want to pass these as props later, but for now, hardcoded:
const gradeLevel = 6;
const studentCount = 125; // Example student count

function GradeCard({gradeLevel,studentCount}) { // Changed to a functional component
  return (
    <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-bold">Grade {gradeLevel}</CardTitle>
        <BookOpen className="h-6 w-6 text-muted-foreground" /> {/* Icon */}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          View all students and classes for Grade {gradeLevel}.
        </CardDescription>
        <div className="text-2xl font-bold mt-4">
          {studentCount} Students
        </div>
        <p className="text-xs text-muted-foreground">
          Currently enrolled in this grade.
        </p>
      </CardContent>
      <CardFooter>
        {/* The Button acts as the primary "action" for this card */}
        <Link to={`/admin/students/classes/${gradeLevel}`} className="w-full">
        <Button className="w-full">
          View Classes
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default GradeCard;