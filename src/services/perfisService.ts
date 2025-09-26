import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  key: string;
  label: string;
  submenus?: MenuItem[];
}

export interface MenuSection {
  key: string;
  label: string;
  items: MenuItem[];
}

export function getMenusHierarchy(): MenuSection[] {
  return [
    {
      key: "dashboard",
      label: "Dashboard",
      items: [
        { key: "dashboard", label: "Dashboard Principal" }
      ]
    },
    {
      key: "sms",
      label: "SMS - Segurança, Meio Ambiente e Saúde",
      items: [
        {
          key: "desvios",
          label: "Desvios",
          submenus: [
            { key: "desvios_dashboard", label: "Dashboard" },
            { key: "desvios_cadastro", label: "Cadastro" },
            { key: "desvios_consulta", label: "Consulta" },
            { key: "desvios_nao_conformidade", label: "Não Conformidade" },
            { key: "desvios_insights", label: "Insights" }
          ]
        },
        {
          key: "treinamentos",
          label: "Treinamentos",
          submenus: [
            { key: "treinamentos_dashboard", label: "Dashboard" },
            { key: "treinamentos_normativo", label: "Normativo" },
            { key: "treinamentos_consulta", label: "Consulta" },
            { key: "treinamentos_execucao", label: "Execução" },
            { key: "treinamentos_cracha", label: "Crachá" }
          ]
        },
        {
          key: "hora_seguranca",
          label: "Hora de Segurança",
          submenus: [
            { key: "hora_seguranca_dashboard", label: "Dashboard" },
            { key: "hora_seguranca_agenda", label: "Agenda HSA" },
            { key: "hora_seguranca_acompanhamento", label: "Acompanhamento" },
            { key: "hora_seguranca_cadastro", label: "Cadastro" },
            { key: "hora_seguranca_cadastro_inspecao", label: "Cadastro Inspeção" },
            { key: "hora_seguranca_cadastro_nao_programada", label: "Inspeção Não Programada" }
          ]
        },
        {
          key: "inspecao_sms",
          label: "Inspeção SMS",
          submenus: [
            { key: "inspecao_sms_dashboard", label: "Dashboard" },
            { key: "inspecao_sms_cadastro", label: "Cadastrar" },
            { key: "inspecao_sms_consulta", label: "Consultar" }
          ]
        },
        {
          key: "prevencao_incendio",
          label: "Prevenção de Incêndio",
          submenus: [
            { key: "prevencao_incendio_dashboard", label: "Dashboard" },
            { key: "prevencao_incendio_cadastro_extintores", label: "Cadastro de Extintores" },
            { key: "prevencao_incendio_inspecao_extintores", label: "Inspeção de Extintores" }
          ]
        },
        {
          key: "medidas_disciplinares",
          label: "Medidas Disciplinares",
          submenus: [
            { key: "medidas_disciplinares_dashboard", label: "Dashboard" },
            { key: "medidas_disciplinares_cadastro", label: "Cadastro" },
            { key: "medidas_disciplinares_consulta", label: "Consulta" }
          ]
        },
        {
          key: "ocorrencias",
          label: "Ocorrências",
          submenus: [
            { key: "ocorrencias_dashboard", label: "Dashboard" },
            { key: "ocorrencias_cadastro", label: "Cadastro" },
            { key: "ocorrencias_consulta", label: "Consulta" }
          ]
        },
        {
          key: "gro",
          label: "GRO",
          submenus: [
            { key: "gro_dashboard", label: "Dashboard" },
            { key: "gro_avaliacao_riscos", label: "Avaliação de Riscos" },
            { key: "gro_cadastro_perigos", label: "Cadastro de Perigos" },
            { key: "gro_pgr", label: "PGR" }
          ]
        }
      ]
    },
    {
      key: "idsms",
      label: "IDSMS - Indicadores",
      items: [
        { key: "idsms_dashboard", label: "Dashboard" },
        { key: "idsms_indicadores", label: "Indicadores" },
        { key: "idsms_ht", label: "HT" },
        { key: "idsms_hsa", label: "HSA" },
        { key: "idsms_iid", label: "IID" },
        { key: "idsms_ipom", label: "IPOM" },
        { key: "idsms_indice_reativo", label: "Índice Reativo" },
        { key: "idsms_inspecao_alta_lideranca", label: "Inspeção Alta Liderança" },
        { key: "idsms_inspecao_gestao_sms", label: "Inspeção Gestão SMS" },
        { key: "idsms_relatorios", label: "Relatórios" }
      ]
    },
    {
      key: "comunicados",
      label: "Comunicados",
      items: [
        { key: "admin_comunicados", label: "Cadastro de Comunicados" },
        { key: "consulta_comunicados", label: "Consulta de Comunicados" },
        { key: "meus_comunicados", label: "Meus Comunicados" }
      ]
    },
    {
      key: "administracao",
      label: "Administração",
      items: [
        {
          key: "configuracoes_sistema",
          label: "Configurações do Sistema",
          submenus: [
            { key: "admin_configuracoes", label: "Configurações Gerais" },
            { key: "admin_templates", label: "Templates" },
            { key: "admin_logo", label: "Logo" },
            { key: "admin_checklists", label: "Cadastro de Checklists" },
            { key: "admin_configuracao_emails", label: "Configuração de E-mails" },
            { key: "admin_upload_tutoriais", label: "Upload de Tutoriais" }
          ]
        },
        {
          key: "usuarios_perfis",
          label: "Usuários e Perfis",
          submenus: [
            { key: "admin_usuarios", label: "Usuários" },
            { key: "admin_usuarios_auth", label: "Usuários Auth" },
            { key: "admin_perfis", label: "Perfis" },
            { key: "admin_criar_usuario", label: "Criar Usuário" }
          ]
        },
        {
          key: "gestao_organizacional",
          label: "Gestão Organizacional",
          submenus: [
            { key: "admin_empresas", label: "Empresas" },
            { key: "admin_ccas", label: "CCAs" },
            { key: "admin_engenheiros", label: "Engenheiros" },
            { key: "admin_supervisores", label: "Supervisores" },
            { key: "admin_encarregados", label: "Encarregados" },
            { key: "admin_funcionarios", label: "Funcionários" }
          ]
        },
        {
          key: "importacoes",
          label: "Importações",
          submenus: [
            { key: "admin_importacao_funcionarios", label: "Importação de Funcionários" },
            { key: "admin_importacao_execucao_treinamentos", label: "Importação Execução Treinamentos" },
            { key: "admin_importacao_hsa", label: "Importação HSA" }
          ]
        },
        {
          key: "dados_sistema",
          label: "Dados do Sistema",
          submenus: [
            { key: "admin_exportacao_dados", label: "Exportação de Dados" },
            { key: "admin_registro_hht", label: "Registro HHT" },
            { key: "admin_metas_indicadores", label: "Metas e Indicadores" }
          ]
        }
      ]
    },
    {
      key: "tarefas",
      label: "Tarefas",
      items: [
        { key: "tarefas_dashboard", label: "Dashboard" },
        { key: "tarefas_minhas_tarefas", label: "Minhas Tarefas" },
        { key: "tarefas_cadastro", label: "Cadastro" }
      ]
    },
    {
      key: "relatorios",
      label: "Relatórios",
      items: [
        { key: "relatorios_dashboard", label: "Dashboard" },
        { key: "relatorios_ocorrencias", label: "Ocorrências" },
        { key: "relatorios_desvios", label: "Desvios" },
        { key: "relatorios_treinamentos", label: "Treinamentos" },
        { key: "relatorios_idsms", label: "IDSMS" },
        { key: "relatorios_hsa", label: "HSA" }
      ]
    },
    {
      key: "sistema",
      label: "Sistema",
      items: [
        { key: "sms_dashboard", label: "Dashboard SMS" },
        { key: "suporte", label: "Suporte" },
        { key: "account_profile", label: "Perfil" },
        { key: "account_settings", label: "Configurações" },
        { key: "account_support", label: "Suporte da Conta" }
      ]
    }
  ];
}

