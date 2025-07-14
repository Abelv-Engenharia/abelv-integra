import React from "react";
import { HelpCircle } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export default function SidebarSectionSuporte() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          className={currentPath === "/suporte" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
        >
          <Link to="/suporte" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            <span className="break-words">SUPORTE</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}