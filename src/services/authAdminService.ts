
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";
import { toast } from "@/hooks/use-toast";

// URL base da função edge
const EDGE_FUNCTION_BASE_URL = import.meta.env.VITE_SUPABASE_URL ? 
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users` :
  "https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/admin-users";

// Helper para obter token do usuário autenticado
async function getAuthToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// Função para chamar a edge function com autorização
async function callEdgeFunction(path = "", method = "GET", body = null) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const url = path ? `${EDGE_FUNCTION_BASE_URL}/${path}` : EDGE_FUNCTION_BASE_URL;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || `Error: ${response.status} ${response.statusText}`;
    console.error("Edge function error:", errorMessage);
    throw new Error(errorMessage);
  }
  
  return response.json();
}

export async function fetchUsers(page = 1, perPage = 100, query = "", status = ""): Promise<any> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("perPage", perPage.toString());
    
    if (query) queryParams.append("query", query);
    if (status) queryParams.append("status", status);
    
    const result = await callEdgeFunction(`?${queryParams.toString()}`);
    
    // Map the Supabase Auth users to our User format
    if (result?.users) {
      const users = await Promise.all(result.users.map(async (authUser: any) => {
        // Try to get the user's profile data
        let perfil = "Usuário";
        try {
          const rolesResponse = await getUserRoles(authUser.id);
          if (rolesResponse && rolesResponse.length > 0 && rolesResponse[0]?.perfis) {
            perfil = rolesResponse[0].perfis.nome;
          }
        } catch (error) {
          console.error(`Erro ao buscar perfil do usuário ${authUser.id}:`, error);
        }
        
        return {
          id: authUser.id,
          nome: authUser.user_metadata?.nome || authUser.email?.split('@')[0] || "Sem nome",
          email: authUser.email || "",
          perfil: perfil,
          status: authUser.email_confirmed_at ? "Ativo" : "Pendente"
        };
      }));
      
      return {
        users,
        total: result.total || users.length,
        count: users.length
      };
    }
    
    return { users: [], total: 0, count: 0 };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    toast({
      title: "Erro ao buscar usuários",
      description: "Não foi possível carregar a lista de usuários.",
      variant: "destructive",
    });
    return { users: [], total: 0, count: 0 };
  }
}

export async function fetchUserById(userId: string) {
  return callEdgeFunction(userId);
}

export async function createAuthUser(email: string, password: string, userData = {}) {
  console.log("Criando usuário:", { email, userData });
  try {
    const result = await callEdgeFunction("create", "POST", { email, password, userData });
    console.log("Usuário criado com sucesso:", result);
    return result;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}

export async function updateUser(userId: string, updates: any) {
  return callEdgeFunction(userId, "PUT", updates);
}

export async function deleteUser(userId: string) {
  return callEdgeFunction(userId, "DELETE");
}

export async function getUserRoles(userId: string) {
  try {
    const { data, error } = await supabase
      .from('usuario_perfis')
      .select(`
        perfil_id,
        perfis (
          nome
        )
      `)
      .eq('usuario_id', userId);

    if (error) {
      console.error("Erro ao buscar perfis do usuário:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar perfis do usuário:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, perfilId: number) {
  console.log("Atualizando perfil:", { userId, perfilId });
  try {
    // First, check if user already has a role
    const { data: existingRole, error: checkError } = await supabase
      .from('usuario_perfis')
      .select('id')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar perfil existente:", checkError);
      throw checkError;
    }

    let result;
    if (existingRole) {
      // Update existing role
      const { data, error } = await supabase
        .from('usuario_perfis')
        .update({ perfil_id: perfilId })
        .eq('usuario_id', userId)
        .select();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new role assignment
      const { data, error } = await supabase
        .from('usuario_perfis')
        .insert({ usuario_id: userId, perfil_id: perfilId })
        .select();
      
      if (error) throw error;
      result = data;
    }

    console.log("Perfil atualizado com sucesso:", result);
    return result;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}
