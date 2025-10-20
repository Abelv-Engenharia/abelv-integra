import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, AlertTriangle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const contratosAtrasados = [
  {
    id: "1",
    dataPrevista: "2024-01-10", 
    projeto: "Projeto Beta",
    fornecedor: "Hospedagem Norte S.A.",
    responsavel: "Maria Santos",
    diasAtraso: 5
  },
  {
    id: "2",
    dataPrevista: "2024-01-08",
    projeto: "Projeto Gamma", 
    fornecedor: "Acomodações Sul",
    responsavel: "Carlos Oliveira",
    diasAtraso: 8
  }
];

const vistoriasPendentes = [
  {
    id: "3",
    dataPrevista: "2024-01-25",
    projeto: "Projeto Alpha",
    fornecedor: "Alojamentos Brasil Ltda",
    responsavel: "João Silva",
    diasRestantes: 2
  },
  {
    id: "4", 
    dataPrevista: "2024-01-28",
    projeto: "Projeto Delta",
    fornecedor: "Hospedagem Centro",
    responsavel: "Ana Costa",
    diasRestantes: 5
  }
];

const contratosPorVencer = [
  {
    id: "5",
    prazoVistoria: "2024-02-01",
    diasParaVencer: 8,
    projeto: "Projeto Alpha",
    fornecedor: "Alojamentos Brasil Ltda",
    responsavel: "João Silva"
  },
  {
    id: "6",
    prazoVistoria: "2024-01-30", 
    diasParaVencer: 6,
    projeto: "Projeto Beta",
    fornecedor: "Hospedagem Norte S.A.",
    responsavel: "Maria Santos"
  }
];

const mockProjetos = ["Projeto Alpha", "Projeto Beta", "Projeto Gamma", "Projeto Delta"];
const mockFornecedores = ["Alojamentos Brasil Ltda", "Hospedagem Norte S.A.", "Acomodações Sul", "Hospedagem Centro"];

export default function AlertasVistorias() {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [projetoSelecionado, setProjetoSelecionado] = useState("all");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("all");

  const handleVerDetalhes = (vistoriaId: string) => {
    navigate(`/vistorias-alojamento`);
  };

  const handleExportar = (tipo: string) => {
    console.log(`Exportando ${tipo}...`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Alertas de Contratos e Vistorias</h1>
        <p className="text-muted-foreground">
          Acompanhamento de prazos e eventos relacionados aos contratos de alojamento
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período - desde</label>
            <Input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Período - até</label>
            <Input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Projeto</label>
            <Select value={projetoSelecionado} onValueChange={setProjetoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                {mockProjetos.map(projeto => (
                  <SelectItem key={projeto} value={projeto}>{projeto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fornecedor</label>
            <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fornecedores</SelectItem>
                {mockFornecedores.map(fornecedor => (
                  <SelectItem key={fornecedor} value={fornecedor}>{fornecedor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contratos com Vistoria Atrasada */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Contratos com Vistoria Atrasada
            </CardTitle>
            <Button variant="outline" onClick={() => handleExportar('atrasadas')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contratosAtrasados.map((contrato) => (
              <div key={contrato.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{contrato.projeto} - {contrato.fornecedor}</div>
                    <div className="text-sm text-muted-foreground">
                      Data prevista: {new Date(contrato.dataPrevista).toLocaleDateString('pt-BR')} | 
                      Responsável: {contrato.responsavel}
                    </div>
                    <Badge variant="destructive" className="mt-1">
                      {contrato.diasAtraso} dias de atraso
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleVerDetalhes(contrato.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vistorias Pendentes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Vistorias Pendentes (Próximas)
            </CardTitle>
            <Button variant="outline" onClick={() => handleExportar('pendentes')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vistoriasPendentes.map((vistoria) => (
              <div key={vistoria.id} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{vistoria.projeto} - {vistoria.fornecedor}</div>
                    <div className="text-sm text-muted-foreground">
                      Data prevista: {new Date(vistoria.dataPrevista).toLocaleDateString('pt-BR')} | 
                      Responsável: {vistoria.responsavel}
                    </div>
                    <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800 border-orange-200">
                      {vistoria.diasRestantes} dias restantes
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleVerDetalhes(vistoria.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contratos com Prazo de Vistoria a Vencer */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              Prazos de Vistoria a Vencer
            </CardTitle>
            <Button variant="outline" onClick={() => handleExportar('prazos')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contratosPorVencer.map((contrato) => (
              <div key={contrato.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{contrato.projeto} - {contrato.fornecedor}</div>
                    <div className="text-sm text-muted-foreground">
                      Prazo limite: {new Date(contrato.prazoVistoria).toLocaleDateString('pt-BR')} | 
                      Responsável: {contrato.responsavel}
                    </div>
                    <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800 border-yellow-200">
                      Vence em {contrato.diasParaVencer} dias
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleVerDetalhes(contrato.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}