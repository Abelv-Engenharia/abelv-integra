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
    const { analiseId, card, acao, emailProximo, comentario } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Buscar dados da análise
    const { data: analise } = await supabase
      .from('analises_contratuais')
      .select('*')
      .eq('id', analiseId)
      .single();
    
    if (!analise) {
      throw new Error('Análise não encontrada');
    }
    
    console.log(`Notificação: ${card} ${acao} - Email: ${emailProximo}`);
    console.log(`Contrato: ${analise.numero_contrato}`);
    console.log(`Comentário: ${comentario || 'Nenhum'}`);
    
    // Aqui você pode integrar com Resend ou outro serviço de e-mail
    // const assunto = `Aprovação de Contrato - ${card} - ${acao}`;
    // const corpo = `...`;
    // await enviarEmail(emailProximo, assunto, corpo);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notificação enviada' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro ao enviar notificação:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
