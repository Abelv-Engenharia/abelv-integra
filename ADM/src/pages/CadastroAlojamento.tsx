import { useState } from "react";
import { Building2, Users, FileCheck, Receipt, UserCheck, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FornecedoresTab } from "@/components/alojamento/FornecedoresTab";
import { ContratosTab } from "@/components/alojamento/ContratosTab"; 
import { VistoriasTab } from "@/components/alojamento/VistoriasTab";
import { PedidosDespesaTab } from "@/components/alojamento/PedidosDespesaTab";
import { VinculacaoColaboradoresTab } from "@/components/alojamento/VinculacaoColaboradoresTab";

// Dados mockados
const ccas = [
  { id: "CCA001", nome: "Obra Principal" },
  { id: "CCA002", nome: "Expansão Norte" },
  { id: "CCA003", nome: "Manutenção Sul" }
];

const resumoGeral = {
  contratosAtivos: 8,
  contratosVencendo: 2,
  capacidadeContratada: 150,
  capacidadeOcupada: 120
};

const alertas = [
  { tipo: "vencimento", descricao: "2 contratos vencem em 30 dias", prioridade: "alta" },
  { tipo: "vistoria", descricao: "3 contratos sem vistoria", prioridade: "media" },
  { tipo: "capacidade", descricao: "Alojamento Norte com 95% da capacidade ocupada", prioridade: "baixa" }
];

const CadastroAlojamento = () => {
  const [ccaSelecionado, setCcaSelecionado] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  const resumoCards = [
    {
      title: "Contratos Ativos",
      value: resumoGeral.contratosAtivos,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Vencendo em 30 dias",
      value: resumoGeral.contratosVencendo,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Capacidade Contratada",
      value: resumoGeral.capacidadeContratada,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Ocupação Atual",
      value: `${resumoGeral.capacidadeOcupada}/${resumoGeral.capacidadeContratada}`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-700 border-red-200";
      case "media": return "bg-orange-100 text-orange-700 border-orange-200";
      case "baixa": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cadastro e Contratos de Alojamento</h1>
          <p className="text-muted-foreground">Gestão completa de fornecedores, contratos e ocupação</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="space-y-2">
            <Label htmlFor="cca-filter">CCA da Obra</Label>
            <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o CCA" />
              </SelectTrigger>
              <SelectContent>
                {ccas.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id}>
                    {cca.id} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-filter">Data</Label>
            <Input
              id="data-filter"
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className="w-[180px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="vencendo">Vencendo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            Alertas Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alertas.map((alerta, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${getPrioridadeCor(alerta.prioridade)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{alerta.descricao}</span>
                  <Badge variant="outline" className="text-xs">
                    {alerta.prioridade.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs do Módulo */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="fornecedores" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="fornecedores" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Fornecedores
              </TabsTrigger>
              <TabsTrigger value="contratos" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Contratos
              </TabsTrigger>
              <TabsTrigger value="vistorias" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Vistorias
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Vinculação
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fornecedores" className="mt-6">
              <FornecedoresTab />
            </TabsContent>
            
            <TabsContent value="contratos" className="mt-6">
              <ContratosTab />
            </TabsContent>
            
            <TabsContent value="vistorias" className="mt-6">
              <VistoriasTab />
            </TabsContent>
            
            <TabsContent value="pedidos" className="mt-6">
              <PedidosDespesaTab />
            </TabsContent>
            
            <TabsContent value="vinculacao" className="mt-6">
              <VinculacaoColaboradoresTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroAlojamento;