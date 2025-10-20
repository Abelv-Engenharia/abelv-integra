import { useState } from "react";
import { Home, Users, Building2, TrendingUp, Truck, Utensils, Calendar, ChevronDown, ChevronRight, FileText, BarChart3, FileCheck, CheckCircle, ClipboardList, FileUser, PieChart, AlertTriangle, DollarSign, Target, Mail, Clock, BookOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  // Estado dos menus expansíveis
  const [isAdmMatricialOpen, setIsAdmMatricialOpen] = useState(true);
  const [isGestaoDocumentacaoOpen, setIsGestaoDocumentacaoOpen] = useState(false);
  const [isControleMaoObraOpen, setIsControleMaoObraOpen] = useState(false);
  const [isControleDiarioTerceirosOpen, setIsControleDiarioTerceirosOpen] = useState(false);
  const [isControleDiarioAbelvPJOpen, setIsControleDiarioAbelvPJOpen] = useState(false);
  const [isContratosAlojamentoOpen, setIsContratosAlojamentoOpen] = useState(false);
  const [isGestaoAlojamentosMensalOpen, setIsGestaoAlojamentosMensalOpen] = useState(false);
  const [isCaucaoOpen, setIsCaucaoOpen] = useState(false);
  const [isAluguelOpen, setIsAluguelOpen] = useState(false);
  const [isRelatoriosAlertasAluguelOpen, setIsRelatoriosAlertasAluguelOpen] = useState(false);
  const [isHospedagemOpen, setIsHospedagemOpen] = useState(false);
  const [isControleTransporteOpen, setIsControleTransporteOpen] = useState(false);
  const [isControleAlimentacaoOpen, setIsControleAlimentacaoOpen] = useState(false);
  const [isFolgaCampoOpen, setIsFolgaCampoOpen] = useState(false);
  const [isRelatoriosAlertasOpen, setIsRelatoriosAlertasOpen] = useState(false);
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`;
  return <Sidebar className="border-r border-sidebar-border bg-sidebar backdrop-blur-sm" collapsible="icon">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls}>
                    <Home className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Exemplos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Adm Matricial & Obras - Menu Principal */}
              <SidebarMenuItem>
                <Collapsible open={isAdmMatricialOpen} onOpenChange={setIsAdmMatricialOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-semibold">Adm Matricial & Obras</span>}
                      </div>
                      {!isCollapsed && (isAdmMatricialOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
              {/* 1. Gestão de Documentação de Mobilização */}
              <Collapsible open={isGestaoDocumentacaoOpen} onOpenChange={setIsGestaoDocumentacaoOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <FileUser className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">Gestão de Documentação de Mobilização</span>}
                    </div>
                    {!isCollapsed && (isGestaoDocumentacaoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/mobilizacao/guia" className={getNavCls}>
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">📘 Guia do módulo</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/nova-admissao" className={getNavCls}>
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Nova admissão</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <ClipboardList className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Checklist do Colaborador</span>
                              </div>
                              <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/checklist-colaborador" className={getNavCls}>
                                  <span className="text-xs">Documentação</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/relacao-documentos-prazos/1" className={getNavCls}>
                                  <span className="text-xs">Relação de Documentos e Prazos</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/validacao-admissao" className={getNavCls}>
                                  <span className="text-xs">Validação de Admissão (Nydhus)</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorio-documentacao-mobilizacao" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatórios por colaborador</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/mobilizacao/alertas" className={getNavCls}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Alertas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/mobilizacao/dashboard" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Dashboard</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/mobilizacao/leadtime-contratacao" className={getNavCls}>
                            <Clock className="h-4 w-4 shrink-0" />
                            <span className="text-sm">LeadTime - Contratação</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/mobilizacao/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>

              {/* 2. Controle de Mão de Obra */}
              <Collapsible open={isControleMaoObraOpen} onOpenChange={setIsControleMaoObraOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Controle de Mão de Obra</span>}
                      </div>
                      {!isCollapsed && (isControleMaoObraOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <Collapsible open={isControleDiarioTerceirosOpen} onOpenChange={setIsControleDiarioTerceirosOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Controle diário - Terceiros</span>
                              </div>
                              {isControleDiarioTerceirosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/controle-mao-obra/efetivo-terceiros" className={getNavCls}>
                                  <Users className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Efetivo de terceiros</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/controle-mao-obra/controle-diario" className={getNavCls}>
                                  <Calendar className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Controle diário</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                      
                      {/* Controle diário - Abelv + PJ */}
                      <SidebarMenuItem>
                        <Collapsible open={isControleDiarioAbelvPJOpen} onOpenChange={setIsControleDiarioAbelvPJOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Controle diário - Abelv + PJ</span>
                              </div>
                              {isControleDiarioAbelvPJOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/controle-mao-obra/efetivo-abelv-pj" className={getNavCls}>
                                  <Users className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Efetivo obra</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/controle-mao-obra/controle-diario-abelv-pj" className={getNavCls}>
                                  <Calendar className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Controle diário</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-mao-obra/relatorios-efetivo" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatórios de efetivo</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-mao-obra/destinatarios-efetivo" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>

              {/* 3. Contratos de Alojamento */}
              <Collapsible open={isContratosAlojamentoOpen} onOpenChange={setIsContratosAlojamentoOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Contratos de Alojamento</span>}
                      </div>
                      {!isCollapsed && (isContratosAlojamentoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/painel-analise-contratual" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Painel De Análise Contratual</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/fornecedores-alojamento" className={getNavCls}>
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Cadastro De Fornecedores</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/contratos-alojamento" className={getNavCls}>
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Contratos de alojamento</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/vistorias-alojamento" className={getNavCls}>
                            <CheckCircle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Vistorias</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorios-alertas-alojamento/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>

              {/* 4. Gestão de Alojamentos – Mensal */}
              <SidebarMenuItem>
                <Collapsible open={isGestaoAlojamentosMensalOpen} onOpenChange={setIsGestaoAlojamentosMensalOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Gestão de Alojamentos – Mensal</span>}
                      </div>
                      {!isCollapsed && (isGestaoAlojamentosMensalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      {/* Guia do Módulo */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/alojamento/guia-gestao-mensal" className={getNavCls}>
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">📘 Guia do módulo</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      {/* Caução */}
                      <SidebarMenuItem>
                        <Collapsible open={isCaucaoOpen} onOpenChange={setIsCaucaoOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Caução</span>
                              </div>
                              {isCaucaoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/cadastro" className={getNavCls}>
                                  <FileText className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Cadastro</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/aprovacao" className={getNavCls}>
                                  <CheckCircle className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Aprovação</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/liquidacao" className={getNavCls}>
                                  <DollarSign className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Liquidação/Pagamento</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/restituicao" className={getNavCls}>
                                  <Target className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Restituição/Compensação</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/logs" className={getNavCls}>
                                  <ClipboardList className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Logs & Evidências</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/caucao/destinatarios" className={getNavCls}>
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Destinatários</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Aluguel */}
                      <SidebarMenuItem>
                        <Collapsible open={isAluguelOpen} onOpenChange={setIsAluguelOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Aluguel</span>
                              </div>
                              {isAluguelOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/aluguel/medicoes" className={getNavCls}>
                                  <FileCheck className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Medições</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/aluguel/lancamentos-sienge" className={getNavCls}>
                                  <Target className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Lançamentos – Integração Sienge</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <Collapsible open={isRelatoriosAlertasAluguelOpen} onOpenChange={setIsRelatoriosAlertasAluguelOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <AlertTriangle className="h-3 w-3 shrink-0" />
                                      <span className="text-xs">Relatórios e Alertas</span>
                                    </div>
                                    {isRelatoriosAlertasAluguelOpen ? <ChevronDown className="h-2 w-2" /> : <ChevronRight className="h-2 w-2" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <NavLink to="/aluguel/visao-geral" className={getNavCls}>
                                        <PieChart className="h-2 w-2 shrink-0" />
                                        <span className="text-xs">Visão Geral por Obra</span>
                                      </NavLink>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <NavLink to="/aluguel/relatorios-alertas" className={getNavCls}>
                                        <BarChart3 className="h-2 w-2 shrink-0" />
                                        <span className="text-xs">Relatórios e Alertas</span>
                                      </NavLink>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/aluguel/destinatarios" className={getNavCls}>
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Destinatários</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Hospedagem */}
                      <SidebarMenuItem>
                        <Collapsible open={isHospedagemOpen} onOpenChange={setIsHospedagemOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <span className="text-sm">Hospedagem</span>
                              </div>
                              {isHospedagemOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/hospedagem/medicoes" className={getNavCls}>
                                  <FileCheck className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Medições</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/hospedagem/lancamentos-sienge" className={getNavCls}>
                                  <Target className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Lançamentos – Integração Sienge</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/hospedagem/relatorios-alertas" className={getNavCls}>
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Relatórios e Alertas</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <NavLink to="/hospedagem/destinatarios" className={getNavCls}>
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="text-xs">Destinatários</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>

              {/* 5. Controle Transporte */}
              <SidebarMenuItem>
                <Collapsible open={isControleTransporteOpen} onOpenChange={setIsControleTransporteOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Controle Transporte</span>}
                      </div>
                      {!isCollapsed && (isControleTransporteOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/guia" className={getNavCls}>
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">📘 Guia do módulo</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/medicao" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Medição</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/lancamentos-sienge" className={getNavCls}>
                            <Target className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Lançamentos – Integração Sienge</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/relatorios" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatórios</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/alertas" className={getNavCls}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Alertas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/metas" className={getNavCls}>
                            <Target className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Metas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-transporte/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>

              {/* 6. Controle Alimentação */}
              <SidebarMenuItem>
                <Collapsible open={isControleAlimentacaoOpen} onOpenChange={setIsControleAlimentacaoOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Utensils className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Controle Alimentação</span>}
                      </div>
                      {!isCollapsed && (isControleAlimentacaoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/guia" className={getNavCls}>
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">📘 Guia do módulo</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/medicao" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Medição</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/lancamentos-sienge" className={getNavCls}>
                            <Target className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Lançamentos – Integração Sienge</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/relatorios" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatórios</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/alertas" className={getNavCls}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Alertas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/metas" className={getNavCls}>
                            <Target className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Metas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-alimentacao/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>

              {/* 7. Folga de Campo */}
              <SidebarMenuItem>
                <Collapsible open={isFolgaCampoOpen} onOpenChange={setIsFolgaCampoOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Folga de Campo</span>}
                      </div>
                      {!isCollapsed && (isFolgaCampoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/dashboard" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Dashboard</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/colaboradores" className={getNavCls}>
                            <Users className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Colaboradores</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/por-obra" className={getNavCls}>
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Por Obra</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/compras" className={getNavCls}>
                            <DollarSign className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Compras</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/relatorios" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatórios</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/alertas" className={getNavCls}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Alertas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/auditoria" className={getNavCls}>
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Auditoria</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/folga-campo/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>

              {/* 8. Relatórios e Alertas */}
              <SidebarMenuItem>
                <Collapsible open={isRelatoriosAlertasOpen} onOpenChange={setIsRelatoriosAlertasOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Relatórios e Alertas</span>}
                      </div>
                      {!isCollapsed && (isRelatoriosAlertasOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorios-alertas-alojamento/gestao-contratos" className={getNavCls}>
                            <FileCheck className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Gestão de Contratos</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorios-alertas-alojamento/relatorio-obra" className={getNavCls}>
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatório por Obra</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-agregados/relatorio-cca-competencia" className={getNavCls}>
                            <PieChart className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatório CCA x Competência</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorio-consolidado-obras" className={getNavCls}>
                            <PieChart className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Relatório Consolidado – Obras</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorios-alertas-alojamento/dashboard" className={getNavCls}>
                            <BarChart3 className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Dashboard</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/controle-agregados/alertas" className={getNavCls}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Alertas</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/relatorios-alertas-alojamento/destinatarios" className={getNavCls}>
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="text-sm">Destinatários</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>
                    </CollapsibleContent>}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}