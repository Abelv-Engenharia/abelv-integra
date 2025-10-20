import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Send, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const mockEspelhos = [
  {
    id: "1",
    cca: "24043",
    conta_contabil: "3.1.1.01.001",
    fornecedor: "Bruno Martins Moreira",
    cnpj_cpf: "077.389.046-74",
    referencia: "09/2024",
    tipo_despesa: "Alojamento",
    valor_total: 2619.00,
    nf_numero: "001234",
    nf_data: "2024-09-15",
    contrato_vinculado: "CONT-001-2024",
    observacoes: "Aluguel mensal MOI 01",
    status: "conferido",
    sienge_pedido: ""
  },
  {
    id: "2",
    cca: "24043", 
    conta_contabil: "3.1.1.01.002",
    fornecedor: "Embu Mercearia Delicias",
    cnpj_cpf: "07.339.165/0001-31",
    referencia: "09/2024",
    tipo_despesa: "Alojamento",
    valor_total: 4650.00,
    nf_numero: "002456",
    nf_data: "2024-09-20",
    contrato_vinculado: "CONT-002-2024",
    observacoes: "Aluguel mensal MOD 01 + taxa",
    status: "conferido",
    sienge_pedido: ""
  },
  {
    id: "3",
    cca: "24044",
    conta_contabil: "3.1.1.01.001", 
    fornecedor: "Locações XYZ Ltda",
    cnpj_cpf: "12.345.678/0001-90",
    referencia: "09/2024",
    tipo_despesa: "Caução",
    valor_total: 6300.00,
    nf_numero: "003789",
    nf_data: "2024-09-10",
    contrato_vinculado: "CONT-003-2024",
    observacoes: "Caução alojamento técnicos",
    status: "processado",
    sienge_pedido: "PD-2024-001234"
  }
];

const mockLogOperacoes = [
  {
    id: "1",
    usuario: "Rebeca Silva",
    data: "2024-09-23 14:30:00",
    operacao: "Geração PD Sienge",
    pedido_sienge: "PD-2024-001234",
    detalhes: "3 itens processados com sucesso"
  },
  {
    id: "2",
    usuario: "Carlos Santos",
    data: "2024-09-23 09:15:00", 
    operacao: "Exportação CSV",
    pedido_sienge: "",
    detalhes: "Relatório mensal exportado"
  }
];

export default function EspelhoDespesas() {
  const [ccaFiltro, setCcaFiltro] = useState("all");
  const [referenciaFiltro, setReferenciaFiltro] = useState("09/2024");
  const [statusFiltro, setStatusFiltro] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "conferido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Conferido
        </Badge>;
      case "processado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Send className="w-3 h-3 mr-1" />
          Processado
        </Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  const handleExportarCSV = () => {
    toast.success("Arquivo CSV exportado com sucesso!");
  };

  const handleGerarPedidoSienge = () => {
    const itensConferidos = mockEspelhos.filter(item => item.status === "conferido");
    if (itensConferidos.length === 0) {
      toast.error("Não há itens conferidos para gerar pedido no Sienge");
      return;
    }
    
    toast.success(`Pedido de despesa gerado no Sienge com ${itensConferidos.length} itens`);
  };

  const valorTotalConferido = mockEspelhos
    .filter(item => item.status === "conferido")
    .reduce((total, item) => total + item.valor_total, 0);

  const valorTotalProcessado = mockEspelhos
    .filter(item => item.status === "processado")
    .reduce((total, item) => total + item.valor_total, 0);

  const filtrosFuncionam = (item: any) => {
    const matchCca = ccaFiltro === "all" || ccaFiltro === "" || item.cca === ccaFiltro;
    const matchStatus = statusFiltro === "all" || statusFiltro === "" || item.status === statusFiltro;
    return matchCca && matchStatus;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espelho de despesas - Integração sienge</h1>
          <p className="text-muted-foreground">Consolidação e geração automática de pedidos de despesa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportarCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={handleGerarPedidoSienge}>
            <Send className="w-4 h-4 mr-2" />
            Gerar PD Sienge
          </Button>
        </div>
      </div>

      {/* Filtros e Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Select value={referenciaFiltro} onValueChange={setReferenciaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Referência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09/2024">Setembro/2024</SelectItem>
                  <SelectItem value="08/2024">Agosto/2024</SelectItem>
                  <SelectItem value="07/2024">Julho/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Select value={ccaFiltro} onValueChange={setCcaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  <SelectItem value="24043">24043</SelectItem>
                  <SelectItem value="24044">24044</SelectItem>
                  <SelectItem value="24045">24045</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="conferido">Conferido</SelectItem>
                  <SelectItem value="processado">Processado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total conferido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {valorTotalConferido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockEspelhos.filter(item => item.status === "conferido").length} itens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total processado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {valorTotalProcessado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockEspelhos.filter(item => item.status === "processado").length} itens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Último pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">PD-2024-001234</div>
            <p className="text-xs text-muted-foreground">
              23/09/2024 - 14:30
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Espelho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Espelho de despesas - {referenciaFiltro}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Conta contábil</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>CNPJ/CPF</TableHead>
                <TableHead>Tipo despesa</TableHead>
                <TableHead className="text-right">Valor total</TableHead>
                <TableHead>NF / Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEspelhos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.cca}</TableCell>
                  <TableCell className="text-sm">{item.conta_contabil}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.fornecedor}</div>
                      <div className="text-xs text-muted-foreground">{item.contrato_vinculado}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.cnpj_cpf}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.tipo_despesa}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>NF: {item.nf_numero}</div>
                      <div className="text-muted-foreground">{new Date(item.nf_data).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {item.sienge_pedido && (
                        <Button variant="outline" size="sm" title={`Pedido: ${item.sienge_pedido}`}>
                          <Send className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log de Operações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Log de operações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Nº Pedido Sienge</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogOperacoes.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.usuario}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(log.data).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {log.operacao}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.pedido_sienge || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.detalhes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}