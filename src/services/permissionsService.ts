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
    name: 'Relatórios',
    permissions: [
      { key: 'relatorios_dashboard', label: 'Dashboard' },
      { key: 'relatorios_ocorrencias', label: 'Ocorrências' },
      { key: 'relatorios_desvios', label: 'Desvios' },
      { key: 'relatorios_treinamentos', label: 'Treinamentos' },
      { key: 'relatorios_idsms', label: 'IDSMS' },
      { key: 'relatorios_hsa', label: 'HSA' }
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
    name: 'SMS',
    permissions: [
      { key: 'sms_dashboard', label: 'Dashboard SMS' }
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
  }
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