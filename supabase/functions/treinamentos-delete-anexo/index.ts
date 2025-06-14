
// Deno + Supabase: Função Edge para deletar arquivo de lista após exclusão de execução de treinamento

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Headers para CORS e outros
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Tratamento de preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Lê corpo: esperado { url: string }
  let url: string | undefined = undefined;
  try {
    const json = await req.json();
    url = json?.url;
  } catch {
    return new Response(
      JSON.stringify({ error: "Corpo da requisição inválido" }),
      { status: 400, headers: corsHeaders },
    );
  }

  if (!url) {
    return new Response(
      JSON.stringify({ error: "Sem url de anexo fornecida" }),
      { status: 400, headers: corsHeaders },
    );
  }

  // Extraí o caminho após o nome do bucket
  // ex: https://.../storage/v1/object/public/treinamentos-anexos/foo.pdf
  const splitToken = "/treinamentos-anexos/";
  const idx = url.indexOf(splitToken);
  if (idx === -1) {
    return new Response(
      JSON.stringify({ error: "URL não pertence ao bucket treinamentos-anexos" }),
      { status: 400, headers: corsHeaders },
    );
  }
  const path = url.substring(idx + splitToken.length);

  // Instancia o client com service key (máxima permissão)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Tenta deletar do bucket
  const { error } = await supabase
    .storage
    .from("treinamentos-anexos")
    .remove([path]);

  if (error) {
    console.error("Erro ao excluir anexo do bucket:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao remover arquivo do bucket", detalhes: error.message }),
      { status: 500, headers: corsHeaders },
    );
  }

  console.log(`Arquivo removido: treinamentos-anexos/${path}`);
  return new Response(JSON.stringify({ ok: true, path }), { headers: corsHeaders });
});
