
import React from "react";
import { Settings } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};

export default function SidebarSectionAdministracao({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdminOpen = openMenu === "admin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isAdminOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("admin")}
              className="text-white hover:bg-slate-600"
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">ADMINISTRAÇÃO</span>
              {isAdminOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/modelos-inspecao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/modelos-inspecao" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Modelos de Inspeção</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
