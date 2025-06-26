
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
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
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
      <SidebarGroupLabel>Administração</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "admin"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton onClick={() => toggleMenu("admin")}>
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("admin_usuarios", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/usuarios">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Usuários</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_perfis", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/perfis">
                          <UserCheck className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Perfis</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_empresas", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/empresas">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Empresas</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_ccas", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/ccas">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">CCAs</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_engenheiros", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/engenheiros">
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Engenheiros</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_supervisores", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/supervisores">
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Supervisores</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_funcionarios", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/funcionarios">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Funcionários</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_hht", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/hht">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Registro HHT</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_metas_indicadores", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/metas-indicadores">
                          <Target className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Metas e Indicadores</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_modelos_inspecao", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/modelos-inspecao">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Modelos de Inspeção</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_templates", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/templates">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Templates</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {podeVerMenu("admin_logo", menusSidebar) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/admin/logo">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          <span className="text-xs leading-tight">Logo do Sistema</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
