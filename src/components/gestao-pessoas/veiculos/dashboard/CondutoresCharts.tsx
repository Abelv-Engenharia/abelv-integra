import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { differenceInDays } from "date-fns";
import { MultaCompleta } from "@/types/multa";
import { AlertCard } from "./AlertCard";

interface Condutor {
  id: string;
  nome: string;
  cpf: string;
  categoriaCnh: string;
  validadeCnh: Date;
  statusCnh: string;
  termoResponsabilidade?: boolean;
}

interface CondutoresChartsProps {
  condutores: Condutor[];
  multas: MultaCompleta[];
}

const COLORS = {
  verde: "#10B981",
  amarelo: "#F59E0B",
  laranja: "#FB923C",
  vermelho: "#EF4444",
  azul: "#3B82F6",
  roxo: "#8B5CF6"
};

export function CondutoresCharts({ condutores, multas }: CondutoresChartsProps) {
  // Calcular pontuação por condutor
  const condutoresComPontos = condutores.map(c => {
    const pontos = multas
      .filter(m => m.condutorInfrator === c.nome)
      .reduce((sum, m) => sum + m.pontos, 0);
    return { ...c, pontos };
  });

  // Gráfico 1: Distribuição de Pontuação
  const faixasPontuacao = [
    { faixa: "0-4 pts", min: 0, max: 4, cor: COLORS.verde },
    { faixa: "5-9 pts", min: 5, max: 9, cor: COLORS.amarelo },
    { faixa: "10-14 pts", min: 10, max: 14, cor: COLORS.laranja },
    { faixa: "15-19 pts", min: 15, max: 19, cor: "#F97316" },
    { faixa: "≥20 pts", min: 20, max: 999, cor: COLORS.vermelho }
  ];

  const pontuacaoData = faixasPontuacao.map(f => ({
    name: f.faixa,
    value: condutoresComPontos.filter(c => c.pontos >= f.min && c.pontos <= f.max).length,
    fill: f.cor
  }));

  // Gráfico 2: Status da CNH
  const statusCnhData = condutores.reduce((acc, c) => {
    const diasRestantes = differenceInDays(new Date(c.validadeCnh), new Date());
    let status = "";
    
    if (diasRestantes < 0) {
      status = "Vencida";
    } else if (diasRestantes <= 30) {
      status = "Vencendo (30 dias)";
    } else if (c.statusCnh === "suspensa") {
      status = "Suspensa";
    } else {
      status = "Válida";
    }

    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCnhChartData = Object.entries(statusCnhData).map(([name, value]) => ({ name, value }));

  // Gráfico 3: CNHs por Categoria
  const categoriaData = condutores.reduce((acc, c) => {
    acc[c.categoriaCnh] = (acc[c.categoriaCnh] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriaChartData = Object.entries(categoriaData).map(([name, value]) => ({ name, value }));

  // Alertas: CNH Vencendo
  const cnhVencendo = condutores
    .filter(c => {
      const diasRestantes = differenceInDays(new Date(c.validadeCnh), new Date());
      return diasRestantes > 0 && diasRestantes <= 30;
    })
    .map(c => ({
      nome: c.nome,
      detalhes: `Vence em ${differenceInDays(new Date(c.validadeCnh), new Date())} dias`,
      severidade: "alerta" as const
    }));

  // Alertas: Condutores Críticos (≥20 pontos)
  const condutoresCriticos = condutoresComPontos
    .filter(c => c.pontos >= 20)
    .map(c => ({
      nome: c.nome,
      detalhes: `${c.pontos} pontos acumulados`,
      severidade: "critico" as const
    }));

  // Alertas: Sem Termo de Responsabilidade
  const semTermo = condutores
    .filter(c => !c.termoResponsabilidade)
    .map(c => ({
      nome: c.nome,
      detalhes: "Termo de responsabilidade pendente",
      severidade: "info" as const
    }));

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Distribuição de Pontuação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Pontuação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pontuacaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status da CNH */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status da CNH</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusCnhChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusCnhChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CNHs por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CNHs por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoriaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.azul} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard titulo="CNH Vencendo em 30 Dias" itens={cnhVencendo} tipo="alerta" />
        <AlertCard titulo="Condutores Críticos (≥20 pontos)" itens={condutoresCriticos} tipo="critico" />
        <AlertCard titulo="Sem Termo de Responsabilidade" itens={semTermo} tipo="info" />
      </div>
    </div>
  );
}
