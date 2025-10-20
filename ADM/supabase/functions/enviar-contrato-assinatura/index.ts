import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  analiseId: string;
  emailAssinatura: string;
  emailsCopia?: string[];
  nomeAlojamento: string;
  contratoPdfUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      analiseId,
      emailAssinatura,
      emailsCopia = [],
      nomeAlojamento,
      contratoPdfUrl,
    }: RequestBody = await req.json();

    console.log('Enviando contrato para assinatura:', {
      analiseId,
      emailAssinatura,
      nomeAlojamento,
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Buscar dados completos da análise
    const { data: analise, error: analiseError } = await supabase
      .from('analises_contratuais')
      .select('*')
      .eq('id', analiseId)
      .single();

    if (analiseError || !analise) {
      throw new Error('Análise não encontrada');
    }

    // Buscar histórico de aprovações
    const { data: aprovacoes } = await supabase
      .from('aprovacoes_analise')
      .select('*')
      .eq('analise_id', analiseId)
      .order('created_at', { ascending: true });

    // Gerar corpo do email
    const corpoHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .section {
              margin-bottom: 25px;
              background: white;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #059669;
            }
            .section h3 {
              margin-top: 0;
              color: #059669;
            }
            .approval-item {
              padding: 10px;
              margin: 5px 0;
              background: #f0fdf4;
              border-radius: 5px;
            }
            .info-row {
              display: flex;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .info-label {
              font-weight: bold;
              min-width: 180px;
              color: #6b7280;
            }
            .info-value {
              color: #111827;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              font-size: 12px;
            }
            .cta-button {
              display: inline-block;
              background: #059669;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✍️ Contrato Aprovado</h1>
              <h2 style="margin: 10px 0 0 0; font-weight: normal;">${nomeAlojamento}</h2>
            </div>
            
            <div class="content">
              <div class="section">
                <h3>✅ Aprovações Concluídas</h3>
                <p>O contrato de alojamento passou por todas as aprovações necessárias:</p>
                ${aprovacoes?.map(apr => `
                  <div class="approval-item">
                    <strong>${apr.bloco === 'card1' ? '📋 ADM Matricial' : 
                             apr.bloco === 'card2' ? '💰 Financeiro' : 
                             apr.bloco === 'card5' ? '🧮 Gestor/Superintendência' : 
                             '📑 Superintendência (Documentação)'}</strong>
                    - ${apr.acao === 'aprovado' ? '✅ Aprovado' : '💬 Comentou'} por ${apr.aprovador}
                    ${apr.comentario ? `<br><em>Observação: ${apr.comentario}</em>` : ''}
                  </div>
                `).join('') || '<p>Sem histórico de aprovações registrado.</p>'}
              </div>

              <div class="section">
                <h3>📋 Resumo Do Contrato</h3>
                <div class="info-row">
                  <span class="info-label">Tipo de Locador:</span>
                  <span class="info-value">${analise.tipo_locador === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Locador:</span>
                  <span class="info-value">${analise.fornecedor_nome || analise.nome_proprietario}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Endereço:</span>
                  <span class="info-value">${analise.logradouro}, ${analise.numero} - ${analise.bairro}, ${analise.cidade}/${analise.uf}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nº Contrato:</span>
                  <span class="info-value">${analise.numero_contrato}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Valor Mensal:</span>
                  <span class="info-value">R$ ${Number(analise.valor_mensal || 0).toFixed(2)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Prazo:</span>
                  <span class="info-value">${analise.prazo_contratual} meses</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Vigência:</span>
                  <span class="info-value">${new Date(analise.data_inicio_contrato).toLocaleDateString('pt-BR')} a ${new Date(analise.data_fim_contrato).toLocaleDateString('pt-BR')}</span>
                </div>
                ${analise.tipo_locador === 'pf' && analise.ir_valor_retido > 0 ? `
                <div class="info-row">
                  <span class="info-label">IR Retido:</span>
                  <span class="info-value">R$ ${Number(analise.ir_valor_retido || 0).toFixed(2)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Valor Líquido:</span>
                  <span class="info-value">R$ ${Number(analise.valor_liquido_pagar || 0).toFixed(2)}</span>
                </div>
                ` : ''}
              </div>

              <div class="section">
                <h3>📄 Próximos Passos</h3>
                <p>O contrato está anexado a este email. Por favor:</p>
                <ol>
                  <li>Revise o documento anexo</li>
                  <li>Providencie a assinatura</li>
                  <li>Retorne o contrato assinado</li>
                </ol>
              </div>

              <div style="text-align: center;">
                <p style="font-size: 14px; color: #6b7280;">
                  Em caso de dúvidas, entre em contato com a equipe administrativa.
                </p>
              </div>
            </div>

            <div class="footer">
              <p>Sistema de Gestão de Alojamentos - ABELV</p>
              <p>Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Fazer download do PDF do contrato para anexar
    let anexos = [];
    if (contratoPdfUrl) {
      try {
        const pdfResponse = await fetch(contratoPdfUrl);
        const pdfBlob = await pdfResponse.blob();
        const pdfBuffer = await pdfBlob.arrayBuffer();
        const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
        
        anexos.push({
          filename: `Contrato_${analise.numero_contrato.replace(/\s/g, '_')}.pdf`,
          content: pdfBase64,
        });
      } catch (error) {
        console.error('Erro ao anexar PDF:', error);
      }
    }

    // Preparar lista de destinatários
    const destinatarios = [emailAssinatura, ...emailsCopia].filter(Boolean);

    // Enviar email com Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Gestão de Alojamentos <onboarding@resend.dev>',
      to: destinatarios,
      subject: `✍️ Contrato Aprovado - ${nomeAlojamento}`,
      html: corpoHTML,
      attachments: anexos,
    });

    if (emailError) {
      console.error('Erro no Resend:', emailError);
      throw emailError;
    }

    console.log('Email enviado com sucesso:', emailData);

    // Registrar envio no log
    await supabase
      .from('logs_alertas_validacao')
      .insert({
        analise_id: analiseId,
        bloco: 'assinatura',
        status: 'enviado',
        emails_enviados: destinatarios.join(', '),
        detalhes: {
          nomeAlojamento,
          numeroContrato: analise.numero_contrato,
          emailId: emailData?.id,
        },
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado com sucesso',
        emailId: emailData?.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
