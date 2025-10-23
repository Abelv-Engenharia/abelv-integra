import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // 2. Gerar prompt para a IA criar o relatório visual
    const prompt = gerarPromptRelatorio(dados);
    console.log('✅ Prompt gerado');

    // 3. Usar AI Gateway para gerar imagem do relatório
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Gateway error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const imageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageBase64) {
      throw new Error('Nenhuma imagem foi gerada pela IA');
    }

    console.log('✅ Imagem gerada pela IA');

    // 4. Converter base64 para buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // 5. Upload para Supabase Storage
    const filename = `hsa-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('relatorios-automaticos')
      .upload(`hsa/${filename}`, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;
    console.log('✅ Upload realizado:', filename);

    // 6. Obter URL pública
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

// Função para gerar prompt do relatório para a IA
function gerarPromptRelatorio(dados: any): string {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const periodoTexto = dados.filtros.data_inicial && dados.filtros.data_final
    ? `${new Date(dados.filtros.data_inicial).toLocaleDateString('pt-BR')} a ${new Date(dados.filtros.data_final).toLocaleDateString('pt-BR')}`
    : 'Todos os períodos';

  return `Crie uma imagem profissional de um relatório corporativo de Hora da Segurança (HSA) com as seguintes especificações:

LAYOUT:
- Orientação: Paisagem (landscape)
- Fundo: Gradiente suave azul claro para branco
- Design: Moderno e corporativo, com espaçamento adequado

CABEÇALHO:
- Título grande e em destaque: "RELATÓRIO - EXECUÇÃO DA HSA"
- Subtítulo: "Período: ${periodoTexto} | Gerado em: ${dataAtual}"
- Separador horizontal elegante abaixo do cabeçalho

CARDS DE INDICADORES (dispostos em grid 3x2):

Linha 1:
1. Card verde com borda esquerda verde escura:
   - Título: "Aderência HSA (real)"
   - Valor grande: "${dados.aderenciaReal}%"
   - Descrição pequena: "Realizadas vs Programadas"

2. Card azul com borda esquerda azul escura:
   - Título: "Aderência HSA (ajustada)"
   - Valor grande: "${dados.aderenciaAjustada}%"
   - Descrição pequena: "Incluindo não programadas"

3. Card roxo com borda esquerda roxa:
   - Título: "Inspeções Programadas"
   - Valor grande: "${dados.inspecoesProgramadas}"
   - Descrição pequena: "A realizar + Realizadas + Não realizadas"

Linha 2:
4. Card verde com borda esquerda verde escura:
   - Título: "Inspeções Realizadas"
   - Valor grande: "${dados.realizadas}"
   - Descrição pequena: "Inspeções concluídas"

5. Card laranja/âmbar com borda esquerda:
   - Título: "Não Programadas"
   - Valor grande: "${dados.realizadasNaoProgramadas}"
   - Descrição pequena: "Realizadas não programadas"

6. Card vermelho com borda esquerda vermelha:
   - Título: "Não Realizadas"
   - Valor grande: "${dados.naoRealizadas}"
   - Descrição pequena: "Inspeções não executadas"

ESTILO DOS CARDS:
- Fundo branco com sombra suave
- Bordas arredondadas
- Títulos em cinza médio, fonte menor
- Valores em fonte grande e negrito, cor escura
- Descrições em fonte pequena, cor cinza claro
- Espaçamento adequado entre elementos

RODAPÉ:
- Texto pequeno centralizado: "Relatório gerado automaticamente pelo Sistema ABELV"
- Cor do texto: cinza claro

IMPORTANTE:
- Use cores profissionais e harmoniosas
- Mantenha boa legibilidade
- Use tipografia corporativa
- Certifique-se de que todos os números estão claramente visíveis
- Layout limpo e organizado
- Alta resolução e qualidade profissional`;
}
