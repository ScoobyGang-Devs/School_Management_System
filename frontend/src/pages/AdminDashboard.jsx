import React, { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, BarChart2, CheckSquare } from 'lucide-react';
import { fetchAdminDashboard } from '../api'; // Import API

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
const AdminDashboard = () => {
  // State for API data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  // Fetch data on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAdminDashboard();
        setData(result);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading School Data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Error loading data.</div>;


  // --- DATA TRANSFORMATIONS ---

  // Transform Backend Dictionary to Array for the UI List
  const gradeAverages = Object.entries(data.grade_averages || {}).map(([key, val]) => ({
    grade: key.replace('Grade ', ''),
    avg: val
  }));

  // Prepare Attendance Data (Backend returns "present_count", we need to scale it for the chart)
  // find the maximum attendance count to calculate bar height relative to 100%
  const attendanceData = data.attendance_last_5_days || [];
  const maxAttendance = Math.max(...attendanceData.map(d => d.present_count || 0), 1);
  
  // --- SUB-COMPONENTS  ---


  const GradeAverageList = ({ averages }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col border border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-[var(--chart-4)]" />
        Gradewise Average Results
      </h2>
      <div className="space-y-3 overflow-y-auto max-h-[400px]">
        {averages.map((item) => (
          <div key={item.grade} className="flex justify-between items-center p-3 bg-secondary rounded-lg hover:bg-accent transition duration-150">
            <span className="text-base font-medium text-foreground">
              Grade {item.grade}
            </span>
            <span className="text-xl font-extrabold text-primary">
              {item.avg ? item.avg.toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Overall School Average: **
        {averages.length > 0
          ? (averages.reduce((sum, item) => sum + (item.avg || 0)) / averages.length).toFixed(1) : 0}%
        **
      </p>
    </div>
  );

  const SchoolAttendanceChart = ({ chartData }) => {
    return (
      <div className="bg-card p-6 rounded-xl shadow-lg h-full flex flex-col border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
          <CheckSquare className="w-6 h-6 mr-2 text-[var(--chart-2)]" />
          Last 5 Days School Attendance
        </h2>
        <div className="flex justify-around items-end h-40 border-b border-border pb-2">
          {chartData.map((day, index) => {
            
            const heightPercentage = (day.present_count / maxAttendance) * 100;

            
            return (
              <div key={index} className="flex flex-col items-center group relative w-1/5 mx-2">
                {/* Bar Height: Use the calculated percentage */}
                <div
                  style={{ height: `${heightPercentage}%` }}
                  className="w-10 rounded-t-lg transition-all duration-500 ease-out bg-[var(--chart-5)] hover:bg-[var(--chart-5)]/90"
                ></div>
                
                {/* Tooltip: Show actual count, not percentage */}
                <div className="absolute top-0 transform -translate-y-full mb-1 text-sm font-bold text-foreground bg-card p-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.present_count} Present
                </div>
                
                <span className="mt-3 text-xs font-medium text-muted-foreground">{day.date}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Displaying present counts for recent days.
        </p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 font-sans">
      <header className="mb-10">
        <h1 className="text-5xl font-extrabold text-foreground mb-1">
          Admin Dashboard
        </h1>
        <p className="text-xl text-primary">
          Overview for Central High School
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          title="Total Students (All Grades)"
          value={data.total_students?.toLocaleString() || "0"}
          icon={Users}
          color="bg-[var(--chart-1)]"
          size={28}
        />
        <StatCard
          title="Total Staff"
          value={data.total_staff || "0"}
          icon={Briefcase}
          color="bg-[var(--chart-3)]"
          size={28}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gradewise Average Results */}
        <div className="lg:col-span-1">
          <GradeAverageList averages={gradeAverages} />
        </div>

        {/* School Attendance Chart */}
        <div className="lg:col-span-1">
          <SchoolAttendanceChart chartData={attendanceData} />
        </div>
      </div>

      {/* Placeholder for future expansion */}
      <div className="mt-8 p-6 bg-card rounded-xl shadow-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-primary" />
          Key Performance Indicators
        </h3>
        <p className="text-muted-foreground mt-2">
          This area could include more detailed charts on budget, enrollment trends, or subject-specific performance metrics.
        </p>
      </div>

      <footer className="mt-10 text-center text-xs text-muted-foreground border-t border-border pt-4">
        *System Data.
      </footer>
    </div>
  );
};

export default AdminDashboard;
