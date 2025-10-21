import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { mockVagas } from "@/data/gestao-pessoas/mockVagas";
import { mockCandidatos } from "@/data/gestao-pessoas/mockCandidatos";
import { KPIsRecrutamento } from "@/components/gestao-pessoas/recrutamento/dashboard/KPIsRecrutamento";
import { FunilConversaoChart } from "@/components/gestao-pessoas/recrutamento/dashboard/FunilConversaoChart";
import { DistribuicaoVagasChart } from "@/components/gestao-pessoas/recrutamento/dashboard/DistribuicaoVagasChart";
import { VagasPorPrioridadeChart } from "@/components/gestao-pessoas/recrutamento/dashboard/VagasPorPrioridadeChart";
import { OrigemCandidatosChart } from "@/components/gestao-pessoas/recrutamento/dashboard/OrigemCandidatosChart";
import { TopCargosChart } from "@/components/gestao-pessoas/recrutamento/dashboard/TopCargosChart";
import { VagasPorContratoChart } from "@/components/gestao-pessoas/recrutamento/dashboard/VagasPorContratoChart";
import { CandidatosPorStatusChart } from "@/components/gestao-pessoas/recrutamento/dashboard/CandidatosPorStatusChart";
import { VagasAbertoTable } from "@/components/gestao-pessoas/recrutamento/dashboard/VagasAbertoTable";

export default function DashboardRecrutamento() {
  const [periodo, setPeriodo] = useState("30");
  const [area, setArea] = useState("todas");

  const handleExportPDF = () => {
    console.log("Exportando dashboard em PDF...");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Recrutamento & Seleção</h1>
          <p className="text-muted-foreground mt-1">
            Visão consolidada do processo de recrutamento e banco de talentos
          </p>
        </div>
          <Button onClick={handleExportPDF} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="60">Últimos 60 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="180">Últimos 6 meses</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Área</label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as áreas</SelectItem>
                    <SelectItem value="engenharia">Engenharia</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="rh">Recursos Humanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Carregando dados...</div>
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Vagas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.totalVagasAtivas}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">No Prazo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{kpis.vagasNoSLA}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Atrasadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{kpis.vagasAtrasadas}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Taxa Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.taxaConversao}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.totalCandidatos}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpis.tempoMedioFechamento} dias</div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos - Primeira linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  {funilConversao.length > 0 ? (
                    <div className="space-y-2">
                      {funilConversao.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.etapa}</span>
                          <span className="font-bold">{item.quantidade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">Sem dados</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Vagas</CardTitle>
                </CardHeader>
                <CardContent>
                  {distribuicaoVagas.length > 0 ? (
                    <div className="space-y-2">
                      {distribuicaoVagas.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.status}</span>
                          <span className="font-bold">{item.quantidade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">Sem dados</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gráficos - Segunda linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VagasPorPrioridadeChart vagas={vagasEmAberto} />
              <Card>
                <CardHeader>
                  <CardTitle>Vagas por Contrato</CardTitle>
                </CardHeader>
                <CardContent>
                  {vagasPorContrato.length > 0 ? (
                    <div className="space-y-2">
                      {vagasPorContrato.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.tipo}</span>
                          <span className="font-bold">{item.quantidade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">Sem dados</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gráficos - Terceira linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Origem dos Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  {origemCandidatos.length > 0 ? (
                    <div className="space-y-2">
                      {origemCandidatos.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">Sem dados</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Candidatos por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidatosPorStatus.length > 0 ? (
                    <div className="space-y-2">
                      {candidatosPorStatus.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.status}</span>
                          <span className="font-bold">{item.quantidade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-4">Sem dados</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Cargos */}
            {topCargos.length > 0 && <TopCargosChart vagas={vagasEmAberto} />}

            {/* Tabela de Vagas em Aberto */}
            {vagasEmAberto.length > 0 && <VagasAbertoTable vagas={vagasEmAberto} />}
          </>
        )}
    </div>
  );
}
