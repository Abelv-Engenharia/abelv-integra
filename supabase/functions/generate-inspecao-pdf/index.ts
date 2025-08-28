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

    // Buscar dados da inspeção com relacionamentos
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

    // Buscar dados das pessoas responsáveis
    const camposCabecalho = inspecao.dados_preenchidos?.campos_cabecalho || {}
    const responsaveis: any = {}

    if (camposCabecalho.engenheiro_responsavel_id) {
      const { data: engenheiro } = await supabase
        .from('engenheiros')
        .select('nome')
        .eq('id', camposCabecalho.engenheiro_responsavel_id)
        .single()
      if (engenheiro) responsaveis.engenheiro = engenheiro.nome
    }

    if (camposCabecalho.supervisor_responsavel_id) {
      const { data: supervisor } = await supabase
        .from('supervisores')
        .select('nome')
        .eq('id', camposCabecalho.supervisor_responsavel_id)
        .single()
      if (supervisor) responsaveis.supervisor = supervisor.nome
    }

    if (camposCabecalho.encarregado_responsavel_id) {
      const { data: encarregado } = await supabase
        .from('encarregados')
        .select('nome')
        .eq('id', camposCabecalho.encarregado_responsavel_id)
        .single()
      if (encarregado) responsaveis.encarregado = encarregado.nome
    }

    if (camposCabecalho.empresa_id) {
      const { data: empresa } = await supabase
        .from('empresas')
        .select('nome')
        .eq('id', camposCabecalho.empresa_id)
        .single()
      if (empresa) responsaveis.empresa = empresa.nome
    }

    if (camposCabecalho.disciplina_id) {
      const { data: disciplina } = await supabase
        .from('disciplinas')
        .select('nome')
        .eq('id', camposCabecalho.disciplina_id)
        .single()
      if (disciplina) responsaveis.disciplina = disciplina.nome
    }

    // Gerar HTML do relatório
    const htmlContent = generateHTMLReport(inspecao as InspectionData, responsaveis)


    // Retornar como HTML que pode ser convertido para PDF pelo navegador
    return new Response(
      htmlContent,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="inspecao-${inspecaoId}.html"`
        }
      }
    )

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateHTMLReport(inspecao: InspectionData, responsaveis: any = {}): string {
  const itens = inspecao.dados_preenchidos?.itens || []
  const naoConformidades = itens.filter((item: any) => 
    item.status === 'nao_conforme' && item.observacao_nc
  )
  
  const camposCabecalho = inspecao.dados_preenchidos?.campos_cabecalho || {}

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'conforme': 'Conforme',
      'nao_conforme': 'Não Conforme', 
      'nao_se_aplica': 'Não se Aplica'
    }
    return statusMap[status] || status
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Inspeção SMS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header-logo {
            width: 80px;
            height: auto;
        }
        .header-content {
            flex: 1;
            text-align: center;
        }
        .header h1 {
            color: #0066cc;
            margin: 0;
            font-size: 24px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-item {
            border: 1px solid #ddd;
            padding: 12px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #0066cc;
            background-color: #e7f3ff;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .item {
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 5px;
            overflow: hidden;
        }
        .item-header {
            padding: 15px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-name {
            font-weight: bold;
            flex: 1;
        }
        .status {
            padding: 5px 10px;
            border-radius: 3px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        .status-conforme {
            background-color: #28a745;
        }
        .status-nao-conforme {
            background-color: #dc3545;
        }
        .status-nao-se-aplica {
            background-color: #6c757d;
        }
        .item-observation {
            padding: 15px;
            background-color: #fff3cd;
            border-top: 1px solid #ddd;
        }
        .summary {
            background-color: #e7f3ff;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            text-align: center;
        }
        .summary-item {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .summary-number {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
        }
        .signature-section {
            margin-top: 50px;
            border-top: 2px solid #ddd;
            padding-top: 30px;
        }
        .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 30px;
        }
        .signature-box {
            border: 1px solid #ddd;
            padding: 20px;
            text-align: center;
            min-height: 80px;
        }
        @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="data:image/png;base64,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" class="header-logo" alt="ABELV Logo">
        <div class="header-content">
            <h1>RELATÓRIO DE INSPEÇÃO SMS</h1>
            <p>Data: ${formatDate(inspecao.data_inspecao)}</p>
        </div>
        <div style="width: 80px;"></div>
    </div>

    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Nome da Inspeção:</div>
            <div class="info-value">${inspecao.checklists_avaliacao?.nome || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Local:</div>
            <div class="info-value">${inspecao.local}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Responsável:</div>
            <div class="info-value">${inspecao.profiles?.nome || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">CCA:</div>
            <div class="info-value">${inspecao.ccas ? `${inspecao.ccas.codigo} - ${inspecao.ccas.nome}` : 'N/A'}</div>
        </div>
    </div>
    
    ${Object.keys(camposCabecalho).length > 0 ? `
    <div class="section">
        <h2>Identificação da Frente de Trabalho</h2>
        <div class="info-grid">
            ${responsaveis.engenheiro ? `
                <div class="info-item">
                    <div class="info-label">Engenheiro Responsável:</div>
                    <div class="info-value">${responsaveis.engenheiro}</div>
                </div>
            ` : ''}
            ${responsaveis.supervisor ? `
                <div class="info-item">
                    <div class="info-label">Supervisor Responsável:</div>
                    <div class="info-value">${responsaveis.supervisor}</div>
                </div>
            ` : ''}
            ${responsaveis.encarregado ? `
                <div class="info-item">
                    <div class="info-label">Encarregado Responsável:</div>
                    <div class="info-value">${responsaveis.encarregado}</div>
                </div>
            ` : ''}
            ${responsaveis.empresa ? `
                <div class="info-item">
                    <div class="info-label">Empresa:</div>
                    <div class="info-value">${responsaveis.empresa}</div>
                </div>
            ` : ''}
            ${responsaveis.disciplina ? `
                <div class="info-item">
                    <div class="info-label">Disciplina:</div>
                    <div class="info-value">${responsaveis.disciplina}</div>
                </div>
            ` : ''}
        </div>
    </div>
    ` : ''}

    <div class="summary">
        <h3 style="margin-top: 0; text-align: center;">Resumo da Inspeção</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">${itens.length}</div>
                <div>Itens Verificados</div>
            </div>
            <div class="summary-item">
                <div class="summary-number" style="color: #28a745;">${itens.filter((item: any) => item.status === 'conforme').length}</div>
                <div>Conformes</div>
            </div>
            <div class="summary-item">
                <div class="summary-number" style="color: #dc3545;">${itens.filter((item: any) => item.status === 'nao_conforme').length}</div>
                <div>Não Conformes</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Itens Verificados</h2>
        ${itens.map((item: any) => `
            <div class="item">
                <div class="item-header">
                    <div class="item-name">${item.nome || 'Item não identificado'}</div>
                    <div class="status status-${item.status?.replace('_', '-') || 'conforme'}">
                        ${getStatusLabel(item.status)}
                    </div>
                </div>
                ${item.status === 'nao_conforme' && item.observacao_nc ? `
                    <div class="item-observation">
                        <strong>Observação:</strong> ${item.observacao_nc}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    ${naoConformidades.length > 0 ? `
    <div class="section">
        <h2>Resumo das Não Conformidades</h2>
        ${naoConformidades.map((item: any, index: number) => `
            <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid #dc3545; background-color: #f8f9fa;">
                <strong>${index + 1}. ${item.nome}</strong><br>
                <span style="color: #666;">${item.observacao_nc}</span>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="signature-section">
        <h2>Assinaturas</h2>
        <div class="signature-grid">
            <div class="signature-box">
                <p><strong>Responsável pela Inspeção</strong></p>
                <p>${inspecao.profiles?.nome || 'N/A'}</p>
                <br><br>
                <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
                    Assinatura
                </div>
            </div>
            <div class="signature-box">
                <p><strong>Supervisor Responsável</strong></p>
                <p>_______________________</p>
                <br><br>
                <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
                    Assinatura
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    </div>
</body>
</html>`
}