import { useState } from "react";
import { Car, AlertTriangle, Users, Fuel, DollarSign, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { KPICard } from "@/components/gestao-pessoas/veiculos/dashboard/KPICard";
import { VeiculosCharts } from "@/components/gestao-pessoas/veiculos/dashboard/VeiculosCharts";
import { MultasCharts } from "@/components/gestao-pessoas/veiculos/dashboard/MultasCharts";
import { CondutoresCharts } from "@/components/gestao-pessoas/veiculos/dashboard/CondutoresCharts";
import { AbastecimentoCharts } from "@/components/gestao-pessoas/veiculos/dashboard/AbastecimentoCharts";
import { useDashboardVeiculos } from "@/hooks/gestao-pessoas/useDashboardVeiculos";

export default function DashboardVeiculos() {
  const [periodo, setPeriodo] = useState<"mensal" | "trimestral" | "anual">("mensal");
  const { dashboardData, isLoading } = useDashboardVeiculos(periodo);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    veiculosAtivos,
    cnhVencendo,
    multasPendentes,
    condutoresCriticos,
    gastosCombustivelMes,
    totalMultasMes
  } = dashboardData.kpis;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Gestão de Veículos</h1>
        <p className="text-muted-foreground">
          Visão consolidada de veículos, multas, condutores e abastecimento
        </p>
      </div>

      <Separator />

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          titulo="Veículos Ativos"
          valor={veiculosAtivos}
          Icon={Car}
          cor="azul"
        />
        <KPICard
          titulo="CNHs Vencendo"
          valor={cnhVencendo}
          Icon={AlertTriangle}
          cor="amarelo"
        />
        <KPICard
          titulo="Multas Pendentes"
          valor={multasPendentes}
          Icon={Receipt}
          cor="vermelho"
        />
        <KPICard
          titulo="Condutores Críticos"
          valor={condutoresCriticos}
          Icon={Users}
          cor="vermelho"
        />
        <KPICard
          titulo="Gasto Combustível (Mês)"
          valor={gastosCombustivelMes.toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
          Icon={Fuel}
          cor="roxo"
        />
        <KPICard
          titulo="Total de Multas (Mês)"
          valor={totalMultasMes.toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
          Icon={DollarSign}
          cor="cinza"
        />
      </div>

      {/* Tabs de Período */}
      <Tabs value={periodo} onValueChange={(v) => setPeriodo(v as typeof periodo)}>
        <TabsList>
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
          <TabsTrigger value="trimestral">Trimestral</TabsTrigger>
          <TabsTrigger value="anual">Anual</TabsTrigger>
        </TabsList>

        <TabsContent value="mensal" className="space-y-8 mt-6">
          {/* Seção: Visão Geral de Veículos */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Car className="h-6 w-6 text-blue-500" />
                Visão Geral de Veículos
              </h2>
              <p className="text-sm text-muted-foreground">
                Status, locadoras e próximas devoluções
              </p>
            </div>
            <VeiculosCharts veiculos={dashboardData.rawData.veiculos} />
          </div>

          <Separator />

          {/* Seção: Análise de Multas */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Receipt className="h-6 w-6 text-red-500" />
                Análise de Multas
              </h2>
              <p className="text-sm text-muted-foreground">
                Evolução, status e principais ocorrências
              </p>
            </div>
            <MultasCharts multas={dashboardData.rawData.multas} />
          </div>

          <Separator />

          {/* Seção: Gestão de Condutores */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6 text-green-500" />
                Gestão de Condutores
              </h2>
              <p className="text-sm text-muted-foreground">
                Pontuação, status de CNH e alertas
              </p>
            </div>
            <CondutoresCharts condutores={dashboardData.rawData.condutores} multas={dashboardData.rawData.multas} />
          </div>

          <Separator />

          {/* Seção: Controle de Abastecimento */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Fuel className="h-6 w-6 text-purple-500" />
                Controle de Abastecimento
              </h2>
              <p className="text-sm text-muted-foreground">
                Consumo, gastos e distribuição por tipo
              </p>
            </div>
            <AbastecimentoCharts transacoes={dashboardData.rawData.abastecimentos} />
          </div>
        </TabsContent>

        <TabsContent value="trimestral" className="mt-6">
          <div className="text-center text-muted-foreground py-12">
            <p>Visão trimestral em desenvolvimento</p>
          </div>
        </TabsContent>

        <TabsContent value="anual" className="mt-6">
          <div className="text-center text-muted-foreground py-12">
            <p>Visão anual em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
