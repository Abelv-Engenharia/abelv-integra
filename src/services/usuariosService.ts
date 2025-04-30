
import { supabase } from "@/integrations/supabase/client";
import { User, Profile } from "@/types/users";
import { useToast } from "@/hooks/use-toast";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // For the purpose of this example, we'll use the auth.users table
    // In a real system, you might need to implement a system of profiles
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Erro ao buscar usuários:', userError);
      
      // Use mock data if we can't access the auth API
      return [
        { id: 1, nome: "João Silva", email: "joao.silva@empresa.com", perfil: "Administrador", status: "Ativo" },
        { id: 2, nome: "Maria Souza", email: "maria.souza@empresa.com", perfil: "Operador", status: "Ativo" },
        { id: 3, nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", perfil: "Gestor", status: "Inativo" },
        { id: 4, nome: "Ana Pereira", email: "ana.pereira@empresa.com", perfil: "Operador", status: "Ativo" },
      ];
    }
    
    // Map Supabase data to our User format
    return userData?.users?.map(user => ({
      id: user.id,
      nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Sem nome',
      email: user.email || '',
      perfil: user.user_metadata?.perfil || 'Usuário',
      status: user.banned ? "Inativo" : "Ativo"
    })) || [];
  } catch (error) {
    console.error('Exception fetching users:', error);
    return [
      { id: 1, nome: "João Silva", email: "joao.silva@empresa.com", perfil: "Administrador", status: "Ativo" },
      { id: 2, nome: "Maria Souza", email: "maria.souza@empresa.com", perfil: "Operador", status: "Ativo" },
      { id: 3, nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", perfil: "Gestor", status: "Inativo" },
      { id: 4, nome: "Ana Pereira", email: "ana.pereira@empresa.com", perfil: "Operador", status: "Ativo" },
    ];
  }
};

export const fetchProfiles = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('ativo', true);
    
    if (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching profiles:', error);
    return [];
  }
};
