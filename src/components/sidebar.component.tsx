import {
  ClipboardClock,
  FileText,
  Home,
  LogOut,
  Settings,
  Store,
  Target,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AvatarComponent } from "./avatar.component";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: Users,
    isActive: true,
  },
  {
    title: "Solar-sales",
    url: "/dashboard/solar-sales",
    icon: Target,
    isActive: true,
  },
  {
    title: "Appointments",
    url: "/dashboard/appointments",
    icon: ClipboardClock,
    isActive: true,
  },
  {
    title: "Store",
    url: "/dashboard/store",
    icon: Store,
    isActive: true,
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
    isActive: true,
  },
  {
    title: "Setting",
    url: "/dashboard/setting",
    icon: Settings,
    isActive: true,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="h-screenflex-col border-r bg-[#101928] text-white">
      <SidebarContent className="bg-[#101928] overflow-y-hidden ">
        <div className="flex items-center gap-2 p-6">
          <div className="h-8 w-8 rounded-lg bg-blue-950 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-lg">Rayna Solar</span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="p-4">
          <Card className="bg-blue-950 border-0">
            <CardContent className="p-4 space-y-3">
              <img
                className="h-8 w-8 rounded-md object-cover border-blue-500"
                src={'/employees.png'}
                alt={'Dashboard guide'}
              />
              <div>
                <h3 className="font-semibold text-sm mb-1 text-white">Welcome</h3>
                <p className="text-xs text-blue-200 mb-3">
                  Explore your Rayna Solar Dashboard with our quick guide.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={"#"} className="text-[13px] py-2 h-auto text-orange-600 hover:text-orange-300 hover:no-underline">
                  Get Started
                </Link>
                <Button
                  variant="link"
                  size={"sm"}
                  className="text-xs py-2 h-auto text-blue-200 hover:text-white hover:no-underline"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        </SidebarFooter>

        <SidebarFooter className="p-4 border-slate-700">
          <div className="p-4 border-t border-gray-800 flex items-center gap-3">
            <AvatarComponent />
            <div className="flex-1">
              <div className="text-sm font-medium">Alison Eyo</div>
              <div className="text-xs text-gray-400">alison.e@rayna.ui</div>
            </div>
            <Button variant="link" className="text-gray-400">
              <LogOut size={20} />
            </Button>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
