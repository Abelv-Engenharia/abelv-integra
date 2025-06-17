
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
          if (rolesResponse && rolesResponse.length > 0 && rolesResponse[0].perfis) {
            perfil = rolesResponse[0].perfis.nome;
          }
        } catch (error) {
          console.error(`Erro ao buscar perfil do usuário ${authUser.id}:`, error);
        }
        
        return {
          id: authUser.id,
          nome: authUser.user_metadata?.nome || "Sem nome",
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
    // Primeiro tentar criar diretamente no banco em vez de usar a edge function
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: userData,
      email_confirm: true // Auto-confirmar o email para evitar problemas de rate limit
    });

    if (signUpError) {
      console.error("Erro no signUp:", signUpError);
      throw new Error(signUpError.message);
    }

    if (!authData?.user?.id) {
      throw new Error("Falha ao criar usuário: ID não retornado");
    }

    console.log("Usuário criado no auth:", authData.user);

    // Criar o perfil na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        nome: userData.nome,
        email: email
      });

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError);
      // Se falhar, tentar deletar o usuário do auth
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error("Erro ao reverter criação do usuário:", deleteError);
      }
      throw new Error("Erro ao criar perfil do usuário");
    }

    // Associar o perfil de acesso se fornecido
    if (userData.perfil_id) {
      const { error: userPerfilError } = await supabase
        .from('usuario_perfis')
        .insert({
          usuario_id: authData.user.id,
          perfil_id: userData.perfil_id
        });

      if (userPerfilError) {
        console.error("Erro ao associar perfil:", userPerfilError);
        // Não falhar aqui, apenas logar o erro
      }
    }

    console.log("Usuário criado com sucesso completo");
    return authData;
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
  return callEdgeFunction(`${userId}/roles`);
}

export async function updateUserRole(userId: string, perfilId: number) {
  console.log("Atualizando perfil:", { userId, perfilId });
  try {
    const result = await callEdgeFunction(`${userId}/roles`, "PUT", { perfilId });
    console.log("Perfil atualizado com sucesso:", result);
    return result;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}
