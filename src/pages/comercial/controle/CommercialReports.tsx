import { useState } from "react";
import { ArrowLeft, FileDown, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { commercialMockData, segmentoOptions, vendedorOptions } from "@/data/commercialMockData";

const CommercialReports = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedSegmento, setSelectedSegmento] = useState<string>("todos");
  const [selectedVendedor, setSelectedVendedor] = useState<string>("todos");

  const handleExport = () => {
    alert("Funcionalidade de exportação será implementada");
  };

  const availableReports = [
    {
      title: "Relatório de Vendas por Período",
      description: "Análise completa de vendas em período específico",
      icon: FileDown,
    },
    {
      title: "Relatório de Performance por Vendedor",
      description: "Desempenho individual de cada vendedor",
      icon: FileDown,
    },
    {
      title: "Relatório de Segmentos",
      description: "Análise por segmento de mercado",
      icon: FileDown,
    },
    {
      title: "Relatório de Taxa de Positivação",
      description: "Análise de conversão de propostas",
      icon: FileDown,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/comercial/controle")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Relatórios Comerciais</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>Selecione os critérios para gerar os relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Segmento</label>
              <Select value={selectedSegmento} onValueChange={setSelectedSegmento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {segmentoOptions.map((seg) => (
                    <SelectItem key={seg} value={seg}>
                      {seg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Vendedor</label>
              <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {vendedorOptions.map((vend) => (
                    <SelectItem key={vend} value={vend}>
                      {vend}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableReports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExport} className="w-full">
                <FileDown className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommercialReports;
