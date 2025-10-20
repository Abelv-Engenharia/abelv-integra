import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockVistorias = [
  {
    id: "1",
    data: "2024-01-15",
    projeto: "Projeto Alpha",
    fornecedor: "Alojamentos Brasil Ltda",
    tipo: "Entrada",
    responsavel: "João Silva",
    status: "Realizada" as const,
    observacoes: "Vistoria e contrato assinado",
    ultimaAtualizacao: "2024-01-15 14:30"
  },
  {
    id: "2", 
    data: "2024-01-10",
    projeto: "Projeto Beta",
    fornecedor: "Hospedagem Norte S.A.",
    tipo: "Periódica",
    responsavel: "Maria Santos",
    status: "Pendente" as const,
    observacoes: "Aguardando assinatura",
    ultimaAtualizacao: "2024-01-12 09:15"
  },
  {
    id: "3",
    data: "2024-01-08",
    projeto: "Projeto Gamma",
    fornecedor: "Acomodações Sul",
    tipo: "Saída",
    responsavel: "Carlos Oliveira",
    status: "Atrasada" as const,
    observacoes: "Prazo vencido",
    ultimaAtualizacao: "2024-01-20 16:45"
  }
];

const mockProjetos = ["Projeto Alpha", "Projeto Beta", "Projeto Gamma"];
const mockFornecedores = ["Alojamentos Brasil Ltda", "Hospedagem Norte S.A.", "Acomodações Sul"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Realizada":
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Realizada</Badge>;
    case "Pendente":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
    case "Atrasada":
      return <Badge variant="destructive">Atrasada</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function RelatoriosVistorias() {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [projetoSelecionado, setProjetoSelecionado] = useState("all");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("all");
  const [statusSelecionado, setStatusSelecionado] = useState("all");

  const handleExportarCSV = () => {
    // Mock export functionality
    console.log("Exportando CSV...");
  };

  const handleExportarPDF = () => {
    // Mock export functionality  
    console.log("Exportando PDF...");
  };

  const handleVerDetalhes = (vistoriaId: string) => {
    navigate(`/vistorias-alojamento`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios de Contratos e Vistorias</h1>
        <p className="text-muted-foreground">
          Consolidação e análise dos contratos de alojamento e suas vistorias
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-red-600">Data inicial *</label>
            <Input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className={!dataInicial ? "border-red-300 bg-red-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-red-600">Data final *</label>
            <Input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className={!dataFinal ? "border-red-300 bg-red-50" : ""}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusSelecionado} onValueChange={setStatusSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Realizada">Realizada</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Atrasada">Atrasada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ações e Tabela */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contratos e Vistorias Realizadas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportarCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button variant="outline" onClick={handleExportarPDF}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data da vistoria</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Tipo de vistoria</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Última atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVistorias.map((vistoria) => (
                <TableRow key={vistoria.id}>
                  <TableCell>{new Date(vistoria.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{vistoria.projeto}</TableCell>
                  <TableCell>{vistoria.fornecedor}</TableCell>
                  <TableCell>{vistoria.tipo}</TableCell>
                  <TableCell>{vistoria.responsavel}</TableCell>
                  <TableCell>{getStatusBadge(vistoria.status)}</TableCell>
                  <TableCell className="text-sm">
                    {vistoria.observacoes}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {vistoria.ultimaAtualizacao}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVerDetalhes(vistoria.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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