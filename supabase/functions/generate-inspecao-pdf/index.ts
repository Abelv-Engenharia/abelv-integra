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

    // Buscar dados de forma paralela
    const promises = []

    if (camposCabecalho.engenheiro_responsavel || camposCabecalho.engenheiro_responsavel_id) {
      const id = camposCabecalho.engenheiro_responsavel || camposCabecalho.engenheiro_responsavel_id
      promises.push(
        supabase.from('engenheiros').select('nome').eq('id', id).single()
          .then(({ data }) => { if (data) responsaveis.engenheiro = data.nome })
      )
    }

    if (camposCabecalho.supervisor_responsavel || camposCabecalho.supervisor_responsavel_id) {
      const id = camposCabecalho.supervisor_responsavel || camposCabecalho.supervisor_responsavel_id
      promises.push(
        supabase.from('supervisores').select('nome').eq('id', id).single()
          .then(({ data }) => { if (data) responsaveis.supervisor = data.nome })
      )
    }

    if (camposCabecalho.encarregado_responsavel || camposCabecalho.encarregado_responsavel_id) {
      const id = camposCabecalho.encarregado_responsavel || camposCabecalho.encarregado_responsavel_id
      promises.push(
        supabase.from('encarregados').select('nome').eq('id', id).single()
          .then(({ data }) => { if (data) responsaveis.encarregado = data.nome })
      )
    }

    if (camposCabecalho.empresa || camposCabecalho.empresa_id) {
      const id = camposCabecalho.empresa || camposCabecalho.empresa_id
      promises.push(
        supabase.from('empresas').select('nome').eq('id', id).single()
          .then(({ data }) => { if (data) responsaveis.empresa = data.nome })
      )
    }

    if (camposCabecalho.disciplina || camposCabecalho.disciplina_id) {
      const id = camposCabecalho.disciplina || camposCabecalho.disciplina_id
      promises.push(
        supabase.from('disciplinas').select('nome').eq('id', id).single()
          .then(({ data }) => { if (data) responsaveis.disciplina = data.nome })
      )
    }

    // Buscar dados do responsável técnico selecionado para assinatura
    const responsavelTecnicoId = inspecao.dados_preenchidos?.responsavel_tecnico_id || 
                                 inspecao.dados_preenchidos?.assinaturas?.responsavel_tecnico
    
    if (responsavelTecnicoId) {
      // Tentar buscar em engenheiros primeiro
      promises.push(
        supabase.from('engenheiros').select('nome').eq('id', responsavelTecnicoId).maybeSingle()
          .then(({ data }) => { 
            if (data?.nome) {
              responsaveis.responsavel_tecnico = data.nome
              return
            }
            // Se não encontrou em engenheiros, tentar supervisores
            return supabase.from('supervisores').select('nome').eq('id', responsavelTecnicoId).maybeSingle()
              .then(({ data }) => { 
                if (data?.nome) {
                  responsaveis.responsavel_tecnico = data.nome
                  return
                }
                // Se não encontrou em supervisores, tentar encarregados
                return supabase.from('encarregados').select('nome').eq('id', responsavelTecnicoId).maybeSingle()
                  .then(({ data }) => { 
                    if (data?.nome) {
                      responsaveis.responsavel_tecnico = data.nome
                    }
                  })
              })
          })
          .catch(error => {
            console.error('Erro ao buscar responsável técnico:', error)
          })
      )
    }

    // Aguardar todas as consultas
    await Promise.all(promises)

    // Gerar HTML do relatório
    const htmlContent = await generateHTMLReport(inspecao as InspectionData, responsaveis)


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

