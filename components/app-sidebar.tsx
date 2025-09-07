"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Home,
  Upload,
  MessageSquare,
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  Brain,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Upload Data", url: "/upload", icon: Upload },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
  { title: "Candidates", url: "/candidates", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { state, toggleSidebar,setOpen} = useSidebar()
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Sidebar {...props} onMouseEnter={() => toggleSidebar()} onMouseLeave={() => setOpen(false)}>
      <SidebarHeader>
        <div
          className={`flex items-center relative`}
        > 
          {/* Logo */}
          <div
            className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white`}
          >
            <Brain
              className={`h-8 w-8`}
            />
          </div>

          {/* Title + trigger (always visible) */}
          {state === "expanded" && (
            <div className="grid flex-1 ml-2 text-left text-sm leading-tight">
              <span className="truncate font-semibold">AI Hiring</span>
              <span className="truncate text-xs text-muted-foreground">
                Recruitment Platform
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`
                      ${
                        state === "collapsed"
                          ? "h-10 w-10 p-0 justify-center"
                          : "h-9 px-3"
                      }
                      ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                          : "hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Link href={item.url} className="flex items-center">
                      <item.icon
                        className={`${
                          state === "collapsed" ? "h-5 w-5" : "h-4 w-4"
                        }`}
                      />
                      {state === "expanded" && (
                        <span className="ml-2">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <div
            className={`flex items-center justify-center`}
          >
            <div
              className={`flex items-center justify-center rounded-lg bg-muted ${
                state === "collapsed" ? "h-8 w-8" : "h-8 w-8"
              }`}
            >
              <User
                className={`h-4 w-4`}
              />
            </div>
            {state === "expanded" && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.user_metadata.full_name || "User"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  HR Manager
                </span>
              </div>
            )}
          </div>
        )}
       {user && (
          <div
            className={`flex items-center justify-center cursor-pointer`}
            onClick={handleSignOut}
          >
            <div
              className={`flex items-center justify-center rounded-lg bg-muted ${
                state === "collapsed" ? "h-8 w-8" : "h-8 w-8"
              }`}
            >
              <LogOut
                className={`h-4 w-4`}
              />
            </div>
            {state === "expanded" && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate">
                  Sign Out
                </span>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}


//
// Sidebar Provider Wrapper
//
export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide sidebar on auth/landing pages
  if (
    pathname === "/" ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth")
  ) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon"/>
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
