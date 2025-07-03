
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const RelatoriosDashboard = () => {
  const reportCards = [
    {
      title: "Relatórios de Desvios",
      description: "Análise de desvios por período, tipo e classificação de risco",
      icon: <FileText className="h-8 w-8" />,
      link: "/relatorios/desvios",
    },
    {
      title: "Relatórios de Treinamentos",
      description: "Análise de treinamentos por período, status e funcionário",
      icon: <FileText className="h-8 w-8" />,
      link: "/relatorios/treinamentos",
    },
    {
      title: "Relatórios de Ocorrências",
      description: "Análise de ocorrências por período, tipo e classificação",
      icon: <FileText className="h-8 w-8" />,
      link: "/relatorios/ocorrencias",
    },
    {
      title: "Relatórios IDSMS",
      description: "Análise de indicadores IDSMS por período, CCA e tipo de indicador",
      icon: <BarChart3 className="h-8 w-8" />,
      link: "/relatorios/idsms",
    },
    {
      title: "Relatórios HSA",
      description: "Análise completa das inspeções de Hora da Segurança por período e responsável",
      icon: <Shield className="h-8 w-8" />,
      link: "/relatorios/hsa",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {reportCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className="h-full hover:bg-slate-50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{card.title}</CardTitle>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatoriosDashboard;
