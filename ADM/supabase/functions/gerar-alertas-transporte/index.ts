import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Iniciando geração de alertas de transporte...');

    // Buscar todos os CCAs com destinatários ativos
    const { data: destinatarios, error: destError } = await supabaseClient
      .from('destinatarios_transporte')
      .select('*')
      .eq('ativo', true);

    if (destError) {
      console.error('Erro ao buscar destinatários:', destError);
      throw destError;
    }

    console.log(`Encontrados ${destinatarios?.length || 0} destinatários ativos`);

    const hoje = new Date();
    const mesReferencia = hoje.toLocaleString('pt-BR', { month: 'long' });
    const anoReferencia = hoje.getFullYear();
    
    // Agrupar destinatários por CCA
    const destinatariosPorCCA = destinatarios?.reduce((acc: any, dest: any) => {
      if (!acc[dest.cca_codigo]) {
        acc[dest.cca_codigo] = [];
      }
      acc[dest.cca_codigo].push(dest.email);
      return acc;
    }, {});

    // Criar alertas para cada CCA
    for (const [ccaCodigo, emails] of Object.entries(destinatariosPorCCA)) {
      // Verificar se já existe alerta para este mês
      const { data: alertaExistente } = await supabaseClient
        .from('alertas_medicao_transporte')
        .select('id')
        .eq('cca_codigo', ccaCodigo)
        .eq('mes_referencia', mesReferencia)
        .eq('ano_referencia', anoReferencia)
        .maybeSingle();

      if (!alertaExistente) {
        console.log(`Criando alerta para CCA ${ccaCodigo}`);
        
        const { error: insertError } = await supabaseClient
          .from('alertas_medicao_transporte')
          .insert({
            cca_codigo: ccaCodigo,
            mes_referencia: mesReferencia,
            ano_referencia: anoReferencia,
            data_referencia: hoje.toISOString().split('T')[0],
            status: 'pendente',
            destinatarios: emails as string[]
          });

        if (insertError) {
          console.error(`Erro ao criar alerta para CCA ${ccaCodigo}:`, insertError);
        } else {
          console.log(`Alerta criado com sucesso para CCA ${ccaCodigo}`);
        }
      } else {
        console.log(`Alerta já existe para CCA ${ccaCodigo} no mês ${mesReferencia}/${anoReferencia}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Alertas processados com sucesso',
        totalDestinatarios: destinatarios?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro ao gerar alertas:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});