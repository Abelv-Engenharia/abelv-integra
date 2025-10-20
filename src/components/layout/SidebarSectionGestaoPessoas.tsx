import { useState, useEffect } from "react";
import { Home, Users, Building2, UserCog, Gift, UserPlus, FileText, GraduationCap, Briefcase, Building, Car, BarChart3, ClipboardList, ChevronDown, ChevronRight, Clock, CheckSquare, MapPin, Plane, Receipt, Fuel, FilePlus, Calendar, Calculator, Database, Kanban, FileSpreadsheet, AlertTriangle, User, CreditCard, Route, Search, LayoutGrid } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick: () => void;
  canSee?: (slug: string) => boolean;
}

const solicitacoesServicosItems = [
  { title: "Solicitação de serviços", url: "/gestao-pessoas/solicitacao-servicos", icon: ClipboardList },
  { title: "Controle de solicitações", url: "/gestao-pessoas/controle-solicitacoes", icon: BarChart3 },
  { title: "Aprovação de solicitações", url: "/gestao-pessoas/aprovacao-solicitacoes", icon: CheckSquare },
  { title: "Relatórios de solicitações", url: "/gestao-pessoas/relatorios-solicitacoes", icon: FileText }
];

const recursosBeneficiosItems = [
  { title: "Kpi", url: "/gestao-pessoas/kpi-solicitacoes", icon: BarChart3 }
];

const gestaoViagensItems = [
  { title: "Dashboard de viagens", url: "/gestao-pessoas/gestao-viagens-dashboard", icon: BarChart3 },
  { title: "Cadastro de fatura", url: "/gestao-pessoas/cadastro-fatura", icon: FilePlus },
  { title: "Importar fatura", url: "/gestao-pessoas/importar-fatura", icon: FileSpreadsheet },
  { title: "Consulta de faturas", url: "/gestao-pessoas/consulta-faturas", icon: Database },
  { title: "Relatório de viagens", url: "/gestao-pessoas/relatorio-viagens", icon: MapPin }
];

const gestaoVeiculosItems = [
  { title: "Dashboard", url: "/gestao-pessoas/dashboard-veiculos", icon: BarChart3 },
  { title: "Relatórios", url: "/gestao-pessoas/relatorios-veiculos", icon: FileText },
  { title: "Checklist", url: "/gestao-pessoas/checklist-veiculos", icon: CheckSquare },
  { title: "Abastecimento", url: "/gestao-pessoas/controle-abastecimento", icon: Fuel },
  { title: "Cálculo de rotas", url: "/gestao-pessoas/calculo-rotas", icon: Route },
  { title: "Cadastro de veículo", url: "/gestao-pessoas/cadastro-veiculo", icon: Car },
  { title: "Cadastro de multa", url: "/gestao-pessoas/cadastro-multa", icon: AlertTriangle },
  { title: "Cadastro de condutor", url: "/gestao-pessoas/cadastro-condutor", icon: User },
  { title: "Cadastro de cartão", url: "/gestao-pessoas/cadastro-cartao-abastecimento", icon: CreditCard },
  { title: "Cadastro de pedágio", url: "/gestao-pessoas/cadastro-pedagio-estacionamento", icon: MapPin },
  { title: "Consultas", url: "/gestao-pessoas/consultas-veiculos", icon: Search }
];

const recrutamentoSelecaoItems = [
  { title: "Dashboard", url: "/gestao-pessoas/dashboard-recrutamento", icon: BarChart3 },
  { title: "Abertura de vaga", url: "/gestao-pessoas/rh-abertura-vaga", icon: UserPlus },
  { title: "Aprovação de vaga", url: "/gestao-pessoas/aprovacao-vaga", icon: CheckSquare },
  { title: "Gestão de vagas", url: "/gestao-pessoas/gestao-vagas", icon: LayoutGrid },
  { title: "Banco de talentos", url: "/gestao-pessoas/banco-talentos", icon: Database }
];

const prestadoresServicoItems = [
  { title: "Dashboard", url: "/gestao-pessoas/dashboard-prestadores", icon: BarChart3 },
  { title: "Cadastro de pessoa jurídica", url: "/gestao-pessoas/cadastro-pessoa-juridica", icon: Building },
  { title: "Consulta de prestadores", url: "/gestao-pessoas/consulta-prestadores", icon: Users },
  { title: "Emissão de contrato", url: "/gestao-pessoas/emissao-contrato-prestacao-servico", icon: FileText },
  { title: "Consulta de contratos", url: "/gestao-pessoas/consulta-contratos", icon: Search },
  { title: "Demonstrativo de prestação de serviço", url: "/gestao-pessoas/demonstrativo-prestacao-servico", icon: FileText },
  { title: "Cadastro de emissão de nf", url: "/gestao-pessoas/cadastro-emissao-nf", icon: FilePlus },
  { title: "Aprovação de nf", url: "/gestao-pessoas/aprovacao-nf", icon: CheckSquare },
  { title: "Solicitação de férias", url: "/gestao-pessoas/controle-ferias", icon: Calendar },
  { title: "Aprovação de férias", url: "/gestao-pessoas/aprovacao-ferias", icon: CheckSquare },
  { title: "Controle de passivos", url: "/gestao-pessoas/controle-passivos", icon: Calculator },
  { title: "Relatórios", url: "/gestao-pessoas/relatorios-prestadores", icon: BarChart3 }
];

export default function SidebarSectionGestaoPessoas({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isRouteActive = (items: any[]) => items.some(item => currentPath === item.url);
  
  const [isSolicitacoesServicosOpen, setIsSolicitacoesServicosOpen] = useState(false);
  const [isRecursosBeneficiosOpen, setIsRecursosBeneficiosOpen] = useState(false);
  const [isGestaoViagensOpen, setIsGestaoViagensOpen] = useState(false);
  const [isGestaoVeiculosOpen, setIsGestaoVeiculosOpen] = useState(false);
  const [isRecrutamentoSelecaoOpen, setIsRecrutamentoSelecaoOpen] = useState(false);
  const [isDepartamentoPessoalOpen, setIsDepartamentoPessoalOpen] = useState(false);
  const [isPrestadoresServicoOpen, setIsPrestadoresServicoOpen] = useState(false);
  
  useEffect(() => {
    setIsRecursosBeneficiosOpen(false);
    setIsSolicitacoesServicosOpen(false);
    setIsGestaoViagensOpen(false);
    setIsGestaoVeiculosOpen(false);
    setIsRecrutamentoSelecaoOpen(false);
    setIsDepartamentoPessoalOpen(false);
    setIsPrestadoresServicoOpen(false);
    
    if (isRouteActive(solicitacoesServicosItems)) {
      setIsRecursosBeneficiosOpen(true);
      setIsSolicitacoesServicosOpen(true);
      return;
    }
    
    if (isRouteActive(recursosBeneficiosItems)) {
      setIsRecursosBeneficiosOpen(true);
      return;
    }
    
    if (isRouteActive(gestaoViagensItems)) {
      setIsRecursosBeneficiosOpen(true);
      setIsGestaoViagensOpen(true);
      return;
    }
    
    if (isRouteActive(gestaoVeiculosItems)) {
      setIsRecursosBeneficiosOpen(true);
      setIsGestaoVeiculosOpen(true);
      return;
    }
    
    if (isRouteActive(recrutamentoSelecaoItems)) {
      setIsRecrutamentoSelecaoOpen(true);
      return;
    }
    
    if (isRouteActive(prestadoresServicoItems)) {
      setIsDepartamentoPessoalOpen(true);
      setIsPrestadoresServicoOpen(true);
      return;
    }
  }, [currentPath]);
  
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 ${
      isActive 
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant" 
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <SidebarMenuItem>
      <Collapsible 
        open={openMenu === "gestao-pessoas"} 
        onOpenChange={() => toggleMenu("gestao-pessoas")}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <UserCog className="h-5 w-5 shrink-0" />
              <span className="text-sm whitespace-normal break-words leading-tight">Gestão de pessoas</span>
            </div>
            {openMenu === "gestao-pessoas" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="ml-4 mt-1 space-y-1">
          {/* Dashboard Principal */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/gestao-pessoas" end className={getNavCls} onClick={onLinkClick}>
                <Home className="h-4 w-4 shrink-0" />
                <span className="text-sm whitespace-normal break-words leading-tight">Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Recursos & Benefícios */}
          <SidebarMenuItem>
            <Collapsible open={isRecursosBeneficiosOpen} onOpenChange={setIsRecursosBeneficiosOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Gift className="h-4 w-4 shrink-0" />
                    <span className="text-sm whitespace-normal break-words leading-tight">Recursos & benefícios</span>
                  </div>
                  {isRecursosBeneficiosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                <SidebarMenu>
                  {recursosBeneficiosItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto py-2">
                        <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                          <item.icon className="h-3 w-3 shrink-0" />
                          <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Solicitações de Serviços */}
                  <SidebarMenuItem>
                    <Collapsible open={isSolicitacoesServicosOpen} onOpenChange={setIsSolicitacoesServicosOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <ClipboardList className="h-3 w-3 shrink-0" />
                            <span className="text-xs whitespace-normal break-words leading-tight">Solicitações de serviços</span>
                          </div>
                          {isSolicitacoesServicosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        <SidebarMenu>
                          {solicitacoesServicosItems.map(item => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild className="h-auto py-2">
                                <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                                  <item.icon className="h-3 w-3 shrink-0" />
                                  <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  
                  {/* Gestão de Viagens */}
                  <SidebarMenuItem>
                    <Collapsible open={isGestaoViagensOpen} onOpenChange={setIsGestaoViagensOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <Plane className="h-3 w-3 shrink-0" />
                            <span className="text-xs whitespace-normal break-words leading-tight">Gestão de viagens</span>
                          </div>
                          {isGestaoViagensOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        <SidebarMenu>
                          {gestaoViagensItems.map(item => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild className="h-auto py-2">
                                <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                                  <item.icon className="h-3 w-3 shrink-0" />
                                  <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                  
                  {/* Gestão de Veículos */}
                  <SidebarMenuItem>
                    <Collapsible open={isGestaoVeiculosOpen} onOpenChange={setIsGestaoVeiculosOpen}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <Car className="h-3 w-3 shrink-0" />
                            <span className="text-xs whitespace-normal break-words leading-tight">Gestão de veículos</span>
                          </div>
                          {isGestaoVeiculosOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        <SidebarMenu>
                          {gestaoVeiculosItems.map((item: any) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild className="h-auto py-2">
                                <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                                  <item.icon className="h-3 w-3 shrink-0" />
                                  <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Recrutamento e Seleção */}
          <SidebarMenuItem>
            <Collapsible open={isRecrutamentoSelecaoOpen} onOpenChange={setIsRecrutamentoSelecaoOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span className="text-sm whitespace-normal break-words leading-tight">Recrutamento e seleção</span>
                  </div>
                  {isRecrutamentoSelecaoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                <SidebarMenu>
                  {recrutamentoSelecaoItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto py-2">
                        <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                          <item.icon className="h-3 w-3 shrink-0" />
                          <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>

          {/* Departamento Pessoal */}
          <SidebarMenuItem>
            <Collapsible open={isDepartamentoPessoalOpen} onOpenChange={setIsDepartamentoPessoalOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span className="text-sm whitespace-normal break-words leading-tight">Departamento pessoal</span>
                  </div>
                  {isDepartamentoPessoalOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {/* Prestadores de Serviço */}
                <SidebarMenuItem>
                  <Collapsible open={isPrestadoresServicoOpen} onOpenChange={setIsPrestadoresServicoOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="text-xs whitespace-normal break-words leading-tight">Prestadores de serviço</span>
                        </div>
                        {isPrestadoresServicoOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      <SidebarMenu>
                        {prestadoresServicoItems.map(item => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="h-auto py-2">
                              <NavLink to={item.url} end className={getNavCls} onClick={onLinkClick}>
                                <item.icon className="h-3 w-3 shrink-0" />
                                <span className="text-xs whitespace-normal break-words leading-tight !overflow-visible">{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
