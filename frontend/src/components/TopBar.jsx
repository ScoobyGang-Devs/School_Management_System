import React, { useContext } from "react"
import { Sun, Bell, Mail } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ThemeContext } from "../App"
import { ModeToggle } from "./mode-toggle"

export default function TopBar() {


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

  const currentPage = pageTitles[location.pathname] || "Dashboard"

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
        <img
          src="/images/profile.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>
    </div>
  </div>
)

}