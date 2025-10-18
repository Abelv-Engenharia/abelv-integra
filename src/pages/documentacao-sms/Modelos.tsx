import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Upload, Plus, Eye, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tiposDocumento = [
  { value: "OS", label: "Ordem de Serviço" },
  { value: "TERMO_ALTURA", label: "Termo de Trabalho em Altura" },
  { value: "TERMO_ELETRICIDADE", label: "Termo de Trabalho com Eletricidade" },
  { value: "TERMO_CONFINADO", label: "Termo de Espaço Confinado" },
  { value: "LISTA_PRESENCA", label: "Lista de Presença" },
  { value: "CERTIFICADO", label: "Certificado de Treinamento" },
];

const codigosDisponiveis = [
  "{{FUNCIONARIO_NOME}}",
  "{{FUNCIONARIO_MATRICULA}}",
  "{{FUNCIONARIO_CPF}}",
  "{{FUNCIONARIO_FUNCAO}}",
  "{{CCA_CODIGO}}",
  "{{CCA_NOME}}",
  "{{EMPRESA_NOME}}",
  "{{EMPRESA_CNPJ}}",
  "{{DATA_EMISSAO}}",
  "{{USUARIO_EMISSAO}}",
];

const Modelos = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState("");

  const handleUpload = () => {
    toast({
      title: "Upload realizado",
      description: "Modelo cadastrado com sucesso!",
    });
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Modelos de Documentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os templates de documentos Word e Excel
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Modelo</DialogTitle>
              <DialogDescription>
                Faça upload de um template Word (.docx) ou Excel (.xlsx) com códigos de substituição
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Documento *</Label>
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Modelo *</Label>
                <Input id="nome" placeholder="Ex: Ordem de Serviço Padrão V2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o modelo e quando deve ser usado"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo do Modelo *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste o arquivo
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos: .docx, .xlsx (máx. 5MB)
                  </p>
                  <Input
                    id="arquivo"
                    type="file"
                    accept=".docx,.xlsx"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Códigos de Substituição Disponíveis</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-2">
                    {codigosDisponiveis.map((codigo) => (
                      <Badge key={codigo} variant="secondary" className="font-mono text-xs">
                        {codigo}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Insira estes códigos no template onde deseja que os dados sejam substituídos
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Cadastrar Modelo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Modelos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Templates cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Disponíveis para uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Categorias disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Modelos */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum modelo cadastrado</p>
            <p className="text-sm mt-1">
              Clique em "Novo Modelo" para cadastrar seu primeiro template
            </p>
          </div>
          {/* Tabela será populada quando houver modelos cadastrados */}
          <div className="hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge>OS</Badge>
                  </TableCell>
                  <TableCell className="font-medium">Ordem de Serviço Padrão</TableCell>
                  <TableCell>V1</TableCell>
                  <TableCell>
                    <Badge variant="default">Ativo</Badge>
                  </TableCell>
                  <TableCell>20/01/2025</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Modelos;
