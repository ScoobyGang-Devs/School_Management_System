import './App.css'
import { AppSidebar } from '@/components/app-sidebar.jsx'
import TopBar from '@/components/TopBar.jsx'
import { SidebarProvider } from './components/ui/sidebar'
import { Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'

// Create Theme Context
export const ThemeContext = createContext()

// --- Pages ---
import Dashboard from './pages/navigation/Dashboard'
import Settings from './pages/navigation/Settings'
import InternalMessaging from './pages/navigation/InternalMessaging'
import SchoolWideAttendance from './pages/administration/SchoolWideAttendance'
import SchoolWideResults from './pages/administration/SchoolWideResults'
import StudentDatabase from './pages/administration/StudentDatabase'
import UserManagement from './pages/administration/UserManagement'
import MyClasses from './pages/teacher_tools/MyClasses'
import TakeAttendance from './pages/teacher_tools/TakeAttendance'
import GradeAssignments from './pages/teacher_tools/GradeAssignments'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    const appContainer = document.querySelector(".app-container")
    
    if (!darkMode) {
      appContainer.style.backgroundColor = "hsla(0, 0%, 15%, 1.00)"
      appContainer.style.color = "#f0f0f0"
    } else {
      appContainer.style.backgroundColor = "#ffffff"
      appContainer.style.color = "#000000"
    }
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <SidebarProvider>
        {/* Main layout wrapper */}
        <div className="app-container flex min-h-screen bg-white transition-colors duration-500">
          {/* ✅ Left sidebar */}
          <AppSidebar />

          {/* ✅ Right area: top bar + page content */}
          <div className="flex-1 flex flex-col">
            <TopBar />

            {/* ✅ Dynamic routed pages */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
              <Routes>
                {/* NAVIGATION */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/messaging" element={<InternalMessaging />} />

                {/* ADMINISTRATION */}
                <Route path="/admin/attendance" element={<SchoolWideAttendance />} />
                <Route path="/admin/results" element={<SchoolWideResults />} />
                <Route path="/admin/students" element={<StudentDatabase />} />
                <Route path="/admin/users" element={<UserManagement />} />

                {/* TEACHER TOOLS */}
                <Route path="/teacher/classes" element={<MyClasses />} />
                <Route path="/teacher/attendance" element={<TakeAttendance />} />
                <Route path="/teacher/grades" element={<GradeAssignments />} />

                {/* 404 fallback */}
                <Route path="*" element={<h1>404 | Page Not Found</h1>} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeContext.Provider>
  )
}

export default App