import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "react-router-dom"

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

// This is sample data.
const data = {
  navMain: [
    {
      title: "NAVIGATION",
      // Removed top-level URL since these are groups
      items: [
        {
          title: "Dashboard",
          url: "/", // 👈 Home path
        },
        {
          title: "Settings",
          url: "/settings", // 👈 Route from App.jsx
        },
        {
          title: "Internal Messaging",
          url: "/messaging", // 👈 Route from App.jsx
        }
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          title: "School-Wide Attendance",
          url: "/admin/attendance", // 👈 Route from App.jsx
        },
        {
          title: "School-Wide Results",
          url: "/admin/results", // 👈 Route from App.jsx (Note: Changed from Results/Attendance to match your component name)
          isActive: true,
        },
        {
          title: "User Management",
          url: "/admin/users", // 👈 Route from App.jsx
        },
                {
          title: "Student Database",
          url: "/admin/students", // 👈 Route from App.jsx
        },
        
      ],
    },
    {
      title: "TEACHER TOOLS",
      items: [
        {
          title: "My Classes",
          url: "/teacher/classes", // 👈 Route from App.jsx
        },
        {
          title: "Take Attendance",
          url: "/teacher/attendance", // 👈 Route from App.jsx
        },
        {
          title: "Grade Assignments",
          url: "/teacher/grades", // 👈 Route from App.jsx
        },
        
      ],
    },
  ],
}
export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">SAMS</span>
                  <span className="">Management Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <Link to={item.url}>{item.title}</Link> 
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
    </Sidebar>
  );
}
