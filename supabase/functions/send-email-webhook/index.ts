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
    // Usar service_role key para bypass RLS (seguro porque roda no servidor)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔑 SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'NÃO CONFIGURADA');
    console.log('🔑 SERVICE_ROLE_KEY:', serviceRoleKey ? 'Configurada' : 'NÃO CONFIGURADA');
    
    const supabase = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    );

    // Verificar se é um teste de configuração específica
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const testConfigId = body.configuracao_id;

    console.log('📨 Body recebido:', JSON.stringify(body));
    console.log('🔍 Test Config ID:', testConfigId);

    let configuracoes;
    let configError;

    // Se for teste de configuração específica, buscar apenas ela (sem validar hora/periodicidade)
    if (testConfigId) {
      console.log(`🧪 Teste manual - Buscando configuração ${testConfigId}`);
      
      const { data, error } = await supabase
        .from('configuracoes_emails')
        .select('*')
        .eq('id', testConfigId)
        .eq('ativo', true)
        .not('webhook_url', 'is', null);
      
      configuracoes = data;
      configError = error;
      
      console.log('📊 Dados retornados:', JSON.stringify(data));
      console.log('❌ Erro na query:', error);
    } else {
      console.log('⏰ Chamada do cron - buscando todas configurações');
      
      // Chamada do cron - buscar todas as configurações ativas
      const { data, error } = await supabase
        .from('configuracoes_emails')
        .select('*')
        .eq('ativo', true)
        .not('webhook_url', 'is', null);
      
      configuracoes = data;
      configError = error;
    }

    if (configError) {
      console.error('❌ Erro ao buscar configurações:', configError);
      throw configError;
    }

    console.log(`✅ Encontradas ${configuracoes?.length || 0} configurações com webhook`);

    const now = new Date();
    const currentWeekday = now.getDay();
    const currentDay = now.getDate();
    const currentHour = now.getHours();

    const results = [];

    for (const config of (configuracoes || [])) {
      let shouldSend = false;

      // Se for teste manual, enviar sempre
      if (testConfigId) {
        shouldSend = true;
        console.log(`Teste manual da configuração ${config.id} - enviando imediatamente`);
      } else {
        // Chamada do cron - verificar hora e periodicidade
        const configHour = parseInt(config.hora_envio.split(':')[0]);
        
        // Verificar se está na hora de enviar
        if (configHour !== currentHour) {
          console.log(`Configuração ${config.id}: não é a hora (${configHour} vs ${currentHour})`);
          continue;
        }

        // Verificar periodicidade
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
      }

      // Gerar relatório automaticamente se configurado
      let anexoUrl = config.anexo_url;
      let anexoGerado = false;
      let tempoGeracaoMs = 0;

      if (config.tipo_relatorio === 'hsa') {
        console.log(`📊 Gerando relatório HSA para configuração ${config.id}...`);
        
        try {
          const { data: reportData, error: reportError } = await supabase.functions.invoke(
            'generate-hsa-report',
            {
              body: {
                cca_id: config.cca_id,
                data_inicial: config.data_inicial,
                data_final: config.data_final,
              }
            }
          );

          if (!reportError && reportData?.anexo_url) {
            anexoUrl = reportData.anexo_url;
            anexoGerado = true;
            tempoGeracaoMs = reportData.tempo_geracao_ms;
            console.log(`✅ Relatório gerado: ${anexoUrl} (${tempoGeracaoMs}ms)`);
          } else {
            console.error('❌ Erro ao gerar relatório:', reportError);
          }
        } catch (error: any) {
          console.error('❌ Exceção ao gerar relatório:', error);
        }
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
        anexo_url: anexoUrl,
        anexo_gerado: anexoGerado,
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
            erro_mensagem: webhookResponse.ok ? null : `Status ${webhookResponse.status}: ${responseBody}`,
            anexo_gerado: anexoGerado,
            anexo_url: anexoUrl,
            tempo_geracao_ms: tempoGeracaoMs
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
            erro_mensagem: webhookError.message,
            anexo_gerado: anexoGerado,
            anexo_url: anexoUrl,
            tempo_geracao_ms: tempoGeracaoMs
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
