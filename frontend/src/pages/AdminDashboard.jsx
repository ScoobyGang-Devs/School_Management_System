import React, { useState, useEffect } from 'react';
import api from '../api';

// --- SHADCN UI IMPORTS ---
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
import { ScrollArea } from "@/components/ui/scroll-area";

// --- RECHARTS (Standard React Charting) ---
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('dashboard/admin_dashboard/');
        setData(response.data);
      } catch (err) {
        console.error("Error loading admin dashboard", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // --- LOADING SKELETON ---
  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500 font-bold">{error}</div>;

  const { total_students, total_staff, grade_averages, attendance_recent } = data;

  // Calculate School Average
  const schoolAverage = grade_averages.length > 0
    ? (grade_averages.reduce((acc, curr) => acc + curr.average, 0) / grade_averages.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background p-8 font-sans space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of school performance and attendance.</p>
        </div>
        <div className="flex items-center space-x-2">
           <Badge variant="outline" className="text-sm py-1 px-3">
             {new Date().toLocaleDateString()}
           </Badge>
        </div>
      </div>

      {/* 1. TOP STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_students}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_staff}</div>
            <p className="text-xs text-muted-foreground">Teachers & Admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Avg. Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolAverage}%</div>
            <p className="text-xs text-muted-foreground">Based on recent term tests</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MIDDLE SECTION: Charts & Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* LEFT: Grade Performance Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>Average Term Test scores by Class/Grade</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {grade_averages.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={grade_averages}>
                    <XAxis 
                      dataKey="className" 
                      stroke="#ffffff" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#ffffff" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}%`} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                          {grade_averages.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              // If average < 50, make it RED (#ef4444). Otherwise, make it BLUE (#3b82f6).
                              fill={entry.average < 50 ? '#ef4444' : '#3b82f6'} 
                            />
                          ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No term test data available.
                </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: Recent Attendance Log */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>
              Latest class attendance submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                    {attendance_recent.length > 0 ? attendance_recent.map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{record.class.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">Class {record.class}</p>
                                    <p className="text-xs text-muted-foreground">{record.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">
                                    {record.present_count} / {record.total_students}
                                </div>
                                <div className={`text-xs ${record.attendance_percentage < 80 ? 'text-red-500' : 'text-green-500'}`}>
                                    {record.attendance_percentage}% Present
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center pt-10">No recent attendance records found.</p>
                    )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM SECTION: Detailed Stats (Optional) */}
      <Card>
        <CardHeader>
            <CardTitle>Low Attendance Alerts</CardTitle>
            <CardDescription>Classes with less than 50% attendance in the last 5 days.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                 <TableHeader>
                     <TableRow>
                         <TableHead>Date</TableHead>
                         <TableHead>Class</TableHead>
                         <TableHead className="text-center">Absent</TableHead>
                         <TableHead className="text-center">Rate</TableHead>
                         <TableHead className="text-right">Status</TableHead>
                     </TableRow>
                 </TableHeader>
                 <TableBody>
                     {attendance_recent.filter(r => r.attendance_percentage < 50).length > 0 ? (
                         attendance_recent.filter(r => r.attendance_percentage < 50).map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.date}</TableCell>
                                <TableCell className="font-bold">{r.class}</TableCell>
                                <TableCell className="text-center text-red-500">{r.absent_count}</TableCell>
                                <TableCell className="text-center">{r.attendance_percentage}%</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="destructive">Critical</Badge>
                                </TableCell>
                            </TableRow>
                         ))
                     ) : (
                         <TableRow>
                             <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                 No critical attendance issues found. Good job!
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

export default AdminDashboard;