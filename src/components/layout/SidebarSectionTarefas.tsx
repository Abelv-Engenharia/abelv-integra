
import React from "react";
import { ClipboardList } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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

export default function SidebarSectionTarefas({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white">Tarefas</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "tarefas"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("tarefas")}
                  className="text-white hover:bg-slate-600"
                >
                  <ClipboardList className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Tarefas</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild
                      className={currentPath === "/tarefas/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/tarefas/dashboard" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild
                      className={currentPath === "/tarefas/minhas-tarefas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/tarefas/minhas-tarefas" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Minhas Tarefas</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild
                      className={currentPath === "/tarefas/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/tarefas/cadastro" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Cadastro de Tarefas</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
