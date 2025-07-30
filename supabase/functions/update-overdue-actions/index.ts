import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Acao {
  tratativa_aplicada: string;
  data_adequacao: string | null;
  responsavel_acao: string;
  funcao_responsavel: string;
  situacao: string;
  status: string;
}

interface Ocorrencia {
  id: string;
  acoes: Acao[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar todas as ocorrências que têm ações com data de adequação no passado
    const { data: ocorrencias, error: fetchError } = await supabase
      .from('ocorrencias')
      .select('id, acoes')
      .not('acoes', 'is', null)

    if (fetchError) {
      console.error('Erro ao buscar ocorrências:', fetchError)
      throw fetchError
    }

    if (!ocorrencias || ocorrencias.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Nenhuma ocorrência encontrada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0) // Considerar apenas a data, não o horário
    let atualizacoesRealizadas = 0

    // Processar cada ocorrência
    for (const ocorrencia of ocorrencias as Ocorrencia[]) {
      if (!ocorrencia.acoes || !Array.isArray(ocorrencia.acoes)) continue

      let acoesAtualizadas = false
      const acoesModificadas = ocorrencia.acoes.map((acao: Acao) => {
        // Verificar se a ação tem data de adequação e não está concluída
        const statusUpper = acao.status.toUpperCase();
        const situacaoUpper = acao.situacao.toUpperCase();
        
        if (acao.data_adequacao && 
            !['CONCLUÍDO', 'CONCLUIDO', 'CANCELADO'].includes(statusUpper) &&
            !['CONCLUÍDA', 'CONCLUIDA', 'CANCELADA'].includes(situacaoUpper)) {
          
          const dataAdequacao = new Date(acao.data_adequacao)
          dataAdequacao.setHours(0, 0, 0, 0)
          
          // Se a data de adequação já passou
          if (dataAdequacao < hoje) {
            console.log(`Ação atrasada encontrada na ocorrência ${ocorrencia.id}:`, {
              tratativa: acao.tratativa_aplicada.substring(0, 50) + '...',
              data_adequacao: acao.data_adequacao,
              status_atual: acao.status,
              situacao_atual: acao.situacao
            })
            
            acoesAtualizadas = true
            return {
              ...acao,
              status: 'Atrasado',
              situacao: 'Pendente'
            }
          }
        }
        
        return acao
      })

      // Se houve mudanças, atualizar no banco
      if (acoesAtualizadas) {
        // Calcular o status geral da ocorrência baseado nas ações
        const todasConcluidas = acoesModificadas.every((acao: Acao) => {
          const statusUpper = acao.status.toUpperCase();
          const situacaoUpper = acao.situacao.toUpperCase();
          return ['CONCLUÍDO', 'CONCLUIDO', 'CANCELADO'].includes(statusUpper) ||
                 ['CONCLUÍDA', 'CONCLUIDA', 'CANCELADA'].includes(situacaoUpper);
        });
        
        const algumaAtrasada = acoesModificadas.some((acao: Acao) => 
          acao.status.toUpperCase() === 'ATRASADO'
        );
        
        const algumaEmExecucao = acoesModificadas.some((acao: Acao) => 
          acao.status.toUpperCase().includes('EXECUÇÃO') || acao.status.toUpperCase().includes('EXECUCAO')
        );
        
        let statusGeral = 'Em tratativa';
        if (todasConcluidas) {
          statusGeral = 'Concluído';
        } else if (algumaAtrasada) {
          statusGeral = 'Em tratativa'; // Manter como tratativa, mas com indicação visual
        } else if (algumaEmExecucao) {
          statusGeral = 'Em execução';
        }

        const { error: updateError } = await supabase
          .from('ocorrencias')
          .update({ 
            acoes: acoesModificadas,
            status: statusGeral
          })
          .eq('id', ocorrencia.id)

        if (updateError) {
          console.error(`Erro ao atualizar ocorrência ${ocorrencia.id}:`, updateError)
        } else {
          atualizacoesRealizadas++
          console.log(`Ocorrência ${ocorrencia.id} atualizada - Status: ${statusGeral}`)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processamento concluído. ${atualizacoesRealizadas} ocorrências atualizadas.`,
        atualizacoes: atualizacoesRealizadas,
        processadas: ocorrencias.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro na função update-overdue-actions:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})