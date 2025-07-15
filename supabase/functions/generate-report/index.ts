import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  tipo_relatorio: string
  periodo_dias: number
  data_referencia?: string
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function generateOcorrenciasReport(periodoDias: number, dataReferencia: string) {
  console.log(`Gerando relatório de ocorrências para ${periodoDias} dias até ${dataReferencia}`)
  
  const dataInicio = new Date(dataReferencia)
  dataInicio.setDate(dataInicio.getDate() - periodoDias)
  
  const { data, error } = await supabase
    .from('ocorrencias')
    .select(`
      id,
      data,
      tipo_ocorrencia,
      classificacao_risco,
      descricao,
      empresa,
      cca,
      status
    `)
    .gte('data', dataInicio.toISOString())
    .lte('data', dataReferencia)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  const html = `
    <h1>Relatório de Ocorrências</h1>
    <p><strong>Período:</strong> ${dataInicio.toLocaleDateString('pt-BR')} até ${new Date(dataReferencia).toLocaleDateString('pt-BR')}</p>
    <p><strong>Total de ocorrências:</strong> ${data.length}</p>
    
    <h2>Resumo por Classificação de Risco</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Classificação</th>
        <th>Quantidade</th>
        <th>Percentual</th>
      </tr>
      ${Object.entries(data.reduce((acc, item) => {
        acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1
        return acc
      }, {} as Record<string, number>)).map(([risco, qtd]) => `
        <tr>
          <td>${risco}</td>
          <td>${qtd}</td>
          <td>${((qtd / data.length) * 100).toFixed(1)}%</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Detalhes das Ocorrências</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>Classificação</th>
        <th>Empresa</th>
        <th>CCA</th>
        <th>Status</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${new Date(item.data).toLocaleDateString('pt-BR')}</td>
          <td>${item.tipo_ocorrencia}</td>
          <td>${item.classificacao_risco}</td>
          <td>${item.empresa}</td>
          <td>${item.cca}</td>
          <td>${item.status}</td>
        </tr>
      `).join('')}
    </table>
  `
  
  return html
}

async function generateDesviosReport(periodoDias: number, dataReferencia: string) {
  console.log(`Gerando relatório de desvios para ${periodoDias} dias até ${dataReferencia}`)
  
  const dataInicio = new Date(dataReferencia)
  dataInicio.setDate(dataInicio.getDate() - periodoDias)
  
  const { data, error } = await supabase
    .from('desvios_completos')
    .select(`
      id,
      data_desvio,
      descricao_desvio,
      classificacao_risco,
      local,
      status,
      situacao
    `)
    .gte('data_desvio', dataInicio.toISOString().split('T')[0])
    .lte('data_desvio', dataReferencia.split('T')[0])
    .order('data_desvio', { ascending: false })
  
  if (error) throw error
  
  const html = `
    <h1>Relatório de Desvios</h1>
    <p><strong>Período:</strong> ${dataInicio.toLocaleDateString('pt-BR')} até ${new Date(dataReferencia).toLocaleDateString('pt-BR')}</p>
    <p><strong>Total de desvios:</strong> ${data.length}</p>
    
    <h2>Resumo por Status</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Status</th>
        <th>Quantidade</th>
        <th>Percentual</th>
      </tr>
      ${Object.entries(data.reduce((acc, item) => {
        acc[item.status || 'Não informado'] = (acc[item.status || 'Não informado'] || 0) + 1
        return acc
      }, {} as Record<string, number>)).map(([status, qtd]) => `
        <tr>
          <td>${status}</td>
          <td>${qtd}</td>
          <td>${((qtd / data.length) * 100).toFixed(1)}%</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Detalhes dos Desvios</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Data</th>
        <th>Descrição</th>
        <th>Classificação</th>
        <th>Local</th>
        <th>Status</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${new Date(item.data_desvio).toLocaleDateString('pt-BR')}</td>
          <td>${item.descricao_desvio.substring(0, 50)}...</td>
          <td>${item.classificacao_risco}</td>
          <td>${item.local}</td>
          <td>${item.status}</td>
        </tr>
      `).join('')}
    </table>
  `
  
  return html
}

