
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destinatario, assunto, mensagem, documentoHtml } = await req.json();

    if (!destinatario || !assunto || !documentoHtml) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios ausentes." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enviar e-mail com Resend
    const emailResponse = await resend.emails.send({
      from: "Segurança do Trabalho <onboarding@resend.dev>",
      to: [destinatario],
      subject: assunto,
      html: `
        <div>
          <div style="margin-bottom:20px;">
            <p>${mensagem || "Segue relatório de não conformidade gerado pelo sistema."}</p>
          </div>
          <pre style="background:#f6f6f6;padding:15px;border-radius:6px;font-size:14px;white-space:pre-wrap;font-family:monospace;">${documentoHtml}</pre>
        </div>
      `,
    });

    if (emailResponse.error) {
      return new Response(JSON.stringify({ error: emailResponse.error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ result: "ok" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
