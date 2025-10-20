import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Schemas de validação
const colaboradorAbelvSchema = z.object({
  nome: z.string().max(100),
  funcao: z.string().max(100),
  disciplina: z.string().max(50),
  classificacao: z.string().max(50),
});

const colaboradorTerceiroSchema = z.object({
  empresa: z.string().max(100).optional(),
  nome: z.string().max(100),
  funcao: z.string().max(100),
  disciplina: z.string().max(50).optional(),
  classificacao: z.string().max(50).optional(),
});

const requestSchema = z.object({
  cca: z.string().min(1).max(50).regex(/^[A-Z0-9\s\-]+$/),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  colaboradoresAbelv: z.array(colaboradorAbelvSchema).max(500),
  colaboradoresTerceiros: z.array(colaboradorTerceiroSchema).max(500),
  destinatarios: z.array(z.string().email()).min(1).max(10),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ColaboradorAbelv {
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
}

interface ColaboradorTerceiro {
  empresa: string;
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
}

interface DadosRelatorio {
  cca: string;
  data: string;
  colaboradoresAbelv: ColaboradorAbelv[];
  colaboradoresTerceiros: ColaboradorTerceiro[];
  destinatarios: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validar entrada
    const rawData = await req.json();
    const validationResult = requestSchema.safeParse(rawData);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: validationResult.error.issues 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { cca, data, colaboradoresAbelv, colaboradoresTerceiros, destinatarios } = validationResult.data;

    // Validar destinatários contra whitelist (apenas emails @abelv.com.br)
    const allowedDomains = ["abelv.com.br"];
    const validRecipients = destinatarios.filter(email =>
      allowedDomains.some(domain => email.toLowerCase().endsWith(`@${domain}`))
    );

    if (validRecipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid recipients. Only @abelv.com.br emails are allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Gerando relatório de efetivo para CCA: ${cca}, Data: ${data}`);

    const html = gerarHTMLRelatorio({
      cca,
      data,
      colaboradoresAbelv,
      colaboradoresTerceiros,
    });

    const emailResponse = await resend.emails.send({
      from: "Controle de Mão de Obra <onboarding@resend.dev>",
      to: validRecipients,
      subject: `Relatório de Efetivo - ${cca} - ${data}`,
      html,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Relatório enviado com sucesso",
      emailId: emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar relatório de efetivo:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Função auxiliar para escapar HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function agruparPorDisciplina(colaboradores: any[]) {
  const grupos: { [key: string]: any[] } = {};
  
  colaboradores.forEach(colab => {
    const disciplina = colab.disciplina || "Sem Disciplina";
    if (!grupos[disciplina]) {
      grupos[disciplina] = [];
    }
    grupos[disciplina].push(colab);
  });
  
  return grupos;
}

function gerarHTMLRelatorio(dados: any) {
  const { cca, data, colaboradoresAbelv, colaboradoresTerceiros } = dados;
  
  // Escapar valores antes de usar no HTML
  const ccaSafe = escapeHtml(cca);
  const dataSafe = escapeHtml(data);

  // Helper para normalizar classificação
  const isDireta = (c: any) => (c.classificacao || '').toLowerCase().includes('direta');

  // Calcular contadores
  const moDireta = colaboradoresAbelv.filter(isDireta).length;
  const moIndireta = colaboradoresAbelv.length - moDireta;
  const totalAbelv = colaboradoresAbelv.length;

  // Agrupar por disciplina (apenas DIRETA)
  const disciplinasAbelv = colaboradoresAbelv
    .filter(isDireta)
    .reduce((acc: any, col: any) => {
      const disc = col.disciplina || 'Outras';
      if (!acc[disc]) acc[disc] = 0;
      acc[disc]++;
      return acc;
    }, {});

  // Agrupar terceiros por função
  const terceirosMap = colaboradoresTerceiros.reduce((acc: any, col: any) => {
    const func = col.funcao || 'Outros';
    if (!acc[func]) acc[func] = 0;
    acc[func]++;
    return acc;
  }, {});

  const totalTerceiros = colaboradoresTerceiros.length;

  // Gerar linhas de disciplinas
  const linhasDisciplinas = Object.entries(disciplinasAbelv)
    .map(([disc, count]: [string, any]) => {
      const discSafe = escapeHtml(disc);
      return `
      <tr>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">${discSafe.toUpperCase()}</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${count}</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${count}</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">0</td>
      </tr>
    `}).join('');

  // Gerar linhas de terceiros
  const linhasTerceiros = Object.entries(terceirosMap)
    .map(([func, count]: [string, any]) => {
      const funcSafe = escapeHtml(func);
      return `
      <tr>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">${funcSafe.toUpperCase()}</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">-</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${count}</td>
        <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${count}</td>
      </tr>
    `}).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Efetivo - Terceiros</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px;">
            <h1 style="margin: 0 0 10px 0; font-size: 24px;">Relatório de Efetivo - Terceiros</h1>
            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;"><strong>Obra/CCA:</strong> ${ccaSafe}</p>
            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;"><strong>Data:</strong> ${dataSafe}</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <!-- Tabela 1: CLASSIFICAÇÃO DO EFETIVO - ABELV -->
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                CLASSIFICAÇÃO DO EFETIVO - ABELV
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: left; font-weight: 600;">Tipo</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Mobilizado</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">MO. Direta</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">MO. Indireta</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moIndireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moIndireta}</td>
                  </tr>
                  <tr style="background-color: #F1F5F9; font-weight: bold;">
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">TOTAL ===&gt;</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalAbelv}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalAbelv}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabela 2: MOD - POR DISCIPLINA - ABELV -->
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #FED7AA; color: #92400E; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                MOD - POR DISCIPLINA - ABELV
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: left; font-weight: 600;">Tipo</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Mobilizado</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Presente</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Variação 7 Dias</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasDisciplinas}
                  <tr style="background-color: #F1F5F9; font-weight: bold;">
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">TOTAL ===&gt;</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabela 3: Terceiros por Disciplina -->
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                Terceiros por Disciplina
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: left; font-weight: 600;">Terceiro</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Civil</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Mobilizado</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasTerceiros}
                  <tr style="background-color: #F1F5F9; font-weight: bold;">
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">Terceiros ===&gt;</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">-</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalTerceiros}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalTerceiros}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabela 4: ABELV+TERCEIRO -->
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                ABELV+TERCEIRO
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: left; font-weight: 600;">Tipo</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Mobilizado</th>
                    <th style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center; font-weight: 600;">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">MO/C</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moDireta}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">MOI</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moIndireta}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${moIndireta}</td>
                  </tr>
                  <tr style="background-color: #F1F5F9; font-weight: bold;">
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px;">TOTAL ===&gt;</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalAbelv + totalTerceiros}</td>
                    <td style="border: 1px solid #E2E8F0; padding: 8px 12px; text-align: center;">${totalAbelv + totalTerceiros}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Seções Adicionais -->
            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                AG. GRACIA
              </div>
            </div>

            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                AG. DOCS SMS
              </div>
            </div>

            <div style="border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
              <div style="background-color: #DBEAFE; color: #1E40AF; font-weight: bold; font-size: 14px; padding: 8px 16px;">
                AG. INTEGRAÇÃO
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #6c757d;">Este é um relatório automático gerado pelo sistema de controle de efetivo.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #6c757d;">© ${new Date().getFullYear()} Abelv - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(handler);
