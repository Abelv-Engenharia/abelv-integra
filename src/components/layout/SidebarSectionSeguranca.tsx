import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Shield,
  UserPlus,
  UserCog,
  Users,
  Building2,
  Settings,
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

  const [openConfigModulos, setOpenConfigModulos] = useState(false);

  const items: Item[] = [
    { label: "Administradores Sistema", to: "/admin/admin-sistema", slug: "admin_sistema", Icon: UserPlus },
    { label: "Perfis de Acesso", to: "/admin/perfis", slug: "admin_perfis", Icon: UserCog },
    { label: "Associar Perfis", to: "/admin/usuarios-perfis", slug: "admin_usuarios_perfis", Icon: Users },
    { label: "Gerenciar CCAs", to: "/admin/usuarios-ccas", slug: "admin_usuarios_ccas", Icon: Building2 },
    { label: "Usuários", to: "/admin/usuarios-direct", slug: "admin_usuarios", Icon: Users },
  ].filter((i) => can(i.slug));

  const configModulosItems: Item[] = [
    { label: "Engenharia Matricial", to: "/engenharia-matricial/admin/usuarios", slug: "config_modulo_engenharia_matricial_usuarios", Icon: Building2 },
  ].filter((i) => can(i.slug));

  useEffect(() => {
    if (pathname.startsWith("/engenharia-matricial/admin")) {
      setOpenConfigModulos(true);
    }
  }, [pathname]);

  const hasConfigModulos = configModulosItems.length > 0;

  if (items.length === 0 && !hasConfigModulos) return null;

  const isOpen = openMenu === "seguranca";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("seguranca")} className="text-white hover:bg-slate-600">
              <Shield className="h-4 w-4" />
              <span className="break-words">Segurança</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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

              {hasConfigModulos && (
                <SidebarMenuSubItem>
                  <Collapsible open={openConfigModulos} className="group/subcollapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton
                        onClick={() => setOpenConfigModulos(!openConfigModulos)}
                        className="text-white hover:bg-slate-600"
                      >
                        <Settings className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs leading-tight break-words min-w-0">Configuração por Módulos</span>
                        <ChevronDown className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pl-4">
                        {configModulosItems.map(({ slug, to, label, Icon }) => (
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
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
