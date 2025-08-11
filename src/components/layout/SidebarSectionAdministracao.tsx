
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings } from "lucide-react";

interface SidebarSectionAdministracaoProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionAdministracao({ openMenu, toggleMenu }: SidebarSectionAdministracaoProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={openMenu === "admin"}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("admin")} 
              className="text-white hover:bg-slate-600"
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">ADMINISTRAÇÃO</span>
              {openMenu === "admin" ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Dashboard Admin</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/funcionarios" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Funcionários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath.startsWith("/admin/importacao") ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/importacao" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Importação de Dados</span>
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
