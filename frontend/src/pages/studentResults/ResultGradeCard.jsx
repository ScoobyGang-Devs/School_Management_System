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



function ResultGradeCard({gradeLevel,studentCount}) { // Changed to a functional component
  return (
    <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-bold">Grade {gradeLevel}</CardTitle>
        <BookOpen className="h-6 w-6 text-muted-foreground" /> {/* Icon */}
      </CardHeader>
        <CardContent>
            {/* REVISED CardDescription with Mock Data */}
            <CardDescription className="text-sm text-muted-foreground space-y-1">

              <p>
                  {studentCount} Students
              </p>
              <p>
                <span className="font-semibold text-primary">Avg. Pass Rate:</span> 76%
              </p>
              <p>
                <span className="font-semibold text-primary">Avg. Mark:</span> 76.8%
              </p>
            </CardDescription>

            {/* Original Student Count Display */}
            <div className="text-1xl font-bold mt-4">
              <p>
                <span className="font-semibold text-primary">Last Exam:</span> Final Term 2025
              </p>

            </div>
          </CardContent>
      <CardFooter>
        {/* The Button acts as the primary "action" for this card */}
        <Link to={`/admin/results/classes/${gradeLevel}`} className="w-full">
        <Button className="w-full">
          View Results
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ResultGradeCard;