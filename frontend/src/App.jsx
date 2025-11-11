import './App.css'
import { AppSidebar } from '@/components/app-sidebar.jsx'
import TopBar from '@/components/TopBar.jsx'
import { SidebarProvider } from './components/ui/sidebar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { createContext } from 'react'

// Create Theme Context
export const ThemeContext = createContext()

// --- Pages ---
import LoginForm from './pages/navigation/loginForm'
import Dashboard from './pages/navigation/Dashboard'
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

function App() {
  const location = useLocation()

  // ✅ Check if we are on the login page
  const isLoginPage = location.pathname === "/login"

  return (
    <ThemeProvider defaultTheme="root" storageKey="vite-ui-theme">
      <SidebarProvider>
        {/* ✅ Conditional Layout */}
        {isLoginPage ? (
          // --- LOGIN PAGE (No sidebar, no top bar) ---
          <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
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
              <AppSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <TopBar />

              <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/messaging" element={<InternalMessaging />} />
                  <Route path="/edit-profile" element={<EditProfile />} />

                  {/* ADMIN */}
                  <Route path="/admin/attendance" element={<SchoolWideAttendance />} />
                  <Route path="/admin/results" element={<SchoolWideResults />} />
                  <Route path="/admin/students" element={<StudentDatabase />} />
                  <Route path="/admin/users" element={<UserManagement />} />

                  {/* TEACHER */}
                  <Route path="/teacher/classes" element={<MyClasses />} />
                  <Route path="/teacher/attendance" element={<TakeAttendance />} />
                  <Route path="/teacher/grades" element={<GradeAssignments />} />

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
