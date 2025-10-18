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
import { FileUpload } from "@/components/ui/file-upload";
import { useModelos } from "@/hooks/useModelos";
import { format } from "date-fns";

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
  const [nomeModelo, setNomeModelo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivoUrl, setArquivoUrl] = useState("");
  const [arquivoNome, setArquivoNome] = useState("");
  const [erros, setErros] = useState<Record<string, boolean>>({});

  const { modelos, totalModelos, totalAtivos, totalTipos, isLoading, createModelo, deleteModelo } = useModelos();

  const handleUpload = () => {
    const novosErros: Record<string, boolean> = {};
    
    if (!selectedTipo) novosErros.tipo = true;
    if (!nomeModelo.trim()) novosErros.nome = true;
    if (!arquivoUrl) novosErros.arquivo = true;

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos marcados em vermelho",
        variant: "destructive",
      });
      return;
    }

    createModelo.mutate(
      {
        tipo: selectedTipo,
        nome: nomeModelo,
        descricao: descricao || undefined,
        arquivo_url: arquivoUrl,
        arquivo_nome: arquivoNome,
        codigos_disponiveis: codigosDisponiveis,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedTipo("");
          setNomeModelo("");
          setDescricao("");
          setArquivoUrl("");
          setArquivoNome("");
          setErros({});
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este modelo?")) {
      deleteModelo.mutate(id);
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
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
                <Label htmlFor="tipo" className={erros.tipo ? "text-destructive" : ""}>
                  Tipo de Documento *
                </Label>
                <Select 
                  value={selectedTipo} 
                  onValueChange={(value) => {
                    setSelectedTipo(value);
                    setErros((prev) => ({ ...prev, tipo: false }));
                  }}
                >
                  <SelectTrigger className={erros.tipo ? "border-destructive" : ""}>
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
                <Label htmlFor="nome" className={erros.nome ? "text-destructive" : ""}>
                  Nome do Modelo *
                </Label>
                <Input 
                  id="nome" 
                  placeholder="Ex: Ordem de Serviço Padrão V2" 
                  value={nomeModelo}
                  onChange={(e) => {
                    setNomeModelo(e.target.value);
                    setErros((prev) => ({ ...prev, nome: false }));
                  }}
                  className={erros.nome ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o modelo e quando deve ser usado"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arquivo" className={erros.arquivo ? "text-destructive" : ""}>
                  Arquivo do Modelo *
                </Label>
                <FileUpload
                  accept=".docx,.xlsx"
                  onFileUpload={(url, nome) => {
                    setArquivoUrl(url);
                    setArquivoNome(nome);
                    setErros((prev) => ({ ...prev, arquivo: false }));
                  }}
                  currentFile={arquivoUrl}
                  onRemove={() => {
                    setArquivoUrl("");
                    setArquivoNome("");
                  }}
                  className={erros.arquivo ? "border-destructive border-2" : ""}
                />
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
                <Button onClick={handleUpload} disabled={createModelo.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {createModelo.isPending ? "Cadastrando..." : "Cadastrar Modelo"}
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
            <div className="text-2xl font-bold">{totalModelos}</div>
            <p className="text-xs text-muted-foreground">Templates cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtivos}</div>
            <p className="text-xs text-muted-foreground">Disponíveis para uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTipos}</div>
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
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Carregando modelos...</p>
            </div>
          ) : modelos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum modelo cadastrado</p>
              <p className="text-sm mt-1">
                Clique em "Novo Modelo" para cadastrar seu primeiro template
              </p>
            </div>
          ) : (
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
                {modelos.map((modelo) => (
                  <TableRow key={modelo.id}>
                    <TableCell>
                      <Badge variant="secondary">{modelo.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{modelo.nome}</TableCell>
                    <TableCell>V{modelo.versao}</TableCell>
                    <TableCell>
                      <Badge variant={modelo.ativo ? "default" : "secondary"}>
                        {modelo.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(modelo.created_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(modelo.arquivo_url)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(modelo.id)}
                          className="text-destructive hover:text-destructive"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Modelos;
