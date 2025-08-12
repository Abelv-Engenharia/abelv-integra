
import { supabase } from '@/integrations/supabase/client';

export function getAllMenusSidebar(): string[] {
  return [
    "dashboard",
    
    // SMS menus
    "desvios_dashboard",
    "desvios_cadastro",
    "desvios_consulta",
    "desvios_nao_conformidade",
    "treinamentos_dashboard",
    "treinamentos_normativo",
    "treinamentos_consulta",
    "treinamentos_execucao",
    "treinamentos_cracha",
    "hora_seguranca_cadastro",
    "hora_seguranca_cadastro_inspecao",
    "hora_seguranca_cadastro_nao_programada",
    "hora_seguranca_dashboard",
    "hora_seguranca_agenda",
    "hora_seguranca_acompanhamento",
    "inspecao_sms_dashboard",
    "inspecao_sms_cadastro",
    "inspecao_sms_consulta",
    "medidas_disciplinares_dashboard",
    "medidas_disciplinares_cadastro",
    "medidas_disciplinares_consulta",
    "ocorrencias_dashboard",
    "ocorrencias_cadastro",
    "ocorrencias_consulta",
    
    // IDSMS menus
    "idsms_dashboard",
    "idsms_relatorios",
    
    // ADM MATRICIAL menus
    "adm_dashboard",
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
    "adm_modelos_inspecao",
    "adm_templates",
    "adm_logo",
    "adm_manutencao",
    "adm_importacao_funcionarios",
    "adm_importacao_execucao_treinamentos",

    // ORÇAMENTOS menus
    "orcamentos_dashboard",
    "orcamentos_projetos",
    "orcamentos_custos",
    "orcamentos_analises",
    "orcamentos_aprovacoes",
    "orcamentos_historico",

    // PRODUÇÃO menus
    "producao_dashboard",
    "producao_planejamento",
    "producao_ordens_producao",
    "producao_controle_qualidade",
    "producao_manutencao",
    "producao_recursos",
    "producao_indicadores",

    // QUALIDADE menus
    "qualidade_dashboard",
    "qualidade_controle",
    "qualidade_auditorias",
    "qualidade_indicadores",
    "qualidade_equipe",
    "qualidade_configuracoes",

    // SUPRIMENTOS menus
    "suprimentos_dashboard",
    "suprimentos_fornecedores",
    "suprimentos_materiais",
    "suprimentos_compras",
    "suprimentos_estoque",
    "suprimentos_pedidos",
    "suprimentos_contratos",

    // TAREFAS menus
    "tarefas_dashboard",
    "tarefas_minhas_tarefas",
    "tarefas_cadastro",

    // RELATÓRIOS menus
    "relatorios_dashboard",
    "relatorios_idsms",

    // CONFIGURAÇÕES/ADMINISTRAÇÃO menus
    "admin_usuarios",
    "admin_perfis",
    "admin_empresas",
    "admin_ccas",
    "admin_engenheiros",
    "admin_supervisores",
    "admin_encarregados",
    "admin_funcionarios",
    "admin_registro_hht",
    "admin_metas_indicadores",
    "admin_modelos_inspecao",
    "admin_templates",
    "admin_logo_sistema",
    "admin_upload_tutoriais",
    "admin_configuracao_emails",
    "admin_exportacao_dados",
    "admin_importacao_funcionarios",
    "admin_importacao_execucao_treinamentos",

    // CONTA menus
    "conta_perfil",
    "conta_configuracoes",
  ];
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
