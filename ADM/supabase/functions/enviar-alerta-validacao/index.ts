import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertaRequest {
  emails: string;
  bloco: string;
  nomeContrato: string;
  obraVinculada?: string;
  responsavel: string;
  linkDireto: string;
  dadosValidacao?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      emails,
      bloco,
      nomeContrato,
      obraVinculada,
      responsavel,
      linkDireto,
      dadosValidacao,
    }: AlertaRequest = await req.json();

    console.log("Enviando alerta de validação:", { bloco, emails });

    const listaEmails = emails.split(",").map((e) => e.trim()).filter((e) => e);

    if (listaEmails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum e-mail válido fornecido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const assunto = `Validação pendente – ${bloco} – ${nomeContrato}`;

    const corpoHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .info-item { margin: 10px 0; }
            .info-label { font-weight: bold; color: #4b5563; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 Nova Validação Pendente</h2>
            </div>
            <div class="content">
              <p>Olá,</p>
              <p>Uma nova solicitação de validação foi enviada e requer sua atenção:</p>
              
              <div class="info-item">
                <span class="info-label">Bloco:</span> ${bloco}
              </div>
              <div class="info-item">
                <span class="info-label">Contrato/Imóvel:</span> ${nomeContrato}
              </div>
              ${obraVinculada ? `<div class="info-item"><span class="info-label">Obra:</span> ${obraVinculada}</div>` : ""}
              <div class="info-item">
                <span class="info-label">Enviado por:</span> ${responsavel}
              </div>
              <div class="info-item">
                <span class="info-label">Data/Hora:</span> ${new Date().toLocaleString("pt-BR")}
              </div>
              
              ${dadosValidacao ? `
                <div style="margin-top: 20px; padding: 15px; background-color: white; border-left: 4px solid #2563eb;">
                  <h3 style="margin-top: 0;">Dados para Validação:</h3>
                  <pre style="white-space: pre-wrap; font-size: 12px;">${JSON.stringify(dadosValidacao, null, 2)}</pre>
                </div>
              ` : ""}
              
              <a href="${linkDireto}" class="button">Acessar Sistema para Validar</a>
              
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                Por favor, acesse o sistema e realize a validação o mais breve possível.
              </p>
            </div>
            <div class="footer">
              <p>Este é um e-mail automático do Sistema de Gestão de Contratos ABELV.</p>
              <p>Não responda este e-mail.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const promises = listaEmails.map((email) =>
      resend.emails.send({
        from: "Gestão ABELV <onboarding@resend.dev>",
        to: [email],
        subject: assunto,
        html: corpoHtml,
      })
    );

    const results = await Promise.allSettled(promises);

    const sucessos = results.filter((r) => r.status === "fulfilled").length;
    const falhas = results.filter((r) => r.status === "rejected").length;

    console.log(`Envio concluído: ${sucessos} sucessos, ${falhas} falhas`);

    return new Response(
      JSON.stringify({
        message: "Alertas enviados",
        sucessos,
        falhas,
        detalhes: results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar alertas:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
