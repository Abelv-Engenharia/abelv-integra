
import React from "react";
import { Calculator, FileText, BarChart3, CheckCircle, Clock, Archive } from "lucide-react";
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

export default function SidebarSectionOrcamentos({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isOrcamentosOpen = openMenu === "orcamentos";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOrcamentosOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("orcamentos")}
              className="text-white hover:bg-slate-600"
            >
              <Calculator className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">ORÇAMENTOS</span>
              {isOrcamentosOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/dashboard" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/projetos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/projetos" className="flex items-center gap-2">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Projetos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/custos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/custos" className="flex items-center gap-2">
                    <Calculator className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Custos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/analises" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/analises" className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Análises</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/aprovacoes" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/aprovacoes" className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Aprovações</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/orcamentos/historico" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/orcamentos/historico" className="flex items-center gap-2">
                    <Archive className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Histórico</span>
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
