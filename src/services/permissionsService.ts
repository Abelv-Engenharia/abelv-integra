import { PermissoesCustomizadas } from '@/types/users';

export interface PermissionOption {
  key: string;
  label: string;
  description?: string;
}

export interface PermissionCategory {
  name: string;
  icon?: string;
  permissions: PermissionOption[];
}

// Mapeamento completo de todas as páginas da aplicação
export const COMPLETE_PERMISSIONS: PermissionCategory[] = [
  {
    name: 'Dashboard',
    permissions: [
      { key: 'dashboard', label: 'Dashboard Principal' }
    ]
  },
  {
    name: 'Desvios',
    permissions: [
      { key: 'desvios_dashboard', label: 'Dashboard' },
      { key: 'desvios_cadastro', label: 'Cadastro' },
      { key: 'desvios_consulta', label: 'Consulta' },
      { key: 'desvios_nao_conformidade', label: 'Não Conformidade' },
      { key: 'desvios_insights', label: 'Insights' },
      { key: 'desvios_editar', label: 'Editar' },
      { key: 'desvios_excluir', label: 'Excluir' }
    ]
  },
  {
    name: 'Ocorrências',
    permissions: [
      { key: 'ocorrencias_dashboard', label: 'Dashboard' },
      { key: 'ocorrencias_cadastro', label: 'Cadastro' },
      { key: 'ocorrencias_consulta', label: 'Consulta' },
      { key: 'ocorrencias_visualizacao', label: 'Visualização' },
      { key: 'ocorrencias_detalhes', label: 'Detalhes' },
      { key: 'ocorrencias_edicao', label: 'Edição' },
      { key: 'ocorrencias_excluir', label: 'Excluir' },
      { key: 'ocorrencias_atualizar_status', label: 'Atualizar Status' }
    ]
  },
  {
    name: 'Treinamentos',
    permissions: [
      { key: 'treinamentos_dashboard', label: 'Dashboard' },
      { key: 'treinamentos_execucao', label: 'Execução' },
      { key: 'treinamentos_consulta', label: 'Consulta' },
      { key: 'treinamentos_cracha', label: 'Crachá' },
      { key: 'treinamentos_normativo', label: 'Normativo' },
      { key: 'treinamentos_editar_execucao', label: 'Editar Execução' },
      { key: 'treinamentos_visualizar_execucao', label: 'Visualizar Execução' },
      { key: 'treinamentos_excluir', label: 'Excluir' }
    ]
  },
  {
    name: 'Tarefas',
    permissions: [
      { key: 'tarefas_dashboard', label: 'Dashboard' },
      { key: 'tarefas_cadastro', label: 'Cadastro' },
      { key: 'tarefas_minhas_tarefas', label: 'Minhas Tarefas' },
      { key: 'tarefas_detalhe', label: 'Detalhe' },
      { key: 'tarefas_editar', label: 'Editar' }
    ]
  },
  {
    name: 'HSA - Hora da Segurança',
    permissions: [
      { key: 'hora_seguranca_dashboard', label: 'Dashboard' },
      { key: 'hora_seguranca_cadastro_inspecao', label: 'Cadastro Inspeções' },
      { key: 'hora_seguranca_acompanhamento', label: 'Acompanhamento' },
      { key: 'hora_seguranca_cadastro_nao_programada', label: 'Não Programadas' },
      { key: 'hora_seguranca_cadastro_hsa', label: 'Cadastro HSA' },
      { key: 'hora_seguranca_nao_programada_hsa', label: 'Não Programada HSA' },
      { key: 'hora_seguranca_painel_execucao_hsa', label: 'Painel Execução' },
      { key: 'hora_seguranca_agenda', label: 'Agenda HSA' }
    ]
  },
  {
    name: 'IDSMS',
    permissions: [
      { key: 'idsms_dashboard', label: 'Dashboard' },
      { key: 'idsms_indicadores', label: 'Indicadores' },
      { key: 'idsms_ht', label: 'HT - Horas Trabalhadas' },
      { key: 'idsms_hsa', label: 'HSA' },
      { key: 'idsms_iid', label: 'IID' },
      { key: 'idsms_ipom', label: 'IPOM' },
      { key: 'idsms_indice_reativo', label: 'Índice Reativo' },
      { key: 'idsms_inspecao_alta_lideranca', label: 'Inspeção Alta Liderança' },
      { key: 'idsms_inspecao_gestao_sms', label: 'Inspeção Gestão SMS' }
    ]
  },
  {
    name: 'GRO',
    permissions: [
      { key: 'gro_dashboard', label: 'Dashboard' },
      { key: 'gro_cadastro', label: 'Cadastro' },
      { key: 'gro_consulta', label: 'Consulta' },
      { key: 'gro_avaliacao_riscos', label: 'Avaliação de Riscos' },
      { key: 'gro_cadastro_perigos', label: 'Cadastro de Perigos' },
      { key: 'gro_pgr', label: 'PGR' }
    ]
  },
  {
    name: 'Medidas Disciplinares',
    permissions: [
      { key: 'medidas_disciplinares_dashboard', label: 'Dashboard' },
      { key: 'medidas_disciplinares_cadastro', label: 'Cadastro' },
      { key: 'medidas_disciplinares_consulta', label: 'Consulta' }
    ]
  },
  {
    name: 'Inspeção SMS',
    permissions: [
      { key: 'inspecao_sms_dashboard', label: 'Dashboard' },
      { key: 'inspecao_sms_cadastro', label: 'Cadastrar' },
      { key: 'inspecao_sms_consulta', label: 'Consulta' },
      { key: 'inspecao_sms_visualizar', label: 'Visualizar' },
      { key: 'inspecao_sms_excluir', label: 'Excluir' },
      { key: 'inspecao_sms_hora_seguranca', label: 'Hora Segurança' }
    ]
  },
  {
    name: 'Prevenção de Incêndio',
    permissions: [
      { key: 'prevencao_incendio_dashboard', label: 'Dashboard' },
      { key: 'prevencao_incendio_cadastro_extintores', label: 'Cadastro Extintores' },
      { key: 'prevencao_incendio_inspecao_extintores', label: 'Inspeção Extintores' },
      { key: 'prevencao_incendio_consulta_inspecoes', label: 'Consulta Inspeções' },
      { key: 'prevencao_incendio_consulta_extintores', label: 'Consulta Extintores' },
      { key: 'prevencao_incendio_visualizar_inspecao', label: 'Visualizar Inspeção' }
    ]
  },
  {
    name: 'SMS - Relatórios',
    permissions: [
      { key: 'relatorios_dashboard', label: 'Relatórios Dashboard' },
      { key: 'relatorios_idsms', label: 'Relatórios IDSMS' },
      { key: 'relatorios_ocorrencias', label: 'Relatórios Ocorrências' },
      { key: 'relatorios_desvios', label: 'Relatórios Desvios' },
      { key: 'relatorios_treinamentos', label: 'Relatórios Treinamentos' },
      { key: 'relatorios_hsa', label: 'Relatórios HSA' }
    ]
  },
  {
    name: 'Comunicados',
    permissions: [
      { key: 'comunicados_cadastro', label: 'Cadastro' },
      { key: 'comunicados_consulta', label: 'Consulta' },
      { key: 'comunicados_detalhe', label: 'Detalhe' },
      { key: 'comunicados_edicao', label: 'Edição' },
      { key: 'comunicados_meus_comunicados', label: 'Meus Comunicados' }
    ]
  },
  {
    name: 'Administração - Usuários',
    permissions: [
      { key: 'admin_usuarios', label: 'Gerenciar Usuários' },
      { key: 'admin_usuarios_direct', label: 'Usuários Diretos' },
      { key: 'admin_usuarios_auth', label: 'Usuários Auth' },
      { key: 'admin_criar_usuario', label: 'Criar Usuário' },
      { key: 'admin_criar_usuario_direct', label: 'Criar Usuário Direto' }
    ]
  },
  {
    name: 'Configuração por Módulos - Engenharia Matricial',
    permissions: [
      { key: 'config_modulo_engenharia_matricial_usuarios', label: 'Usuários Engenharia Matricial' }
    ]
  },
  {
    name: 'Administração - Empresas',
    permissions: [
      { key: 'admin_empresas', label: 'Empresas' },
      { key: 'admin_ccas', label: 'CCAs' },
      { key: 'admin_engenheiros', label: 'Engenheiros' },
      { key: 'admin_supervisores', label: 'Supervisores' },
      { key: 'admin_encarregados', label: 'Encarregados' }
    ]
  },
  {
    name: 'Administração - Funcionários',
    permissions: [
      { key: 'admin_funcionarios', label: 'Funcionários' },
      { key: 'admin_importacao_funcionarios', label: 'Importação Funcionários' }
    ]
  },
  {
    name: 'Administração - Sistema',
    permissions: [
      { key: 'admin_configuracoes', label: 'Configurações' },
      { key: 'admin_logo', label: 'Logo' },
      { key: 'admin_templates', label: 'Templates' },
      { key: 'admin_checklists', label: 'Checklists' },
      { key: 'admin_metas_indicadores', label: 'Metas e Indicadores' },
      { key: 'admin_registro_hht', label: 'Registro HHT' },
      { key: 'configuracao_emails', label: 'Configuração Emails' },
      { key: 'upload_tutoriais', label: 'Upload Tutoriais' }
    ]
  },
  {
    name: 'Administração - Importações',
    permissions: [
      { key: 'admin_importacao_execucao_treinamentos', label: 'Importação Execução Treinamentos' },
      { key: 'admin_importacao_hsa', label: 'Importação HSA' },
      { key: 'admin_exportacao_dados', label: 'Exportação Dados' }
    ]
  },
  {
    name: 'Conta e Suporte',
    permissions: [
      { key: 'account_profile', label: 'Perfil da Conta' },
      { key: 'account_settings', label: 'Configurações da Conta' },
      { key: 'account_support', label: 'Suporte da Conta' },
      { key: 'suporte', label: 'Suporte Geral' }
    ]
  },
  {
    name: 'Suprimentos - Estoque',
    permissions: [
      { key: 'estoque_acesso', label: 'Acesso ao Estoque', description: 'Visualizar módulo de controle de estoque' },
      { key: 'estoque_dashboard', label: 'Dashboard' },
      { key: 'estoque_apoio', label: 'Apoio - Menu Principal', description: 'Acesso ao menu Apoio' },
      { key: 'estoque_apoio_eap', label: 'Apoio - EAP' },
      { key: 'estoque_apoio_almoxarifados', label: 'Apoio - Almoxarifados' },
      { key: 'estoque_apoio_configuracoes_arcabouco', label: 'Apoio - Configurações Arcabouço' },
      { key: 'estoque_apoio_relatorio_eap', label: 'Apoio - Relatório de EAP' },
      { key: 'estoque_apoio_relacao_almoxarifados', label: 'Apoio - Relação de Almoxarifados' },
      { key: 'estoque_entradas', label: 'Entradas - Menu Principal', description: 'Acesso ao menu Entradas' },
      { key: 'estoque_entradas_entrada_materiais', label: 'Entradas - Entrada de Materiais' },
      { key: 'estoque_entradas_relatorio_entrada', label: 'Entradas - Relatório de Entrada' },
      { key: 'estoque_entradas_relacao_entradas', label: 'Entradas - Relação de Entradas' },
      { key: 'estoque_requisicoes', label: 'Requisições - Menu Principal', description: 'Acesso ao menu Requisições' },
      { key: 'estoque_requisicoes_requisicao_materiais', label: 'Requisições - Requisição de Materiais' },
      { key: 'estoque_requisicoes_devolucao_materiais', label: 'Requisições - Devolução de Materiais' },
      { key: 'estoque_requisicoes_relatorio_requisicao', label: 'Requisições - Relatório de Requisição' },
      { key: 'estoque_requisicoes_relacao_requisicoes', label: 'Requisições - Relação de Requisições' },
      { key: 'estoque_requisicoes_relacao_devolucoes', label: 'Requisições - Relação de Devoluções' },
      { key: 'estoque_transferencias', label: 'Transferências - Menu Principal', description: 'Acesso ao menu Transferências' },
      { key: 'estoque_transferencias_transferencia_almoxarifados', label: 'Transferências - Entre Almoxarifados' },
      { key: 'estoque_transferencias_transferencia_ccas', label: 'Transferências - Entre CCAs' },
      { key: 'estoque_transferencias_relatorio_transferencias', label: 'Transferências - Relatório' },
      { key: 'estoque_transferencias_relacao_transferencias', label: 'Transferências - Relação' },
      { key: 'estoque_beneficiamento', label: 'Beneficiamento - Menu Principal', description: 'Acesso ao menu Beneficiamento' },
      { key: 'estoque_beneficiamento_envio', label: 'Beneficiamento - Envio' },
      { key: 'estoque_beneficiamento_retorno', label: 'Beneficiamento - Retorno' },
      { key: 'estoque_beneficiamento_relacao_materiais', label: 'Beneficiamento - Relação de Materiais' }
    ]
  },
  {
    name: 'Engenharia Matricial',
    permissions: [
      { key: 'em_ordens_servico', label: 'Ordens de Serviço' },
      { key: 'em_os_abertas', label: 'Abertura de OS' },
      { key: 'em_os_planejamento', label: 'OS em Planejamento' },
      { key: 'em_os_aguardando_aceite', label: 'OS Aguardando Aceite' },
      { key: 'em_os_execucao', label: 'OS em Execução' },
      { key: 'em_os_fechamento', label: 'OS em Fechamento' },
      { key: 'em_os_aguardando_aceite_fechamento', label: 'Aguardando Aceite Fechamento' },
      { key: 'em_os_concluidas', label: 'OS Concluídas' },
      { key: 'em_replanejamento', label: 'Replanejamento' },
      { key: 'em_aceite_replanejamento', label: 'Aceite Replanejamento' },
      { key: 'em_relatorios_anual', label: 'Relatório Anual' },
      { key: 'em_relatorios_eletrica', label: 'Relatórios EM Elétrica' },
      { key: 'em_relatorios_mecanica', label: 'Relatórios EM Mecânica' },
      { key: 'em_relatorios_departamento', label: 'Relatórios EM Departamento' }
    ]
  },
  {
    name: 'Comercial - Repositório de Documentos',
    permissions: [
      { key: 'comercial_repositorio_consulta', label: 'Consulta de Documentos' },
      { key: 'comercial_repositorio_empresarial', label: 'Empresarial' },
      { key: 'comercial_repositorio_habilitacao', label: 'Habilitação' },
      { key: 'comercial_repositorio_financeiro', label: 'Financeiro' },
      { key: 'comercial_repositorio_certidoes', label: 'Certidões' },
      { key: 'comercial_repositorio_politicas', label: 'Políticas e Código de Conduta' }
    ]
  },
  {
    name: 'Comercial - Controle Comercial',
    permissions: [
      { key: 'comercial_controle_dashboard', label: 'Dashboard' },
      { key: 'comercial_controle_cadastro', label: 'Cadastro de Proposta' },
      { key: 'comercial_controle_registros', label: 'Consulta de Propostas Emitidas' },
      { key: 'comercial_controle_metas', label: 'Metas Anuais' },
      { key: 'comercial_controle_performance', label: 'Performance de Vendas' },
      { key: 'comercial_controle_relatorios', label: 'Relatórios' },
      { key: 'comercial_controle_cadastros_segmentos', label: 'Alteração - Segmentos' },
      { key: 'comercial_controle_cadastros_vendedores', label: 'Alteração - Vendedores' }
    ]
  },
  {
    name: 'Gestão de Pessoas - Solicitações de Serviços',
    permissions: [
      { key: 'gestao_pessoas_solicitacoes_dashboard', label: 'Dashboard' },
      { key: 'gestao_pessoas_solicitacoes_criar', label: 'Criar Solicitação' },
      { key: 'gestao_pessoas_solicitacoes_visualizar', label: 'Visualizar Solicitações' },
      { key: 'gestao_pessoas_solicitacoes_editar', label: 'Editar Solicitação' },
      { key: 'gestao_pessoas_solicitacoes_excluir', label: 'Excluir Solicitação' },
      { key: 'gestao_pessoas_solicitacoes_aprovar', label: 'Aprovar Solicitações' },
      { key: 'gestao_pessoas_solicitacoes_reprovar', label: 'Reprovar Solicitações' },
      { key: 'gestao_pessoas_solicitacoes_relatorios', label: 'Relatórios' }
    ]
  },
  {
    name: 'Gestão de Pessoas - Viagens',
    permissions: [
      { key: 'gestao_pessoas_viagens_dashboard', label: 'Dashboard' },
      { key: 'gestao_pessoas_viagens_cadastrar_fatura', label: 'Cadastrar Fatura' },
      { key: 'gestao_pessoas_viagens_importar_fatura', label: 'Importar Fatura' },
      { key: 'gestao_pessoas_viagens_consultar_faturas', label: 'Consultar Faturas' },
      { key: 'gestao_pessoas_viagens_relatorios', label: 'Relatórios' }
    ]
  },
  {
    name: 'Gestão de Pessoas - Veículos',
    permissions: [
      { key: 'gestao_pessoas_veiculos_dashboard', label: 'Dashboard' },
      { key: 'gestao_pessoas_veiculos_cadastrar', label: 'Cadastrar Veículo' },
      { key: 'gestao_pessoas_veiculos_editar', label: 'Editar Veículo' },
      { key: 'gestao_pessoas_veiculos_visualizar', label: 'Visualizar Veículos' },
      { key: 'gestao_pessoas_veiculos_excluir', label: 'Excluir Veículo' },
      { key: 'gestao_pessoas_veiculos_consultas', label: 'Consultas Veículos' },
      { key: 'gestao_pessoas_veiculos_multas_cadastrar', label: 'Cadastrar Multas' },
      { key: 'gestao_pessoas_veiculos_multas_visualizar', label: 'Visualizar Multas' },
      { key: 'gestao_pessoas_veiculos_multas_editar', label: 'Editar Multas' },
      { key: 'gestao_pessoas_veiculos_condutores_cadastrar', label: 'Cadastrar Condutores' },
      { key: 'gestao_pessoas_veiculos_condutores_visualizar', label: 'Visualizar Condutores' },
      { key: 'gestao_pessoas_veiculos_condutores_editar', label: 'Editar Condutores' },
      { key: 'gestao_pessoas_veiculos_cartoes_cadastrar', label: 'Cadastrar Cartões' },
      { key: 'gestao_pessoas_veiculos_cartoes_visualizar', label: 'Visualizar Cartões' },
      { key: 'gestao_pessoas_veiculos_pedagios_cadastrar', label: 'Cadastrar Pedágios' },
      { key: 'gestao_pessoas_veiculos_pedagios_visualizar', label: 'Visualizar Pedágios' },
      { key: 'gestao_pessoas_veiculos_checklists_criar', label: 'Criar Checklists' },
      { key: 'gestao_pessoas_veiculos_checklists_visualizar', label: 'Visualizar Checklists' },
      { key: 'gestao_pessoas_veiculos_abastecimento_gerenciar', label: 'Gerenciar Abastecimento' },
      { key: 'gestao_pessoas_veiculos_relatorios', label: 'Relatórios' }
    ]
  },
  {
    name: 'Gestão de Pessoas - Recrutamento & Seleção',
    permissions: [
      { key: 'gestao_pessoas_recrutamento_dashboard', label: 'Dashboard' },
      { key: 'gestao_pessoas_recrutamento_abertura_vaga', label: 'Abertura de Vaga' },
      { key: 'gestao_pessoas_recrutamento_gestao_vagas', label: 'Gestão de Vagas' },
      { key: 'gestao_pessoas_recrutamento_aprovacao_vaga', label: 'Aprovação de Vaga' },
      { key: 'gestao_pessoas_recrutamento_banco_talentos', label: 'Banco de Talentos' },
      { key: 'gestao_pessoas_recrutamento_acompanhamento_sla', label: 'Acompanhamento SLA' }
    ]
  },
  {
    name: 'Gestão de Pessoas - Prestadores de Serviço',
    permissions: [
      { key: 'gestao_pessoas_prestadores_dashboard', label: 'Dashboard' },
      { key: 'gestao_pessoas_prestadores_cadastrar_pj', label: 'Cadastrar Pessoa Jurídica' },
      { key: 'gestao_pessoas_prestadores_consultar_pj', label: 'Consultar Prestadores' },
      { key: 'gestao_pessoas_prestadores_editar_pj', label: 'Editar Prestador' },
      { key: 'gestao_pessoas_prestadores_contratos_visualizar', label: 'Visualizar Contratos' },
      { key: 'gestao_pessoas_prestadores_contratos_criar', label: 'Criar Contrato' },
      { key: 'gestao_pessoas_prestadores_contratos_editar', label: 'Editar Contrato' },
      { key: 'gestao_pessoas_prestadores_demonstrativos', label: 'Demonstrativos' },
      { key: 'gestao_pessoas_prestadores_nf_emitir', label: 'Emitir Nota Fiscal' },
      { key: 'gestao_pessoas_prestadores_nf_aprovar', label: 'Aprovar Nota Fiscal' },
      { key: 'gestao_pessoas_prestadores_ferias_controlar', label: 'Controlar Férias' },
      { key: 'gestao_pessoas_prestadores_ferias_aprovar', label: 'Aprovar Férias' },
      { key: 'gestao_pessoas_prestadores_passivos', label: 'Controle de Passivos' },
      { key: 'gestao_pessoas_prestadores_relatorios', label: 'Relatórios' }
    ]
  },
];

