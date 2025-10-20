import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Buscar contratos ativos
    const { data: contratos, error: contratosError } = await supabase
      .from('contratos_alojamento')
      .select('*')
      .eq('status', 'ativo');
    
    if (contratosError) throw contratosError;
    
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    // Para cada contrato, verificar se precisa gerar alerta para o mês atual
    for (const contrato of contratos) {
      const dataInicio = new Date(contrato.inicio_locacao);
      const dataFim = new Date(contrato.fim_locacao);
      
      // Verificar se o contrato está vigente no mês atual
      if (dataInicio <= hoje && dataFim >= hoje) {
        const competencia = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}`;
        const dataReferencia = new Date(anoAtual, mesAtual, 1);
        
        // Verificar se já existe alerta para este mês
        const { data: alertaExistente } = await supabase
          .from('alertas_medicao_aluguel')
          .select('id')
          .eq('contrato_id', contrato.id)
          .eq('competencia', competencia)
          .single();
        
        if (!alertaExistente) {
          // Criar alerta
          const { error: insertError } = await supabase
            .from('alertas_medicao_aluguel')
            .insert({
              contrato_id: contrato.id,
              cca_codigo: contrato.cca_codigo,
              data_referencia: dataReferencia.toISOString().split('T')[0],
              competencia,
              status: 'pendente',
            });
          
          if (insertError) {
            console.error(`Erro ao criar alerta para contrato ${contrato.codigo}:`, insertError);
          } else {
            console.log(`Alerta criado para contrato ${contrato.codigo} - ${competencia}`);
          }
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Alertas de medição gerados com sucesso',
        processados: contratos.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro ao gerar alertas:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});