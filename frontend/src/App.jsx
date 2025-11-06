import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from '@/components/ui/button.jsx'
import {AppSidebar} from '@/components/app-sidebar.jsx'
import { SidebarProvider } from './components/ui/sidebar'
import { Routes, Route } from 'react-router-dom';

import SchoolWideAttendance from './pages/administration/SchoolWideAttendance';
import SchoolWideResults from './pages/administration/SchoolWideResults';
import StudentDatabase from './pages/administration/StudentDatabase';
import UserManagement from './pages/administration/UserManagement';
import Dashboard from './pages/navigation/Dashboard';
import InternalMessaging from './pages/navigation/InternalMessaging';
import Settings from './pages/navigation/Settings';
import GradeAssignments from './pages/teacher_tools/GradeAssignments';
import MyClasses from './pages/teacher_tools/MyClasses';
import TakeAttendance from './pages/teacher_tools/TakeAttendance';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SidebarProvider> 
         <AppSidebar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
<Routes>
                {/* Main Dashboard - default route */}
                <Route path="/" element={<Dashboard />} /> 
                
                {/* --- CORRECTED ADMINISTRATION ROUTES --- */}
                <Route path="/admin/attendance" element={<SchoolWideAttendance />} />
                <Route path="/admin/results" element={<SchoolWideResults />} />
                <Route path="/admin/students" element={<StudentDatabase />} />
                <Route path="/admin/users" element={<UserManagement />} />

                {/* --- NAVIGATION ROUTES --- */}
                <Route path="/messaging" element={<InternalMessaging />} />
                <Route path="/settings" element={<Settings />} /> 
                
                {/* --- TEACHER TOOLS ROUTES --- */}
                <Route path="/teacher/grades" element={<GradeAssignments />} />
                <Route path="/teacher/classes" element={<MyClasses />} />
                <Route path="/teacher/attendance" element={<TakeAttendance />} />

                {/* Catch-all route for 404 Not Found */}
                <Route path="*" element={<h1>404 | Page Not Found</h1>} />
            </Routes>
        </main>
    </SidebarProvider>


    

    </>
  )
}

export default App
