
import React from "react";
import { Settings, Users, Building, Shield, Wrench, UserCheck, UserCog, Clock, Target, FileText, Image, Upload, Mail, HardHat, Download, ClipboardList } from "lucide-react";
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
  onLinkClick?: () => void;
};

export default function SidebarSectionAdministracao({ openMenu, toggleMenu, onLinkClick }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdminOpen = openMenu === "admin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isAdminOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("admin")}
              className="text-white hover:bg-slate-600"
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">CONFIGURAÇÕES</span>
              {isAdminOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/usuarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/usuarios" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Usuários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/perfis" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/perfis" className="flex items-center gap-2">
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Perfis</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/empresas" className="flex items-center gap-2">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Empresas</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/ccas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/ccas" className="flex items-center gap-2">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">CCAs</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/engenheiros" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/engenheiros" className="flex items-center gap-2">
                    <UserCog className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Engenheiros</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/supervisores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/supervisores" className="flex items-center gap-2">
                    <UserCheck className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Supervisores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/encarregados" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/encarregados" className="flex items-center gap-2">
                    <HardHat className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Encarregados</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/funcionarios" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Funcionários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/registro-hht" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/registro-hht" className="flex items-center gap-2">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Registro HHT</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/metas-indicadores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/metas-indicadores" className="flex items-center gap-2">
                    <Target className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Metas e Indicadores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/checklists" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/checklists" className="flex items-center gap-2">
                    <ClipboardList className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Checklists</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/admin/templates" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/admin/templates" className="flex items-center gap-2">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Templates</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/admin/logo-sistema" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/admin/logo-sistema" className="flex items-center gap-2">
                      <Image className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Logo do Sistema</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/upload-tutoriais" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/upload-tutoriais" className="flex items-center gap-2">
                      <Upload className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Upload de Tutoriais</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/configuracao-emails" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/configuracao-emails" className="flex items-center gap-2">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Configuração de E-mails</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/admin/exportacao-dados" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/admin/exportacao-dados" className="flex items-center gap-2">
                      <Download className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Exportação de Dados</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/admin/importacao-funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/admin/importacao-funcionarios" className="flex items-center gap-2">
                      <Upload className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Importação de Funcionários</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/admin/importacao-execucao-treinamentos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/admin/importacao-execucao-treinamentos" className="flex items-center gap-2">
                      <Upload className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Importação Execução Treinamentos</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild
                    className={currentPath === "/admin/importacao-hsa" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                  >
                    <Link to="/admin/importacao-hsa" className="flex items-center gap-2">
                      <Upload className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Importação de HSA</span>
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
