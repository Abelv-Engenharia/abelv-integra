import React from "react";
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
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
  onLinkClick?: () => void;
  canSee?: (slug: string) => boolean; // <- novo
};

type Item = { label: string; to: string; slug: string };

export default function SidebarSectionRelatorios({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => (canSee ? canSee(slug) : true);

  const items: Item[] = [
    { label: "Dashboard", to: "/relatorios/dashboard", slug: "relatorios_dashboard" },
    { label: "IDSMS", to: "/relatorios/idsms", slug: "relatorios_idsms" },
  ].filter((i) => can(i.slug));

  if (items.length === 0) return null;

  const isOpen = openMenu === "relatorios";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("relatorios")} className="text-white hover:bg-slate-600">
              <BarChart3 className="h-4 w-4" />
              <span className="break-words">Relatórios</span>
              {isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((it) => (
                <SidebarMenuSubItem key={it.slug}>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      pathname === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                    }
                  >
                    <Link to={it.to} onClick={onLinkClick}>
                      {it.label}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
