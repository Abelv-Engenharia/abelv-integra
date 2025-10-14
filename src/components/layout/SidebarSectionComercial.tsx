import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  FolderOpen,
  LayoutDashboard,
  Building2,
  UserCheck,
  DollarSign,
  FileCheck,
  BookOpen,
  PieChart,
  FileText,
  Search,
  Target,
  FileSpreadsheet,
  Settings,
  Folder,
  Users,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
  onLinkClick: () => void;
}

export default function SidebarSectionComercial({ openMenu, toggleMenu, onLinkClick }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Estados locais para controlar submenus
  const [isRepositorioOpen, setIsRepositorioOpen] = useState(false);
  const [isControleOpen, setIsControleOpen] = useState(false);
  const [isAlteracaoCadastrosOpen, setIsAlteracaoCadastrosOpen] = useState(false);

  // Auto-expansão baseada na rota atual
  useEffect(() => {
    if (currentPath.startsWith("/comercial/repositorio")) {
      setIsRepositorioOpen(true);
    }
    if (currentPath.startsWith("/comercial/controle")) {
      setIsControleOpen(true);
      if (currentPath.includes("/cadastros")) {
        setIsAlteracaoCadastrosOpen(true);
      }
    }
  }, [currentPath]);

  const isActive = (path: string) => currentPath === path;

  return (
    <Collapsible open={openMenu === "comercial"} onOpenChange={() => toggleMenu("comercial")}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comercial</span>
            </div>
            {openMenu === "comercial" ? (
              <ChevronDown className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {/* Repositório de Documentos */}
            <Collapsible open={isRepositorioOpen} onOpenChange={setIsRepositorioOpen}>
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      <span>Repositório de Documentos</span>
                    </div>
                    {isRepositorioOpen ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/documentos") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/repositorio/documentos" onClick={onLinkClick}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          <span>Consulta de Documentos</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/categoria/1") ? "bg-muted" : ""}
                      >
                        <Link
                          to="/comercial/repositorio/categoria/154d9884-092f-402a-beae-331755b3b348"
                          onClick={onLinkClick}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>Empresarial</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/categoria/2") ? "bg-muted" : ""}
                      >
                        <Link
                          to="/comercial/repositorio/categoria/2720b38c-65cc-488b-8253-fa31ed1e2131"
                          onClick={onLinkClick}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          <span>Habilitação</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/categoria/3") ? "bg-muted" : ""}
                      >
                        <Link
                          to="/comercial/repositorio/categoria/3e8f5d43-de7e-4a64-918f-6ea80d0ee8c4"
                          onClick={onLinkClick}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>Financeiro</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/categoria/4") ? "bg-muted" : ""}
                      >
                        <Link
                          to="/comercial/repositorio/categoria/3f6a700b-e85f-4576-88ef-6fa271f066ec"
                          onClick={onLinkClick}
                        >
                          <FileCheck className="h-4 w-4 mr-2" />
                          <span>Certidões</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/repositorio/categoria/5") ? "bg-muted" : ""}
                      >
                        <Link
                          to="/comercial/repositorio/categoria/843b9d8c-1b5f-4216-8574-2bac83bbdb85"
                          onClick={onLinkClick}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>Políticas e Código de Conduta</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>

            {/* Controle Comercial */}
            <Collapsible open={isControleOpen} onOpenChange={setIsControleOpen}>
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Controle Comercial</span>
                    </div>
                    {isControleOpen ? (
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform" />
                    )}
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/controle/dashboard") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/controle/dashboard" onClick={onLinkClick}>
                          <PieChart className="h-4 w-4 mr-2" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/controle/cadastro") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/controle/cadastro" onClick={onLinkClick}>
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Cadastro de Proposta</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/controle/registros") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/controle/registros" onClick={onLinkClick}>
                          <Search className="h-4 w-4 mr-2" />
                          <span>Consulta de Propostas Emitidas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild className={isActive("/comercial/controle/metas") ? "bg-muted" : ""}>
                        <Link to="/comercial/controle/metas" onClick={onLinkClick}>
                          <Target className="h-4 w-4 mr-2" />
                          <span>Metas Anuais</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/controle/performance") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/controle/performance" onClick={onLinkClick}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span>Performance de Vendas</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        className={isActive("/comercial/controle/relatorios") ? "bg-muted" : ""}
                      >
                        <Link to="/comercial/controle/relatorios" onClick={onLinkClick}>
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          <span>Relatórios</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* Alteração de Cadastros (nível 3) */}
                    <Collapsible open={isAlteracaoCadastrosOpen} onOpenChange={setIsAlteracaoCadastrosOpen}>
                      <SidebarMenuSubItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <span>Alteração de Cadastros</span>
                            </div>
                            {isAlteracaoCadastrosOpen ? (
                              <ChevronDown className="h-3 w-3 transition-transform" />
                            ) : (
                              <ChevronRight className="h-3 w-3 transition-transform" />
                            )}
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                className={isActive("/comercial/controle/cadastros/segmentos") ? "bg-muted" : ""}
                              >
                                <Link to="/comercial/controle/cadastros/segmentos" onClick={onLinkClick}>
                                  <Folder className="h-4 w-4 mr-2" />
                                  <span>Segmentos</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                className={isActive("/comercial/controle/cadastros/vendedores") ? "bg-muted" : ""}
                              >
                                <Link to="/comercial/controle/cadastros/vendedores" onClick={onLinkClick}>
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Vendedores</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuSubItem>
                    </Collapsible>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
