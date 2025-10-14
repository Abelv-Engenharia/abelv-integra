import { useState } from "react";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { categoriasmock } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    nomearquivo: "",
    categoria: "",
    subcategoria: "",
    datavalidade: "",
    responsavel: "",
    emailresponsavel: "",
    descricao: "",
    arquivo: null as File | null
  });
  
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simulação de upload
    toast({
      title: "Documento enviado com sucesso!",
      description: `O arquivo "${formData.nomearquivo || formData.arquivo?.name}" foi enviado para "${formData.categoria} > ${formData.subcategoria}" com responsável ${formData.responsavel}.`,
    });
    
    // Reset form
    setFormData({
      nomearquivo: "",
      categoria: "",
      subcategoria: "",
      datavalidade: "",
      responsavel: "",
      emailresponsavel: "",
      descricao: "",
      arquivo: null
    });
  };

  const isFormValid = formData.nomearquivo && formData.categoria && formData.subcategoria && formData.datavalidade && formData.responsavel && formData.emailresponsavel && formData.arquivo;

  const categoriasSelecionada = categoriasmock.find(cat => cat.nome === formData.categoria);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/repositorio">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enviar Documento</h1>
          <p className="text-muted-foreground">Faça o upload de um novo documento para o repositório</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Documento</CardTitle>
            <CardDescription>Preencha os dados do documento que será enviado</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomearquivo" className="text-sm font-medium">
                  Nome do Arquivo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nomearquivo"
                  placeholder="Digite o nome do arquivo"
                  value={formData.nomearquivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomearquivo: e.target.value }))}
                  className={!formData.nomearquivo ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-medium">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value, subcategoria: "" }))}
                >
                  <SelectTrigger className={!formData.categoria ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasmock.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.nome}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.categoria && categoriasSelecionada && (
                <div className="space-y-2">
                  <Label htmlFor="subcategoria" className="text-sm font-medium">
                    Subpasta <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.subcategoria} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoria: value }))}>
                    <SelectTrigger className={!formData.subcategoria ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione uma subpasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasSelecionada.subcategorias.map((subcategoria) => (
                        <SelectItem key={subcategoria.id} value={subcategoria.nome}>
                          {subcategoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="datavalidade" className="text-sm font-medium">
                  Data de Validade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="datavalidade"
                  type="date"
                  value={formData.datavalidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, datavalidade: e.target.value }))}
                  className={!formData.datavalidade ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-sm font-medium">
                  Responsável <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="responsavel"
                  placeholder="Digite o nome do responsável"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  className={!formData.responsavel ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailresponsavel" className="text-sm font-medium">
                  E-mail do Responsável <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="emailresponsavel"
                  type="email"
                  placeholder="Digite o e-mail do responsável"
                  value={formData.emailresponsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, emailresponsavel: e.target.value }))}
                  className={!formData.emailresponsavel ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição (Opcional)
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Adicione uma descrição para o documento"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                disabled={!isFormValid}
              >
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documento
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* File Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Arquivo</CardTitle>
            <CardDescription>Arraste e solte o arquivo ou clique para selecioná-lo</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? "border-primary bg-primary/5" 
                  : formData.arquivo 
                    ? "border-green-500 bg-green-50" 
                    : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="arquivo"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
                className="hidden"
              />
              
              {formData.arquivo ? (
                <div className="space-y-3">
                  <FileText className="mx-auto h-12 w-12 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">{formData.arquivo.name}</p>
                    <p className="text-sm text-green-600">
                      {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('arquivo')?.click()}
                  >
                    Alterar Arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Arraste e solte seu arquivo aqui</p>
                    <p className="text-sm text-muted-foreground">ou</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById('arquivo')?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              )}
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Formatos aceitos: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), Imagens (.png, .jpg, .jpeg)
                <br />
                Tamanho máximo: 20 MB
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;