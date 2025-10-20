import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, ClipboardList, FileText, CheckSquare, CheckCircle, BarChart3, Plane, FileUp, Database, FilePlus, Car, Briefcase, UserPlus } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarSectionGestaoPessoasProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick: () => void;
  canSee?: (slug: string) => boolean;
}

export default function SidebarSectionGestaoPessoas({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee = () => true,
}: SidebarSectionGestaoPessoasProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isOpen = openMenu === "gestao-pessoas";

  // Submenus state
  const [openSubmenus, setOpenSubmenus] = useState<{
    recursos: boolean;
    solicitacoes: boolean;
    viagens: boolean;
    veiculos: boolean;
    recrutamento: boolean;
  }>({
    recursos: false,
    solicitacoes: false,
    viagens: false,
    veiculos: false,
    recrutamento: false,
  });

  // Auto-expand based on current path
  useEffect(() => {
    if (currentPath.includes('/gestao-pessoas/')) {
      const newState = {
        recursos: true,
        solicitacoes: currentPath.includes('kpi-solicitacoes') || 
                      currentPath.includes('solicitacao-servicos') || 
                      currentPath.includes('controle-solicitacoes') || 
                      currentPath.includes('aprovacao-solicitacoes') || 
                      currentPath.includes('relatorios-solicitacoes'),
        viagens: currentPath.includes('viagens') || 
                 currentPath.includes('fatura') || 
                 currentPath.includes('faturas'),
        veiculos: currentPath.includes('veiculos') || 
                  currentPath.includes('veiculo') || 
                  currentPath.includes('checklist') || 
                  currentPath.includes('rotas') || 
                  currentPath.includes('abastecimento'),
        recrutamento: currentPath.includes('recrutamento') || 
                      currentPath.includes('vaga') || 
                      currentPath.includes('vagas'),
      };
      setOpenSubmenus(newState);
    }
  }, [currentPath]);

  const toggleSubmenu = (submenu: keyof typeof openSubmenus) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [submenu]: !prev[submenu]
    }));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleMenu("gestao-pessoas")}>
      <SidebarMenu>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Gestão de Pessoas</span>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenu className="ml-4 border-l border-sidebar-border">
              {/* Recursos & Benefícios */}
              <Collapsible open={openSubmenus.recursos} onOpenChange={() => toggleSubmenu("recursos")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Recursos & Benefícios</span>
                      </div>
                      {openSubmenus.recursos ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenu className="ml-4 border-l border-sidebar-border">
                      {/* Solicitações de Serviços */}
                      <Collapsible open={openSubmenus.solicitacoes} onOpenChange={() => toggleSubmenu("solicitacoes")}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Solicitações</span>
                              </div>
                              {openSubmenus.solicitacoes ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenu className="ml-4 border-l border-sidebar-border">
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/kpi-solicitacoes" onClick={onLinkClick}>
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Kpi Solicitações</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/solicitacao-servicos" onClick={onLinkClick}>
                                    <FileText className="h-4 w-4" />
                                    <span>Solicitação de Serviços</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/controle-solicitacoes" onClick={onLinkClick}>
                                    <CheckSquare className="h-4 w-4" />
                                    <span>Controle Solicitações</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/aprovacao-solicitacoes" onClick={onLinkClick}>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Aprovação Solicitações</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/relatorios-solicitacoes" onClick={onLinkClick}>
                                    <FileText className="h-4 w-4" />
                                    <span>Relatórios Solicitações</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>

                      {/* Gestão de Viagens */}
                      <Collapsible open={openSubmenus.viagens} onOpenChange={() => toggleSubmenu("viagens")}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                              <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4" />
                                <span>Viagens</span>
                              </div>
                              {openSubmenus.viagens ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenu className="ml-4 border-l border-sidebar-border">
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/gestao-viagens-dashboard" onClick={onLinkClick}>
                                    <Plane className="h-4 w-4" />
                                    <span>Dashboard Viagens</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/cadastro-fatura" onClick={onLinkClick}>
                                    <FilePlus className="h-4 w-4" />
                                    <span>Cadastro Fatura</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/importar-fatura" onClick={onLinkClick}>
                                    <FileUp className="h-4 w-4" />
                                    <span>Importar Fatura</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/consulta-faturas" onClick={onLinkClick}>
                                    <Database className="h-4 w-4" />
                                    <span>Consulta Faturas</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/relatorio-viagens" onClick={onLinkClick}>
                                    <FileText className="h-4 w-4" />
                                    <span>Relatório Viagens</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>

                      {/* Gestão de Veículos */}
                      <Collapsible open={openSubmenus.veiculos} onOpenChange={() => toggleSubmenu("veiculos")}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                <span>Veículos</span>
                              </div>
                              {openSubmenus.veiculos ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenu className="ml-4 border-l border-sidebar-border">
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/dashboard-veiculos" onClick={onLinkClick}>
                                    <Car className="h-4 w-4" />
                                    <span>Dashboard Veículos</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/consultas-veiculos" onClick={onLinkClick}>
                                    <Database className="h-4 w-4" />
                                    <span>Consultas Veículos</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/checklist-veiculos" onClick={onLinkClick}>
                                    <CheckSquare className="h-4 w-4" />
                                    <span>Checklist Veículos</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/calculo-rotas" onClick={onLinkClick}>
                                    <FileText className="h-4 w-4" />
                                    <span>Cálculo Rotas</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/controle-abastecimento" onClick={onLinkClick}>
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Controle Abastecimento</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                              <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                  <Link to="/gestao-pessoas/relatorios-veiculos" onClick={onLinkClick}>
                                    <FileText className="h-4 w-4" />
                                    <span>Relatórios Veículos</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Recrutamento & Seleção */}
              <Collapsible open={openSubmenus.recrutamento} onOpenChange={() => toggleSubmenu("recrutamento")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Recrutamento & Seleção</span>
                      </div>
                      {openSubmenus.recrutamento ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenu className="ml-4 border-l border-sidebar-border">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gestao-pessoas/dashboard-recrutamento" onClick={onLinkClick}>
                            <BarChart3 className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gestao-pessoas/rh-abertura-vaga" onClick={onLinkClick}>
                            <FilePlus className="h-4 w-4" />
                            <span>Abertura de Vaga</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gestao-pessoas/gestao-vagas" onClick={onLinkClick}>
                            <Database className="h-4 w-4" />
                            <span>Gestão de Vagas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gestao-pessoas/aprovacao-vaga" onClick={onLinkClick}>
                            <CheckCircle className="h-4 w-4" />
                            <span>Aprovação de Vaga</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </SidebarMenu>
    </Collapsible>
  );
}
