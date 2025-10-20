import { useState } from "react";
import Layout from "@/components/layout/Layout";
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
    <Layout>
      <div className="space-y-6">
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

        {/* KPIs */}
        <KPIsRecrutamento vagas={mockVagas} candidatos={mockCandidatos} />

        {/* Gráficos - Primeira linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunilConversaoChart vagas={mockVagas} />
          <DistribuicaoVagasChart vagas={mockVagas} />
        </div>

        {/* Gráficos - Segunda linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VagasPorPrioridadeChart vagas={mockVagas} />
          <VagasPorContratoChart vagas={mockVagas} />
        </div>

        {/* Gráficos - Terceira linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrigemCandidatosChart candidatos={mockCandidatos} />
          <CandidatosPorStatusChart candidatos={mockCandidatos} />
        </div>

        {/* Gráfico - Quarta linha */}
        <TopCargosChart vagas={mockVagas} />

        {/* Tabela de Vagas em Aberto */}
        <VagasAbertoTable vagas={mockVagas} />
      </div>
    </Layout>
  );
}
