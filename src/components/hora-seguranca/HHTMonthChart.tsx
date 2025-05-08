
import { useEffect, useState } from "react";
import { fetchHHTByMonth } from "@/services/hora-seguranca/horasTrabalhadasService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type HHTByMonthItem = {
  mes: number;
  ano: number;
  total_horas: number;
};

// Nome dos meses em português
const mesesNomes = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function HHTMonthChart() {
  const [hhtData, setHhtData] = useState<HHTByMonthItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHHTData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHHTByMonth();
        setHhtData(data);
      } catch (error) {
        console.error("Erro ao carregar dados de HHT por mês:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHHTData();
  }, []);

  // Formatar os dados para o gráfico
  const chartData = hhtData.map((item) => ({
    name: `${mesesNomes[item.mes - 1]}/${item.ano.toString().substring(2)}`,
    horas: Number(item.total_horas.toFixed(2)),
    mes: item.mes,
    ano: item.ano,
  })).slice(0, 12).reverse(); // Pegar os últimos 12 meses e inverter para ordem cronológica

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Horas Trabalhadas por Mês</CardTitle>
          <CardDescription>
            Histórico dos últimos meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Trabalhadas por Mês</CardTitle>
        <CardDescription>
          Histórico dos últimos meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                formatter={(value) => [`${value} horas`, "Horas Trabalhadas"]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar
                dataKey="horas"
                name="Horas Trabalhadas"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
