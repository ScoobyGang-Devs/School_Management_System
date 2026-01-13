import React, { useState, useContext } from "react"
import { Sun, Bell, Mail } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ThemeContext } from "../App"
import { ModeToggle } from "./mode-toggle"
import ProfileCard from "./ui/ProfileCard.jsx"

export default function TopBar() {

  const location = useLocation(); // ✅ useLocation hook
  const [showProfile, setShowProfile] = useState(false); // ✅ define state

  // ✅ Current page name based on route
  const pageTitles = {
    "/": "Dashboard",
    "/settings": "Settings",
    "/messaging": "Internal Messaging",
    "/admin/attendance": "School-Wide Attendance",
    "/admin/results": "School-Wide Results",
    "/admin/users": "User Management",
    "/admin/students": "Student Database",
    "/teacher/classes": "My Classes",
    "/teacher/attendance": "Take Attendance",
    "/teacher/grades": "Grade Assignments",
  }

  const currentPage = pageTitles[location.pathname] || "Dashboard";
  const user = JSON.parse(localStorage.getItem("user"));
  const firstLetter = user?.nameWithInitials?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U";


return (
  <div
    className="flex items-center justify-end w-full px-6 py-4 border-b bg-background text-foreground border-border"
  >
    {/* ✅ Left side: current page name */}
    <h1 className="text-lg font-semibold">{currentPage}</h1>

    {/* ✅ Right side: icons */}
    <div className="flex items-center gap-5 ml-auto">
      {/* Theme toggle */}
      <ModeToggle />

      {/* Notifications */}
      <button
        className="p-2 rounded-full transition hover:bg-muted"
        title="Notifications"
        onClick={() => console.log('Open notifications panel')}
      >
        <Bell className="w-5 h-5 text-primary" />
      </button>

      {/* Messages */}
      <Link
        to="/messaging"
        className="p-2 rounded-full transition hover:bg-muted"
        title="Messages"
      >
        <Mail className="w-5 h-5 text-primary" />
      </Link>

      {/* Profile */}
      <button
        className="p-1 rounded-full overflow-hidden border-2 border-primary hover:ring-2 ring-ring transition"
        title="Profile"
        onClick={() => console.log('Open profile panel')}
      >
        <div
          onClick={() => setShowProfile(true)}
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold cursor-pointer"
        >
          {firstLetter}
        </div>
      </button>
    </div>
    
    {/* ✅ Show profile card with overlay when clicked */}
    {showProfile && (
    <>
    {/* BACKDROP — click anywhere outside to close */}
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setShowProfile(false)}
    ></div>

    {/* PROFILE CARD — stays on top */}
    <div className="fixed top-14 right-6 z-50">
      <ProfileCard onClose={() => setShowProfile(false)} />
    </div>
    </>
    )}
  
  </div>
)

}