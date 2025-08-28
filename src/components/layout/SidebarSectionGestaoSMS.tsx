
import React from "react";
import { Shield } from "lucide-react";
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

export default function SidebarSectionGestaoSMS({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isSmsOpen = openMenu === "gestao-sms";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isSmsOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("gestao-sms")}
              className="text-white hover:bg-slate-600"
            >
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">GESTÃO SMS</span>
              {isSmsOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/inspecao-sms/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/inspecao-sms/cadastro" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Cadastro de Inspeção</span>
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
