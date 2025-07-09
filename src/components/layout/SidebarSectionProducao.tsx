
import React from "react";
import { Factory, Calendar, ClipboardList, Award, Wrench, BarChart3, Users } from "lucide-react";
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

export default function SidebarSectionProducao({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isProducaoOpen = openMenu === "producao";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isProducaoOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("producao")}
              className="text-white hover:bg-slate-600"
            >
              <Factory className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">PRODUÇÃO</span>
              {isProducaoOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/dashboard" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/planejamento" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/planejamento" className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Planejamento</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/ordens-producao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/ordens-producao" className="flex items-center gap-2">
                    <ClipboardList className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Ordens de Produção</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/controle-qualidade" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/controle-qualidade" className="flex items-center gap-2">
                    <Award className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Controle de Qualidade</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/manutencao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/manutencao" className="flex items-center gap-2">
                    <Wrench className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Manutenção</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/recursos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/recursos" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Recursos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/producao/indicadores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/producao/indicadores" className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Indicadores</span>
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
