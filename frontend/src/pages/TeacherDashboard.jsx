import React, { useState, useEffect } from 'react';
import { BookOpen, UserCheck, AlertTriangle, Users, TrendingUp, Calendar } from 'lucide-react';
import { fetchTeacherClasses } from '../api';

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


const TeacherDashboard = ({ user }) => { // CHANGED: Accepts user prop
  //State to hold real data
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

// Fetch Data from Backend
  useEffect(() => {
    const loadData = async () => {
      // If no teacherId (e.g. admin viewing this), stop
      if (!user?.teacherId) {
        setLoading(false);
        return;
      }

      try {
        // Call the POST endpoint
        const data = await fetchTeacherClasses(user.teacherId);
        
        // Transform backend strings to objects for UI
        // Backend returns: { teachingClasses: ["10 A", "11 B"], assignedClass: "12 A" }
        const formattedClasses = data.teachingClasses.map((clsName, index) => ({
            id: index,
            name: clsName,
            // API doesn't send these yet, so we use placeholders
            students: "N/A", 
            avgMark: "N/A"   
        }));

        setClasses(formattedClasses);
      } catch (err) {
        console.error("Error loading classes", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);
  // Helper for Attendance Status (Using placeholder logic for now)
  const alertStatus = { 
      message: "Attendance system connected.", 
      color: "bg-[var(--chart-5)]", 
      icon: UserCheck, 
      text: "text-primary-foreground" 
  };
  const { message: alertMessage, color: alertColor, icon: AlertIcon, text: alertText } = alertStatus;
  
  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
  if (!user) return <div className="p-8 text-center">Please log in.</div>;


    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 font-sans">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground mb-1">
           Teacher Dashboard
          </h1>
          {/* Use real name from user profile */}
          <p className="text-lg text-primary">
            Welcome back, {user?.fullName || "Teacher"}.
          </p>
        </header>
      {/* Attendance Check Message */}
      <div className={`p-4 mb-8 rounded-xl flex items-center ${alertColor} ${alertText} shadow-xl`}>
        <AlertIcon className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="font-semibold">{alertMessage}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
            title="Classes Taught" 
            value={classes.length} 
            icon={BookOpen} 
            color="bg-[var(--chart-1)]" 
        />
        <StatCard 
            title="Assigned Class" 
            value={user.assignedClass?.className || "None"} 
            icon={Users} 
            color="bg-[var(--chart-2)]" 
        />
        <StatCard 
            title="Avg. Performance" 
            value="View Reports" 
            icon={TrendingUp} 
            color="bg-[var(--chart-4)]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class List & Avg Marks Table */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            My Classes
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
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-secondary/50 transition duration-150">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {cls.name}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                      {cls.students}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-lg font-bold text-primary text-right">
                      {cls.avgMark}
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                    <tr>
                        <td colSpan="3" className="p-4 text-center text-muted-foreground">No classes found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5-Day Attendance Card (Static Placeholder until API endpoint is ready) */}
        <div className="lg:col-span-1">
           <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col border border-border justify-center items-center text-center">
             <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
             <h3 className="text-lg font-semibold">Attendance Chart</h3>
             <p className="text-sm text-muted-foreground mt-2">
               Select a specific class to view detailed attendance history.
             </p>
           </div>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-muted-foreground border-t border-border pt-4">
        *Data displayed is mock data for front-end demonstration purposes.
      </footer>
    </div>
  );
};

export default TeacherDashboard;
