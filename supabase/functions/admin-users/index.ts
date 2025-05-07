
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Cria o cliente Supabase com a chave de serviço - não exposta no frontend
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// Headers CORS para permitir requisições do frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Habilitar CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verificar autenticação do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user: authenticatedUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authenticatedUser) {
      return new Response(JSON.stringify({ error: "Não autorizado", details: authError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Processar a requisição
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const pathPart = pathSegments[pathSegments.length - 1];

    console.log("Request method:", req.method);
    console.log("Request path:", url.pathname);
    console.log("Path part:", pathPart);

    try {
      // Listar usuários
      if (req.method === "GET" && pathPart === "admin-users") {
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
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Obter usuário específico
      if (req.method === "GET" && pathPart && pathPart !== "admin-users" && !pathPart.includes("roles")) {
        const userId = pathPart;
        const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (error) throw error;

        return new Response(JSON.stringify(user), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Criar novo usuário
      if (req.method === "POST" && pathPart === "create") {
        const requestData = await req.json();
        const { email, password, userData } = requestData;
        
        console.log("Creating user:", { email, userData });
        
        const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto confirmar e-mail
          user_metadata: userData || {},
        });

        if (error) {
          console.error("Error creating user:", error);
          throw error;
        }

        console.log("User created successfully:", user);
        
        return new Response(JSON.stringify(user), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Atualizar usuário
      if (req.method === "PUT" && pathPart && pathPart !== "admin-users" && !pathPart.includes("roles")) {
        const userId = pathPart;
        const updates = await req.json();
        
        const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          updates
        );

        if (error) throw error;

        return new Response(JSON.stringify(user), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Excluir usuário
      if (req.method === "DELETE" && pathPart && pathPart !== "admin-users") {
        const userId = pathPart;
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Endpoint para obter roles do usuário
      if (req.method === "GET" && pathPart === "roles") {
        const userId = pathSegments[pathSegments.length - 2];
        
        const { data, error } = await supabaseAdmin
          .from("usuario_perfis")
          .select("perfil_id, perfis(nome, permissoes)")
          .eq("usuario_id", userId);

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Endpoint para atualizar roles do usuário
      if (req.method === "PUT" && pathPart === "roles") {
        const userId = pathSegments[pathSegments.length - 2];
        const { perfilId } = await req.json();
        
        console.log("Updating user role:", { userId, perfilId });
        
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
        
        console.log("User role updated successfully");
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Se não for nenhum dos endpoints acima
      return new Response(JSON.stringify({ 
        error: "Endpoint não encontrado",
        path: url.pathname,
        pathPart
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Erro na função edge:", error);
      
      return new Response(JSON.stringify({ 
        error: error.message || "Erro no servidor",
        details: error.toString()
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Erro crítico na função edge:", error);
    return new Response(JSON.stringify({ 
      error: "Erro interno do servidor",
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
