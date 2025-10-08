import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  UserPlus,
  UserCog,
  Users,
  Building2,
} from "lucide-react";
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
  canSee?: (slug: string) => boolean;
};

type Item = { label: string; to: string; slug: string; Icon: React.ComponentType<any> };

export default function SidebarSectionSeguranca({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => {
    const result = canSee ? canSee(slug) : true;
    return result;
  };

  const items: Item[] = [
    { label: "Administradores Sistema", to: "/admin/admin-sistema", slug: "admin_sistema", Icon: UserPlus },
    { label: "Perfis de Acesso", to: "/admin/perfis", slug: "admin_perfis", Icon: UserCog },
    { label: "Associar Perfis", to: "/admin/usuarios-perfis", slug: "admin_usuarios_perfis", Icon: Users },
    { label: "Gerenciar CCAs", to: "/admin/usuarios-ccas", slug: "admin_usuarios_ccas", Icon: Building2 },
    { label: "Usuários", to: "/admin/usuarios-direct", slug: "admin_usuarios", Icon: Users },
  ].filter((i) => can(i.slug));

  if (items.length === 0) return null;

  const isOpen = openMenu === "seguranca";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("seguranca")} className="text-white hover:bg-slate-600">
              <Shield className="h-4 w-4" />
              <span className="break-words">Segurança</span>
              {isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map(({ slug, to, label, Icon }) => (
                <SidebarMenuSubItem key={slug}>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      pathname === to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                    }
                  >
                    <Link to={to} onClick={onLinkClick} className="flex items-center gap-2">
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">{label}</span>
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
