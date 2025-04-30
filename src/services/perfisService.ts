
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Permissoes = {
  desvios: boolean;
  treinamentos: boolean;
  hora_seguranca: boolean;
  ocorrencias: boolean;
  medidas_disciplinares: boolean;
  tarefas: boolean;
  relatorios: boolean;
  admin_usuarios: boolean;
  admin_perfis: boolean;
  admin_funcionarios: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
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
      permissoes: perfil.permissoes as Permissoes
    }));
  } catch (error) {
    console.error('Exceção ao buscar perfis:', error);
    return [];
  }
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
      permissoes: data.permissoes as Permissoes
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
