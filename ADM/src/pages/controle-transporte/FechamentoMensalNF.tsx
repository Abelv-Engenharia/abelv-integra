import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMedicoesValidadas = [
  {
    id: "1",
    cca: "24043",
    obra: "Obra São Paulo Centro",
    fornecedor: "Transportadora São Paulo Ltda",
    periodo: "01/09/2024 - 30/09/2024",
    valor_estimado: 9000.00,
    status: "disponivel"
  },
  {
    id: "2", 
    cca: "24044",
    obra: "Obra Guarulhos",
    fornecedor: "Van Express Transportes",
    periodo: "01/09/2024 - 30/09/2024",
    valor_estimado: 3600.00,
    status: "disponivel"
  }
];

const mockNotasFiscais = [
  {
    id: "1",
    medicao_id: "1",
    numero_nf: "001234",
    serie: "1",
    fornecedor: "Transportadora São Paulo Ltda",
    valor_nf: 9000.00,
    periodo_referencia: "09/2024",
    arquivo_nf: "NF_001234.pdf",
    status: "validada",
    protocolo_sienge: "SGE-2024-001",
    data_integracao: "2024-10-01",
    observacoes: "Integração realizada com sucesso"
  }
];

export default function FechamentoMensalNF() {
  const [medicoesValidadas] = useState(mockMedicoesValidadas);
  const [notasFiscais] = useState(mockNotasFiscais);
  const [novaNotaFiscal, setNovaNotaFiscal] = useState({
    medicao_id: "",
    numero_nf: "",
    serie: "",
    valor_nf: "",
    periodo_referencia: "",
    arquivo_nf: null as File | null,
    observacoes: ""
  });
  const { toast } = useToast();

  const handleSalvar = () => {
    if (!novaNotaFiscal.medicao_id || !novaNotaFiscal.numero_nf || !novaNotaFiscal.valor_nf) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simular integração automática com Sienge
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: "Nota Fiscal lançada e integrada ao Sienge automaticamente"
      });
    }, 1000);
    
    // Reset form
    setNovaNotaFiscal({
      medicao_id: "",
      numero_nf: "",
      serie: "",
      valor_nf: "",
      periodo_referencia: "",
      arquivo_nf: null,
      observacoes: ""
    });
  };

  const getMedicaoSelecionada = () => {
    return medicoesValidadas.find(m => m.id === novaNotaFiscal.medicao_id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validada":
        return <Badge variant="default">Validada</Badge>;
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>;
      case "erro_integracao":
        return <Badge variant="destructive">Erro Integração</Badge>;
      default:
        return <Badge variant="outline">Rascunho</Badge>;
    }
  };

  const getIntegracaoIcon = (status: string) => {
    switch (status) {
      case "validada":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "erro_integracao":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fechamento Mensal - NF</h1>
          <p className="text-muted-foreground">Lançar NF obrigatoriamente vinculada a uma medição validada</p>
        </div>
      </div>

      {/* Card de Informação sobre Integração */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Integração Automática com Sienge</h3>
              <p className="text-sm text-blue-700">
                Após anexar e salvar a NF vinculada à Medição Validada, o sistema efetua automaticamente 
                o lançamento no Sienge, retornando o protocolo de integração.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Nota Fiscal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Nota Fiscal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicao">Nº da Medição (Validadas) *</Label>
              <Select value={novaNotaFiscal.medicao_id} onValueChange={(value) => setNovaNotaFiscal({...novaNotaFiscal, medicao_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a medição validada" />
                </SelectTrigger>
                <SelectContent>
                  {medicoesValidadas.map((medicao) => (
                    <SelectItem key={medicao.id} value={medicao.id}>
                      {medicao.cca} - {medicao.obra} - R$ {medicao.valor_estimado.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input 
                id="fornecedor"
                value={getMedicaoSelecionada()?.fornecedor || ""}
                disabled
                className="bg-muted"
                placeholder="Preenchimento automático pela medição"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_nf">Número da Nota Fiscal *</Label>
              <Input 
                id="numero_nf"
                value={novaNotaFiscal.numero_nf}
                onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, numero_nf: e.target.value})}
                placeholder="Número da NF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serie">Série</Label>
              <Input 
                id="serie"
                value={novaNotaFiscal.serie}
                onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, serie: e.target.value})}
                placeholder="Série da NF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_nf">Valor da NF *</Label>
              <Input 
                id="valor_nf"
                type="number"
                step="0.01"
                value={novaNotaFiscal.valor_nf}
                onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, valor_nf: e.target.value})}
                placeholder="Valor da nota fiscal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período de Referência *</Label>
              <Input 
                id="periodo"
                type="month"
                value={novaNotaFiscal.periodo_referencia}
                onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, periodo_referencia: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="arquivo">Upload da NF (PDF) *</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste e solte o arquivo PDF aqui ou clique para selecionar
                </p>
                <Input 
                  type="file" 
                  accept=".pdf"
                  className="max-w-xs mx-auto"
                  onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, arquivo_nf: e.target.files?.[0] || null})}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes"
                value={novaNotaFiscal.observacoes}
                onChange={(e) => setNovaNotaFiscal({...novaNotaFiscal, observacoes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSalvar}>
              <Plus className="w-4 h-4 mr-2" />
              Lançar Nota Fiscal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Medições Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Medições Validadas (Disponíveis para NF)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicoesValidadas.map((medicao) => (
                <TableRow key={medicao.id}>
                  <TableCell className="font-medium">{medicao.cca}</TableCell>
                  <TableCell>{medicao.obra}</TableCell>
                  <TableCell>{medicao.fornecedor}</TableCell>
                  <TableCell>{medicao.periodo}</TableCell>
                  <TableCell>R$ {medicao.valor_estimado.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="default">Disponível</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lista de Notas Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notas Fiscais - Fechamento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº NF</TableHead>
                <TableHead>Série</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Integração Sienge</TableHead>
                <TableHead>Protocolo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notasFiscais.map((nf) => (
                <TableRow key={nf.id}>
                  <TableCell className="font-medium">{nf.numero_nf}</TableCell>
                  <TableCell>{nf.serie}</TableCell>
                  <TableCell>{nf.fornecedor}</TableCell>
                  <TableCell>R$ {nf.valor_nf.toFixed(2)}</TableCell>
                  <TableCell>{nf.periodo_referencia}</TableCell>
                  <TableCell>{getStatusBadge(nf.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIntegracaoIcon(nf.status)}
                      <span className="text-sm">
                        {nf.status === "validada" ? "Integrado" : "Pendente"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{nf.protocolo_sienge || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}