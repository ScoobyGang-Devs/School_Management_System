import React, { useState, useEffect } from 'react';
import api from '../api'; // Importing your configured axios instance

// --- SHADCN IMPORTS (Ensure these are installed) ---
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Calling the endpoint defined in your Django URL patterns
        // URL: /dashboard/teacher_dashboard/
        const response = await api.get('dashboard/teacher_dashboard/');
        setDashboardData(response.data);
        console.log("Dashboard Data:", response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- LOADING STATE (Using Shadcn Skeleton) ---
  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Destructure data based on your Django Response structure
  const { teacherName, totalClasses } = dashboardData;
  const classData = dashboardData["teacher'sClassData"] || [];

  // Calculate a quick global average for the summary cards
  const validMarks = classData.filter(c => c.avg_marks > 0);
  const globalAverage = validMarks.length > 0
    ? (validMarks.reduce((acc, curr) => acc + curr.avg_marks, 0) / validMarks.length).toFixed(1)
    : "N/A";

  const totalStudents = classData.reduce((acc, curr) => acc + curr.studentCount, 0);

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={teacherName} />
            <AvatarFallback className="text-lg font-bold">
              {teacherName?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {teacherName}
            </p>
          </div>
        </div>
        <Button variant="outline">View Schedule</Button>
      </header>

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active teaching subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalAverage}%</div>
            <p className="text-xs text-muted-foreground">Global class average</p>
          </CardContent>
        </Card>
      </div>

      {/* CLASS PERFORMANCE TABLE */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
          <CardDescription>
            A detailed breakdown of your assigned classes and student performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Classroom</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-right">Avg. Mark</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.length > 0 ? (
                classData.map((cls, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{String(cls.Classroom)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {String(cls.Subject)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{cls.studentCount}</TableCell>
                    <TableCell className="text-right font-bold">
                      {cls.avg_marks ? parseFloat(cls.avg_marks).toFixed(1) : "0.0"}
                    </TableCell>
                    <TableCell className="text-right">
                       {/* Conditional Badge Logic */}
                       {cls.avg_marks >= 75 ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Excellent</Badge>
                       ) : cls.avg_marks >= 50 ? (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Average</Badge>
                       ) : (
                          <Badge variant="destructive">Needs Focus</Badge>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No classes assigned.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
