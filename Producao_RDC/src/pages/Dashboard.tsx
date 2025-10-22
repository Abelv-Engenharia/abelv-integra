import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from "@/components/Layout"
import { TrendingUp, TrendingDown, Calculator } from 'lucide-react'

type Estatisticas = {
  totalFluidos: number
  totalLinhas: number
  totalJuntas: number
  percentualSoldadas: number
  percentualAcopladas: number
  linhasFinalizadas: number
}

type EstatisticasSPEC = {
  totalDNProjeto: number
  specCarbono: number
  specInox: number
  eficienciaCarbono: number
  eficienciaInox: number
  valorBaseCarbono: number
  valorBaseInox: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Estatisticas>({
    totalFluidos: 0,
    totalLinhas: 0,
    totalJuntas: 0,
    percentualSoldadas: 0,
    percentualAcopladas: 0,
    linhasFinalizadas: 0
  })
  const [specStats, setSpecStats] = useState<EstatisticasSPEC>({
    totalDNProjeto: 0,
    specCarbono: 0,
    specInox: 0,
    eficienciaCarbono: 0,
    eficienciaInox: 0,
    valorBaseCarbono: 1.8,
    valorBaseInox: 2.3
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarEstatisticas()
    carregarEstatisticasSPEC()
  }, [])

  const carregarEstatisticas = async () => {
    try {
      // Buscar totais das tabelas
      const [fluidosRes, linhasRes, juntasRes, statusRes] = await Promise.all([
        supabase.from('fluidos').select('id', { count: 'exact' }),
        supabase.from('linhas').select('id', { count: 'exact' }),
        supabase.from('juntas').select('id', { count: 'exact' }),
        supabase.from('status_juntas').select('junta_id, atividade')
      ])

      const totalFluidos = fluidosRes.count || 0
      const totalLinhas = linhasRes.count || 0
      const totalJuntas = juntasRes.count || 0

      // Calcular percentuais de soldagem e acoplamento
      const statusData = statusRes.data || []
      const juntasComSolda = new Set()
      const juntasComAcoplamento = new Set()

      statusData.forEach(status => {
        if (status.atividade === 'Solda') {
          juntasComSolda.add(status.junta_id)
        }
        if (status.atividade === 'Acoplamento') {
          juntasComAcoplamento.add(status.junta_id)
        }
      })

      const percentualSoldadas = totalJuntas > 0 ? (juntasComSolda.size / totalJuntas) * 100 : 0
      const percentualAcopladas = totalJuntas > 0 ? (juntasComAcoplamento.size / totalJuntas) * 100 : 0
      
      // Linhas finalizadas (com todas as juntas soldadas e acopladas)
      const juntasFinalizadas = [...juntasComSolda].filter(id => juntasComAcoplamento.has(id))
      const linhasFinalizadas = Math.floor(juntasFinalizadas.length / 10) // Estimativa

      setStats({
        totalFluidos,
        totalLinhas,
        totalJuntas,
        percentualSoldadas: Math.round(percentualSoldadas),
        percentualAcopladas: Math.round(percentualAcopladas),
        linhasFinalizadas
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const carregarEstatisticasSPEC = async () => {
    try {
      // Buscar parâmetros base
      const { data: parametros } = await supabase
        .from('parametros_tubulacao')
        .select('tipo_material, atividade, valor_base')

      let valorBaseCarbono = 1.8
      let valorBaseInox = 2.3

      parametros?.forEach(param => {
        if (param.tipo_material === 'CARBONO' && param.atividade === 'TUB_AC') {
          valorBaseCarbono = param.valor_base
        }
        if (param.tipo_material === 'INOX304' && param.atividade === 'TUB_AI304') {
          valorBaseInox = param.valor_base
        }
      })

      // SOLUÇÃO DEFINITIVA: Usar query SQL direta para calcular soma no servidor
      const { data: somaResult, error: somaError } = await supabase
        .from('juntas')
        .select('DN')
        .then(response => {
          if (response.error) throw response.error;
          
          // Calcular soma usando SQL agregada via query
          return supabase
            .rpc('calculate_total_dn')
            .single();
        });

      let totalDNProjeto = 0;
      
      if (somaError) {
        console.error('Erro na função RPC, usando fallback:', somaError);
        
        // Fallback robusto: Buscar todos os registros com múltiplas páginas
        let allJuntas = [];
        let hasMore = true;
        let offset = 0;
        const pageSize = 1000;
        
        while (hasMore) {
          const { data: pageData, error: pageError } = await supabase
            .from('juntas')
            .select('DN')
            .range(offset, offset + pageSize - 1);
            
          if (pageError) {
            console.error('Erro ao buscar página:', pageError);
            break;
          }
          
          if (pageData && pageData.length > 0) {
            allJuntas.push(...pageData);
            offset += pageSize;
            hasMore = pageData.length === pageSize;
          } else {
            hasMore = false;
          }
        }
        
        console.log('Debug DN - Total de juntas coletadas (fallback):', allJuntas.length);
        totalDNProjeto = allJuntas.reduce((sum, junta) => sum + (Number(junta.DN) || 0), 0);
        
      } else {
        totalDNProjeto = Number(somaResult?.total_dn || 0);
        console.log('Debug DN - Soma calculada via RPC:', totalDNProjeto);
      }

      // Buscar juntas com linhas para calcular por tipo de material
      const { data: juntasLinhas } = await supabase
        .from('juntas')
        .select(`
          id,
          "DN",
          linhas (
            id,
            tipo_material
          )
        `)

      // Calcular SPEC base por tipo de material (apenas para eficiência)
      let specCarbono = 0
      let specInox = 0

      juntasLinhas?.forEach(junta => {
        const dn = junta.DN || 0
        const tipoMaterial = junta.linhas?.tipo_material

        if (tipoMaterial === 'CARBONO') {
          specCarbono += dn
        } else if (tipoMaterial === 'INOX304') {
          specInox += dn
        }
      })

      // Buscar horas totais por tipo de material das linhas
      const { data: horasCarbonoResult } = await supabase
        .from('relatorios_atividades')
        .select(`
          horas_totais,
          linhas (
            tipo_material
          )
        `)
        .eq('linhas.tipo_material', 'CARBONO')

      const { data: horasInoxResult } = await supabase
        .from('relatorios_atividades')
        .select(`
          horas_totais,
          linhas (
            tipo_material
          )
        `)
        .eq('linhas.tipo_material', 'INOX304')

      let horasTUB_AC = 0
      let horasTUB_AI304 = 0

      horasCarbonoResult?.forEach(relatorio => {
        horasTUB_AC += relatorio.horas_totais || 0
      })

      horasInoxResult?.forEach(relatorio => {
        horasTUB_AI304 += relatorio.horas_totais || 0
      })

      // Calcular eficiência real: horas / (quantidade_juntas × DN)
      const eficienciaCarbono = specCarbono > 0 ? horasTUB_AC / specCarbono : 0
      const eficienciaInox = specInox > 0 ? horasTUB_AI304 / specInox : 0

      setSpecStats({
        totalDNProjeto,
        specCarbono,
        specInox,
        eficienciaCarbono,
        eficienciaInox,
        valorBaseCarbono,
        valorBaseInox
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas SPEC:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'Soldagem', valor: stats.percentualSoldadas },
    { name: 'Acoplamento', valor: stats.percentualAcopladas }
  ]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dashboard...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header com Logo */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            {/* Placeholder para o logo da ABELV */}
            <span className="text-primary font-bold text-sm">ABELV</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Sistema de Registro - Dashboard</p>
          </div>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fluidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFluidos}</div>
              <p className="text-xs text-muted-foreground">Fluidos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Linhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLinhas}</div>
              <p className="text-xs text-muted-foreground">Linhas cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Juntas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJuntas}</div>
              <p className="text-xs text-muted-foreground">Juntas cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Linhas Finalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.linhasFinalizadas}</div>
              <p className="text-xs text-muted-foreground">Soldagem + Acoplamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Cálculos SPEC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pol.DN do projeto</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{specStats.totalDNProjeto.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
              <p className="text-xs text-muted-foreground">Soma de todos os DN das juntas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência TUB_AC</CardTitle>
              {specStats.eficienciaCarbono <= specStats.valorBaseCarbono ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{specStats.eficienciaCarbono.toFixed(2)}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Real vs Base ({specStats.valorBaseCarbono})</p>
                <Badge variant={specStats.eficienciaCarbono <= specStats.valorBaseCarbono ? "default" : "destructive"}>
                  {specStats.eficienciaCarbono <= specStats.valorBaseCarbono ? "Eficiente" : "Acima"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência TUB_AI304</CardTitle>
              {specStats.eficienciaInox <= specStats.valorBaseInox ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{specStats.eficienciaInox.toFixed(2)}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Real vs Base ({specStats.valorBaseInox})</p>
                <Badge variant={specStats.eficienciaInox <= specStats.valorBaseInox ? "default" : "destructive"}>
                  {specStats.eficienciaInox <= specStats.valorBaseInox ? "Eficiente" : "Acima"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso das Atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso das Atividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Soldagem</span>
                  <span>{stats.percentualSoldadas}%</span>
                </div>
                <Progress value={stats.percentualSoldadas} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Acoplamento</span>
                  <span>{stats.percentualAcopladas}%</span>
                </div>
                <Progress value={stats.percentualAcopladas} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}