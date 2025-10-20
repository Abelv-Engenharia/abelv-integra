import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vaga } from "@/types/gestao-pessoas/vaga";
import { Briefcase, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface PainelResumoProps {
  vagas: Vaga[];
}

export function PainelResumo({ vagas: todasVagas }: PainelResumoProps) {
  const totalVagas = todasVagas.length;
  const vagasDentroSLA = todasVagas.filter(v => !v.atrasado).length;
  const vagasAtrasadas = todasVagas.filter(v => v.atrasado).length;
  
  const calcularTempoMedio = () => {
    const vagasComTempo = todasVagas.filter(v => v.diasRestantes !== undefined);
    if (vagasComTempo.length === 0) return 0;
    
    const totalDias = vagasComTempo.reduce((acc, v) => {
      return acc + (v.diasRestantes || 0);
    }, 0);
    
    return Math.round(totalDias / vagasComTempo.length);
  };

  const tempoMedio = calcularTempoMedio();

  const stats = [
    {
      title: "Total de Vagas",
      value: totalVagas,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Dentro do SLA",
      value: vagasDentroSLA,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      percentage: totalVagas > 0 ? Math.round((vagasDentroSLA / totalVagas) * 100) : 0
    },
    {
      title: "Atrasadas",
      value: vagasAtrasadas,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      percentage: totalVagas > 0 ? Math.round((vagasAtrasadas / totalVagas) * 100) : 0
    },
    {
      title: "Tempo Médio",
      value: `${tempoMedio}d`,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.percentage !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.percentage}% do total
                  </p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
