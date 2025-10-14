import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  PieChart,
  FileText,
  Search,
  Target,
  FileSpreadsheet,
  Settings,
  Edit,
  Folder,
  Users,
  FolderOpen,
  FileSearch,
  Building2,
  Award,
  DollarSign,
  ScrollText,
} from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

interface SidebarSectionComercialProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick: () => void;
  canSee: (slug: string) => boolean;
}

export default function SidebarSectionComercial({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee,
}: SidebarSectionComercialProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Estados de controle para os submenus
  const [isControleComercialOpen, setIsControleComercialOpen] = useState(false);
  const [isApoioOpen, setIsApoioOpen] = useState(false);
  const [isAlteracaoCadastrosOpen, setIsAlteracaoCadastrosOpen] = useState(false);
  const [isRepositorioOpen, setIsRepositorioOpen] = useState(false);

  // Auto-expansão baseada na rota atual
  useEffect(() => {
    if (currentPath.startsWith("/comercial/controle")) {
      setIsControleComercialOpen(true);
      
      if (currentPath.includes("/cadastros")) {
        setIsApoioOpen(true);
        setIsAlteracaoCadastrosOpen(true);
      }
    }
    
    if (currentPath.startsWith("/comercial/repositorio")) {
      setIsRepositorioOpen(true);
    }
  }, [currentPath]);

  // Helpers para estilização
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  // Verificar se o usuário tem acesso a qualquer item do comercial
  const hasComercialAccess = canSee("comercial_acesso") || canSee("*");

  if (!hasComercialAccess) return null;

  return (
    <Collapsible
      open={openMenu === "comercial"}
      onOpenChange={() => toggleMenu("comercial")}
    >
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md px-2 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comercial</span>
            </div>
            {openMenu === "comercial" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenu>
            {/* ============================================ */}
            {/* NÍVEL 2a: Controle Comercial                */}
            {/* ============================================ */}
            <Collapsible
              open={isControleComercialOpen}
              onOpenChange={setIsControleComercialOpen}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Controle Comercial</span>
                    </div>
                    {isControleComercialOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Dashboard */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle/dashboard"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <PieChart className="h-4 w-4" />
                          <span>Dashboard</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Cadastro de Proposta */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle/cadastro"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Cadastro de Proposta</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Consulta de Propostas Emitidas */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <Search className="h-4 w-4" />
                          <span>Consulta de Propostas Emitidas</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Metas Anuais */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle/metas"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <Target className="h-4 w-4" />
                          <span>Metas Anuais</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Performance de Vendas */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle/registros"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>Performance de Vendas</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Relatórios */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/controle/relatorios"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          <span>Relatórios</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* ============================================ */}
                    {/* NÍVEL 3: Apoio                               */}
                    {/* ============================================ */}
                    <SidebarMenuSubItem>
                      <Collapsible
                        open={isApoioOpen}
                        onOpenChange={setIsApoioOpen}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <span>Apoio</span>
                            </div>
                            {isApoioOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4">
                            {/* ============================================ */}
                            {/* NÍVEL 4: Alteração de Cadastros             */}
                            {/* ============================================ */}
                            <SidebarMenuSubItem>
                              <Collapsible
                                open={isAlteracaoCadastrosOpen}
                                onOpenChange={setIsAlteracaoCadastrosOpen}
                              >
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton className="w-full justify-between">
                                    <div className="flex items-center gap-2">
                                      <Edit className="h-4 w-4" />
                                      <span>Alteração de Cadastros</span>
                                    </div>
                                    {isAlteracaoCadastrosOpen ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <SidebarMenuSub className="ml-4">
                                    {/* Segmentos */}
                                    <SidebarMenuSubItem>
                                      <SidebarMenuSubButton asChild>
                                        <NavLink
                                          to="/comercial/controle/cadastros/segmentos"
                                          className={getNavCls}
                                          onClick={onLinkClick}
                                        >
                                          <Folder className="h-4 w-4" />
                                          <span>Segmentos</span>
                                        </NavLink>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>

                                    {/* Vendedores */}
                                    <SidebarMenuSubItem>
                                      <SidebarMenuSubButton asChild>
                                        <NavLink
                                          to="/comercial/controle/cadastros/vendedores"
                                          className={getNavCls}
                                          onClick={onLinkClick}
                                        >
                                          <Users className="h-4 w-4" />
                                          <span>Vendedores</span>
                                        </NavLink>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* ============================================ */}
            {/* NÍVEL 2b: Repositório de Documentos         */}
            {/* ============================================ */}
            <Collapsible
              open={isRepositorioOpen}
              onOpenChange={setIsRepositorioOpen}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      <span>Repositório de Documentos</span>
                    </div>
                    {isRepositorioOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Consulta de Documentos */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/documentos"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <FileSearch className="h-4 w-4" />
                          <span>Consulta de Documentos</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Empresarial */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/categoria/1"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <Building2 className="h-4 w-4" />
                          <span>Empresarial</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Habilitação */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/categoria/2"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <Award className="h-4 w-4" />
                          <span>Habilitação</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Financeiro */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/categoria/3"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>Financeiro</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Certidões */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/categoria/4"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <ScrollText className="h-4 w-4" />
                          <span>Certidões</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Políticas e Código de Conduta */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to="/comercial/repositorio/categoria/5"
                          className={getNavCls}
                          onClick={onLinkClick}
                        >
                          <Briefcase className="h-4 w-4" />
                          <span>Políticas e Código de Conduta</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
