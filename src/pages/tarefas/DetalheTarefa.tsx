import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User, Clock, AlertCircle, CheckCircle, FileUp, X, MessageSquare, Send, Trash2, Download, Eye, File, ExternalLink } from "lucide-react";
import { Tarefa, TarefaStatus } from "@/types/tarefas";
import { tarefasService } from "@/services/tarefasService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTarefaObservacoes } from "@/hooks/tarefas/useTarefaObservacoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

const DetalheTarefa = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [anexo, setAnexo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [excluindoAnexo, setExcluindoAnexo] = useState(false);
  const [novaObservacao, setNovaObservacao] = useState("");
  const [adicionandoObservacao, setAdicionandoObservacao] = useState(false);

  // Hook para gerenciar observações da tarefa
  const { 
    observacoes: listaObservacoes, 
    isLoading: loadingObservacoes,
    adicionarObservacao,
    excluirObservacao
  } = useTarefaObservacoes(id);

  useEffect(() => {
    const fetchTarefa = async () => {
      if (!id) {
        console.error("ID da tarefa não fornecido");
        navigate("/tarefas/minhas-tarefas");
        return;
      }

      // Validar se o ID é um UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error("ID da tarefa não é um UUID válido:", id);
        toast({
          title: "Erro",
          description: "ID da tarefa inválido.",
          variant: "destructive"
        });
        navigate("/tarefas/minhas-tarefas");
        return;
      }

      try {
        console.log("Buscando tarefa com ID:", id);
        const data = await tarefasService.getById(id);
        if (data) {
          setTarefa(data);
          console.log("Tarefa carregada:", data);
        } else {
          console.error("Tarefa não encontrada");
          toast({
            title: "Tarefa não encontrada",
            description: "A tarefa solicitada não foi encontrada ou você não tem permissão para visualizá-la.",
            variant: "destructive"
          });
          navigate("/tarefas/minhas-tarefas");
        }
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
        toast({
          title: "Erro ao carregar tarefa",
          description: "Não foi possível carregar os detalhes da tarefa.",
          variant: "destructive"
        });
        navigate("/tarefas/minhas-tarefas");
      } finally {
        setLoading(false);
      }
    };

    fetchTarefa();
  }, [id, navigate, toast]);

  const handleStatusChange = async (newStatus: TarefaStatus) => {
    if (!tarefa?.id) {
      toast({
        title: "Erro",
        description: "ID da tarefa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sucesso = await tarefasService.updateStatus(tarefa.id, { status: newStatus });
      if (sucesso) {
        setTarefa({ ...tarefa, status: newStatus });
        toast({
          title: "Status atualizado",
          description: `Status da tarefa alterado para ${newStatus}.`,
        });
      } else {
        toast({
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status da tarefa.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status da tarefa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnexoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAnexo(event.target.files[0]);
    } else {
      setAnexo(null);
    }
  };

  const handleUploadAnexo = async () => {
    if (!tarefa?.id || !anexo) {
      toast({
        title: "Erro",
        description: "Tarefa ou anexo não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload do arquivo para o Supabase Storage
      const fileExt = anexo.name.split('.').pop();
      const fileName = `${tarefa.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('tarefas-anexos')
        .upload(fileName, anexo);

      if (uploadError) throw uploadError;

      // Atualizar a tarefa com o nome do arquivo
      const sucesso = await tarefasService.updateStatus(tarefa.id, { anexo: fileName });

      if (sucesso) {
        setTarefa({ ...tarefa, anexo: fileName });
        setAnexo(null);
        toast({
          title: "Anexo enviado",
          description: "Anexo enviado com sucesso.",
        });
      } else {
        // Se falhou ao atualizar a tarefa, remover o arquivo do storage
        await supabase.storage.from('tarefas-anexos').remove([fileName]);
        throw new Error("Falha ao atualizar tarefa");
      }
    } catch (error: any) {
      console.error("Erro ao enviar anexo:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar o anexo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVisualizarAnexo = async () => {
    if (!tarefa?.anexo) return;

    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .createSignedUrl(tarefa.anexo, 3600); // URL válida por 1 hora

      if (error) throw error;

      // Abrir em nova aba
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      console.error("Erro ao visualizar anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível visualizar o documento.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAnexo = async () => {
    if (!tarefa?.anexo) return;

    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .download(tarefa.anexo);

      if (error) throw error;

      // Criar URL do blob e fazer download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = tarefa.anexo.split('-').slice(1).join('-') || tarefa.anexo; // Remove timestamp do nome
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download concluído",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao baixar anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o documento.",
        variant: "destructive",
      });
    }
  };

  const handleExcluirAnexo = async () => {
    if (!tarefa?.id || !tarefa?.anexo) return;

    setExcluindoAnexo(true);
    try {
      // Remover arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('tarefas-anexos')
        .remove([tarefa.anexo]);

      if (storageError) throw storageError;

      // Atualizar tarefa removendo o anexo
      const sucesso = await tarefasService.updateStatus(tarefa.id, { anexo: null });

      if (sucesso) {
        setTarefa({ ...tarefa, anexo: null });
        toast({
          title: "Anexo excluído",
          description: "O anexo foi excluído com sucesso.",
        });
      } else {
        throw new Error("Falha ao atualizar tarefa");
      }
    } catch (error: any) {
      console.error("Erro ao excluir anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o anexo.",
        variant: "destructive",
      });
    } finally {
      setExcluindoAnexo(false);
    }
  };

  const handleAdicionarObservacao = async () => {
    if (!novaObservacao.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma observação antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setAdicionandoObservacao(true);
    try {
      const sucesso = await adicionarObservacao(novaObservacao);
      if (sucesso) {
        setNovaObservacao("");
        toast({
          title: "Observação adicionada",
          description: "Observação adicionada com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a observação.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar observação:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a observação.",
        variant: "destructive",
      });
    } finally {
      setAdicionandoObservacao(false);
    }
  };

  const handleExcluirObservacao = async (observacaoId: string) => {
    try {
      const sucesso = await excluirObservacao(observacaoId);
      if (sucesso) {
        toast({
          title: "Observação excluída",
          description: "Observação excluída com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a observação.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir observação:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a observação.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando detalhes da tarefa...</p>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Tarefa não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate("/tarefas/minhas-tarefas")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Minhas Tarefas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {tarefa.titulo}
            <Badge variant="secondary" className="ml-2">{tarefa.cca}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4 inline-block" />
                Data de Conclusão
              </Label>
              <p>{new Date(tarefa.dataConclusao).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">
                <User className="mr-2 h-4 w-4 inline-block" />
                Responsável
              </Label>
              <p>{tarefa.responsavel.nome}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">
              <Clock className="mr-2 h-4 w-4 inline-block" />
              Status
            </Label>
            <div className="space-x-2">
              {tarefa.status === "programada" && (
                <Button variant="outline" onClick={() => handleStatusChange("em-andamento")}>
                  Iniciar Tarefa
                </Button>
              )}
              {tarefa.status === "em-andamento" && (
                <Button variant="outline" onClick={() => handleStatusChange("pendente")}>
                  Marcar como Pendente
                </Button>
              )}
              {tarefa.status !== "concluida" && (
                <Button variant="outline" onClick={() => handleStatusChange("concluida")}>
                  Concluir Tarefa
                </Button>
              )}
              {tarefa.status === "pendente" && (
                <Button variant="outline" onClick={() => handleStatusChange("em-andamento")}>
                  Retomar Tarefa
                </Button>
              )}
              <Badge>
                {tarefa.status === "programada" && "Programada"}
                {tarefa.status === "em-andamento" && "Em Andamento"}
                {tarefa.status === "pendente" && "Pendente"}
                {tarefa.status === "concluida" && "Concluída"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4 inline-block" />
              Descrição
            </Label>
            <p>{tarefa.descricao}</p>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">
              <FileUp className="mr-2 h-4 w-4 inline-block" />
              Anexar Documento
            </Label>
            <div className="flex items-center space-x-4">
              <Input type="file" onChange={handleAnexoChange} />
              <Button onClick={handleUploadAnexo} disabled={!anexo || uploading}>
                {uploading ? "Enviando..." : "Enviar Anexo"}
              </Button>
              {tarefa.anexo && (
                <Badge variant="secondary">
                  <CheckCircle className="mr-2 h-4 w-4 inline-block" />
                  {tarefa.anexo}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Seção de Documentos Anexados */}
          <div>
            <Label className="text-muted-foreground flex items-center gap-2 mb-4">
              <File className="h-4 w-4" />
              Documentos Anexados
            </Label>
            
            {tarefa.anexo ? (
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <File className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {tarefa.anexo.split('-').slice(1).join('-') || tarefa.anexo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Documento anexado à tarefa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleVisualizarAnexo}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadAnexo}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={excluindoAnexo}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {excluindoAnexo ? "Excluindo..." : "Excluir"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja excluir este anexo? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleExcluirAnexo}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento foi anexado a esta tarefa.</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Seção de Observações */}
          <div>
            <Label className="text-muted-foreground flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4" />
              Observações da Tarefa
            </Label>
            
            {/* Adicionar nova observação */}
            <div className="mb-4 p-4 border rounded-lg bg-muted/50">
              <Label className="text-sm font-medium mb-2 block">Adicionar Observação</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua observação..."
                  value={novaObservacao}
                  onChange={(e) => setNovaObservacao(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={handleAdicionarObservacao}
                  disabled={adicionandoObservacao || !novaObservacao.trim()}
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                  {adicionandoObservacao ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>

            {/* Lista de observações */}
            <div className="space-y-3">
              {loadingObservacoes ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Carregando observações...</p>
                </div>
              ) : listaObservacoes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma observação foi registrada ainda.</p>
                </div>
              ) : (
                listaObservacoes.map((obs) => (
                  <div key={obs.id} className="border rounded-lg p-4 bg-background">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{obs.usuario_nome}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(obs.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm">{obs.observacao}</p>
                      </div>
                      {obs.usuario_id === user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir esta observação? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleExcluirObservacao(obs.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalheTarefa;
