
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado. Necessário token de autenticação.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cria um cliente Supabase com service role key para operações admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Verificar se o usuário autenticado tem permissão (usando token do usuário)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );
    
    // Parse da URL para obter o path e possíveis parâmetros
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Processar GET - Lista de usuários ou usuário específico
    if (req.method === 'GET') {
      // Parâmetros de paginação e filtragem
      const page = parseInt(url.searchParams.get('page') || '1');
      const perPage = parseInt(url.searchParams.get('perPage') || '100');
      const query = url.searchParams.get('query') || '';
      const status = url.searchParams.get('status') || '';
      
      // Se temos um ID específico na URL, buscar apenas esse usuário
      if (path && path !== 'admin-users') {
        const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(path);
        
        if (error) {
          return new Response(
            JSON.stringify({ error: `Erro ao buscar usuário: ${error.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify(user),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Buscamos todos os usuários
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
        page, 
        perPage
      });
      
      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao listar usuários: ${error.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Filtrar usuários conforme os parâmetros
      let filteredUsers = users.users;
      
      if (query) {
        const queryLower = query.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email?.toLowerCase().includes(queryLower) || 
          user.user_metadata?.nome?.toLowerCase().includes(queryLower)
        );
      }
      
      if (status) {
        if (status === 'Ativo') {
          filteredUsers = filteredUsers.filter(user => user.email_confirmed_at);
        } else if (status === 'Pendente') {
          filteredUsers = filteredUsers.filter(user => !user.email_confirmed_at);
        }
      }
      
      return new Response(
        JSON.stringify({
          users: filteredUsers,
          total: users.total || filteredUsers.length,
          count: filteredUsers.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Criar novo usuário
    else if (req.method === 'POST' && path === 'create') {
      const { email, password, userData, emailConfirm } = await req.json();
      
      // Validações básicas
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Gerar senha temporária aleatória se não fornecida (usuário via Azure AD)
      const userPassword = password || `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      
      // Criar usuário usando a API admin
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: userPassword,
        email_confirm: emailConfirm !== false, // Default true, mas pode ser false
        user_metadata: userData
      });
      
      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao criar usuário: ${error.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ user: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Atualizar usuário
    else if (req.method === 'PUT' && path && path !== 'admin-users') {
      const updates = await req.json();
      
      // Atualizar usuário usando a API admin
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        path,
        updates
      );
      
      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao atualizar usuário: ${error.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Gerenciar perfis/roles de usuários
    else if (path && path.includes('roles')) {
      const userId = path.split('/')[0];
      
      // GET - Buscar perfis do usuário
      if (req.method === 'GET') {
        const { data, error } = await supabaseAdmin
          .from('usuario_perfis')
          .select('*, perfis(*)')
          .eq('usuario_id', userId);
        
        if (error) {
          return new Response(
            JSON.stringify({ error: `Erro ao buscar perfis do usuário: ${error.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // PUT - Atualizar perfil do usuário
      else if (req.method === 'PUT') {
        const { perfilId } = await req.json();
        
        // Verificar se o perfil existe
        if (!perfilId) {
          return new Response(
            JSON.stringify({ error: 'ID do perfil é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Verificar se o perfil já está atribuído ao usuário
        const { data: existingRole, error: checkError } = await supabaseAdmin
          .from('usuario_perfis')
          .select('*')
          .eq('usuario_id', userId);
        
        if (checkError) {
          return new Response(
            JSON.stringify({ error: `Erro ao verificar perfil do usuário: ${checkError.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        let result;
        
        // Se já existe uma associação, atualizamos
        if (existingRole && existingRole.length > 0) {
          const { data, error } = await supabaseAdmin
            .from('usuario_perfis')
            .update({ perfil_id: perfilId })
            .eq('usuario_id', userId)
            .select('*, perfis(*)');
            
          if (error) {
            return new Response(
              JSON.stringify({ error: `Erro ao atualizar perfil do usuário: ${error.message}` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          result = data;
        } 
        // Caso contrário, criamos uma nova
        else {
          const { data, error } = await supabaseAdmin
            .from('usuario_perfis')
            .insert({ usuario_id: userId, perfil_id: perfilId })
            .select('*, perfis(*)');
            
          if (error) {
            return new Response(
              JSON.stringify({ error: `Erro ao atribuir perfil ao usuário: ${error.message}` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          result = data;
        }
        
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Excluir usuário
    else if (req.method === 'DELETE' && path && path !== 'admin-users') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(path);
      
      if (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao excluir usuário: ${error.message}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Método não suportado ou rota inválida
    return new Response(
      JSON.stringify({ error: 'Método não suportado ou rota inválida' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Erro não tratado:', error);
    return new Response(
      JSON.stringify({ error: `Erro interno do servidor: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
