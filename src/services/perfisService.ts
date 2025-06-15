import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Permissoes, Perfil } from "@/types/users";

// Helper para pegar todos os menus e submenus possíveis do sistema
function getAllMenusSidebar(): string[] {
  return [
    "dashboard",
    "desvios_dashboard",
    "desvios_cadastro",
    "desvios_consulta",
    "desvios_nao_conformidade",
    "treinamentos_dashboard",
    "treinamentos_normativo",
    "treinamentos_consulta",
    "treinamentos_execucao",
    "treinamentos_cracha",
    "medidas_disciplinares_dashboard",
    "medidas_disciplinares_cadastro",
    "medidas_disciplinares_consulta",
    "tarefas_dashboard",
    "tarefas_minhas_tarefas",
    "tarefas_cadastro",
    "relatorios",
    "relatorios_idsms",
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
    "idsms_dashboard",
    "idsms_indicadores",
    "idsms_iid",
    "idsms_hsa",
    "idsms_ht",
    "idsms_ipom",
    "idsms_inspecao_alta_lideranca",
    "idsms_inspecao_gestao_sms",
    "idsms_indice_reativo",
    "hora_seguranca_cadastro",
    "hora_seguranca_cadastro_inspecao",
    "hora_seguranca_cadastro_nao_programada",
    "hora_seguranca_dashboard",
    "hora_seguranca_agenda",
    "hora_seguranca_acompanhamento",
    "gro_perigos",
    "gro_avaliacao",
    "gro_pgr",
    "ocorrencias_dashboard",
    "ocorrencias_cadastro",
    "ocorrencias_consulta",
    // Adicione outros conforme a evolução do sistema
  ];
}

// Helper para montar permissões do admin sempre com todas as permissões ativas e todos os menus
function getFullAdminPermissions(): Permissoes {
  const permissoes: Permissoes = {
    // Módulos principais
    desvios: true,
    treinamentos: true,
    ocorrencias: true,
    tarefas: true,
    relatorios: true,
    hora_seguranca: true,
    medidas_disciplinares: true,

    // Administração
    admin_usuarios: true,
    admin_perfis: true,
    admin_funcionarios: true,
    admin_hht: true,
    admin_templates: true,
    admin_empresas: true,
    admin_supervisores: true,
    admin_engenheiros: true,
    admin_ccas: true,

    // IDSMS
    idsms_dashboard: true,
    idsms_formularios: true,

    // Configurações específicas de permissões
    pode_editar_desvios: true,
    pode_excluir_desvios: true,
    pode_editar_ocorrencias: true,
    pode_excluir_ocorrencias: true,
    pode_editar_treinamentos: true,
    pode_excluir_treinamentos: true,
    pode_editar_tarefas: true,
    pode_excluir_tarefas: true,
    pode_aprovar_tarefas: true,
    pode_visualizar_relatorios_completos: true,
    pode_exportar_dados: true,

    menus_sidebar: getAllMenusSidebar(),
  };
  return permissoes;
}

export async function fetchPerfis(): Promise<Perfil[]> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
    
    return data.map(perfil => ({
      id: perfil.id,
      nome: perfil.nome,
      descricao: perfil.descricao || "",
      permissoes: ensureAllPermissoes(perfil.permissoes, perfil.nome)
    }));
  } catch (error) {
    console.error('Exceção ao buscar perfis:', error);
    return [];
  }
}

// Helper to ensure all permission fields exist with default values
function ensureAllPermissoes(permissoes: any, nomePerfil?: string): Permissoes {
  // ... pega o default
  const defaultPermissoes: Permissoes = {
    desvios: false,
    treinamentos: false,
    ocorrencias: false,
    tarefas: false,
    relatorios: false,
    hora_seguranca: false,
    medidas_disciplinares: false,
    admin_usuarios: false,
    admin_perfis: false,
    admin_funcionarios: false,
    admin_hht: false,
    admin_templates: false,
    admin_empresas: false,
    admin_supervisores: false,
    admin_engenheiros: false,
    admin_ccas: false,
    idsms_dashboard: false,
    idsms_formularios: false,
    pode_editar_desvios: false,
    pode_excluir_desvios: false,
    pode_editar_ocorrencias: false,
    pode_excluir_ocorrencias: false,
    pode_editar_treinamentos: false,
    pode_excluir_treinamentos: false,
    pode_editar_tarefas: false,
    pode_excluir_tarefas: false,
    pode_aprovar_tarefas: false,
    pode_visualizar_relatorios_completos: false,
    pode_exportar_dados: false,
    menus_sidebar: [],
  };

  // Se é admin, retorna tudo true e todos menus.
  if (nomePerfil && nomePerfil.toLowerCase().startsWith("admin")) {
    return getFullAdminPermissions();
  }

  const merged: Permissoes = { ...defaultPermissoes, ...permissoes };
  if (!merged.menus_sidebar) merged.menus_sidebar = [];
  return merged;
}

export async function createPerfil(perfil: Omit<Perfil, "id">): Promise<Perfil | null> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .insert([{
        nome: perfil.nome,
        descricao: perfil.descricao,
        // cast permissoes to any as expected by supabase (jsonb)
        permissoes: perfil.permissoes as any,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
    
    return {
      id: data.id,
      nome: data.nome,
      descricao: data.descricao || "",
      permissoes: ensureAllPermissoes(data.permissoes)
    };
  } catch (error) {
    console.error('Exceção ao criar perfil:', error);
    throw error;
  }
}

export async function updatePerfil(
  id: number,
  perfil: Partial<Omit<Perfil, "id">>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('perfis')
      .update({
        nome: perfil.nome,
        descricao: perfil.descricao,
        // cast permissoes to any as expected by supabase (jsonb)
        permissoes: perfil.permissoes as any,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exceção ao atualizar perfil:', error);
    throw error;
  }
}

export async function deletePerfil(id: number): Promise<boolean> {
  try {
    // Check if there are any users with this profile
    const { count, error: countError } = await supabase
      .from('usuario_perfis')
      .select('*', { count: 'exact', head: true })
      .eq('perfil_id', id);
    
    if (countError) {
      console.error('Erro ao verificar usuários com este perfil:', countError);
      throw countError;
    }
    
    // If there are users with this profile, don't delete it
    if (count && count > 0) {
      throw new Error(`Não é possível excluir este perfil pois existem ${count} usuários associados a ele.`);
    }
    
    const { error } = await supabase
      .from('perfis')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir perfil:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exceção ao excluir perfil:', error);
    throw error;
  }
}
