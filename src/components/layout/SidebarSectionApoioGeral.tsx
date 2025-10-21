import React from "react";
import {
  ChevronDown,
  Building2,
  Layers,
  Ruler,
  FileText,
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

export default function SidebarSectionApoioGeral({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => (canSee ? canSee(slug) : true);

  const items: Item[] = [
    { label: "Empresas", to: "/admin/empresas", slug: "admin_empresas", Icon: Building2 },
    { label: "Empresas (sienge)", to: "/admin/empresas-sienge", slug: "admin_empresas_sienge", Icon: Building2 },
    { label: "CCAs", to: "/admin/ccas", slug: "admin_ccas", Icon: Layers },
    { label: "Unidades de Medidas", to: "/admin/unidades-medidas", slug: "admin_unidades_medidas", Icon: Ruler },
    { label: "Documentos", to: "/admin/tipos-documentos", slug: "admin_tipos_documentos", Icon: FileText },
  ].filter((i) => can(i.slug));

  if (items.length === 0) return null;

  const isOpen = openMenu === "apoio-geral";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("apoio-geral")} className="text-white hover:bg-slate-600">
              <Building2 className="h-4 w-4" />
              <span className="break-words">Apoio Geral</span>
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
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
