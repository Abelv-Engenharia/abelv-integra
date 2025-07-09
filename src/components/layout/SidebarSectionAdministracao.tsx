
import React from "react";
import { Settings, Users, Building, Shield, Wrench } from "lucide-react";
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
                  className={currentPath === "/admin/usuarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/usuarios" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Usuários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/perfis" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/perfis" className="flex items-center gap-2">
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Perfis</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/empresas" className="flex items-center gap-2">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Empresas</span>
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
