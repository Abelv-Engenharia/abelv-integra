import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InspectionData {
  id: string
  data_inspecao: string
  local: string
  tem_nao_conformidade: boolean
  status: string
  dados_preenchidos: any
  assinatura_inspetor?: string
  assinatura_supervisor?: string
  checklists_avaliacao?: {
    nome: string
  }
  profiles?: {
    nome: string
  }
  ccas?: {
    codigo: string
    nome: string
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { inspecaoId } = await req.json()

    if (!inspecaoId) {
      return new Response(
        JSON.stringify({ error: 'inspecaoId é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Buscar dados da inspeção
    const { data: inspecao, error } = await supabase
      .from('inspecoes_sms')
      .select(`
        *,
        checklists_avaliacao(nome),
        profiles(nome),
        ccas(codigo, nome)
      `)
      .eq('id', inspecaoId)
      .single()

    if (error || !inspecao) {
      console.error('Erro ao buscar inspeção:', error)
      return new Response(
        JSON.stringify({ error: 'Inspeção não encontrada' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Gerar PDF usando jsPDF (simulado para este exemplo)
    const pdfContent = generatePDFContent(inspecao as InspectionData)

    // Retornar o PDF como blob
    return new Response(
      new Uint8Array(Buffer.from(pdfContent, 'base64')),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="inspecao-${inspecaoId}.pdf"`
        }
      }
    )

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generatePDFContent(inspecao: InspectionData): string {
  // Esta é uma implementação simplificada
  // Em um ambiente real, você usaria uma biblioteca como PDFKit ou similar
  
  const itens = inspecao.dados_preenchidos?.itens || []
  const naoConformidades = itens.filter((item: any) => 
    item.status === 'nao_conforme' && item.observacao_nc
  )

  const pdfData = {
    titulo: 'RELATÓRIO DE INSPEÇÃO SMS',
    dados: {
      data: new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR'),
      local: inspecao.local,
      responsavel: inspecao.profiles?.nome || 'N/A',
      cca: inspecao.ccas ? `${inspecao.ccas.codigo} - ${inspecao.ccas.nome}` : 'N/A',
      tipo: inspecao.checklists_avaliacao?.nome || 'N/A',
      status: inspecao.status,
      conformidade: inspecao.tem_nao_conformidade ? 'Não Conforme' : 'Conforme'
    },
    itens: itens.map((item: any) => ({
      secao: item.secao || 'N/A',
      nome: item.nome || 'N/A',
      status: item.status || 'N/A',
      observacao: item.observacao_nc || ''
    })),
    naoConformidades,
    assinaturas: {
      inspetor: inspecao.assinatura_inspetor || null,
      supervisor: inspecao.assinatura_supervisor || null
    }
  }

  // Simular geração de PDF retornando base64
  // Em produção, usaria uma biblioteca real de PDF
  const pdfBase64 = Buffer.from(JSON.stringify(pdfData, null, 2)).toString('base64')
  
  return pdfBase64
}