import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, Eye, Edit, MapPin, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const mockAlojamentos = [
  {
    id: "A01",
    nome: "MOI 01 - Gerente",
    fornecedor: "Bruno Martins Moreira",
    endereco: "Estrada dos Orquidófilos, 958 - Apto 03",
    capacidade: 12,
    ocupacao_atual: 8,
    valor_mensal: 2619.00,
    status_contrato: "ativo",
    inicio_contrato: "2024-01-15",
    fim_contrato: "2026-01-14",
    cca: "24043",
    cca_nome: "Obra São Paulo Centro",
    distancia_obra: "15 km"
  },
  {
    id: "A02", 
    nome: "MOD 01 - Operários",
    fornecedor: "Embu Mercearia Delicias",
    endereco: "Rua das Flores, 123 - Casa",
    capacidade: 20,
    ocupacao_atual: 18,
    valor_mensal: 4500.00,
    status_contrato: "ativo",
    inicio_contrato: "2024-02-01",
    fim_contrato: "2025-12-31",
    cca: "24043",
    cca_nome: "Obra São Paulo Centro",
    distancia_obra: "8 km"
  },
  {
    id: "A03",
    nome: "Técnicos Suporte",
    fornecedor: "Locações XYZ Ltda",
    endereco: "Av. Principal, 456 - Apto 12",
    capacidade: 8,
    ocupacao_atual: 6,
    valor_mensal: 3200.00,
    status_contrato: "vencendo",
    inicio_contrato: "2023-10-01",
    fim_contrato: "2024-10-31",
    cca: "24044",
    cca_nome: "Obra Guarulhos",
    distancia_obra: "5 km"
  },
  {
    id: "A04",
    nome: "Supervisores",
    fornecedor: "Imóveis ABC",
    endereco: "Rua da Paz, 789 - Casa",
    capacidade: 6,
    ocupacao_atual: 0,
    valor_mensal: 1800.00,
    status_contrato: "inativo",
    inicio_contrato: "2024-01-01",
    fim_contrato: "2024-06-30",
    cca: "24045",
    cca_nome: "Obra Osasco",
    distancia_obra: "12 km"
  }
];

const mockCcas = [
  { id: "24043", nome: "Obra São Paulo Centro" },
  { id: "24044", nome: "Obra Guarulhos" },
  { id: "24045", nome: "Obra Osasco" }
];

const mockFornecedores = [
  "Bruno Martins Moreira",
  "Embu Mercearia Delicias",
  "Locações XYZ Ltda",
  "Imóveis ABC"
];

export default function VisaoGeralAlojamentos() {
  const [ccaFiltro, setCcaFiltro] = useState("all");
  const [fornecedorFiltro, setFornecedorFiltro] = useState("all");
  const [statusFiltro, setStatusFiltro] = useState("all");
  const [buscaTexto, setBuscaTexto] = useState("");

  const alojamentosFiltrados = mockAlojamentos.filter(alojamento => {
    const matchCca = ccaFiltro === "all" || !ccaFiltro || alojamento.cca === ccaFiltro;
    const matchFornecedor = fornecedorFiltro === "all" || !fornecedorFiltro || alojamento.fornecedor === fornecedorFiltro;
    const matchStatus = statusFiltro === "all" || !statusFiltro || alojamento.status_contrato === statusFiltro;
    const matchTexto = !buscaTexto || 
      alojamento.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      alojamento.fornecedor.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      alojamento.endereco.toLowerCase().includes(buscaTexto.toLowerCase());
    
    return matchCca && matchFornecedor && matchStatus && matchTexto;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ativo
        </Badge>;
      case "vencendo":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Vencendo
        </Badge>;
      case "inativo":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Inativo
        </Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  const getOcupacaoColor = (ocupacao: number, capacidade: number) => {
    const percentual = (ocupacao / capacidade) * 100;
    if (percentual >= 90) return "text-red-600";
    if (percentual >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getOcupacaoPercentual = (ocupacao: number, capacidade: number) => {
    return Math.round((ocupacao / capacidade) * 100);
  };

  // Estatísticas gerais
  const totalCapacidade = alojamentosFiltrados.reduce((sum, a) => sum + a.capacidade, 0);
  const totalOcupacao = alojamentosFiltrados.reduce((sum, a) => sum + a.ocupacao_atual, 0);
  const alojamentosAtivos = alojamentosFiltrados.filter(a => a.status_contrato === "ativo").length;
  const valorTotalMensal = alojamentosFiltrados
    .filter(a => a.status_contrato === "ativo")
    .reduce((sum, a) => sum + a.valor_mensal, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão geral de alojamentos</h1>
          <p className="text-muted-foreground">Listagem e controle de todos os alojamentos cadastrados</p>
        </div>
        <Button>
          <Building2 className="w-4 h-4 mr-2" />
          Novo alojamento
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Total alojamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alojamentosFiltrados.length}</div>
            <p className="text-xs text-muted-foreground">
              {alojamentosAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Ocupação geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOcupacao}/{totalCapacidade}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalOcupacao / totalCapacidade) * 100)}% ocupado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor mensal total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Apenas alojamentos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vagas disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCapacidade - totalOcupacao}
            </div>
            <p className="text-xs text-muted-foreground">
              Em alojamentos ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Buscar por nome, fornecedor ou endereço..."
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Select value={ccaFiltro} onValueChange={setCcaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  {mockCcas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id}>
                      {cca.id} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={fornecedorFiltro} onValueChange={setFornecedorFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  {mockFornecedores.map((fornecedor) => (
                    <SelectItem key={fornecedor} value={fornecedor}>
                      {fornecedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="vencendo">Vencendo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCcaFiltro("all");
                  setFornecedorFiltro("all");
                  setStatusFiltro("all");
                  setBuscaTexto("");
                }}
              >
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Alojamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Alojamentos ({alojamentosFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead className="text-center">Ocupação</TableHead>
                <TableHead className="text-right">Valor mensal</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alojamentosFiltrados.map((alojamento) => (
                <TableRow key={alojamento.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alojamento.nome}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alojamento.distancia_obra}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alojamento.fornecedor}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm truncate" title={alojamento.endereco}>
                      {alojamento.endereco}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alojamento.cca}</div>
                      <div className="text-xs text-muted-foreground">{alojamento.cca_nome}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <div className={`font-bold ${getOcupacaoColor(alojamento.ocupacao_atual, alojamento.capacidade)}`}>
                        {alojamento.ocupacao_atual}/{alojamento.capacidade}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getOcupacaoPercentual(alojamento.ocupacao_atual, alojamento.capacidade)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {alojamento.valor_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(alojamento.inicio_contrato).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        até {new Date(alojamento.fim_contrato).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(alojamento.status_contrato)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}