async function generateHTMLReport(inspecao: InspectionData, responsaveis: any = {}): Promise<string> {
  const itens = inspecao.dados_preenchidos?.itens || []
  console.log('Total de itens:', itens.length)
  
  const naoConformidades = itens.filter((item: any) => 
    item.status === 'nao_conforme' && item.observacao_nc
  )
  console.log('Não conformidades encontradas:', naoConformidades.length)
  console.log('Dados das não conformidades:', JSON.stringify(naoConformidades, null, 2))
  
  // Filtrar não conformidades que têm fotos anexadas
  const naoConformidadesComFotos = naoConformidades.filter((item: any) => item.foto)
  console.log('Não conformidades com fotos:', naoConformidadesComFotos.length)
  
  // Criar cliente Supabase para as signed URLs
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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
            page-break-after: avoid;
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
            page-break-inside: avoid;
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
            page-break-after: avoid;
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
            page-break-inside: avoid;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
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
            page-break-inside: avoid;
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
        .section-group {
            margin-bottom: 25px;
        }
        .section-title {
            color: #0066cc;
            background-color: #e7f3ff;
            padding: 10px;
            margin-bottom: 15px;
            border-left: 4px solid #0066cc;
            border-radius: 3px;
            font-size: 16px;
            page-break-after: avoid;
        }
        .non-conformities-section {
            page-break-inside: avoid;
        }
        .non-conformity-item {
            margin-bottom: 15px;
            padding: 15px;
            border-left: 4px solid #dc3545;
            background-color: #f8f9fa;
        }
        .photo-container {
            margin-top: 15px;
            text-align: center;
        }
        .photo-container img {
            max-width: 300px;
            max-height: 200px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 10px 0;
        }
        .photo-filename {
            font-size: 11px;
            color: #666;
            font-style: italic;
        }
        /* Controle inteligente de quebras de página */
        .section-with-items {
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
        }
        .item-group {
            page-break-inside: avoid;
        }
        @media print {
            body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .header { 
                page-break-after: avoid; 
            }
            .section h2 {
                page-break-after: avoid;
                orphans: 2;
            }
            .summary {
                page-break-inside: avoid;
            }
            .signature-section {
                page-break-inside: avoid;
            }
            .info-grid {
                page-break-inside: avoid;
            }
            /* Permitir quebras mais naturais para seções longas */
            .section-group {
                break-inside: auto;
                page-break-inside: auto;
            }
            /* Mas ainda evitar quebras ruins */
            .section-title + .item:first-of-type {
                page-break-before: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/lovable-uploads/ed7dfa99-8b19-4c1a-a642-c54e0ac65c7f.png" class="header-logo" alt="ABELV Logo" style="max-width: 80px; height: auto;">
        <div class="header-content">
            <h1>RELATÓRIO DE INSPEÇÃO DE SMS</h1>
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
        <h2>${(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? 'Identificação do Veículo de Transporte' : 'Identificação da Frente de Trabalho'}</h2>
        <div class="info-grid">
            ${(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? `
                ${responsaveis.empresa ? `
                    <div class="info-item">
                        <div class="info-label">Empresa:</div>
                        <div class="info-value">${responsaveis.empresa}</div>
                    </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Responsável pela Inspeção:</div>
                    <div class="info-value">${inspecao.profiles?.nome || 'N/A'}</div>
                </div>
                ${responsaveis.engenheiro ? `
                    <div class="info-item">
                        <div class="info-label">Engenheiro Responsável:</div>
                        <div class="info-value">${responsaveis.engenheiro}</div>
                    </div>
                ` : ''}
                ${Object.entries(camposCabecalho).map(([key, value]) => {
                    if (!value || value === '') return '';
                    
                    // Filtrar campos de assinatura, IDs, campos de responsáveis e empresa
                    if (key.toLowerCase().includes('assinatura') || 
                        key.toLowerCase().includes('data_assinatura') ||
                        key.toLowerCase().includes('responsavel_inspecao') ||
                        key.toLowerCase().includes('engenheiro_responsavel') ||
                        key.toLowerCase() === 'empresa' ||
                        (typeof value === 'string' && value.includes('-') && value.length > 30)) {
                        return '';
                    }
                    
                    // Mapear os nomes dos campos para rótulos mais amigáveis
                    const fieldLabels = {
                        placa: 'Placa do Veículo',
                        motorista: 'Motorista',
                        modelo: 'Modelo do Veículo',
                        ano: 'Ano',
                        cor: 'Cor',
                        km: 'Quilometragem',
                        km_do_veiculo: 'Quilometragem',
                        combustivel: 'Combustível',
                        capacidade: 'Capacidade',
                        categoria: 'Categoria',
                        cnh: 'CNH (Nº/Categoria)',
                        empresa_de_transporte: 'Empresa de Transporte',
                        modelo_do_veiculo: 'Modelo do Veículo',
                        renavam: 'RENAVAM',
                        chassi: 'Chassi'
                    };
                    
                    const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                    const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    
                    return `
                        <div class="info-item">
                            <div class="info-label">${label}:</div>
                            <div class="info-value">${displayValue}</div>
                        </div>
                    `;
                }).join('')}
            ` : `
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
            `}
        </div>
    </div>
    ` : ''}

    <div class="summary">
        <h3 style="margin-top: 0; text-align: center;">Resumo da Inspeção</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">${itens.filter((item: any) => item.tipo === 'item' && !item.isSection).length}</div>
                <div>Itens Verificados</div>
            </div>
            <div class="summary-item">
                <div class="summary-number" style="color: #28a745;">${itens.filter((item: any) => item.tipo === 'item' && !item.isSection && item.status === 'conforme').length}</div>
                <div>Conformes</div>
            </div>
            <div class="summary-item">
                <div class="summary-number" style="color: #dc3545;">${itens.filter((item: any) => item.tipo === 'item' && !item.isSection && item.status === 'nao_conforme').length}</div>
                <div>Não Conformes</div>
            </div>
            <div class="summary-item">
                <div class="summary-number" style="color: #6c757d;">${itens.filter((item: any) => item.tipo === 'item' && !item.isSection && item.status === 'nao_se_aplica').length}</div>
                <div>Não Aplicáveis</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Itens Verificados por Seção</h2>
        ${(() => {
            const secoes = new Map();
            
            // Agrupar itens por seção
            itens.forEach((item: any) => {
                if (item.tipo === 'secao' || item.isSection) {
                    if (!secoes.has(item.nome)) {
                        secoes.set(item.nome, { header: item, items: [] });
                    }
                } else if (item.tipo === 'item') {
                    const secaoNome = item.secao || 'Outros Itens';
                    if (!secoes.has(secaoNome)) {
                        secoes.set(secaoNome, { header: { nome: secaoNome }, items: [] });
                    }
                    secoes.get(secaoNome).items.push(item);
                }
            });
            
            // Gerar HTML para cada seção
            let html = '';
            secoes.forEach((secao, nomeSecao) => {
                if (secao.items.length > 0) {
                    html += `
                        <div class="section-group">
                            <h3 class="section-title">${nomeSecao}</h3>
                            ${secao.items.map((item: any) => `
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
                    `;
                }
            });
            
            return html;
        })()}
    </div>

    ${naoConformidades.length > 0 ? (() => {
        console.log('Renderizando seção de não conformidades com', naoConformidades.length, 'itens');
        return `
    <div class="section non-conformities-section">
        <h2>Resumo das Não Conformidades</h2>
        ${await Promise.all(naoConformidades.map(async (item: any, index: number) => {
            let fotoHtml = '';
            if (item.foto) {
                try {
                    // Extract the file path from the full URL
                    const url = new URL(item.foto.url);
                    const pathSegments = url.pathname.split('/');
                    const filePath = pathSegments.slice(-2).join('/'); // userId/fileName
                    
                    // Create signed URL for private bucket
                    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                        .from('inspecoes-sms-fotos')
                        .createSignedUrl(filePath, 300);

                    if (signedUrlError) {
                        console.error('Error creating signed URL:', signedUrlError);
                        fotoHtml = '';
                    } else if (signedUrlData?.signedUrl) {
                        fotoHtml = `
                            <div class="photo-container">
                                <img src="${signedUrlData.signedUrl}" alt="Foto da não conformidade: ${item.nome}" />
                                <div class="photo-filename">Arquivo: ${item.foto.fileName}</div>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error('Error processing photo:', error);
                    fotoHtml = '';
                }
            }
            
            return `
                <div class="non-conformity-item">
                    <strong>${index + 1}. ${item.nome}</strong><br>
                    <span style="color: #666;">${item.observacao_nc}</span>
                    ${fotoHtml}
                </div>
            `;
        })).then(items => items.join(''))}
    </div>
        `;
    })() : ''}

    <div class="signature-section">
        <h2>Assinaturas</h2>
        <div class="signature-grid">
            <div class="signature-box">
                <p><strong>Auditor Responsável</strong></p>
                <p>${inspecao.profiles?.nome || 'N/A'}</p>
                ${(camposCabecalho.assinaturas?.assinatura_inspetor || camposCabecalho.assinatura_inspetor) ? `
                    <div style="margin: 20px 0;">
                        <img src="${camposCabecalho.assinaturas?.assinatura_inspetor || camposCabecalho.assinatura_inspetor}" alt="Assinatura do Inspetor" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px;">
                    </div>
                ` : `
                    <br><br>
                    <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
                        Assinatura
                    </div>
                `}
            </div>
            <div class="signature-box">
                <p><strong>${(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? 'Motorista' : 'Responsável pela Frente de Trabalho'}</strong></p>
                <p>${(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? (camposCabecalho.motorista || '_______________________') : (responsaveis.responsavel_tecnico || '_______________________')}</p>
                ${(camposCabecalho.assinaturas?.assinatura_responsavel_tecnico || camposCabecalho.assinatura_responsavel_tecnico) ? `
                    <div style="margin: 20px 0;">
                        <img src="${camposCabecalho.assinaturas?.assinatura_responsavel_tecnico || camposCabecalho.assinatura_responsavel_tecnico}" alt="Assinatura do ${(inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('veículo') || inspecao.checklists_avaliacao?.nome?.toLowerCase().includes('transporte')) ? 'Motorista' : 'Responsável'}" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px;">
                    </div>
                ` : `
                    <br><br>
                    <div style="border-top: 1px solid #333; margin-top: 40px; padding-top: 5px;">
                        Assinatura
                    </div>
                `}
            </div>
        </div>
    </div>

    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    </div>
</body>
</html>`
}