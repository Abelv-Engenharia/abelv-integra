import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SolicitacaoData {
  id: string;
  numeroSolicitacao: number;
  solicitanteId: string;
  solicitanteNome: string;
  tipoServico: string;
  responsavelAprovacaoId?: string;
  aprovadoPor?: string;
  justificativaAprovacao?: string;
  justificativaReprovacao?: string;
}

interface NotificationPayload {
  evento: 'solicitacao_criada' | 'solicitacao_aprovada' | 'solicitacao_reprovada' | 'solicitacao_emitida';
  solicitacao: SolicitacaoData;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = 'https://xexgdtlctyuycohzhmuu.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: NotificationPayload = await req.json();
    console.log('📩 Evento recebido:', payload.evento, 'para solicitação:', payload.solicitacao.numeroSolicitacao);
    console.log('📋 Payload completo:', JSON.stringify(payload, null, 2));
    console.log('👤 Responsável aprovação ID:', payload.solicitacao.responsavelAprovacaoId);

    const { evento, solicitacao } = payload;
    const notificacoes: Array<{
      usuario_id: string;
      titulo: string;
      mensagem: string;
      tipo: string;
      solicitacao_id: string;
    }> = [];

    // Determinar destinatários e mensagens
    switch (evento) {
      case 'solicitacao_criada':
        if (!solicitacao.responsavelAprovacaoId) {
          console.warn('⚠️ Solicitação sem responsável de aprovação definido');
          return new Response(
            JSON.stringify({ 
              success: true, 
              count: 0, 
              message: 'Nenhuma notificação criada - sem responsável de aprovação' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        notificacoes.push({
          usuario_id: solicitacao.responsavelAprovacaoId,
          titulo: 'Nova solicitação aguardando aprovação',
          mensagem: `${solicitacao.solicitanteNome} criou a solicitação #${solicitacao.numeroSolicitacao} (${solicitacao.tipoServico})`,
          tipo: 'solicitacao',
          solicitacao_id: solicitacao.id,
        });
        break;

      case 'solicitacao_aprovada':
        // Notificar solicitante
        notificacoes.push({
          usuario_id: solicitacao.solicitanteId,
          titulo: 'Solicitação aprovada',
          mensagem: `Sua solicitação #${solicitacao.numeroSolicitacao} foi aprovada por ${solicitacao.aprovadoPor || 'gestor'}${solicitacao.justificativaAprovacao ? ': ' + solicitacao.justificativaAprovacao : ''}`,
          tipo: 'solicitacao',
          solicitacao_id: solicitacao.id,
        });
        break;

      case 'solicitacao_reprovada':
        // Notificar solicitante
        notificacoes.push({
          usuario_id: solicitacao.solicitanteId,
          titulo: 'Solicitação reprovada',
          mensagem: `Sua solicitação #${solicitacao.numeroSolicitacao} foi reprovada${solicitacao.justificativaReprovacao ? ': ' + solicitacao.justificativaReprovacao : ''}`,
          tipo: 'solicitacao',
          solicitacao_id: solicitacao.id,
        });
        break;

      case 'solicitacao_emitida':
        // Notificar solicitante
        notificacoes.push({
          usuario_id: solicitacao.solicitanteId,
          titulo: 'Solicitação emitida',
          mensagem: `Sua solicitação #${solicitacao.numeroSolicitacao} (${solicitacao.tipoServico}) foi emitida e está pronta para uso`,
          tipo: 'solicitacao',
          solicitacao_id: solicitacao.id,
        });
        break;

      default:
        throw new Error(`Evento desconhecido: ${evento}`);
    }

    // Inserir notificações no banco
    if (notificacoes.length > 0) {
      console.log('📝 Notificações a serem inseridas:', JSON.stringify(notificacoes, null, 2));
      const { error } = await supabase.from('notificacoes').insert(notificacoes);

      if (error) {
        console.error('❌ Erro ao criar notificações:', error);
        throw error;
      }

      console.log(`✅ ${notificacoes.length} notificação(ões) criada(s) com sucesso`);
    }

    return new Response(
      JSON.stringify({ success: true, count: notificacoes.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erro ao processar notificação:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
