
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Users, FileText, UserPlus, List, Settings } from "lucide-react";
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

interface SidebarSectionFuncionariosProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionFuncionarios({ openMenu, toggleMenu }: SidebarSectionFuncionariosProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Estado local para controlar os submenus
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});

  // Função para determinar qual submenu deve estar aberto baseado na rota atual
  const getActiveSubmenu = (path: string) => {
    if (path.startsWith("/funcionarios")) return "funcionarios";
    if (path.startsWith("/documentos") || path.startsWith("/minha-documentacao")) return "documentos";
    if (path.startsWith("/configuracoes")) return "configuracoes";
    return null;
  };

  // Effect para definir qual submenu deve estar aberto baseado na rota atual
  useEffect(() => {
    const activeSubmenu = getActiveSubmenu(currentPath);
    if (activeSubmenu) {
      setOpenSubMenus({ [activeSubmenu]: true });
    } else {
      setOpenSubMenus({});
    }
  }, [currentPath]);

  const toggleSubMenu = (subMenuName: string) => {
    setOpenSubMenus(prev => {
      // Se o submenu clicado já está aberto, fecha ele
      if (prev[subMenuName]) {
        return {};
      }
      // Senão, abre apenas o submenu clicado e fecha todos os outros
      return { [subMenuName]: true };
    });
  };

  const isFuncionariosOpen = openMenu === "funcionarios";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isFuncionariosOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("funcionarios")}
              className="text-white hover:bg-slate-600"
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">Gestão de Funcionários</span>
              {isFuncionariosOpen ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Funcionários */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("funcionarios")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 flex-shrink-0" />
                      <span>Funcionários</span>
                    </div>
                    {openSubMenus.funcionarios ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.funcionarios && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/funcionarios">Lista de Funcionários</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/funcionarios/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/funcionarios/cadastro">Cadastro</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Documentos */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("documentos")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span>Documentos</span>
                    </div>
                    {openSubMenus.documentos ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.documentos && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/documentos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/documentos">Documentos</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/minha-documentacao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/minha-documentacao">Minha Documentação</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Configurações */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("configuracoes")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-3 w-3 flex-shrink-0" />
                      <span>Configurações</span>
                    </div>
                    {openSubMenus.configuracoes ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.configuracoes && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/empresas">Empresas</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/usuarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/usuarios">Usuários</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/perfis" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/perfis">Perfis</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/documentos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/documentos">Cadastro Documentos</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/vincular-empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/vincular-empresas">Vincular Empresas</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/configuracoes/vincular-funcoes" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/configuracoes/vincular-funcoes">Vincular Funções</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
