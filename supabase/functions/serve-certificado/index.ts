import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const fileName = url.searchParams.get('file')
    
    console.log('Tentando servir certificado:', fileName)
    
    if (!fileName) {
      console.error('Nome do arquivo não fornecido')
      return new Response(
        JSON.stringify({ error: 'Nome do arquivo é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Tentando baixar arquivo do bucket certificados-treinamentos-normativos:', fileName)

    // Buscar o arquivo do storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('certificados-treinamentos-normativos')
      .download(fileName)

    if (downloadError) {
      console.error('Erro ao baixar arquivo:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Erro ao baixar arquivo: ' + downloadError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!fileData) {
      console.error('Arquivo não encontrado:', fileName)
      return new Response(
        JSON.stringify({ error: 'Arquivo não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Arquivo encontrado, tamanho:', fileData.size)

    // Retornar o arquivo PDF
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Erro ao servir certificado:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})