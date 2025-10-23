import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cca_id, data_inicial, data_final } = await req.json();
    const startTime = Date.now();

    console.log('📊 Gerando relatório HSA...', { cca_id, data_inicial, data_final });

    // 1. Buscar dados HSA
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const dados = await buscarDadosHSA(supabase, { cca_id, data_inicial, data_final });
    console.log('✅ Dados HSA buscados:', dados);

    // 2. Gerar HTML do relatório
    const html = gerarHTMLRelatorio(dados);
    console.log('✅ HTML gerado');

    // 3. Usar Puppeteer para tirar screenshot
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 2000 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Aguardar renderização completa (similar ao frontend)
    await page.waitForTimeout(2000);

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 95,
      fullPage: true
    });

    await browser.close();
    console.log('✅ Screenshot gerado');

    // 4. Upload para Supabase Storage
    const filename = `hsa-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('relatorios-automaticos')
      .upload(`hsa/${filename}`, screenshot, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;
    console.log('✅ Upload realizado:', filename);

    // 5. Obter URL pública
    const { data: urlData } = supabase.storage
      .from('relatorios-automaticos')
      .getPublicUrl(`hsa/${filename}`);

    const tempoTotal = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        anexo_url: urlData.publicUrl,
        tempo_geracao_ms: tempoTotal,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Erro ao gerar relatório:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Função para buscar dados HSA
async function buscarDadosHSA(supabase: any, filtros: any) {
  let query = supabase
    .from('execucao_hsa')
    .select('status, desvios_identificados, responsavel_inspecao, cca_id');

  if (filtros.cca_id) {
    query = query.eq('cca_id', filtros.cca_id);
  }

  if (filtros.data_inicial) {
    query = query.gte('data', filtros.data_inicial);
  }

  if (filtros.data_final) {
    query = query.lte('data', filtros.data_final);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Processar dados (mesma lógica do InspecoesSummaryCards)
  const summary = {
    totalInspecoes: data?.length || 0,
    realizadas: 0,
    aRealizar: 0,
    naoRealizadas: 0,
    realizadasNaoProgramadas: 0,
    canceladas: 0,
    desviosIdentificados: 0,
  };

  data?.forEach((item: any) => {
    const status = (item.status || '').toUpperCase();
    switch (status) {
      case 'A REALIZAR':
        summary.aRealizar++;
        break;
      case 'REALIZADA':
        summary.realizadas++;
        break;
      case 'NÃO REALIZADA':
        summary.naoRealizadas++;
        break;
      case 'REALIZADA (NÃO PROGRAMADA)':
        summary.realizadasNaoProgramadas++;
        break;
      case 'CANCELADA':
        summary.canceladas++;
        break;
    }
    summary.desviosIdentificados += item.desvios_identificados || 0;
  });

  const inspecoesProgramadas = summary.aRealizar + summary.realizadas + summary.naoRealizadas;
  const aderenciaReal = inspecoesProgramadas > 0 
    ? ((summary.realizadas / inspecoesProgramadas) * 100).toFixed(2) 
    : "0.00";

  const realizadasAjustadas = summary.realizadas + summary.realizadasNaoProgramadas;
  const aderenciaAjustada = inspecoesProgramadas > 0 
    ? ((realizadasAjustadas / inspecoesProgramadas) * 100).toFixed(2) 
    : "0.00";

  return {
    ...summary,
    inspecoesProgramadas,
    aderenciaReal,
    aderenciaAjustada,
    filtros,
  };
}

// Função para gerar HTML do relatório
function gerarHTMLRelatorio(dados: any): string {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const periodoTexto = dados.filtros.data_inicial && dados.filtros.data_final
    ? `${new Date(dados.filtros.data_inicial).toLocaleDateString('pt-BR')} a ${new Date(dados.filtros.data_final).toLocaleDateString('pt-BR')}`
    : 'Todos os períodos';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          background: #f8fafc;
          padding: 40px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          height: 60px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          margin: 10px 0;
        }
        .subtitle {
          font-size: 14px;
          color: #64748b;
        }
        .cards-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card.green { border-left: 4px solid #22c55e; }
        .card.blue { border-left: 4px solid #3b82f6; }
        .card.purple { border-left: 4px solid #a855f7; }
        .card.amber { border-left: 4px solid #f59e0b; }
        .card.red { border-left: 4px solid #ef4444; }
        .card-title {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .card-value {
          font-size: 32px;
          font-weight: bold;
          color: #1e293b;
        }
        .card-description {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">RELATÓRIO - EXECUÇÃO DA HSA</div>
        <div class="subtitle">
          Período: ${periodoTexto} | Gerado em: ${dataAtual}
        </div>
      </div>
      
      <div class="cards-container">
        <div class="card green">
          <div class="card-title">Aderência HSA (real)</div>
          <div class="card-value">${dados.aderenciaReal}%</div>
          <div class="card-description">Realizadas vs Programadas</div>
        </div>
        
        <div class="card blue">
          <div class="card-title">Aderência HSA (ajustada)</div>
          <div class="card-value">${dados.aderenciaAjustada}%</div>
          <div class="card-description">Incluindo não programadas</div>
        </div>
        
        <div class="card purple">
          <div class="card-title">Inspeções Programadas</div>
          <div class="card-value">${dados.inspecoesProgramadas}</div>
          <div class="card-description">A realizar + Realizadas + Não realizadas</div>
        </div>
        
        <div class="card green">
          <div class="card-title">Inspeções Realizadas</div>
          <div class="card-value">${dados.realizadas}</div>
          <div class="card-description">Inspeções concluídas</div>
        </div>
        
        <div class="card amber">
          <div class="card-title">Não Programadas</div>
          <div class="card-value">${dados.realizadasNaoProgramadas}</div>
          <div class="card-description">Realizadas não programadas</div>
        </div>
        
        <div class="card red">
          <div class="card-title">Não Realizadas</div>
          <div class="card-value">${dados.naoRealizadas}</div>
          <div class="card-description">Inspeções não executadas</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
