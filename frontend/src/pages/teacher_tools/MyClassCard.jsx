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

function MyClassCard({Grade, Class}) {
  
  return (
    <Card className="w-[300px] hover:shadow-lg hover:border-primary transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Combines grade and class name */}
            <CardTitle className="text-3xl font-bold">{Grade}{Class}</CardTitle>
            <LayoutList className="h-6 w-6 text-muted-foreground" /> 
        </CardHeader>
        <CardFooter>
            <Link to={`/teacher/classes/attendance/${Grade}/${Class}`} className="w-full">
                <Button className="w-full" variant="secondary">
                    View Attendance
                 </Button>
            </Link>
        </CardFooter>
        <CardFooter>
            <Link className="w-full">
                <Button className="w-full" variant="secondary">
                    View Results
                </Button>
            </Link>
      </CardFooter>
    </Card>
  );
}

export default MyClassCard;