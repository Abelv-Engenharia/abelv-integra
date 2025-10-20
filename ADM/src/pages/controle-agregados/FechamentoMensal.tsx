import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle, DollarSign, FileText, Send, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const mockFechamentos = [
  {
    id: "1",
    cca: "24043",
    cca_nome: "Obra São Paulo Centro",
    mes_referencia: "09/2024",
    total_contrato: 14319.00,
    total_nf: 14469.00,
    diferenca: 150.00,
    itens_total: 8,
    itens_divergentes: 2,
    status: "pendente_aprovacao",
    responsavel: "Rebeca Silva",
    data_conferencia: "2024-09-23"
  },
  {
    id: "2", 
    cca: "24044",
    cca_nome: "Obra Guarulhos",
    mes_referencia: "09/2024",
    total_contrato: 22500.00,
    total_nf: 22500.00,
    diferenca: 0,
    itens_total: 12,
    itens_divergentes: 0,
    status: "aprovado",
    responsavel: "Carlos Santos",
    data_conferencia: "2024-09-20",
    data_aprovacao: "2024-09-21",
    aprovado_por: "Ricardo Mendes"
  }
];

const mockDivergencias = [
  {
    id: "1",
    alojamento: "MOD 01 - Operários",
    fornecedor: "Embu Mercearia",
    valor_contrato: 4500.00,
    valor_nf: 4650.00,
    diferenca: 150.00,
    percentual: 3.33,
    observacoes: "Taxa adicional não prevista no contrato"
  },
  {
    id: "2",
    alojamento: "Técnicos Suporte",
    fornecedor: "Locações ABC",
    valor_contrato: 3200.00,
    valor_nf: 3150.00,
    diferenca: -50.00,
    percentual: -1.56,
    observacoes: "Desconto aplicado por manutenção"
  }
];

export default function FechamentoMensal() {
  const [ccaSelecionado, setCcaSelecionado] = useState("24043");
  const [mesSelecionado, setMesSelecionado] = useState("09/2024");

  const fechamentoAtual = mockFechamentos.find(f => f.cca === ccaSelecionado && f.mes_referencia === mesSelecionado);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente_aprovacao":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Pendente aprovação
        </Badge>;
      case "aprovado":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprovado
        </Badge>;
      case "rejeitado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rejeitado
        </Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  const getDiferencaColor = (diferenca: number) => {
    if (diferenca > 0) return "text-red-600";
    if (diferenca < 0) return "text-green-600";
    return "text-gray-600";
  };

  const handleAprovarFechamento = () => {
    if (!fechamentoAtual) return;

    if (fechamentoAtual.itens_divergentes > 0) {
      toast.error("Não é possível aprovar fechamento com divergências pendentes");
      return;
    }

    toast.success("Fechamento aprovado e espelho Sienge gerado com sucesso!");
  };

  const handleRejeitarFechamento = () => {
    toast.info("Fechamento rejeitado. Devolvido para conferência.");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fechamento mensal - Conferência matricial</h1>
          <p className="text-muted-foreground">Validação e aprovação final antes do envio ao Sienge</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros de fechamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Obra/CCA</label>
              <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mês de referência</label>
              <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09/2024">Setembro/2024</SelectItem>
                  <SelectItem value="08/2024">Agosto/2024</SelectItem>
                  <SelectItem value="07/2024">Julho/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {fechamentoAtual && (
        <>
          {/* Resumo do Fechamento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total contratual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {fechamentoAtual.total_contrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Total NF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {fechamentoAtual.total_nf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Diferença
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getDiferencaColor(fechamentoAtual.diferenca)}`}>
                  {fechamentoAtual.diferenca >= 0 ? '+' : ''}R$ {fechamentoAtual.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((fechamentoAtual.diferenca / fechamentoAtual.total_contrato) * 100).toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {getStatusBadge(fechamentoAtual.status)}
                <p className="text-xs text-muted-foreground mt-2">
                  {fechamentoAtual.itens_divergentes} de {fechamentoAtual.itens_total} itens com divergência
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Fechamento */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do fechamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div><strong>CCA:</strong> {fechamentoAtual.cca} - {fechamentoAtual.cca_nome}</div>
                  <div><strong>Período:</strong> {fechamentoAtual.mes_referencia}</div>
                  <div><strong>Responsável conferência:</strong> {fechamentoAtual.responsavel}</div>
                  <div><strong>Data conferência:</strong> {new Date(fechamentoAtual.data_conferencia).toLocaleDateString()}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Total de itens:</strong> {fechamentoAtual.itens_total}</div>
                  <div><strong>Itens com divergência:</strong> {fechamentoAtual.itens_divergentes}</div>
                  {fechamentoAtual.data_aprovacao && (
                    <>
                      <div><strong>Data aprovação:</strong> {new Date(fechamentoAtual.data_aprovacao).toLocaleDateString()}</div>
                      <div><strong>Aprovado por:</strong> {fechamentoAtual.aprovado_por}</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Painel de Divergências */}
          {fechamentoAtual.itens_divergentes > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Painel de divergências ({mockDivergencias.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alojamento</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Valor contrato</TableHead>
                      <TableHead className="text-right">Valor NF</TableHead>
                      <TableHead className="text-right">Diferença</TableHead>
                      <TableHead className="text-right">%</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDivergencias.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.alojamento}</TableCell>
                        <TableCell>{item.fornecedor}</TableCell>
                        <TableCell className="text-right">
                          R$ {item.valor_contrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {item.valor_nf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${getDiferencaColor(item.diferenca)}`}>
                          {item.diferenca >= 0 ? '+' : ''}R$ {item.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${getDiferencaColor(item.diferenca)}`}>
                          {item.percentual >= 0 ? '+' : ''}{item.percentual.toFixed(2)}%
                        </TableCell>
                        <TableCell className="max-w-xs text-sm">{item.observacoes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Ações de Aprovação */}
          {fechamentoAtual.status === "pendente_aprovacao" && (
            <Card>
              <CardHeader>
                <CardTitle>Ações de coordenação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAprovarFechamento}
                    disabled={fechamentoAtual.itens_divergentes > 0}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar e gerar espelho Sienge
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRejeitarFechamento}
                    className="flex-1"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Rejeitar fechamento
                  </Button>
                </div>
                {fechamentoAtual.itens_divergentes > 0 && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Existe(m) {fechamentoAtual.itens_divergentes} item(ns) com divergência. Resolva antes de aprovar.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Log de Aprovação */}
          {fechamentoAtual.status === "aprovado" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Aprovação registrada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div><strong>Aprovado por:</strong> {fechamentoAtual.aprovado_por}</div>
                    <div><strong>Data:</strong> {new Date(fechamentoAtual.data_aprovacao!).toLocaleString('pt-BR')}</div>
                    <div><strong>Valor total aprovado:</strong> R$ {fechamentoAtual.total_nf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div><strong>Status:</strong> Espelho Sienge gerado automaticamente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}