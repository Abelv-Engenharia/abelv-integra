
import { supabase } from "@/integrations/supabase/client";
import { User, Profile } from "@/types/users";
import { useToast } from "@/hooks/use-toast";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error('Erro ao buscar perfis de usuários:', profilesError);
      return [];
    }
    
    const { data: userPerfis, error: perfilError } = await supabase
      .from('usuario_perfis')
      .select('*');
      
    if (perfilError) {
      console.error('Erro ao buscar relacionamento usuario-perfis:', perfilError);
      return [];
    }
    
    const { data: perfis, error: perfisListError } = await supabase
      .from('perfis')
      .select('*');
      
    if (perfisListError) {
      console.error('Erro ao buscar lista de perfis:', perfisListError);
      return [];
    }
    
    // Map the data to our User format
    return profiles.map(profile => {
      // Find perfil information for this user
      const userPerfil = userPerfis.find(up => up.usuario_id === profile.id);
      const perfilInfo = userPerfil ? perfis.find(p => p.id === userPerfil.perfil_id) : null;
      
      return {
        id: profile.id,
        nome: profile.nome || 'Sem nome',
        email: profile.email || '',
        perfil: perfilInfo?.nome || 'Usuário',
        status: "Ativo" // Assumindo que todos os usuários no banco estão ativos
      };
    });
  } catch (error) {
    console.error('Exceção ao buscar usuários:', error);
    return [];
  }
};

export const fetchProfiles = async (): Promise<Profile[]> => {
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
      nome: perfil.nome
    })) || [];
  } catch (error) {
    console.error('Exceção ao buscar perfis:', error);
    return [];
  }
};
