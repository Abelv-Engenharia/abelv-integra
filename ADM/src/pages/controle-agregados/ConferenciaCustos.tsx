import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Calculator, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const mockLancamentos = [
  {
    id: "1",
    alojamento: "MOI 01 - Gerente",
    fornecedor: "Bruno Martins Moreira",
    valor_contratual: 2619.00,
    valor_realizado: 2619.00,
    diferenca: 0,
    nf_numero: "001234",
    nf_arquivo: "nf_001234.pdf",
    status: "conferido",
    observacoes: "Valor conforme contrato"
  },
  {
    id: "2",
    alojamento: "MOD 01 - Operários", 
    fornecedor: "Embu Mercearia",
    valor_contratual: 4500.00,
    valor_realizado: 4650.00,
    diferenca: 150.00,
    nf_numero: "002456",
    nf_arquivo: "",
    status: "em_conferencia",
    observacoes: "Divergência de valor - verificar taxa adicional"
  }
];

const mockAlojamentos = [
  { id: "A01", nome: "MOI 01 - Gerente", fornecedor: "Bruno Martins Moreira", valor_mensal: 2619.00 },
  { id: "A02", nome: "MOD 01 - Operários", fornecedor: "Embu Mercearia", valor_mensal: 4500.00 },
  { id: "A03", nome: "Técnicos", fornecedor: "Locações XYZ", valor_mensal: 3200.00 }
];

export default function ConferenciaCustos() {
  const [alojamentoSelecionado, setAlojamentoSelecionado] = useState("");
  const [valorRealizado, setValorRealizado] = useState("");
  const [numeroNf, setNumeroNf] = useState("");
  const [arquivoNf, setArquivoNf] = useState<File | null>(null);
  const [observacoes, setObservacoes] = useState("");

  const alojamentoAtual = mockAlojamentos.find(a => a.id === alojamentoSelecionado);
  const diferenca = alojamentoAtual && valorRealizado ? 
    parseFloat(valorRealizado) - alojamentoAtual.valor_mensal : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_conferencia":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Em conferência
        </Badge>;
      case "conferido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Conferido
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArquivoNf(file);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conferência de custos e lançamento mensal</h1>
          <p className="text-muted-foreground">Administração matricial - conferência de custos e lançamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Conferência */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Conferência de custos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alojamento">Alojamento *</Label>
                <Select value={alojamentoSelecionado} onValueChange={setAlojamentoSelecionado}>
                  <SelectTrigger className={!alojamentoSelecionado ? "border-red-300 bg-red-50" : ""}>
                    <SelectValue placeholder="Selecione o alojamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAlojamentos.map((alojamento) => (
                      <SelectItem key={alojamento.id} value={alojamento.id}>
                        {alojamento.nome} - {alojamento.fornecedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {alojamentoAtual && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fornecedor / Contrato vinculado</Label>
                      <Input
                        value={alojamentoAtual.fornecedor}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Valor contratual do período</Label>
                      <Input
                        value={`R$ ${alojamentoAtual.valor_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero-nf">Número da nota fiscal / Pedido de despesa *</Label>
                      <Input
                        id="numero-nf"
                        placeholder="Ex: 001234"
                        value={numeroNf}
                        onChange={(e) => setNumeroNf(e.target.value)}
                        className={!numeroNf ? "border-red-300 bg-red-50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valor-realizado">Valor realizado *</Label>
                      <Input
                        id="valor-realizado"
                        type="number"
                        placeholder="0,00"
                        step="0.01"
                        value={valorRealizado}
                        onChange={(e) => setValorRealizado(e.target.value)}
                        className={!valorRealizado ? "border-red-300 bg-red-50" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arquivo-nf">Upload da nota fiscal *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="arquivo-nf"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {arquivoNf && (
                      <p className="text-sm text-green-600">
                        Arquivo selecionado: {arquivoNf.name}
                      </p>
                    )}
                  </div>

                  {valorRealizado && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <div>Valor contratual: R$ {alojamentoAtual.valor_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          <div>Valor realizado: R$ {parseFloat(valorRealizado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Diferença:</div>
                          <div className={`font-bold ${getDiferencaColor(diferenca)}`}>
                            {diferenca >= 0 ? '+' : ''}R$ {diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      {Math.abs(diferenca) > 0 && (
                        <div className="flex items-center gap-2 mt-2 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Atenção: Existe diferença entre os valores</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Adicione observações sobre a conferência..."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Conferir e aprovar
                    </Button>
                    <Button variant="outline">Limpar</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo da Conferência */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Resumo mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Total contratual:</span>
                  <span className="font-medium">R$ 14.319,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total realizado:</span>
                  <span className="font-medium">R$ 14.469,00</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Diferença total:</span>
                  <span className="font-bold text-red-600">+R$ 150,00</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Lançamentos pendentes:</div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  2 pendentes
                </Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Lançamentos conferidos:</div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  5 conferidos
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de Lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lançamentos do mês atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alojamento</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Valor contratual</TableHead>
                <TableHead className="text-right">Valor realizado</TableHead>
                <TableHead className="text-right">Diferença</TableHead>
                <TableHead>NF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLancamentos.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell className="font-medium">{lancamento.alojamento}</TableCell>
                  <TableCell>{lancamento.fornecedor}</TableCell>
                  <TableCell className="text-right">
                    R$ {lancamento.valor_contratual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {lancamento.valor_realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${getDiferencaColor(lancamento.diferenca)}`}>
                    {lancamento.diferenca >= 0 ? '+' : ''}R$ {lancamento.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{lancamento.nf_numero}</span>
                      {lancamento.nf_arquivo && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lancamento.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      {lancamento.status === "em_conferencia" && (
                        <Button size="sm">Conferir</Button>
                      )}
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