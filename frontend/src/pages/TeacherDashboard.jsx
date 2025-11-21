import React from 'react';
import { BookOpen, UserCheck, AlertTriangle, Users, TrendingUp, Calendar } from 'lucide-react';

// --- MOCK DATA & HELPERS ---
const MOCK_TEACHER_NAME = "Mr. Kalin HDPU Ekak";
const MOCK_PRIMARY_SUBJECT = "Pure Mathematics";

const mockClasses = [
  { id: 101, name: "Grade 12 - Pure Maths", avgMark: 78.5, students: 35 },
  { id: 102, name: "Grade 11 - Applied Maths", avgMark: 82.1, students: 34 },
  { id: 111, name: "Grade 13 - Further Maths", avgMark: 67.9, students: 30 },
];

const mockAttendance = [
  { date: "Oct 15", percentage: 97, status: "Present" },
  { date: "Oct 16", percentage: 94, status: "Present" },
  { date: "Oct 17", percentage: 99, status: "Present" },
  { date: "Oct 18", percentage: 91, status: "Present" },
  { date: "Oct 19", percentage: null, status: "Not Taken" },
];

const mockAbsentStudents = [
  { id: 1, name: "A. P. Silva", class: "Grade 12 - Pure Maths", date: "Oct 18, 2025" },
  { id: 2, name: "B. N. Fernando", class: "Grade 11 - Applied Maths", date: "Oct 17, 2025" },
  { id: 3, name: "C. R. Dias", class: "Grade 12 - Pure Maths", date: "Oct 17, 2025" },
  { id: 4, name: "D. E. Perera", class: "Grade 11 - Applied Maths", date: "Oct 16, 2025" },
  { id: 5, name: "E. F. Gunaratne", class: "Grade 12 - Pure Maths", date: "Oct 15, 2025" },
];

const getAttendanceStatus = (attendanceData) => {
  const todayData = attendanceData[attendanceData.length - 1];
  return todayData && todayData.status === "Not Taken"
    ? { message: "Attendance for today (Oct 19) is NOT taken. Please submit it now.", color: "bg-destructive", icon: AlertTriangle, text: "text-destructive-foreground" } 
    : { message: "Attendance for today (Oct 19) has been successfully recorded.", color: "bg-[var(--chart-5)]", icon: UserCheck, text: "text-primary-foreground" }; 
};

// --- COMMON COMPONENT: Dashboard Stat Card ---
const StatCard = ({ title, value, icon: Icon, color, size }) => (
  <div className="flex items-center p-4 bg-card rounded-xl shadow-lg transition duration-300 hover:shadow-xl border border-border">
    <div className={`p-3 rounded-full ${color} text-primary-foreground mr-4`}>
      <Icon size={size || 24} /> 
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const TeacherDashboard = () => {
  const { message: alertMessage, color: alertColor, icon: AlertIcon, text: alertText } = getAttendanceStatus(mockAttendance);
  const totalClasses = mockClasses.length;
  const totalStudents = mockClasses.reduce((sum, cls) => sum + cls.students, 0);

  const AttendanceChart = ({ data }) => {
    const lastFiveDays = data.slice(-5);
        
    return (
      <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          5-Day Attendance (Primary Class)
        </h2>
        <div className="flex justify-around items-end h-40">
          {lastFiveDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center group relative w-1/5 mx-1">
              <div
                style={{ height: `${day.percentage || 0}%` }}
                className={`w-4 rounded-t-lg transition-all duration-500 ease-in-out ${day.percentage ? 'bg-primary hover:bg-primary/90' : 'bg-muted'}`}
              ></div>
              <span className="mt-2 text-xs font-medium text-muted-foreground">{day.date}</span>
              {day.percentage && (
                <div className="absolute bottom-full mb-1 text-xs font-bold text-foreground bg-card p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.percentage}%
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          The latest percentage for your primary subject: **{MOCK_PRIMARY_SUBJECT}**.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-foreground mb-1">
          Teacher Dashboard
        </h1>
        <p className="text-lg text-primary">
          Welcome back, **{MOCK_TEACHER_NAME}**.
        </p>
      </header>

      {/* Attendance Check Message */}
      <div className={`p-4 mb-8 rounded-xl flex items-center ${alertColor} ${alertText} shadow-xl`}>
        <AlertIcon className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="font-semibold">{alertMessage}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Classes Taught" value={totalClasses} icon={BookOpen} color="bg-[var(--chart-1)]" />
        <StatCard title="Total Students" value={totalStudents} icon={Users} color="bg-[var(--chart-2)]" />
        <StatCard title="Avg. Performance" value="76.1%" icon={TrendingUp} color="bg-[var(--chart-4)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Class List & Avg Marks */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            My Classes & Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Class Name</th>
                  <th className="py-3 px-4 text-center">Students</th>
                  <th className="py-3 px-4 text-right">Avg. Mark</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {mockClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-secondary/50 transition duration-150">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {cls.name}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                      {cls.students}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-lg font-bold text-primary text-right">
                      {cls.avgMark}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5-Day Attendance Card */}
        <div className="lg:col-span-1">
          <AttendanceChart data={mockAttendance} />
        </div>
      </div>

      {/* Absent Students List */}
      <div className="mt-8 bg-card p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Recent Absent Students (Last 5 Days)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockAbsentStudents.map((student) => (
            <div key={student.id} className="p-3 bg-secondary border border-border rounded-lg flex justify-between items-center text-sm hover:bg-accent transition duration-150">
              <div>
                <p className="font-semibold text-foreground">{student.name}</p>
                <p className="text-xs text-primary">{student.class}</p>
              </div>
              <span className="text-xs text-destructive-foreground bg-destructive/10 py-1 px-2 rounded-full font-medium">
                Absent ({student.date.split(',')[0]})
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-muted-foreground border-t border-border pt-4">
        *Data displayed is mock data for front-end demonstration purposes.
      </footer>
    </div>
  );
};

export default TeacherDashboard;