export function getAllMenusSidebar(): string[] {
  const hierarchy = getMenusHierarchy();
  const allMenus: string[] = [];
  
  hierarchy.forEach(section => {
    section.items.forEach(item => {
      allMenus.push(item.key);
      if (item.submenus) {
        item.submenus.forEach(submenu => {
          allMenus.push(submenu.key);
        });
      }
    });
  });
  
  // Manter compatibilidade com menus antigos para transição
  const compatibilityMenus = [
    // Menus antigos de administração
    "adm_configuracoes",
    "adm_usuarios",
    "adm_perfis", 
    "adm_empresas",
    "adm_ccas",
    "adm_engenheiros",
    "adm_supervisores",
    "adm_funcionarios",
    "adm_hht",
    "adm_metas_indicadores",
    "adm_templates",
    "adm_logo",
    "adm_modelos_inspecao",
    "adm_checklists",
    "adm_importacao_funcionarios",
    // Outros menus de compatibilidade
    "configuracoes",
    "conta"
  ];
  
  return [...allMenus, ...compatibilityMenus];
}

export async function fetchPerfis() {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Erro ao buscar perfis:', error);
    throw error;
  }

  return data || [];
}

export async function createPerfil(perfil: {
  nome: string;
  descricao?: string;
  permissoes: any;
  ccas_permitidas?: number[];
}) {
  const { data, error } = await supabase
    .from('perfis')
    .insert([perfil])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }

  return data;
}

export async function updatePerfil(id: number, updates: {
  nome?: string;
  descricao?: string;
  permissoes?: any;
  ccas_permitidas?: number[];
}) {
  const { data, error } = await supabase
    .from('perfis')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }

  return data;
}

export async function deletePerfil(id: number) {
  const { error } = await supabase
    .from('perfis')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar perfil:', error);
    throw error;
  }
}
