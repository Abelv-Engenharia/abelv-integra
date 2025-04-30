
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Cria o cliente Supabase com a chave de serviço - não exposta no frontend
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req) => {
  // Habilitar CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Verificar autenticação do usuário
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user: authenticatedUser },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !authenticatedUser) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verificar permissão de administrador
  const { data: permissoes } = await supabaseAdmin
    .from("usuario_perfis")
    .select("perfil_id")
    .eq("usuario_id", authenticatedUser.id)
    .single();

  if (!permissoes) {
    return new Response(JSON.stringify({ error: "Permissão negada" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verificar se o perfil tem permissão admin_usuarios
  const { data: perfil } = await supabaseAdmin
    .from("perfis")
    .select("permissoes")
    .eq("id", permissoes.perfil_id)
    .single();

  if (!perfil?.permissoes?.admin_usuarios) {
    return new Response(JSON.stringify({ error: "Permissão negada para administrar usuários" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Processar a requisição
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Listar usuários
    if (req.method === "GET" && !path) {
      const page = url.searchParams.get("page") ? parseInt(url.searchParams.get("page") || "1") : 1;
      const perPage = url.searchParams.get("perPage") ? parseInt(url.searchParams.get("perPage") || "10") : 10;
      const query = url.searchParams.get("query") || "";
      const status = url.searchParams.get("status") || "";
      
      let { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) throw error;

      // Filtrar usuários com os parâmetros passados
      let filteredUsers = users.users;

      if (query) {
        filteredUsers = filteredUsers.filter(
          (user) => 
            user.email?.toLowerCase().includes(query.toLowerCase()) || 
            user.id.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (status) {
        if (status === "confirmed") {
          filteredUsers = filteredUsers.filter(user => user.email_confirmed_at !== null);
        } else if (status === "unconfirmed") {
          filteredUsers = filteredUsers.filter(user => user.email_confirmed_at === null);
        } else if (status === "blocked") {
          filteredUsers = filteredUsers.filter(user => user.banned_until !== null);
        }
      }

      return new Response(JSON.stringify({ 
        users: filteredUsers,
        total: users.users.length, 
        count: filteredUsers.length 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obter usuário específico
    if (req.method === "GET" && path) {
      const userId = path;
      const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error) throw error;

      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Criar novo usuário
    if (req.method === "POST" && path === "create") {
      const { email, password, userData } = await req.json();
      
      const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirmar e-mail
        user_metadata: userData || {},
      });

      if (error) throw error;

      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Atualizar usuário
    if (req.method === "PUT" && path) {
      const userId = path;
      const updates = await req.json();
      
      const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        updates
      );

      if (error) throw error;

      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Excluir usuário
    if (req.method === "DELETE" && path) {
      const userId = path;
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Endpoint para obter roles do usuário
    if (req.method === "GET" && path && path.includes("roles")) {
      const userId = path.split("/")[0];
      
      const { data, error } = await supabaseAdmin
        .from("usuario_perfis")
        .select("perfil_id, perfis(nome, permissoes)")
        .eq("usuario_id", userId);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Endpoint para atualizar roles do usuário
    if (req.method === "PUT" && path && path.includes("roles")) {
      const userId = path.split("/")[0];
      const { perfilId } = await req.json();
      
      // Remover roles existentes
      const { error: deleteError } = await supabaseAdmin
        .from("usuario_perfis")
        .delete()
        .eq("usuario_id", userId);
        
      if (deleteError) throw deleteError;
      
      // Adicionar novo role
      const { data, error } = await supabaseAdmin
        .from("usuario_perfis")
        .insert({
          usuario_id: userId,
          perfil_id: perfilId
        });
        
      if (error) throw error;
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Se não for nenhum dos endpoints acima
    return new Response(JSON.stringify({ error: "Endpoint não encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função edge:", error);
    
    return new Response(JSON.stringify({ error: error.message || "Erro no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