async function generateTreinamentosReport(periodoDias: number, dataReferencia: string) {
  console.log(`Gerando relatório de treinamentos para ${periodoDias} dias até ${dataReferencia}`)
  
  const dataInicio = new Date(dataReferencia)
  dataInicio.setDate(dataInicio.getDate() - periodoDias)
  
  const { data, error } = await supabase
    .from('execucao_treinamentos')
    .select(`
      id,
      data,
      cca,
      processo_treinamento,
      tipo_treinamento,
      carga_horaria,
      efetivo_mod,
      efetivo_moi,
      horas_totais
    `)
    .gte('data', dataInicio.toISOString().split('T')[0])
    .lte('data', dataReferencia.split('T')[0])
    .order('data', { ascending: false })
  
  if (error) throw error
  
  const totalHoras = data.reduce((sum, item) => sum + (item.horas_totais || 0), 0)
  const totalParticipantes = data.reduce((sum, item) => sum + (item.efetivo_mod || 0) + (item.efetivo_moi || 0), 0)
  
  const html = `
    <h1>Relatório de Treinamentos</h1>
    <p><strong>Período:</strong> ${dataInicio.toLocaleDateString('pt-BR')} até ${new Date(dataReferencia).toLocaleDateString('pt-BR')}</p>
    <p><strong>Total de treinamentos:</strong> ${data.length}</p>
    <p><strong>Total de horas:</strong> ${totalHoras.toLocaleString('pt-BR')}</p>
    <p><strong>Total de participantes:</strong> ${totalParticipantes}</p>
    
    <h2>Resumo por Tipo</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Tipo</th>
        <th>Quantidade</th>
        <th>Horas</th>
      </tr>
      ${Object.entries(data.reduce((acc, item) => {
        const tipo = item.tipo_treinamento || 'Não informado'
        if (!acc[tipo]) acc[tipo] = { count: 0, horas: 0 }
        acc[tipo].count += 1
        acc[tipo].horas += item.horas_totais || 0
        return acc
      }, {} as Record<string, { count: number, horas: number }>)).map(([tipo, stats]) => `
        <tr>
          <td>${tipo}</td>
          <td>${stats.count}</td>
          <td>${stats.horas.toLocaleString('pt-BR')}</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Detalhes dos Treinamentos</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Data</th>
        <th>CCA</th>
        <th>Processo</th>
        <th>Tipo</th>
        <th>Carga Horária</th>
        <th>MOD</th>
        <th>MOI</th>
        <th>Total Horas</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${new Date(item.data).toLocaleDateString('pt-BR')}</td>
          <td>${item.cca}</td>
          <td>${item.processo_treinamento}</td>
          <td>${item.tipo_treinamento}</td>
          <td>${item.carga_horaria}</td>
          <td>${item.efetivo_mod}</td>
          <td>${item.efetivo_moi}</td>
          <td>${item.horas_totais || 0}</td>
        </tr>
      `).join('')}
    </table>
  `
  
  return html
}

async function generateHorasTrabalhadasReport(periodoDias: number, dataReferencia: string) {
  console.log(`Gerando relatório de horas trabalhadas para ${periodoDias} dias até ${dataReferencia}`)
  
  const dataRef = new Date(dataReferencia)
  const mesAtual = dataRef.getMonth() + 1
  const anoAtual = dataRef.getFullYear()
  
  // Buscar dados dos últimos meses baseado no período
  const mesesPeriodo = Math.ceil(periodoDias / 30)
  
  const { data, error } = await supabase
    .from('horas_trabalhadas')
    .select(`
      id,
      mes,
      ano,
      horas_trabalhadas,
      cca_id,
      ccas!inner(nome, codigo)
    `)
    .gte('ano', anoAtual - (mesesPeriodo > 12 ? 1 : 0))
    .order('ano', { ascending: false })
    .order('mes', { ascending: false })
    .limit(mesesPeriodo)
  
  if (error) throw error
  
  const totalHoras = data.reduce((sum, item) => sum + Number(item.horas_trabalhadas), 0)
  
  const html = `
    <h1>Relatório de Horas Trabalhadas</h1>
    <p><strong>Período:</strong> Últimos ${mesesPeriodo} meses</p>
    <p><strong>Total de horas:</strong> ${totalHoras.toLocaleString('pt-BR')}</p>
    
    <h2>Resumo por CCA</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>CCA</th>
        <th>Código</th>
        <th>Total Horas</th>
        <th>Percentual</th>
      </tr>
      ${Object.entries(data.reduce((acc, item) => {
        const cca = item.ccas?.nome || 'Não informado'
        const codigo = item.ccas?.codigo || ''
        if (!acc[cca]) acc[cca] = { codigo, horas: 0 }
        acc[cca].horas += Number(item.horas_trabalhadas)
        return acc
      }, {} as Record<string, { codigo: string, horas: number }>)).map(([cca, stats]) => `
        <tr>
          <td>${cca}</td>
          <td>${stats.codigo}</td>
          <td>${stats.horas.toLocaleString('pt-BR')}</td>
          <td>${((stats.horas / totalHoras) * 100).toFixed(1)}%</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Detalhes por Mês</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Mês/Ano</th>
        <th>CCA</th>
        <th>Horas</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${String(item.mes).padStart(2, '0')}/${item.ano}</td>
          <td>${item.ccas?.nome || 'Não informado'}</td>
          <td>${Number(item.horas_trabalhadas).toLocaleString('pt-BR')}</td>
        </tr>
      `).join('')}
    </table>
  `
  
  return html
}

