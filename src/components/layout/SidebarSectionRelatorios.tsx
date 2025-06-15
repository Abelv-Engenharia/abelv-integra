
import React from "react";
import { FileText } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};
export default function SidebarSectionRelatorios({ openMenu, toggleMenu }: Props) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "relatorios"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton onClick={() => toggleMenu("relatorios")}>
                  <FileText className="h-4 w-4" />
                  <span>Relatórios</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/relatorios">
                        <span className="text-xs leading-tight">Relatórios</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