// Função para converter permissões customizadas em array de slugs para menus_sidebar
export function convertPermissionsToMenusSidebar(permissions: PermissoesCustomizadas): string[] {
  const menusSidebar: string[] = [];
  
  Object.entries(permissions).forEach(([key, value]) => {
    if (value === true) {
      menusSidebar.push(key);
    }
  });
  
  return menusSidebar;
}

// Função para converter menus_sidebar em permissões customizadas
export function convertMenusSidebarToPermissions(menusSidebar: string[]): PermissoesCustomizadas {
  const permissions: PermissoesCustomizadas = {};
  
  // Inicializar todas as permissões como false
  COMPLETE_PERMISSIONS.forEach(category => {
    category.permissions.forEach(permission => {
      permissions[permission.key] = false;
    });
  });
  
  // Marcar as permissões do usuário como true
  menusSidebar.forEach(slug => {
    if (permissions.hasOwnProperty(slug)) {
      permissions[slug] = true;
    }
  });
  
  return permissions;
}

// Função para obter todas as permissões de uma categoria
export function getAllPermissionsFromCategory(categoryName: string): string[] {
  const category = COMPLETE_PERMISSIONS.find(cat => cat.name === categoryName);
  return category ? category.permissions.map(p => p.key) : [];
}

// Função para verificar se todas as permissões de uma categoria estão selecionadas
export function areAllPermissionsSelected(categoryName: string, selectedPermissions: string[]): boolean {
  const categoryPermissions = getAllPermissionsFromCategory(categoryName);
  return categoryPermissions.every(permission => selectedPermissions.includes(permission));
}

// Função para verificar se algumas permissões de uma categoria estão selecionadas
export function areSomePermissionsSelected(categoryName: string, selectedPermissions: string[]): boolean {
  const categoryPermissions = getAllPermissionsFromCategory(categoryName);
  return categoryPermissions.some(permission => selectedPermissions.includes(permission));
}