async function generateIndicadoresReport(periodoDias: number, dataReferencia: string) {
  console.log(`Gerando relatório de indicadores para ${periodoDias} dias até ${dataReferencia}`)
  
  const dataInicio = new Date(dataReferencia)
  dataInicio.setDate(dataInicio.getDate() - periodoDias)
  
  const { data, error } = await supabase
    .from('idsms_indicadores')
    .select(`
      id,
      data,
      tipo,
      resultado,
      motivo,
      ccas!inner(nome, codigo)
    `)
    .gte('data', dataInicio.toISOString().split('T')[0])
    .lte('data', dataReferencia.split('T')[0])
    .order('data', { ascending: false })
  
  if (error) throw error
  
  const html = `
    <h1>Relatório de Indicadores SMS</h1>
    <p><strong>Período:</strong> ${dataInicio.toLocaleDateString('pt-BR')} até ${new Date(dataReferencia).toLocaleDateString('pt-BR')}</p>
    <p><strong>Total de indicadores:</strong> ${data.length}</p>
    
    <h2>Resumo por Tipo</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Tipo</th>
        <th>Quantidade</th>
        <th>Média</th>
      </tr>
      ${Object.entries(data.reduce((acc, item) => {
        const tipo = item.tipo || 'Não informado'
        if (!acc[tipo]) acc[tipo] = { count: 0, total: 0 }
        acc[tipo].count += 1
        acc[tipo].total += Number(item.resultado)
        return acc
      }, {} as Record<string, { count: number, total: number }>)).map(([tipo, stats]) => `
        <tr>
          <td>${tipo}</td>
          <td>${stats.count}</td>
          <td>${(stats.total / stats.count).toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
    
    <h2>Detalhes dos Indicadores</h2>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>Resultado</th>
        <th>CCA</th>
        <th>Motivo</th>
      </tr>
      ${data.map(item => `
        <tr>
          <td>${new Date(item.data).toLocaleDateString('pt-BR')}</td>
          <td>${item.tipo}</td>
          <td>${Number(item.resultado).toFixed(2)}</td>
          <td>${item.ccas?.nome || 'Não informado'}</td>
          <td>${item.motivo || '-'}</td>
        </tr>
      `).join('')}
    </table>
  `
  
  return html
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { tipo_relatorio, periodo_dias, data_referencia }: ReportRequest = await req.json()
    
    console.log(`Gerando relatório: ${tipo_relatorio} para ${periodo_dias} dias`)
    
    const dataRef = data_referencia || new Date().toISOString()
    let reportHtml = ''
    
    switch (tipo_relatorio) {
      case 'ocorrencias':
        reportHtml = await generateOcorrenciasReport(periodo_dias, dataRef)
        break
      case 'desvios':
        reportHtml = await generateDesviosReport(periodo_dias, dataRef)
        break
      case 'treinamentos':
        reportHtml = await generateTreinamentosReport(periodo_dias, dataRef)
        break
      case 'horas_trabalhadas':
        reportHtml = await generateHorasTrabalhadasReport(periodo_dias, dataRef)
        break
      case 'indicadores':
        reportHtml = await generateIndicadoresReport(periodo_dias, dataRef)
        break
      default:
        throw new Error(`Tipo de relatório não suportado: ${tipo_relatorio}`)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        html: reportHtml,
        tipo_relatorio,
        periodo_dias,
        data_referencia: dataRef 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})