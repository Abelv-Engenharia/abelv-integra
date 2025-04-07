
import { useState } from "react";
import { ArrowLeft, FileSpreadsheet, Upload, Download, FileUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  type: "nao-conformidade" | "relatorio";
  dateUploaded: Date;
  codeFields: string[];
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Template Padrão de Não Conformidade",
    type: "nao-conformidade",
    dateUploaded: new Date("2025-01-15"),
    codeFields: ["{{DESVIO_ID}}", "{{DATA}}", "{{DESCRICAO}}", "{{TIPO}}", "{{RESPONSAVEL}}"]
  },
  {
    id: "2",
    name: "Relatório Mensal",
    type: "relatorio",
    dateUploaded: new Date("2025-03-22"),
    codeFields: ["{{MES}}", "{{ANO}}", "{{TOTAL_DESVIOS}}", "{{PENDENTES}}"]
  }
];

const AdminTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [file, setFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<"nao-conformidade" | "relatorio">("nao-conformidade");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's an Excel file
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-fill name from filename if empty
      if (!templateName) {
        setTemplateName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !templateName) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione um arquivo e forneça um nome para o template",
        variant: "destructive"
      });
      return;
    }

    // Mock the upload - in a real app, this would send to a server
    const newTemplate: Template = {
      id: (templates.length + 1).toString(),
      name: templateName,
      type: templateType,
      dateUploaded: new Date(),
      // In reality, we would parse the Excel file to find code fields
      codeFields: ["{{NOVO_CAMPO}}", "{{EXEMPLO}}"]
    };

    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template importado com sucesso",
      description: `${templateName} foi adicionado à biblioteca de templates`,
    });

    // Reset form
    setFile(null);
    setTemplateName("");
    setTemplateType("nao-conformidade");
    
    // Reset file input
    const fileInput = document.getElementById('template-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template removido",
      description: "O template foi removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Templates</h1>
        <p className="text-muted-foreground">
          Administração › Templates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Importar Novo Template</CardTitle>
            <CardDescription>
              Importe templates Excel com códigos para uso no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nome do Template</Label>
                <Input 
                  id="template-name" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ex: Template Padrão de Não Conformidade"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-type">Tipo de Template</Label>
                <select 
                  id="template-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as "nao-conformidade" | "relatorio")}
                >
                  <option value="nao-conformidade">Não Conformidade</option>
                  <option value="relatorio">Relatório</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-file">Arquivo Excel</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="template-file" 
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {file.name}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setFile(null);
              setTemplateName("");
              // Reset file input
              const fileInput = document.getElementById('template-file') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
            }}>
              Limpar
            </Button>
            <Button onClick={handleSubmit} disabled={!file || !templateName}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Template
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
            <CardDescription>
              Como utilizar códigos nos templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertTitle>Códigos para Templates</AlertTitle>
              <AlertDescription>
                Utilize os códigos abaixo em seus templates Excel para criar documentos dinâmicos:
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="font-medium">Códigos para Não Conformidade:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>{{DESVIO_ID}}</code> - ID do desvio</li>
                <li><code>{{DATA}}</code> - Data do desvio</li>
                <li><code>{{DESCRICAO}}</code> - Descrição do desvio</li>
                <li><code>{{TIPO}}</code> - Tipo do desvio</li>
                <li><code>{{RESPONSAVEL}}</code> - Responsável pelo desvio</li>
                <li><code>{{SETOR}}</code> - Setor onde ocorreu o desvio</li>
                <li><code>{{STATUS}}</code> - Status atual do desvio</li>
                <li><code>{{DATA_EMISSAO}}</code> - Data de emissão do documento</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates Disponíveis</CardTitle>
          <CardDescription>
            Lista de templates importados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data de Importação</TableHead>
                <TableHead>Códigos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant={template.type === "nao-conformidade" ? "default" : "secondary"}>
                      {template.type === "nao-conformidade" ? "Não Conformidade" : "Relatório"}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.dateUploaded.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.codeFields.slice(0, 3).map((code, i) => (
                        <Badge key={i} variant="outline">{code}</Badge>
                      ))}
                      {template.codeFields.length > 3 && (
                        <Badge variant="outline">+{template.codeFields.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhum template encontrado. Importe um novo template para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTemplates;
