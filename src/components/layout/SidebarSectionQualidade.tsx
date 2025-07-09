
import React from "react";
import { Award, BarChart3, CheckCircle, FileCheck, Settings, Users } from "lucide-react";
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

export default function SidebarSectionQualidade({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isQualidadeOpen = openMenu === "qualidade";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isQualidadeOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("qualidade")}
              className="text-white hover:bg-slate-600"
            >
              <Award className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">QUALIDADE</span>
              {isQualidadeOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/dashboard" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/controle" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/controle" className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Controle de Qualidade</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/auditorias" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/auditorias" className="flex items-center gap-2">
                    <FileCheck className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Auditorias</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/indicadores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/indicadores" className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Indicadores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/equipe" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/equipe" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Equipe</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/qualidade/configuracoes" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/qualidade/configuracoes" className="flex items-center gap-2">
                    <Settings className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Configurações</span>
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
