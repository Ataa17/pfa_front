import Link from "next/link"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Home, Bell, MessageSquare, BarChart2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function AppSidebar() {
  const routes = [
    { href: "/dashboard", label: "Dashboard", Icon: Home },
    { href: "/alerts", label: "Alerts", Icon: Bell },
    { href: "/chat", label: "Chat", Icon: MessageSquare },
    { href: "/metrics", label: "Metrics", Icon: BarChart2 },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"px-4 py-6 text-2xl mb-2"}>AIOps Monotoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={"gap-3"}>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton a tooltip={route.label} className="px-3 py-6 w-[95%]  text-xl rounded-sm hover:bg-[#111C2F] hover:scale-105 transition-all ">
                    <Link href={route.href} className="w-full">
                      <div className="flex items-center gap-3 w-full text-white">
                        {route.Icon && <route.Icon className="size-5 text-white" />}
                        <span className="text-white">{route.label}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
      </SidebarContent>
    </Sidebar>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center border-b px-4">
            <SidebarTrigger />
          </header>
          <main className="p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}