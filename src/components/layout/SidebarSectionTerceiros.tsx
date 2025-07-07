
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Users, FileText, Settings } from "lucide-react";
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

interface SidebarSectionTerceirosProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionTerceiros({ openMenu, toggleMenu }: SidebarSectionTerceirosProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});

  const getActiveSubmenu = (path: string) => {
    if (path.startsWith("/terceiros/funcionarios")) return "funcionarios";
    if (path.startsWith("/terceiros/documentos") || path.startsWith("/terceiros/minha-documentacao")) return "documentos";
    if (path.startsWith("/terceiros/configuracoes")) return "configuracoes";
    if (path.startsWith("/terceiros/relatorios")) return "relatorios";
    return null;
  };

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
      if (prev[subMenuName]) {
        return {};
      }
      return { [subMenuName]: true };
    });
  };

  const isTerceirosOpen = openMenu === "terceiros";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isTerceirosOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("terceiros")}
              className="text-white hover:bg-slate-600"
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">Gestão de Terceiros</span>
              {isTerceirosOpen ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Dashboard */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/terceiros/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/terceiros/dashboard">Dashboard</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

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
                        className={currentPath === "/terceiros/funcionarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/funcionarios">Lista de Funcionários</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/funcionarios/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/funcionarios/cadastro">Cadastro</Link>
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
                        className={currentPath === "/terceiros/documentos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/documentos">Documentos</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/minha-documentacao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/minha-documentacao">Minha Documentação</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Relatórios */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/terceiros/relatorios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/terceiros/relatorios">Relatórios</Link>
                </SidebarMenuSubButton>
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
                        className={currentPath === "/terceiros/configuracoes/empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/empresas">Empresas</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/configuracoes/usuarios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/usuarios">Usuários</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/configuracoes/perfis" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/perfis">Perfis</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/configuracoes/documentos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/documentos">Cadastro Documentos</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/configuracoes/vincular-empresas" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/vincular-empresas">Vincular Empresas</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/terceiros/configuracoes/vincular-funcoes" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/terceiros/configuracoes/vincular-funcoes">Vincular Funções</Link>
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
