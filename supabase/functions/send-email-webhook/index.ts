import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfiguracaoEmail {
  id: string;
  assunto: string;
  destinatarios: string[];
  mensagem: string;
  periodicidade: string;
  dia_semana: string | null;
  hora_envio: string;
  tipo_relatorio: string | null;
  periodo_dias: number | null;
  anexo_url: string | null;
  cca_id: number | null;
  webhook_url: string | null;
  ativo: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      "https://xexgdtlctyuycohzhmuu.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGdkdGxjdHl1eWNvaHpobXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY0NTMsImV4cCI6MjA2MTQ1MjQ1M30.hbqL05Y8UMfVaOa4nbDQNClCfjk_yRg_dtoL09_yGyo"
    );

    // Verificar se é um teste de configuração específica
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const testConfigId = body.configuracao_id;

    let query = supabase
      .from('configuracoes_emails')
      .select('*')
      .eq('ativo', true)
      .not('webhook_url', 'is', null);

    // Se for teste de configuração específica, buscar apenas ela
    if (testConfigId) {
      query = query.eq('id', testConfigId);
    }

    // Buscar configurações ativas com webhook configurado
    const { data: configuracoes, error: configError } = await query;

    if (configError) throw configError;

    console.log(`Encontradas ${configuracoes?.length || 0} configurações com webhook`);

    const now = new Date();
    const currentWeekday = now.getDay();
    const currentDay = now.getDate();
    const currentHour = now.getHours();

    const results = [];

    for (const config of (configuracoes || [])) {
      const configHour = parseInt(config.hora_envio.split(':')[0]);
      
      // Verificar se está na hora de enviar
      if (configHour !== currentHour) {
        console.log(`Configuração ${config.id}: não é a hora (${configHour} vs ${currentHour})`);
        continue;
      }

      // Verificar periodicidade
      let shouldSend = false;
      
      switch (config.periodicidade) {
        case 'diario':
          shouldSend = true;
          break;
        case 'semanal':
          const diaSemanaMap: { [key: string]: number } = {
            'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3,
            'quinta': 4, 'sexta': 5, 'sabado': 6
          };
          shouldSend = diaSemanaMap[config.dia_semana || ''] === currentWeekday;
          break;
        case 'quinzenal':
          shouldSend = currentDay === 1 || currentDay === 15;
          break;
        case 'mensal':
          shouldSend = currentDay === 1;
          break;
      }

      if (!shouldSend) {
        console.log(`Configuração ${config.id}: não é o momento de enviar`);
        continue;
      }

      // Montar payload para o webhook
      const payload = {
        configuracao_id: config.id,
        assunto: config.assunto,
        destinatarios: config.destinatarios,
        mensagem: config.mensagem,
        periodicidade: config.periodicidade,
        dia_semana: config.dia_semana,
        hora_envio: config.hora_envio,
        tipo_relatorio: config.tipo_relatorio,
        periodo_dias: config.periodo_dias,
        anexo_url: config.anexo_url,
        cca_id: config.cca_id,
        timestamp: now.toISOString()
      };

      console.log(`Enviando webhook para configuração ${config.id}`);

      // Enviar para o webhook N8N
      try {
        const webhookResponse = await fetch(config.webhook_url!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        const responseBody = await webhookResponse.text();

        // Registrar log do envio
        await supabase
          .from('webhook_logs')
          .insert({
            configuracao_id: config.id,
            webhook_url: config.webhook_url,
            payload: payload,
            status_code: webhookResponse.status,
            response_body: responseBody,
            sucesso: webhookResponse.ok,
            erro_mensagem: webhookResponse.ok ? null : `Status ${webhookResponse.status}: ${responseBody}`
          });

        results.push({
          configuracao_id: config.id,
          sucesso: webhookResponse.ok,
          status_code: webhookResponse.status
        });

        console.log(`Webhook enviado com sucesso para ${config.id}: ${webhookResponse.status}`);

      } catch (webhookError: any) {
        console.error(`Erro ao enviar webhook para ${config.id}:`, webhookError);

        // Registrar erro no log
        await supabase
          .from('webhook_logs')
          .insert({
            configuracao_id: config.id,
            webhook_url: config.webhook_url,
            payload: payload,
            status_code: null,
            response_body: null,
            sucesso: false,
            erro_mensagem: webhookError.message
          });

        results.push({
          configuracao_id: config.id,
          sucesso: false,
          erro: webhookError.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processadas ${results.length} configurações`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Erro geral:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
