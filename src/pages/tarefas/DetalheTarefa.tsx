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
import { useTarefaAnexos } from "@/hooks/tarefas/useTarefaAnexos";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const DetalheTarefa = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [novaObservacao, setNovaObservacao] = useState("");
  const [adicionandoObservacao, setAdicionandoObservacao] = useState(false);
  const [showVisualizacao, setShowVisualizacao] = useState(false);
  const [anexoUrl, setAnexoUrl] = useState<string | null>(null);

  // Hook para gerenciar observações da tarefa
  const { 
    observacoes: listaObservacoes, 
    isLoading: loadingObservacoes,
    adicionarObservacao,
    excluirObservacao
  } = useTarefaObservacoes(id);

  // Hook para gerenciar anexos da tarefa
  const {
    anexos,
    loading: loadingAnexos,
    adicionarAnexo,
    removerAnexo,
    visualizarAnexo,
    baixarAnexo
  } = useTarefaAnexos(id);

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

  const handleArquivosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setArquivosSelecionados(Array.from(event.target.files));
    }
  };

  const handleUploadAnexos = async () => {
    if (!tarefa?.id || arquivosSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um arquivo para anexar.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      let sucessos = 0;
      
      for (const arquivo of arquivosSelecionados) {
        const sucesso = await adicionarAnexo(arquivo, tarefa.titulo);
        if (sucesso) sucessos++;
      }

      if (sucessos > 0) {
        setArquivosSelecionados([]);
        // Limpar o input file
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        toast({
          title: "Upload concluído",
          description: `${sucessos} arquivo(s) anexado(s) com sucesso.`,
        });
      }
    } catch (error: any) {
      console.error("Erro ao enviar anexos:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o upload dos arquivos.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Função para visualizar anexo
  const handleVisualizarAnexo = async (nomeArquivo: string) => {
    try {
      const url = await visualizarAnexo(nomeArquivo);
      if (url) {
        setAnexoUrl(url);
        setShowVisualizacao(true);
      }
    } catch (error: any) {
      console.error("Erro ao visualizar anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível visualizar o documento.",
        variant: "destructive",
      });
    }
  };

  // Função para fechar visualização
  const handleFecharVisualizacao = () => {
    if (anexoUrl) {
      URL.revokeObjectURL(anexoUrl);
      setAnexoUrl(null);
    }
    setShowVisualizacao(false);
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
              <p>{tarefa.responsaveis?.map(r => r.nome).join(', ') || 'Sem responsável'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">
              <Clock className="mr-2 h-4 w-4 inline-block" />
              Status
            </Label>
            <div className="flex items-center gap-2">
              <Badge 
                className={`
                  ${tarefa.status === "programada" ? "bg-status-programada-bg text-status-programada border-status-programada" : ""}
                  ${tarefa.status === "em-andamento" ? "bg-status-andamento-bg text-status-andamento border-status-andamento" : ""}
                  ${tarefa.status === "pendente" ? "bg-status-pendente-bg text-status-pendente border-status-pendente" : ""}
                  ${tarefa.status === "concluida" ? "bg-status-concluida-bg text-status-concluida border-status-concluida" : ""}
                  border font-medium
                `}
              >
                {tarefa.status === "programada" && "Programada"}
                {tarefa.status === "em-andamento" && "Em Andamento"}
                {tarefa.status === "pendente" && "Pendente"}
                {tarefa.status === "concluida" && "Concluída"}
              </Badge>
              {tarefa.status === "programada" && (
                <Button variant="outline" onClick={() => handleStatusChange("em-andamento")}>
                  Iniciar Tarefa
                </Button>
              )}
              {tarefa.status === "pendente" && (
                <Button variant="outline" onClick={() => handleStatusChange("em-andamento")}>
                  Retomar Tarefa
                </Button>
              )}
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

          <Separator />

          <div>
            <Label className="text-muted-foreground">
              <FileUp className="mr-2 h-4 w-4 inline-block" />
              Anexar Documentos
            </Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input 
                  id="file-upload"
                  type="file" 
                  multiple
                  onChange={handleArquivosChange} 
                />
                <Button 
                  onClick={handleUploadAnexos} 
                  disabled={arquivosSelecionados.length === 0 || uploading}
                >
                  {uploading ? "Enviando..." : "Enviar Anexos"}
                </Button>
              </div>
              {arquivosSelecionados.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {arquivosSelecionados.length} arquivo(s) selecionado(s)
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Seção de Documentos Anexados */}
          <div>
            <Label className="text-muted-foreground flex items-center gap-2 mb-4">
              <File className="h-4 w-4" />
              Documentos Anexados ({anexos.length})
            </Label>
            
            {loadingAnexos ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Carregando anexos...</p>
              </div>
            ) : anexos.length > 0 ? (
              <div className="space-y-3">
                {anexos.map((anexo) => (
                  <div key={anexo.id} className="border rounded-lg p-4 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <File className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {anexo.nome_original}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Anexado em {format(new Date(anexo.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                            {anexo.tamanho && (
                              <span>
                                {(anexo.tamanho / 1024 / 1024).toFixed(2)} MB
                              </span>
                            )}
                            {anexo.tipo_arquivo && (
                              <span className="uppercase">
                                {anexo.tipo_arquivo.split('/')[1] || anexo.tipo_arquivo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVisualizarAnexo(anexo.nome_arquivo)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => baixarAnexo(anexo)}
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
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir o anexo "{anexo.nome_original}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => removerAnexo(anexo.id, anexo.nome_arquivo)}
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento foi anexado a esta tarefa.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação no Final da Página */}
      <div className="flex justify-end gap-3 mt-6">
        {tarefa.status === "em-andamento" && (
          <Button 
            variant="outline" 
            onClick={() => handleStatusChange("pendente")}
            className="bg-status-pendente-bg text-status-pendente border-status-pendente hover:bg-status-pendente hover:text-white"
          >
            Marcar como Pendente
          </Button>
        )}
        {tarefa.status !== "concluida" && (
          <Button 
            onClick={() => handleStatusChange("concluida")}
            className="bg-status-concluida text-white hover:bg-status-concluida/90"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Concluir Tarefa
          </Button>
        )}
      </div>

      {/* Modal de Visualização */}
      <Dialog open={showVisualizacao} onOpenChange={handleFecharVisualizacao}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Visualização do Anexo</DialogTitle>
          </DialogHeader>
          {anexoUrl && (
            <div className="w-full h-[80vh]">
              <iframe
                src={anexoUrl}
                className="w-full h-full border-0"
                title="Visualização do anexo"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetalheTarefa;
