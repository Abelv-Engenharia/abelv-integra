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
            { key: "desvios_nao_conformidade", label: "Não Conformidade" }
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
            { key: "hora_seguranca_agenda", label: "Agenda" },
            { key: "hora_seguranca_acompanhamento", label: "Acompanhamento" },
            { key: "hora_seguranca_cadastro", label: "Cadastro" },
            { key: "hora_seguranca_cadastro_inspecao", label: "Cadastro Inspeção" },
            { key: "hora_seguranca_cadastro_nao_programada", label: "Cadastro Não Programada" }
          ]
        },
        {
          key: "inspecao_sms",
          label: "Inspeção SMS",
          submenus: [
            { key: "inspecao_sms_dashboard", label: "Dashboard" },
            { key: "inspecao_sms_cadastro", label: "Cadastro" },
            { key: "inspecao_sms_consulta", label: "Consulta" }
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
            { key: "gro_avaliacao_riscos", label: "Avaliação de Riscos" }
          ]
        }
      ]
    },
    {
      key: "idsms",
      label: "IDSMS - Indicadores",
      items: [
        { key: "idsms_dashboard", label: "Dashboard" },
        { key: "idsms_relatorios", label: "Relatórios" }
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
        { key: "relatorios_idsms", label: "IDSMS" }
      ]
    },
    {
      key: "sistema",
      label: "Sistema",
      items: [
        { key: "adm_configuracoes", label: "Configurações" },
        { key: "suporte", label: "Suporte" },
        { key: "conta", label: "Conta" },
        { key: "adm_usuarios", label: "Usuários" },
        { key: "adm_perfis", label: "Perfis" },
        { key: "adm_empresas", label: "Empresas" },
        { key: "adm_ccas", label: "CCAs" },
        { key: "adm_engenheiros", label: "Engenheiros" },
        { key: "adm_supervisores", label: "Supervisores" },
        { key: "adm_funcionarios", label: "Funcionários" },
        { key: "adm_importacao_funcionarios", label: "Importação de Funcionários" },
        { key: "adm_checklists", label: "Cadastro de Checklists" },
        { key: "adm_hht", label: "HHT" },
        { key: "adm_metas_indicadores", label: "Metas e Indicadores" },
        { key: "adm_modelos_inspecao", label: "Modelos de Inspeção" },
        { key: "adm_templates", label: "Templates" },
        { key: "adm_logo", label: "Logo" }
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
  
  // Manter compatibilidade com menus antigos de administração
  const adminMenus = [
    "admin_usuarios",
    "admin_perfis", 
    "admin_empresas",
    "admin_ccas",
    "admin_engenheiros",
    "admin_supervisores",
    "admin_funcionarios",
    "admin_hht",
    "admin_metas_indicadores",
    "admin_templates",
    "admin_logo",
    "admin_modelos_inspecao"
  ];
  
  return [...allMenus, ...adminMenus];
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
