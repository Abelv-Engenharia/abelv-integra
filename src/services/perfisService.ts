
import { supabase } from '@/integrations/supabase/client';

export const getAllMenusSidebar = () => {
  return [
    // Dashboard
    "dashboard",
    
    // Desvios
    "desvios_dashboard",
    "desvios_cadastro", 
    "desvios_consulta",
    "desvios_nao_conformidade",
    
    // Treinamentos
    "treinamentos_dashboard",
    "treinamentos_normativo",
    "treinamentos_consulta", 
    "treinamentos_execucao",
    "treinamentos_cracha",
    
    // Hora da Segurança
    "hora_seguranca_cadastro",
    "hora_seguranca_cadastro_inspecao",
    "hora_seguranca_cadastro_nao_programada",
    "hora_seguranca_dashboard",
    "hora_seguranca_agenda",
    "hora_seguranca_acompanhamento",
    
    // Inspeção SMS - NOVO
    "inspecao_sms_dashboard",
    "inspecao_sms_cadastro",
    "inspecao_sms_consulta",
    
    // Ocorrências
    "ocorrencias_dashboard",
    "ocorrencias_cadastro",
    "ocorrencias_consulta",
    
    // Medidas Disciplinares
    "medidas_disciplinares_dashboard",
    "medidas_disciplinares_cadastro",
    "medidas_disciplinares_consulta",
    
    // Tarefas
    "tarefas_dashboard",
    "tarefas_minhas_tarefas",
    "tarefas_cadastro",
    
    // Relatórios
    "relatorios",
    "relatorios_idsms",
    
    // IDSMS
    "idsms_dashboard",
    "idsms_indicadores",
    "idsms_iid",
    "idsms_hsa",
    "idsms_ht",
    "idsms_ipom",
    "idsms_inspecao_alta_lideranca",
    "idsms_inspecao_gestao_sms",
    "idsms_indice_reativo",
    
    // GRO
    "gro_perigos",
    "gro_avaliacao",
    "gro_pgr",
    
    // Admin
    "admin_usuarios",
    "admin_perfis",
    "admin_empresas",
    "admin_ccas",
    "admin_engenheiros",
    "admin_supervisores",
    "admin_funcionarios",
    "admin_hht",
    "admin_metas_indicadores",
    "admin_modelos_inspecao", // NOVO
    "admin_templates",
    "admin_logo"
  ];
};

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
