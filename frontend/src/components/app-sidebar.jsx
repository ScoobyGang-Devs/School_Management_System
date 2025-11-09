import * as React from "react"
import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "NAVIGATION",
      items: [
        { title: "Dashboard", url: "/" },
        { title: "Settings", url: "/settings" },
        { title: "Internal Messaging", url: "/messaging" },
        { title: "Edit Profile", url: "/edit-profile" },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        { title: "School-Wide Attendance", url: "/admin/attendance" },
        { title: "School-Wide Results", url: "/admin/results" },
        { title: "User Management", url: "/admin/users" },
        { title: "Student Database", url: "/admin/students" },
      ],
    },
    {
      title: "TEACHER TOOLS",
      items: [
        { title: "My Classes", url: "/teacher/classes" },
        { title: "Take Attendance", url: "/teacher/attendance" },
        { title: "Grade Assignments", url: "/teacher/grades" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const [collapsed, setCollapsed] = useState(true)
  const location = useLocation()

  return (
      <div
        className={`transition-all duration-300 ease-in-out 
          ${collapsed ? "w-14" : "w-64"} 
          border-r overflow-hidden h-screen`}
        style={{
          backgroundColor: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
          color: "var(--sidebar-foreground)",
        }}
      >

      <SidebarHeader
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } py-4 px-2`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="bg-black text-white flex size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>

          {!collapsed && (
            <div className="flex flex-col gap-0.5 leading-none text-left">
              <span className="font-medium">SAMS</span>
              <span className="text-xs">Management Portal</span>
            </div>
          )}
        </button>
      </SidebarHeader>

      {!collapsed && (
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <div className="font-semibold px-3 py-1 text-gray-500 uppercase text-xs tracking-wide">
                    {section.title}
                  </div>
                  {section.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {section.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === subItem.url}
                          >
                            <Link to={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      )}
    </div>
  )
}