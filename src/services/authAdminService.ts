
import { supabase } from "@/integrations/supabase/client";

// URL base da função edge
const EDGE_FUNCTION_BASE_URL = "https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/admin-users";

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
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao chamar a função");
  }

  return data;
}

export async function fetchUsers(page = 1, perPage = 10, query = "", status = "") {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  
  if (query) queryParams.append("query", query);
  if (status) queryParams.append("status", status);
  
  return callEdgeFunction(`?${queryParams.toString()}`);
}

export async function fetchUserById(userId: string) {
  return callEdgeFunction(userId);
}

export async function createUser(email: string, password: string, userData = {}) {
  return callEdgeFunction("create", "POST", { email, password, userData });
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
  return callEdgeFunction(`${userId}/roles`, "PUT", { perfilId });
}
