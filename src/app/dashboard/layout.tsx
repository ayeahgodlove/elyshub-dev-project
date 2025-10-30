"use client";
import { AppSidebar } from "@/components/app-sidebar.component";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
