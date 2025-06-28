
import React from "react";
import {
  Settings,
  Users,
  Building2,
  MapPin,
  UserCheck,
  UserCog,
  Clock,
  Target,
  FileText,
  ImageIcon,
} from "lucide-react";
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
import { useProfile } from "@/hooks/useProfile";
import { getAllMenusSidebar } from "@/services/perfisService";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};

export default function SidebarSectionAdministracao({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes, userRole } = useProfile();

  // Garantir fallback para admins
  const isAdmin =
    (userRole && typeof userRole === "string" && userRole.toLowerCase().startsWith("admin")) ||
    (userPermissoes &&
      typeof userPermissoes === "object" &&
      typeof (userPermissoes as any).nome === "string" &&
      (userPermissoes as any).nome.toLowerCase().startsWith("admin"));

  const menusSidebar = isAdmin
    ? getAllMenusSidebar()
    : (
        userPermissoes &&
        typeof userPermissoes === "object" &&
        Array.isArray((userPermissoes as any).menus_sidebar)
        ? (userPermissoes as any).menus_sidebar
        : []
      );

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white">Administração</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "admin"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("admin")}
                  className="text-white hover:bg-slate-600"
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Configurações</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("admin_usuarios", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/usuarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/usuarios" className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Usuários</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_perfis", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/perfis" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/perfis" className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Perfis</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_empresas", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/empresas" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Empresas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_ccas", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/ccas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/ccas" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">CCAs</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_engenheiros", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/engenheiros" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/engenheiros" className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Engenheiros</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_supervisores", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/supervisores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/supervisores" className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Supervisores</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_funcionarios", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/funcionarios" className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Funcionários</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_hht", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/hht" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/hht" className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Registro HHT</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_metas_indicadores", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/metas-indicadores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/metas-indicadores" className="flex items-center gap-2">
                          <Target className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Metas e Indicadores</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_modelos_inspecao", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/modelos-inspecao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/modelos-inspecao" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Modelos de Inspeção</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_templates", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/templates" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/templates" className="flex items-center gap-2">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Templates</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("admin_logo", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/admin/logo" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/admin/logo" className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Logo do Sistema</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
