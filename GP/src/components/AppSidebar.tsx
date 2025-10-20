import { useState, useEffect } from "react";
import { Home, Users, Building2, UserCog, Gift, UserPlus, FileText, GraduationCap, Briefcase, Building, Car, BarChart3, ClipboardList, ChevronDown, ChevronRight, Clock, CheckSquare, MapPin, Plane, Receipt, Fuel, FilePlus, Calendar, Calculator, Database, Kanban, FileSpreadsheet, AlertTriangle, User, CreditCard, Route, Search, LayoutGrid } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const mainMenuItems = [{
  title: "Exemplos",
  url: "/",
  icon: Home
}];

// Gestão de Pessoas - Arrays para os submenus

// Solicitações de Serviços submenu
const solicitacoesServicosItems = [
  {
    title: "Solicitação de Serviços",
    url: "/solicitacao-servicos",
    icon: ClipboardList
  },
  {
    title: "Controle de Solicitações",
    url: "/controle-solicitacoes",
    icon: BarChart3
  },
  {
    title: "Aprovação de Solicitações",
    url: "/aprovacao-solicitacoes",
    icon: CheckSquare
  },
  {
    title: "Relatórios de Solicitações",
    url: "/relatorios-solicitacoes",
    icon: FileText
  }
];

const recursosBeneficiosItems = [
  { title: "KPI", url: "/kpi-solicitacoes", icon: BarChart3 }
];

// Gestão de Viagens - Sub-items
const gestaoViagensItems = [
  {
    title: "Dashboard de Viagens",
    url: "/gestao-viagens-dashboard",
    icon: BarChart3
  },
  {
    title: "Cadastro de Fatura",
    url: "/cadastro-fatura",
    icon: FilePlus
  },
  {
    title: "Importar Fatura",
    url: "/importar-fatura",
    icon: FileSpreadsheet
  },
  {
    title: "Consulta de Faturas",
    url: "/consulta-faturas",
    icon: Database
  },
  {
    title: "Relatório de Viagens",
    url: "/relatorio-viagens",
    icon: MapPin
  }
];

// Gestão de Veículos - Sub-items
const gestaoVeiculosItems = [
  {
    title: "Dashboard",
    url: "/dashboard-veiculos",
    icon: BarChart3
  },
  {
    title: "Relatórios",
    url: "/relatorios-veiculos",
    icon: FileText
  },
  {
    title: "Checklist",
    url: "/checklist-veiculos",
    icon: CheckSquare
  },
  {
    title: "Abastecimento",
    url: "/controle-abastecimento",
    icon: Fuel
  },
  {
    title: "Cálculo de Rotas",
    url: "/calculo-rotas",
    icon: Route
  },
  {
    title: "Cadastro de Veículo",
    url: "/cadastro-veiculo",
    icon: Car
  },
  {
    title: "Cadastro de Multa",
    url: "/cadastro-multa",
    icon: AlertTriangle
  },
  {
    title: "Cadastro de Condutor",
    url: "/cadastro-condutor",
    icon: User
  },
  {
    title: "Cadastro de Cartão",
    url: "/cadastro-cartao-abastecimento",
    icon: CreditCard
  },
  {
    title: "Cadastro de Pedágio",
    url: "/cadastro-pedagio-estacionamento",
    icon: MapPin
  },
  {
    title: "Consultas",
    url: "/consultas-veiculos",
    icon: Search
  }
];

