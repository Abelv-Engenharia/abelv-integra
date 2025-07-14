import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, Video } from "lucide-react";
import { useCreateTutorial, useDeleteTutorial, useTutoriais } from "@/hooks/useTutoriais";
import { CreateTutorialData } from "@/hooks/useTutoriais";

const UploadTutoriais = () => {
  const { data: tutoriais, isLoading } = useTutoriais();
  const createTutorialMutation = useCreateTutorial();
  const deleteTutorialMutation = useDeleteTutorial();
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    video_file: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video_file: file
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoria: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.video_file) {
      return;
    }

    const tutorialData: CreateTutorialData = {
      titulo: formData.titulo,
      descricao: formData.descricao || undefined,
      video_file: formData.video_file,
      categoria: formData.categoria,
    };

    createTutorialMutation.mutate(tutorialData, {
      onSuccess: () => {
        setFormData({
          titulo: "",
          descricao: "",
          categoria: "",
          video_file: null
        });
        // Reset file input
        const fileInput = document.getElementById('video-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este tutorial?")) {
      deleteTutorialMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Novo Tutorial</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Faça upload de um novo tutorial em vídeo para a central de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Digite o título do tutorial"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="desvios">Desvios</SelectItem>
                    <SelectItem value="ocorrencias">Ocorrências</SelectItem>
                    <SelectItem value="tarefas">Tarefas</SelectItem>
                    <SelectItem value="treinamentos">Treinamentos</SelectItem>
                    <SelectItem value="relatorios">Relatórios</SelectItem>
                    <SelectItem value="configuracoes">Configurações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva brevemente o conteúdo do tutorial"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video-file">Arquivo de Vídeo *</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  required
                  className="file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {formData.video_file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span>{formData.video_file.name}</span>
                    <span>({formatFileSize(formData.video_file.size)})</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: MP4, AVI, MOV, WMV. Tamanho máximo: 50MB
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={createTutorialMutation.isPending}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {createTutorialMutation.isPending ? "Enviando..." : "Fazer Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Tutoriais Cadastrados</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Gerencie os tutoriais já enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : tutoriais && tutoriais.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutoriais.map((tutorial) => (
                    <TableRow key={tutorial.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tutorial.titulo}</p>
                          {tutorial.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {tutorial.descricao}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tutorial.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(tutorial.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tutorial.id)}
                          disabled={deleteTutorialMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum tutorial cadastrado</h3>
              <p className="text-muted-foreground">
                Utilize o formulário acima para fazer upload do primeiro tutorial.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadTutoriais;