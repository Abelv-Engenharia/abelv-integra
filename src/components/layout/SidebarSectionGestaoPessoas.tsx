import { useState, useEffect } from "react";
import { ChevronDown, ClipboardList, FileText, CheckSquare, CheckCircle, BarChart3, Plane, FileUp, Database, FilePlus, Car, Briefcase, UserPlus, User, Users, CreditCard, Receipt, Ticket } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
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
  canSee = () => true
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
    prestadores: boolean;
  }>({
    recursos: false,
    solicitacoes: false,
    viagens: false,
    veiculos: false,
    recrutamento: false,
    prestadores: false
  });

  // Auto-expand based on current path - expand only the submenu containing the active page
  useEffect(() => {
    if (currentPath.includes('/gestao-pessoas/')) {
      // Check which submenu contains the active route
      const isSolicitacoes = currentPath.includes('kpi-solicitacoes') || currentPath.includes('solicitacao-servicos') || currentPath.includes('controle-solicitacoes') || currentPath.includes('aprovacao-solicitacoes') || currentPath.includes('relatorios-solicitacoes');
      const isViagens = currentPath.includes('viagens') || currentPath.includes('fatura') || currentPath.includes('faturas');
      const isVeiculos = currentPath.includes('veiculos') || currentPath.includes('veiculo') || currentPath.includes('checklist') || currentPath.includes('rotas') || currentPath.includes('abastecimento') || currentPath.includes('condutor') || currentPath.includes('cartao') || currentPath.includes('pedagio') || currentPath.includes('multa');
      const isRecrutamento = currentPath.includes('recrutamento') || currentPath.includes('vaga') || currentPath.includes('vagas') || currentPath.includes('banco-talentos');
      const isPrestadores = currentPath.includes('prestadores') || currentPath.includes('prestacao-servico') || currentPath.includes('contratos') || currentPath.includes('demonstrativo') || currentPath.includes('ferias') || currentPath.includes('passivos') || currentPath.includes('pessoa-juridica') || currentPath.includes('emissao-nf') || currentPath.includes('aprovacao-nf');

      // Recursos & Benefícios should be open if any of its submenus are active
      const isRecursos = isSolicitacoes || isViagens || isVeiculos;
      const newState = {
        recursos: isRecursos,
        solicitacoes: isSolicitacoes,
        viagens: isViagens,
        veiculos: isVeiculos,
        recrutamento: isRecrutamento,
        prestadores: isPrestadores
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

  // Verificar se usuário tem pelo menos uma permissão de Viagens
  const hasAnyViagensPermission = () => {
    return canSee('gestao_pessoas_viagens_dashboard') || canSee('gestao_pessoas_viagens_cadastrar_fatura') || canSee('gestao_pessoas_viagens_importar_fatura') || canSee('gestao_pessoas_viagens_consultar_faturas') || canSee('gestao_pessoas_viagens_relatorios');
  };

  // Verificar se usuário tem pelo menos uma permissão de Veículos
  const hasAnyVeiculosPermission = () => {
    return canSee('gestao_pessoas_veiculos_dashboard') || canSee('gestao_pessoas_veiculos_consultas') || canSee('gestao_pessoas_veiculos_cadastrar') || canSee('gestao_pessoas_veiculos_multas_cadastrar') || canSee('gestao_pessoas_veiculos_condutores_cadastrar') || canSee('gestao_pessoas_veiculos_cartoes_cadastrar') || canSee('gestao_pessoas_veiculos_pedagios_cadastrar') || canSee('gestao_pessoas_veiculos_checklists_criar') || canSee('gestao_pessoas_veiculos_calculo_rotas') || canSee('gestao_pessoas_veiculos_abastecimento_gerenciar') || canSee('gestao_pessoas_veiculos_relatorios');
  };
  return <Collapsible open={isOpen} onOpenChange={() => toggleMenu("gestao-pessoas")}>
      <SidebarMenu>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
              <div className="flex items-center gap-2 min-w-0">
                <ClipboardList className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Gestão de Pessoas</span>
              </div>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenu className="ml-4 border-l border-sidebar-border">
              {/* Recursos & Benefícios */}
              <Collapsible open={openSubmenus.recursos} onOpenChange={() => toggleSubmenu("recursos")}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                      <div className="flex items-center gap-2 min-w-0">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Recursos & Benefícios</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.recursos ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenu className="ml-4 border-l border-sidebar-border">
                      {/* Solicitações de Serviços */}
                      <Collapsible open={openSubmenus.solicitacoes} onOpenChange={() => toggleSubmenu("solicitacoes")}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">Solicitações</span>
                              </div>
                              <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.solicitacoes ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenu className="ml-4 border-l border-sidebar-border">
                              {canSee('gestao_pessoas_solicitacoes_dashboard') && <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link to="/gestao-pessoas/kpi-solicitacoes" onClick={onLinkClick}>
                                      <BarChart3 className="h-4 w-4" />
                                      <span>Kpi Solicitações</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>}

                              {canSee('gestao_pessoas_solicitacoes_criar') && <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link to="/gestao-pessoas/solicitacao-servicos" onClick={onLinkClick}>
                                      <FileText className="h-4 w-4" />
                                      <span>Solicitação de Serviços</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>}

                              {canSee('gestao_pessoas_solicitacoes_visualizar') && <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link to="/gestao-pessoas/controle-solicitacoes" onClick={onLinkClick}>
                                      <CheckSquare className="h-4 w-4" />
                                      <span>Controle Solicitações</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>}

                              {canSee('gestao_pessoas_solicitacoes_aprovar') && <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link to="/gestao-pessoas/aprovacao-solicitacoes" onClick={onLinkClick}>
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Aprovação Solicitações</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>}

                              {canSee('gestao_pessoas_solicitacoes_relatorios') && <SidebarMenuItem>
                                  <SidebarMenuButton asChild>
                                    <Link to="/gestao-pessoas/relatorios-solicitacoes" onClick={onLinkClick}>
                                      <FileText className="h-4 w-4" />
                                      <span>Relatórios Solicitações</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>}
                            </SidebarMenu>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>

                      {/* Gestão de Viagens - só mostra se tiver pelo menos uma permissão */}
                      {hasAnyViagensPermission() && <Collapsible open={openSubmenus.viagens} onOpenChange={() => toggleSubmenu("viagens")}>
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Plane className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">Viagens</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.viagens ? 'rotate-180' : ''}`} />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenu className="ml-4 border-l border-sidebar-border">
                                {canSee('gestao_pessoas_viagens_dashboard') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/gestao-viagens-dashboard" onClick={onLinkClick}>
                                        <Plane className="h-4 w-4" />
                                        <span>Dashboard Viagens</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_viagens_cadastrar_fatura') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-fatura" onClick={onLinkClick}>
                                        <FilePlus className="h-4 w-4" />
                                        <span>Cadastro Fatura</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_viagens_importar_fatura') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/importar-fatura" onClick={onLinkClick}>
                                        <FileUp className="h-4 w-4" />
                                        <span>Importar Fatura</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_viagens_consultar_faturas') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/consulta-faturas" onClick={onLinkClick}>
                                        <Database className="h-4 w-4" />
                                        <span>Consulta Faturas</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_viagens_relatorios') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/relatorio-viagens" onClick={onLinkClick}>
                                        <FileText className="h-4 w-4" />
                                        <span>Relatório Viagens</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}
                              </SidebarMenu>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>}

                      {/* Gestão de Veículos - só mostra se tiver pelo menos uma permissão */}
                      {hasAnyVeiculosPermission() && <Collapsible open={openSubmenus.veiculos} onOpenChange={() => toggleSubmenu("veiculos")}>
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Car className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">Veículos</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.veiculos ? 'rotate-180' : ''}`} />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenu className="ml-4 border-l border-sidebar-border">
                                {canSee('gestao_pessoas_veiculos_dashboard') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/dashboard-veiculos" onClick={onLinkClick}>
                                        <Car className="h-4 w-4" />
                                        <span>Dashboard</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_consultas') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/consultas-veiculos" onClick={onLinkClick}>
                                        <Database className="h-4 w-4" />
                                        <span>Consultas</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_cadastrar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-veiculo" onClick={onLinkClick}>
                                        <FilePlus className="h-4 w-4" />
                                        <span>Cadastro Veículo</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_multas_cadastrar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-multa" onClick={onLinkClick}>
                                        <Receipt className="h-4 w-4" />
                                        <span>Cadastro Multa</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_condutores_cadastrar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-condutor" onClick={onLinkClick}>
                                        <User className="h-4 w-4" />
                                        <span>Cadastro Condutor</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_cartoes_cadastrar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-cartao" onClick={onLinkClick}>
                                        <CreditCard className="h-4 w-4" />
                                        <span>Cadastro Cartão</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_pedagios_cadastrar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/cadastro-pedagio" onClick={onLinkClick}>
                                        <Ticket className="h-4 w-4" />
                                        <span>Cadastro Pedágio</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_checklists_criar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/checklist-veiculos" onClick={onLinkClick}>
                                        <CheckSquare className="h-4 w-4" />
                                        <span>Checklist Veículos</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_calculo_rotas') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/calculo-rotas" onClick={onLinkClick}>
                                        <FileText className="h-4 w-4" />
                                        <span>Cálculo Rotas</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_abastecimento_gerenciar') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/controle-abastecimento" onClick={onLinkClick}>
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Controle Abastecimento</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}

                                {canSee('gestao_pessoas_veiculos_relatorios') && <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                      <Link to="/gestao-pessoas/relatorios-veiculos" onClick={onLinkClick}>
                                        <FileText className="h-4 w-4" />
                                        <span>Relatórios Veículos</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>}
                              </SidebarMenu>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Recrutamento & Seleção */}
              {['gestao_pessoas_recrutamento_dashboard', 'gestao_pessoas_recrutamento_abertura_vaga', 'gestao_pessoas_recrutamento_gestao_vagas', 'gestao_pessoas_recrutamento_aprovacao_vaga', 'gestao_pessoas_recrutamento_banco_talentos', 'gestao_pessoas_recrutamento_acompanhamento_sla'].some(canSee) && <Collapsible open={openSubmenus.recrutamento} onOpenChange={() => toggleSubmenu("recrutamento")}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                        <div className="flex items-center gap-2 min-w-0">
                          <UserPlus className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Recrutamento & Seleção</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.recrutamento ? 'rotate-180' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenu className="ml-4 border-l border-sidebar-border">
                        {canSee('gestao_pessoas_recrutamento_dashboard') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/dashboard-recrutamento" onClick={onLinkClick}>
                                <BarChart3 className="h-4 w-4" />
                                <span>Dashboard</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_recrutamento_abertura_vaga') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/rh-abertura-vaga" onClick={onLinkClick}>
                                <FilePlus className="h-4 w-4" />
                                <span>Abertura de Vaga</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_recrutamento_gestao_vagas') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/gestao-vagas" onClick={onLinkClick}>
                                <Database className="h-4 w-4" />
                                <span>Gestão de Vagas</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_recrutamento_aprovacao_vaga') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/aprovacao-vaga" onClick={onLinkClick}>
                                <CheckCircle className="h-4 w-4" />
                                <span>Aprovação de Vaga</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_recrutamento_banco_talentos') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/banco-talentos" onClick={onLinkClick}>
                                <Users className="h-4 w-4" />
                                <span>Banco de Talentos</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>}

              {/* Prestadores de Serviço */}
              {['gestao_pessoas_prestadores_dashboard', 'gestao_pessoas_prestadores_cadastrar_pj', 'gestao_pessoas_prestadores_consultar_pj', 'gestao_pessoas_prestadores_editar_pj', 'gestao_pessoas_prestadores_contratos_visualizar', 'gestao_pessoas_prestadores_contratos_criar', 'gestao_pessoas_prestadores_contratos_editar', 'gestao_pessoas_prestadores_demonstrativos', 'gestao_pessoas_prestadores_nf_emitir', 'gestao_pessoas_prestadores_nf_aprovar', 'gestao_pessoas_prestadores_ferias_controlar', 'gestao_pessoas_prestadores_ferias_aprovar', 'gestao_pessoas_prestadores_passivos', 'gestao_pessoas_prestadores_relatorios'].some(canSee) && <Collapsible open={openSubmenus.prestadores} onOpenChange={() => toggleSubmenu("prestadores")}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Prestadores de Serviço</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${openSubmenus.prestadores ? 'rotate-180' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenu className="ml-4 border-l border-sidebar-border">
                        {canSee('gestao_pessoas_prestadores_dashboard') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/dashboard-prestadores" onClick={onLinkClick}>
                                <BarChart3 className="h-4 w-4" />
                                <span>Dashboard</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_cadastrar_pj') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/cadastro-pessoa-juridica" onClick={onLinkClick}>
                                <FilePlus className="h-4 w-4" />
                                <span>Cadastro Pessoa Jurídica</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_consultar_pj') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/consulta-prestadores" onClick={onLinkClick}>
                                <Database className="h-4 w-4" />
                                <span>Consulta Prestadores</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_contratos_criar') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/emissao-contrato-prestacao-servico" onClick={onLinkClick}>
                                <FileText className="h-4 w-4" />
                                <span>Emissão Contrato</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_contratos_visualizar') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/consulta-contratos" onClick={onLinkClick}>
                                <Database className="h-4 w-4" />
                                <span>Consulta Contratos</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_demonstrativos') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/demonstrativo-prestacao-servico" onClick={onLinkClick}>
                                <FileText className="h-4 w-4" />
                                <span>Demonstrativo</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_nf_emitir') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/cadastro-emissao-nf" onClick={onLinkClick}>
                                <FilePlus className="h-4 w-4" />
                                <span>Cadastro Emissão Nf</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_nf_aprovar') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/aprovacao-nf" onClick={onLinkClick}>
                                <CheckCircle className="h-4 w-4" />
                                <span>Aprovação Nf</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_ferias_controlar') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/controle-ferias" onClick={onLinkClick}>
                                <CheckSquare className="h-4 w-4" />
                                <span>Controle Férias</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_ferias_aprovar') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/aprovacao-ferias" onClick={onLinkClick}>
                                <CheckCircle className="h-4 w-4" />
                                <span>Aprovação Férias</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_passivos') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/controle-passivos" onClick={onLinkClick}>
                                <FileText className="h-4 w-4" />
                                <span>Controle Passivos</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}

                        {canSee('gestao_pessoas_prestadores_relatorios') && <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                              <Link to="/gestao-pessoas/relatorios-prestadores" onClick={onLinkClick}>
                                <BarChart3 className="h-4 w-4" />
                                <span>Relatórios</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </SidebarMenu>
    </Collapsible>;
}