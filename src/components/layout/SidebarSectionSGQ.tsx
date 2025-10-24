import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
  onLinkClick: () => void;
  canSee: (slug: string) => boolean;
}

export default function SidebarSectionSGQ({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Collapsible open={openMenu === "sgq"} onOpenChange={() => toggleMenu("sgq")}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>SGQ</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMenu === "sgq" ? 'rotate-180' : ''}`} />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {/* RNC Dashboard */}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className={isActive("/sgq/rnc") ? "bg-muted" : ""}
              >
                <Link to="/sgq/rnc" onClick={onLinkClick}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard RNC</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

            {/* Nova RNC */}
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className={isActive("/sgq/rnc/novo") ? "bg-muted" : ""}
              >
                <Link to="/sgq/rnc/novo" onClick={onLinkClick}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Nova RNC</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