// Requisição de Serviços - Sub-items (removido - agora está em Recursos & Benefícios)
const recrutamentoSelecaoItems = [
  {
    title: "Dashboard",
    url: "/dashboard-recrutamento",
    icon: BarChart3
  },
  {
    title: "Abertura de Vaga",
    url: "/rh-abertura-vaga",
    icon: UserPlus
  },
  {
    title: "Aprovação de Vaga",
    url: "/aprovacao-vaga",
    icon: CheckSquare
  },
  {
    title: "Gestão de Vagas",
    url: "/gestao-vagas",
    icon: LayoutGrid
  },
  {
    title: "Banco de Talentos",
    url: "/banco-talentos",
    icon: Database
  }
];
const departamentoPessoalItems: any[] = [];
const prestadoresServicoItems = [
  {
    title: "Dashboard",
    url: "/dashboard-prestadores",
    icon: BarChart3
  },
  {
    title: "Cadastro de Pessoa Jurídica",
    url: "/cadastro-pessoa-juridica",
    icon: Building
  },
  {
    title: "Consulta de Prestadores",
    url: "/consulta-prestadores",
    icon: Users
  },
  {
    title: "Emissão de Contrato",
    url: "/emissao-contrato-prestacao-servico",
    icon: FileText
  },
  {
    title: "Consulta de Contratos",
    url: "/consulta-contratos",
    icon: Search
  },
  {
    title: "Demonstrativo de Prestação de Serviço",
    url: "/demonstrativo-prestacao-servico",
    icon: FileText
  },
  {
    title: "Cadastro de Emissão de NF",
    url: "/cadastro-emissao-nf",
    icon: FilePlus
  },
  {
    title: "Aprovação de NF",
    url: "/aprovacao-nf",
    icon: CheckSquare
  },
  {
    title: "Solicitação de Férias",
    url: "/controle-ferias",
    icon: Calendar
  },
  {
    title: "Aprovação de Férias",
    url: "/aprovacao-ferias",
    icon: CheckSquare
  },
  {
    title: "Controle de Passivos",
    url: "/controle-passivos",
    icon: Calculator
  },
  {
    title: "Relatórios",
    url: "/relatorios-prestadores",
    icon: BarChart3
  }
];
const colaboradoresItems: any[] = [];
const treinamentoDesenvolvimentoItems: any[] = [];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  
  // Funções auxiliares para verificar se uma rota está ativa
  const isRouteActive = (items: any[]) => items.some(item => currentPath === item.url);
  
  const [isGestaoPessoasOpen, setIsGestaoPessoasOpen] = useState(true);
  const [isSolicitacoesServicosOpen, setIsSolicitacoesServicosOpen] = useState(false);
  const [isRecursosBeneficiosOpen, setIsRecursosBeneficiosOpen] = useState(false);
  const [isGestaoViagensOpen, setIsGestaoViagensOpen] = useState(false);
  const [isGestaoVeiculosOpen, setIsGestaoVeiculosOpen] = useState(false);
  
  const [isRecrutamentoSelecaoOpen, setIsRecrutamentoSelecaoOpen] = useState(false);
  const [isDepartamentoPessoalOpen, setIsDepartamentoPessoalOpen] = useState(false);
  const [isPrestadoresServicoOpen, setIsPrestadoresServicoOpen] = useState(false);
  const [isColaboradoresOpen, setIsColaboradoresOpen] = useState(false);
  const [isTreinamentoDesenvolvimentoOpen, setIsTreinamentoDesenvolvimentoOpen] = useState(false);
  
  // Mantém os submenus abertos quando a rota está ativa
  useEffect(() => {
    // Primeiro, fecha TODOS os submenus
    setIsRecursosBeneficiosOpen(false);
    setIsSolicitacoesServicosOpen(false);
    setIsGestaoViagensOpen(false);
    setIsGestaoVeiculosOpen(false);
    setIsRecrutamentoSelecaoOpen(false);
    setIsDepartamentoPessoalOpen(false);
    setIsPrestadoresServicoOpen(false);
    setIsColaboradoresOpen(false);
    setIsTreinamentoDesenvolvimentoOpen(false);
    
    // Depois, abre APENAS o submenu da rota ativa
    
    if (isRouteActive(solicitacoesServicosItems)) {
      setIsGestaoPessoasOpen(true);
      setIsRecursosBeneficiosOpen(true);
      setIsSolicitacoesServicosOpen(true);
      return;
    }
    
    if (isRouteActive(recursosBeneficiosItems)) {
      setIsGestaoPessoasOpen(true);
      setIsRecursosBeneficiosOpen(true);
      return;
    }
    
    if (isRouteActive(gestaoViagensItems)) {
      setIsGestaoPessoasOpen(true);
      setIsRecursosBeneficiosOpen(true);
      setIsGestaoViagensOpen(true);
      return;
    }
    
    if (isRouteActive(gestaoVeiculosItems)) {
      setIsGestaoPessoasOpen(true);
      setIsRecursosBeneficiosOpen(true);
      setIsGestaoVeiculosOpen(true);
      return;
    }
    
    if (isRouteActive(recrutamentoSelecaoItems)) {
      setIsGestaoPessoasOpen(true);
      setIsRecrutamentoSelecaoOpen(true);
      return;
    }
    
    if (isRouteActive(prestadoresServicoItems)) {
      setIsGestaoPessoasOpen(true);
      setIsDepartamentoPessoalOpen(true);
      setIsPrestadoresServicoOpen(true);
      return;
    }
    
    // Se não estiver em nenhuma rota específica, fecha Gestão de Pessoas também
    setIsGestaoPessoasOpen(false);
  }, [currentPath]);
  
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
              {/* Main menu items */}
              {mainMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm whitespace-normal break-words leading-tight">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}


              {/* Gestão de Pessoas expandable section */}
              <SidebarMenuItem>
                <Collapsible open={isGestaoPessoasOpen} onOpenChange={setIsGestaoPessoasOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <UserCog className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm whitespace-normal break-words leading-tight">Gestão de Pessoas</span>}
                      </div>
                      {!isCollapsed && (isGestaoPessoasOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!isCollapsed && <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      {/* Recursos & Benefícios submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={isRecursosBeneficiosOpen} onOpenChange={setIsRecursosBeneficiosOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Gift className="h-4 w-4 shrink-0" />
                                <span className="text-sm whitespace-normal break-words leading-tight">Recursos & Benefícios</span>
                              </div>
                              {isRecursosBeneficiosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenu>
                              {recursosBeneficiosItems.map(item => <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild className="h-auto py-2">
                                    <NavLink to={item.url} end className={getNavCls}>
                                      <item.icon className="h-3 w-3 shrink-0" />
                            <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                    </NavLink>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>)}
                              
                              {/* Solicitações de Serviços sub-submenu */}
                              <SidebarMenuItem>
                              <Collapsible open={isSolicitacoesServicosOpen} onOpenChange={setIsSolicitacoesServicosOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <ClipboardList className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight">Solicitações de Serviços</span>
                                    </div>
                                    {isSolicitacoesServicosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenu>
                                    {solicitacoesServicosItems.map(item => <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="h-auto py-2">
                                          <NavLink to={item.url} end className={getNavCls}>
                                            <item.icon className="h-3 w-3 shrink-0" />
                                <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                          </NavLink>
                                        </SidebarMenuButton>
                                      </SidebarMenuItem>)}
                                  </SidebarMenu>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>
                            
                            {/* Gestão de Viagens sub-submenu */}
                            <SidebarMenuItem>
                              <Collapsible open={isGestaoViagensOpen} onOpenChange={setIsGestaoViagensOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <Plane className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight">Gestão de Viagens</span>
                                    </div>
                                    {isGestaoViagensOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenu>
                                    {gestaoViagensItems.map(item => <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="h-auto py-2">
                                          <NavLink to={item.url} end className={getNavCls}>
                                            <item.icon className="h-3 w-3 shrink-0" />
                                <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                          </NavLink>
                                        </SidebarMenuButton>
                                      </SidebarMenuItem>)}
                                  </SidebarMenu>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>
                            
                            {/* Gestão de Veículos sub-submenu */}
                            <SidebarMenuItem>
                              <Collapsible open={isGestaoVeiculosOpen} onOpenChange={setIsGestaoVeiculosOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <Car className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight">Gestão de Veículos</span>
                                    </div>
                                    {isGestaoVeiculosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenu>
                                    {gestaoVeiculosItems.map((item: any) => {
                                      if (item.isSeparator) {
                                        return (
                                          <li key={item.title} className="px-2 py-2">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                              {item.title}
                                            </h4>
                                            <div className="mt-1 h-px bg-border" />
                                          </li>
                                        );
                                      }
                                      return (
                                        <SidebarMenuItem key={item.title}>
                                          <SidebarMenuButton asChild className="h-auto py-2">
                                            <NavLink to={item.url} end className={getNavCls}>
                                              <item.icon className="h-3 w-3 shrink-0" />
                                              <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                            </NavLink>
                                          </SidebarMenuButton>
                                        </SidebarMenuItem>
                                      );
                                    })}
                                  </SidebarMenu>
                                </CollapsibleContent>
                              </Collapsible>
                              </SidebarMenuItem>
                            </SidebarMenu>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Recrutamento & Seleção submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={isRecrutamentoSelecaoOpen} onOpenChange={setIsRecrutamentoSelecaoOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <UserPlus className="h-4 w-4 shrink-0" />
                                <span className="text-sm whitespace-normal break-words leading-tight">Recrutamento & Seleção</span>
                              </div>
                              {isRecrutamentoSelecaoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenu>
                              {recrutamentoSelecaoItems.map(item => <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild className="h-auto py-2">
                                    <NavLink to={item.url} end className={getNavCls}>
                                      <item.icon className="h-3 w-3 shrink-0" />
                            <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                    </NavLink>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>)}
                            </SidebarMenu>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Departamento Pessoal submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={isDepartamentoPessoalOpen} onOpenChange={setIsDepartamentoPessoalOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="text-sm whitespace-normal break-words leading-tight">Departamento Pessoal</span>
                              </div>
                              {isDepartamentoPessoalOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenu>
                              {/* Prestadores de serviço sub-submenu */}
                              <SidebarMenuItem>
                              <Collapsible open={isPrestadoresServicoOpen} onOpenChange={setIsPrestadoresServicoOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <Briefcase className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight">Prestadores de Serviço</span>
                                    </div>
                                    {isPrestadoresServicoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenu>
                                    {prestadoresServicoItems.map(item => <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="h-auto py-2">
                                          <NavLink to={item.url} end className={getNavCls}>
                                            <item.icon className="h-3 w-3 shrink-0" />
                                <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                          </NavLink>
                                        </SidebarMenuButton>
                                      </SidebarMenuItem>)}
                                  </SidebarMenu>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>

                            {/* Colaboradores sub-submenu */}
                            <SidebarMenuItem>
                              <Collapsible open={isColaboradoresOpen} onOpenChange={setIsColaboradoresOpen}>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                      <Users className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight">Colaboradores</span>
                                    </div>
                                    {isColaboradoresOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  <SidebarMenu>
                                    {colaboradoresItems.map(item => <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="h-auto py-2">
                                          <NavLink to={item.url} end className={getNavCls}>
                                            <item.icon className="h-3 w-3 shrink-0" />
                                <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                          </NavLink>
                                        </SidebarMenuButton>
                                      </SidebarMenuItem>)}
                                  </SidebarMenu>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuItem>
                            </SidebarMenu>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>

                      {/* Treinamento & Desenvolvimento submenu */}
                      <SidebarMenuItem>
                        <Collapsible open={isTreinamentoDesenvolvimentoOpen} onOpenChange={setIsTreinamentoDesenvolvimentoOpen}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <GraduationCap className="h-4 w-4 shrink-0" />
                                <span className="text-sm whitespace-normal break-words leading-tight">Treinamento & Desenvolvimento</span>
                              </div>
                              {isTreinamentoDesenvolvimentoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            <SidebarMenu>
                              {treinamentoDesenvolvimentoItems.map(item => <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton asChild className="h-auto py-2">
                                    <NavLink to={item.url} end className={getNavCls}>
                                      <item.icon className="h-3 w-3 shrink-0" />
                                      <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                    </NavLink>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>)}
                            </SidebarMenu>
                          </CollapsibleContent>
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