import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnexoEmail {
  nome: string;
  url: string;
}

interface RequestBody {
  assunto: string;
  corpo_html: string;
  destinatarios: string[];
  cc?: string[];
  anexos: AnexoEmail[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assunto, corpo_html, destinatarios, cc, anexos }: RequestBody = await req.json();

    console.log(`📧 Enviando e-mail de validação de contrato: ${assunto}`);
    console.log(`📬 Destinatários: ${destinatarios.join(", ")}`);
    console.log(`📎 Anexos: ${anexos.length}`);

    // Baixar anexos e converter para base64
    const anexosBase64 = await Promise.all(
      anexos.map(async (anexo) => {
        try {
          console.log(`⬇️ Baixando anexo: ${anexo.nome} de ${anexo.url}`);
          const response = await fetch(anexo.url);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ${anexo.url}: ${response.statusText}`);
          }
          
          const buffer = await response.arrayBuffer();
          const base64 = btoa(
            String.fromCharCode(...new Uint8Array(buffer))
          );
          
          console.log(`✅ Anexo convertido: ${anexo.nome}`);
          
          return {
            filename: anexo.nome,
            content: base64,
          };
        } catch (error) {
          console.error(`❌ Erro ao processar anexo ${anexo.nome}:`, error);
          throw error;
        }
      })
    );

    console.log(`📤 Enviando e-mail via Resend...`);

    const emailResponse = await resend.emails.send({
      from: "Gestão de Contratos - ABELV <onboarding@resend.dev>",
      to: destinatarios,
      cc: cc || [],
      subject: assunto,
      html: corpo_html,
      attachments: anexosBase64,
    });

    console.log("✅ E-mail enviado com sucesso:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "E-mail enviado com sucesso",
        email_id: emailResponse.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Erro ao enviar e-mail:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
