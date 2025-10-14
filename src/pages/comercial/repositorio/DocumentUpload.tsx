import { useState, useEffect } from "react";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { fetchUsers } from "@/services/authAdminService";
import { User } from "@/types/users";
import { useRepositorioCategorias } from "@/hooks/useRepositorioCategorias";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
const DocumentUpload = () => {
  const navigate = useNavigate();
  const { data: categorias, isLoading: loadingCategorias } = useRepositorioCategorias();
  const uploadMutation = useDocumentUpload();
  
  const [formData, setFormData] = useState({
    nomearquivo: "",
    categoriaId: "",
    subcategoriaId: "",
    datavalidade: "",
    responsavelNome: "",
    responsavelEmail: "",
    responsavelId: "",
    descricao: "",
    arquivo: null as File | null
  });
  const [dragOver, setDragOver] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const result = await fetchUsers(1, 1000, "", "Ativo");
        setUsuarios(result.users || []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsuarios(false);
      }
    };
    loadUsuarios();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        arquivo: file
      }));
    }
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        arquivo: file
      }));
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.arquivo) return;
    
    try {
      await uploadMutation.mutateAsync({
        nomearquivo: formData.nomearquivo,
        categoriaId: formData.categoriaId,
        subcategoriaId: formData.subcategoriaId,
        datavalidade: formData.datavalidade,
        responsavelEmail: formData.responsavelEmail,
        responsavelNome: formData.responsavelNome,
        responsavelId: formData.responsavelId,
        descricao: formData.descricao,
        arquivo: formData.arquivo,
      });
      
      // Reset form
      setFormData({
        nomearquivo: "",
        categoriaId: "",
        subcategoriaId: "",
        datavalidade: "",
        responsavelNome: "",
        responsavelEmail: "",
        responsavelId: "",
        descricao: "",
        arquivo: null
      });
      
      // Redirecionar para a lista
      setTimeout(() => navigate("/comercial/repositorio/documentos"), 1500);
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
    }
  };
  
  const isFormValid = formData.nomearquivo && formData.categoriaId && formData.subcategoriaId && formData.datavalidade && formData.responsavelNome && formData.responsavelEmail && formData.arquivo;
  const categoriaSelecionada = categorias?.find(cat => cat.id === formData.categoriaId);
  const subcategorias = categoriaSelecionada?.subcategorias || [];
  return <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/comercial/repositorio/documentos">
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
                <Input id="nomearquivo" placeholder="Digite o nome do arquivo" value={formData.nomearquivo} onChange={e => setFormData(prev => ({
                ...prev,
                nomearquivo: e.target.value
              }))} className={!formData.nomearquivo ? "border-destructive" : ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-medium">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.categoriaId} 
                  onValueChange={value => setFormData(prev => ({
                    ...prev,
                    categoriaId: value,
                    subcategoriaId: ""
                  }))}
                  disabled={loadingCategorias}
                >
                  <SelectTrigger className={!formData.categoriaId ? "border-destructive" : ""}>
                    <SelectValue placeholder={loadingCategorias ? "Carregando..." : "Selecione uma categoria"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias?.map(categoria => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.categoriaId && subcategorias.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategoria" className="text-sm font-medium">
                    Subpasta <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.subcategoriaId} 
                    onValueChange={value => setFormData(prev => ({
                      ...prev,
                      subcategoriaId: value
                    }))}
                  >
                    <SelectTrigger className={!formData.subcategoriaId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione uma subpasta" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategorias.map(subcategoria => (
                        <SelectItem key={subcategoria.id} value={subcategoria.id}>
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
                <Input id="datavalidade" type="date" value={formData.datavalidade} onChange={e => setFormData(prev => ({
                ...prev,
                datavalidade: e.target.value
              }))} className={!formData.datavalidade ? "border-destructive" : ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailresponsavel" className="text-sm font-medium">
                  E-mail do Responsável <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.responsavelEmail} 
                  onValueChange={value => {
                    const usuarioSelecionado = usuarios.find(u => u.email === value);
                    setFormData(prev => ({
                      ...prev,
                      responsavelEmail: value,
                      responsavelNome: usuarioSelecionado?.nome || "",
                      responsavelId: usuarioSelecionado?.id?.toString() || ""
                    }));
                  }}
                  disabled={loadingUsuarios}
                >
                  <SelectTrigger className={!formData.responsavelEmail ? "border-destructive" : ""}>
                    <SelectValue placeholder={loadingUsuarios ? "Carregando usuários..." : "Selecione um usuário"} />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map(usuario => (
                      <SelectItem key={usuario.id} value={usuario.email}>
                        {usuario.nome} - {usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel" className="text-sm font-medium">
                  Responsável <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="responsavel" 
                  placeholder="Nome do responsável" 
                  value={formData.responsavelNome} 
                  readOnly 
                  className={`bg-muted ${!formData.responsavelNome ? "border-destructive" : ""}`} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição (Opcional)
                </Label>
                <Textarea id="descricao" placeholder="Adicione uma descrição para o documento" value={formData.descricao} onChange={e => setFormData(prev => ({
                ...prev,
                descricao: e.target.value
              }))} rows={3} />
              </div>

              <Button 
                type="submit" 
                disabled={!isFormValid || uploadMutation.isPending} 
                className="w-full bg-gradient-primary hover:opacity-90 text-sky-50 bg-sky-900 hover:bg-sky-800"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploadMutation.isPending ? "Enviando..." : "Enviar Documento"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selecionar Arquivo</CardTitle>
            <CardDescription>Arraste e solte o arquivo ou clique para selecioná-lo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : formData.arquivo ? "border-green-500 bg-green-50" : "border-muted-foreground/25 hover:border-primary/50"}`} onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
              <input type="file" id="arquivo" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg" className="hidden" />
              
              {formData.arquivo ? <div className="space-y-3">
                  <FileText className="mx-auto h-12 w-12 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">{formData.arquivo.name}</p>
                    <p className="text-sm text-green-600">
                      {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('arquivo')?.click()}>
                    Alterar Arquivo
                  </Button>
                </div> : <div className="space-y-3">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Arraste e solte seu arquivo aqui</p>
                    <p className="text-sm text-muted-foreground">ou</p>
                  </div>
                  <Button variant="outline" onClick={() => document.getElementById('arquivo')?.click()}>
                    Selecionar Arquivo
                  </Button>
                </div>}
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
    </div>;
};
export default DocumentUpload;