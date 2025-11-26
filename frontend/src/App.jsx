import './App.css'
import { useState, useEffect, createContext } from 'react';
import { Routes, Route,useLocation} from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"

import { AppSidebar } from '@/components/app-sidebar.jsx'
import TopBar from './components/TopBar'
import { SidebarProvider } from './components/ui/sidebar'
import { fetchUserProfile } from './api';

// Create Theme Context
export const ThemeContext = createContext()

// --- Pages ---
import LoginForm from './pages/navigation/loginForm'
import SignupForm from './pages/navigation/signUp'
import Dashboard from './pages/navigation/Dashboard'

import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

import Settings from './pages/navigation/Settings'
import InternalMessaging from './pages/navigation/InternalMessaging'
import SchoolWideAttendance from './pages/administration/SchoolWideAttendance'
import SchoolWideResults from './pages/administration/SchoolWideResults'
import StudentDatabase from './pages/administration/StudentDatabase'
import UserManagement from './pages/administration/UserManagement'
import EditProfile from './pages/administration/EditProfile'
import MyClasses from './pages/teacher_tools/MyClasses'
import TakeAttendance from './pages/teacher_tools/TakeAttendance'
import GradeAssignments from './pages/teacher_tools/GradeAssignments'
import RelaventClassesForGrade from './pages/studentDatabase/RelaventClassesForGrade.jsx'
import GradesPage from './pages/studentDatabase/GradesPage.jsx'
import ClassPage from './pages/studentDatabase/ClassPage.jsx'
import TeacherDatabase from './pages/administration/TeacherDatabase'

import RelaventClassResultsForGrade from './pages/studentResults/RelaventClassResultsForGrade.jsx'
import ResultGradePage from './pages/studentResults/ResultGradePage.jsx'
import ResultClassPage from './pages/studentResults/ResultClassPage.jsx'

import AttendanceMainPage from './pages/Attendance/AttendanceMainPage.jsx'
import StudentAttendancePage from './pages/Attendance/StudentAttendancePage.jsx'
import TeacherAttendancePage from './pages/Attendance/TeacherAttendancePage.jsx'
import StudentProfilePage from './pages/studentDatabase/StudentCard'
import AddStudentPage from './pages/administration/AddStudentPage'
import TeacherProfilePage from './pages/TeacherDatabase/TeacherProfileCard'
import MyclassAttendance from './pages/teacher_tools/MyClassAttendancePage';


function App() {
  const location = useLocation()

  // ✅ Check if we are on the login or signup page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // --- STATE MANAGEMENT ---
  const [role, setRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  // Pass setRole to AppSidebar so it can update role
  // --- EFFECT: FETCH USER PROFILE ON LOAD ---
  useEffect(() => {
    const initUser = async () => {
      if (isAuthPage) {
        setLoading(false);
        return;
      }
      try {
        // Fetch profile from Django Backend
        const profile = await fetchUserProfile();
        setRole(profile.role);
        setUserProfile(profile);
        
        // Keep for legacy components if needed
        window.fakeRole = profile.role; 
      } catch (err) {
        console.log("User not logged in or API error", err);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, [isAuthPage]);

  // Show loading screen while checking authentication
  if (loading) return <div className="flex h-screen w-full items-center justify-center text-lg">Loading SAMS...</div>;

  return (
    <ThemeProvider defaultTheme="root" storageKey="vite-ui-theme">
      <SidebarProvider>
        {/* ✅ Conditional Layout */}
        {isAuthPage ? (
          // --- AUTH PAGES (No sidebar, no top bar) ---
          <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
            </Routes>
          </div>
        ) : (
          // --- DASHBOARD LAYOUT ---
          <div className="flex min-h-screen transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)] w-full">
            
            {/* Sidebar */}
            <aside
              className="h-screen border-r transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: "var(--sidebar)",
                borderColor: "var(--sidebar-border)",
                color: "var(--sidebar-foreground)",
              }}
            >
              <AppSidebar role={role || 'guest'} setRole={setRole} />
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <TopBar />

              <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                <Routes>
                  <Route path="/" element={<Dashboard user={userProfile} />} />
                  {/* --- NEW DASHBOARD ROUTES (CONNECTED TO API) --- */}
                  <Route path="/admin-dashboard" element={<AdminDashboard user={userProfile} />} /> 
                  {/* PASS userProfile PROP TO TEACHER DASHBOARD */}
                  <Route path="/teacher-dashboard" element={<TeacherDashboard user={userProfile} />} />
                  {/* ----------------------------------------------- */}

                  <Route path="/settings" element={<Settings />} />
                  <Route path="/messaging" element={<InternalMessaging />} />
                  <Route path="/edit-profile" element={<EditProfile />} />

                  <Route path="/admin/attendance/*" element={<SchoolWideAttendance />}> 
                    <Route index element={<AttendanceMainPage />} />
                    <Route path="students/" element={<StudentAttendancePage />} />
                    <Route path="teachers/" element={<TeacherAttendancePage />} />
                  </Route>

                  <Route path="/admin/results/*" element={<SchoolWideResults />} >
                    <Route index element={<ResultGradePage />} />
                    <Route path="classes/:gradeLevel" element={<RelaventClassResultsForGrade />} >
                      <Route path=":classId" element={<ResultClassPage />} />
                    </Route>
                  </Route>
                  

                  <Route path="/admin/students/*" element={<StudentDatabase />} >
                    <Route index element={<GradesPage />} /> 
                    <Route path="classes/:gradeLevel" element={<RelaventClassesForGrade />} >
                      <Route path=":classId" element={<ClassPage />} /> 

                    </Route>
                  </Route>

                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/teachers" element={<TeacherDatabase />} />

                  

                  

                  <Route path="/teacher/classes">
                    <Route index element={<MyClasses />} />
                    <Route path="attendance/:grade/:classId" element={<MyclassAttendance />} />
                  </Route>


                  <Route path="/teacher/attendance" element={<TakeAttendance />} />
                  <Route path="/teacher/grades" element={<GradeAssignments />} />
                  <Route path="/student-profile/:id" element={<StudentProfilePage />} />
                  <Route path="/teacher-profile/:id" element={<TeacherProfilePage />} />

                  <Route path="/add-student/:id" element={<AddStudentPage />} />



                  {/* 404 */}
                  <Route path="*" element={<h1 className="text-center text-lg font-semibold">404 | Page Not Found</h1>} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App