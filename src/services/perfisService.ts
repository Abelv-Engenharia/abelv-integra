
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Permissoes = {
  // Módulos principais
  desvios: boolean;
  treinamentos: boolean;
  ocorrencias: boolean;
  tarefas: boolean;
  relatorios: boolean;
  hora_seguranca: boolean;
  medidas_disciplinares: boolean;
  
  // Administração
  admin_usuarios: boolean;
  admin_perfis: boolean;
  admin_funcionarios: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
  admin_empresas: boolean;
  admin_supervisores: boolean;
  admin_engenheiros: boolean;
  admin_ccas: boolean;
  
  // IDSMS
  idsms_dashboard: boolean;
  idsms_formularios: boolean;
  
  // Configurações específicas de permissões
  pode_editar_desvios: boolean;
  pode_excluir_desvios: boolean;
  pode_editar_ocorrencias: boolean;
  pode_excluir_ocorrencias: boolean;
  pode_editar_treinamentos: boolean;
  pode_excluir_treinamentos: boolean;
  pode_editar_tarefas: boolean;
  pode_excluir_tarefas: boolean;
  pode_aprovar_tarefas: boolean;
  pode_visualizar_relatorios_completos: boolean;
  pode_exportar_dados: boolean;
};

export type Perfil = {
  id: number;
  nome: string;
  descricao: string | null;
  permissoes: Permissoes;
};

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
      permissoes: ensureAllPermissoes(perfil.permissoes)
    }));
  } catch (error) {
    console.error('Exceção ao buscar perfis:', error);
    return [];
  }
}

// Helper to ensure all permission fields exist with default values
function ensureAllPermissoes(permissoes: any): Permissoes {
  const defaultPermissoes: Permissoes = {
    // Módulos principais
    desvios: false,
    treinamentos: false,
    ocorrencias: false,
    tarefas: false,
    relatorios: false,
    hora_seguranca: false,
    medidas_disciplinares: false,
    
    // Administração
    admin_usuarios: false,
    admin_perfis: false,
    admin_funcionarios: false,
    admin_hht: false,
    admin_templates: false,
    admin_empresas: false,
    admin_supervisores: false,
    admin_engenheiros: false,
    admin_ccas: false,
    
    // IDSMS
    idsms_dashboard: false,
    idsms_formularios: false,
    
    // Configurações específicas de permissões
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
  };
  
  return { ...defaultPermissoes, ...permissoes };
}

export async function createPerfil(perfil: Omit<Perfil, 'id'>): Promise<Perfil | null> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .insert([{
        nome: perfil.nome,
        descricao: perfil.descricao,
        permissoes: perfil.permissoes
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

export async function updatePerfil(id: number, perfil: Partial<Omit<Perfil, 'id'>>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('perfis')
      .update({
        nome: perfil.nome,
        descricao: perfil.descricao,
        permissoes: perfil.permissoes
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
