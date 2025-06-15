
import React from "react";
import {
  Settings,
  Building,
  MapPin,
  UserCog,
  UserCheck,
  Target,
  Image,
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

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};
export default function SidebarSectionAdministracao({ openMenu, toggleMenu }: Props) {
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
                  <span>Administração</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/usuarios">
                        <span className="text-xs leading-tight">Administrar Usuários</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/perfis">
                        <span className="text-xs leading-tight">Perfis de Acesso</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/empresas">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Cadastro de Empresas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/ccas">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Cadastro de CCAs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/engenheiros">
                        <UserCog className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Cadastro de Engenheiros</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/supervisores">
                        <UserCheck className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Cadastro de Supervisores</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/funcionarios">
                        <span className="text-xs leading-tight">Cadastro de Funcionários</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/hht">
                        <span className="text-xs leading-tight">Registro de HHT</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/metas-indicadores">
                        <Target className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Metas de Indicadores</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/templates">
                        <span className="text-xs leading-tight">Templates de Importação</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/admin/logo">
                        <Image className="h-4 w-4 mr-2" />
                        <span className="text-xs leading-tight">Configurar Logo</span>
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
