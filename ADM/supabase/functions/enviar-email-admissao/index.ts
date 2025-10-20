import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Anexo {
  nome: string;
  url: string;
}

interface RequestBody {
  para: string[];
  cc?: string[];
  assunto: string;
  corpo_html: string;
  anexos: Anexo[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { para, cc, assunto, corpo_html, anexos }: RequestBody = await req.json();

    console.log("Enviando email para:", para);

    // Download anexos e converter para base64
    const anexosBase64 = await Promise.all(
      anexos.map(async (anexo) => {
        try {
          const response = await fetch(anexo.url);
          const buffer = await response.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          return {
            filename: anexo.nome,
            content: base64,
          };
        } catch (error) {
          console.error(`Erro ao baixar anexo ${anexo.nome}:`, error);
          return null;
        }
      })
    );

    const anexosValidos = anexosBase64.filter(a => a !== null);

    const emailResponse = await resend.emails.send({
      from: "Coordenação Administrativa <onboarding@resend.dev>",
      to: para,
      cc: cc,
      subject: assunto,
      html: corpo_html,
      attachments: anexosValidos as any,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
