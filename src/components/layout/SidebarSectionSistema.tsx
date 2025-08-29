import React from "react";
import {
  Settings, 
  Users, 
  UserCheck, 
  Building, 
  Factory, 
  HardHat, 
  UserCog, 
  UserX,
  FileText,
  Clock,
  Target,
  Clipboard,
  Image,
  Upload,
  Wrench,
  HelpCircle,
  User
} from "lucide-react";
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
};

export default function SidebarSectionSistema({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isSistemaOpen = openMenu === "sistema";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isSistemaOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("sistema")}
              className={isSistemaOpen ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
            >
              <div className="flex items-center gap-2 w-full">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">Sistema</span>
                {isSistemaOpen ? (
                  <ChevronDown className="h-4 w-4 ml-auto flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Configurações */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/configuracoes" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/configuracoes" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Configurações</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Suporte */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/suporte" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/suporte" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Suporte</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Conta */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/conta" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/conta" className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Conta</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Usuários */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/usuarios" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/usuarios" className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Usuários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Perfis */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/perfis" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/perfis" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Perfis</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Empresas */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/empresas" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/empresas" className="flex items-center gap-2">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Empresas</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* CCAs */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/ccas" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/ccas" className="flex items-center gap-2">
                    <Factory className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">CCAs</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Engenheiros */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/engenheiros" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/engenheiros" className="flex items-center gap-2">
                    <HardHat className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Engenheiros</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Supervisores */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/supervisores" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/supervisores" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Supervisores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Funcionários */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/funcionarios" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/funcionarios" className="flex items-center gap-2">
                    <UserX className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Funcionários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Importação de Funcionários */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/importacao-funcionarios" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/importacao-funcionarios" className="flex items-center gap-2">
                    <Upload className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Importação de Funcionários</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Cadastro de Checklists */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/checklists" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/checklists" className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Cadastro de Checklists</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* HHT */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/hht" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/hht" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">HHT</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Metas e Indicadores */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/metas-indicadores" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/metas-indicadores" className="flex items-center gap-2">
                    <Target className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Metas e Indicadores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Modelos de Inspeção */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/modelos-inspecao" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/modelos-inspecao" className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Modelos de Inspeção</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Templates */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/templates" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/templates" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Templates</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {/* Logo */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild 
                  className={currentPath === "/admin/logo" ? "bg-slate-500 text-white font-medium" : "text-gray-300 hover:bg-slate-600 hover:text-white"}
                >
                  <Link to="/admin/logo" className="flex items-center gap-2">
                    <Image className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Logo</span>
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