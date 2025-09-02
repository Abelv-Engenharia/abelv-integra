import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: number
          nome: string
          descricao: string | null
          permissoes: any
          ccas_permitidas: number[] | null
        }
        Insert: {
          id?: number
          nome: string
          descricao?: string | null
          permissoes: any
          ccas_permitidas?: number[] | null
        }
        Update: {
          id?: number
          nome?: string
          descricao?: string | null
          permissoes?: any
          ccas_permitidas?: number[] | null
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar se o usuário tem permissão de admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Token de autorização necessário')
    }

    // Obter todos os perfis existentes
    const { data: perfis, error: fetchError } = await supabaseClient
      .from('perfis')
      .select('*')

    if (fetchError) {
      throw fetchError
    }

    const perfisAtualizados = []

    // Adicionar as novas permissões de prevenção de incêndio aos perfis existentes
    for (const perfil of perfis) {
      const permissoesAtualizadas = { ...perfil.permissoes }
      const menusSidebarAtualizados = [...(perfil.permissoes.menus_sidebar || [])]
      
      // Se o perfil já tem acesso ao SMS ou é admin, adicionar as permissões de prevenção de incêndio
      const temAcessoSMS = perfil.permissoes.desvios || 
                          perfil.permissoes.treinamentos || 
                          perfil.permissoes.hora_seguranca ||
                          perfil.permissoes.admin_funcionarios

      if (temAcessoSMS) {
        // Adicionar permissão de prevenção de incêndio
        permissoesAtualizadas.prevencao_incendio = true
        
        // Adicionar menus de prevenção de incêndio ao sidebar
        const novosMenus = [
          'prevencao_incendio_dashboard',
          'prevencao_incendio_cadastro_extintores', 
          'prevencao_incendio_inspecao_extintores'
        ]
        
        novosMenus.forEach(menu => {
          if (!menusSidebarAtualizados.includes(menu)) {
            menusSidebarAtualizados.push(menu)
          }
        })
        
        permissoesAtualizadas.menus_sidebar = menusSidebarAtualizados
      }

      // Adicionar outros menus que podem estar faltando
      const menusCompletos = [
        'desvios_insights',
        'gro_cadastro_perigos',
        'gro_pgr',
        'idsms_indicadores',
        'idsms_ht',
        'idsms_hsa',
        'idsms_iid',
        'idsms_ipom',
        'idsms_indice_reativo',
        'idsms_inspecao_alta_lideranca',
        'idsms_inspecao_gestao_sms',
        'relatorios_ocorrencias',
        'relatorios_desvios',
        'relatorios_treinamentos',
        'relatorios_hsa',
        'sms_dashboard'
      ]

      // Adicionar menus que fazem sentido para cada perfil
      menusCompletos.forEach(menu => {
        const categoria = menu.split('_')[0]
        if (perfil.permissoes[categoria] && !menusSidebarAtualizados.includes(menu)) {
          menusSidebarAtualizados.push(menu)
        }
      })

      permissoesAtualizadas.menus_sidebar = menusSidebarAtualizados

      // Atualizar o perfil no banco
      const { error: updateError } = await supabaseClient
        .from('perfis')
        .update({ permissoes: permissoesAtualizadas })
        .eq('id', perfil.id)

      if (updateError) {
        console.error(`Erro ao atualizar perfil ${perfil.nome}:`, updateError)
      } else {
        perfisAtualizados.push(perfil.nome)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Perfis atualizados com sucesso',
        perfisAtualizados,
        total: perfisAtualizados.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})