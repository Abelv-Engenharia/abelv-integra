
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, AlertTriangle, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const ImportacaoDados = () => {
  const importOptions = [
    {
      title: "Importação de Funcionários",
      description: "Importar funcionários via arquivo Excel",
      href: "/admin/importacao/funcionarios",
      icon: Users,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Importação de Desvios",
      description: "Importar desvios via arquivo Excel",
      href: "/admin/importacao/desvios",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600"
    },
    {
      title: "Importação de Execução de Treinamentos",
      description: "Importar execuções de treinamentos via arquivo Excel",
      href: "/admin/importacao/execucao-treinamentos",
      icon: GraduationCap,
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Importação de Dados</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {importOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <Link key={option.href} to={option.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {option.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ImportacaoDados;
