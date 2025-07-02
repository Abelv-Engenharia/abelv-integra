
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { tarefasService, TarefaUpdateData } from "@/services/tarefasService";
import { notificacoesService } from "@/services/notificacoesService";
import { getStatusColor, getCriticidadeColor } from "@/utils/tarefasUtils";
import { Tarefa } from "@/types/tarefas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Check, Clock, AlertTriangle, FileText, Calendar, Upload, Play, Eye, Download } from "lucide-react";
import { toast } from "sonner";

const DetalheTarefa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [progressNotes, setProgressNotes] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  
  useEffect(() => {
    const fetchTarefa = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await tarefasService.getById(id);
        setTarefa(data);
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
        toast.error("Erro ao carregar detalhes da tarefa");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTarefa();
  }, [id]);
  
  const handleIniciarTarefa = async () => {
    if (!tarefa) return;
    
    setUpdating(true);
    try {
      const updateData: TarefaUpdateData = {
        iniciada: true,
        status: 'em-andamento'
      };
      
      const success = await tarefasService.updateStatus(tarefa.id, updateData);
      
      if (success) {
        setTarefa({
          ...tarefa,
          iniciada: true,
          status: 'em-andamento'
        });
        
        toast.success("Tarefa iniciada com sucesso!");
      } else {
        toast.error("Erro ao iniciar tarefa");
      }
    } catch (error) {
      console.error("Erro ao iniciar tarefa:", error);
      toast.error("Erro ao iniciar tarefa");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleConcluirTarefa = async () => {
    if (!tarefa) return;
    
    setUpdating(true);
    try {
      let anexoUrl = tarefa.anexo;
      
      // Se há um arquivo anexado, simular upload (aqui você integraria com storage)
      if (attachmentFile) {
        // Simulação do upload - em produção, usar Supabase Storage
        anexoUrl = `anexo_${Date.now()}_${attachmentFile.name}`;
        console.log("Arquivo anexado:", attachmentFile.name);
      }
      
      // Determinar o status baseado na necessidade de validação
      const novoStatus = tarefa.configuracao.requerValidacao ? 'aguardando-validacao' : 'concluida';
      
      const updateData: TarefaUpdateData = {
        status: novoStatus,
        anexo: anexoUrl,
        data_real_conclusao: new Date().toISOString(),
        observacoes_progresso: progressNotes || undefined
      };
      
      const success = await tarefasService.updateStatus(tarefa.id, updateData);
      
      if (success) {
        setTarefa({
          ...tarefa,
          status: novoStatus,
          anexo: anexoUrl,
          data_real_conclusao: new Date().toISOString()
        });
        
        // Se requer validação, enviar notificação para o criador da tarefa
        if (tarefa.configuracao.requerValidacao) {
          try {
            await notificacoesService.criarNotificacao({
              usuario_id: tarefa.responsavel.id, // Assumindo que o criador é o responsável por ora
              titulo: 'Tarefa aguarda validação',
              mensagem: `A tarefa "${tarefa.descricao}" foi concluída e aguarda sua validação.`,
              tipo: 'validacao',
              tarefa_id: tarefa.id
            });
          } catch (notifError) {
            console.error("Erro ao enviar notificação:", notifError);
          }
        }
        
        setShowProgressDialog(false);
        setProgressNotes("");
        setAttachmentFile(null);
        
        const mensagem = novoStatus === 'aguardando-validacao' 
          ? "Tarefa concluída! Aguardando validação." 
          : "Tarefa concluída com sucesso!";
        toast.success(mensagem);
      } else {
        toast.error("Erro ao concluir tarefa");
      }
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
      toast.error("Erro ao concluir tarefa");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleValidarTarefa = async () => {
    if (!tarefa) return;
    
    setUpdating(true);
    try {
      const updateData: TarefaUpdateData = {
        status: 'concluida'
      };
      
      const success = await tarefasService.updateStatus(tarefa.id, updateData);
      
      if (success) {
        setTarefa({
          ...tarefa,
          status: 'concluida'
        });
        
        toast.success("Tarefa validada com sucesso!");
      } else {
        toast.error("Erro ao validar tarefa");
      }
    } catch (error) {
      console.error("Erro ao validar tarefa:", error);
      toast.error("Erro ao validar tarefa");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleProgressUpdate = async () => {
    if (!tarefa || !progressNotes.trim()) {
      toast.error("Por favor, adicione observações sobre o progresso");
      return;
    }
    
    setUpdating(true);
    try {
      let anexoUrl = tarefa.anexo;
      
      // Se há um arquivo anexado, simular upload
      if (attachmentFile) {
        anexoUrl = `anexo_${Date.now()}_${attachmentFile.name}`;
        console.log("Arquivo anexado:", attachmentFile.name);
      }
      
      const updateData: TarefaUpdateData = {
        anexo: anexoUrl,
        observacoes_progresso: progressNotes
      };
      
      const success = await tarefasService.updateStatus(tarefa.id, updateData);
      
      if (success) {
        setTarefa({
          ...tarefa,
          anexo: anexoUrl
        });
        
        setShowProgressDialog(false);
        setProgressNotes("");
        setAttachmentFile(null);
        
        toast.success("Progresso atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar progresso");
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast.error("Erro ao atualizar progresso");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewAttachment = () => {
    if (!tarefa?.anexo) return;
    
    // Por enquanto, vamos apenas mostrar o nome do arquivo
    // Em produção, isso deveria abrir o arquivo ou gerar um signed URL
    toast.info(`Visualizando anexo: ${tarefa.anexo}`);
    console.log("Tentando visualizar anexo:", tarefa.anexo);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'programada':
        return 'Programada';
      case 'em-andamento':
        return 'Em andamento';
      case 'pendente':
        return 'Pendente';
      case 'concluida':
        return 'Concluída';
      case 'aguardando-validacao':
        return 'Aguardando validação';
      default:
        return status.replace('-', ' ');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando detalhes da tarefa...</p>
      </div>
    );
  }
  
  if (!tarefa) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/tarefas/minhas-tarefas')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Tarefa não encontrada. A tarefa pode ter sido removida ou você não tem permissão para acessá-la.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/tarefas/minhas-tarefas')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes da Tarefa</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CCA: {tarefa.cca}</p>
                  <CardTitle className="text-2xl">{tarefa.descricao}</CardTitle>
                </div>
                <Badge className={getStatusColor(tarefa.status)} variant="outline">
                  {getStatusLabel(tarefa.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                  <p>{tarefa.descricao}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Responsável</h3>
                    <p>{tarefa.responsavel.nome}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Criticidade</h3>
                    <Badge className={getCriticidadeColor(tarefa.configuracao.criticidade)} variant="outline">
                      {tarefa.configuracao.criticidade}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Cadastro</h3>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(tarefa.dataCadastro), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Prazo para Conclusão</h3>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(tarefa.dataConclusao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  {tarefa.data_real_conclusao && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Conclusão Efetiva</h3>
                      <p className="flex items-center">
                        <Check className="h-4 w-4 mr-1 text-green-600" />
                        {format(new Date(tarefa.data_real_conclusao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </div>
                
                {tarefa.anexo && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Anexo</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center" onClick={handleViewAttachment}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          {tarefa.anexo}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!tarefa.iniciada && tarefa.status !== 'concluida' && tarefa.status !== 'aguardando-validacao' && (
              <Button 
                className="flex-1" 
                onClick={handleIniciarTarefa}
                disabled={updating}
              >
                <Play className="h-4 w-4 mr-2" />
                {updating ? "Iniciando..." : "Iniciar Tarefa"}
              </Button>
            )}

            {(tarefa.iniciada || tarefa.status === 'em-andamento') && tarefa.status !== 'concluida' && tarefa.status !== 'aguardando-validacao' && (
              <>
                <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Clock className="h-4 w-4 mr-2" />
                      Informar Progresso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Informar Progresso da Tarefa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="progress-notes">Observações do progresso *</Label>
                        <Textarea
                          id="progress-notes"
                          placeholder="Descreva o andamento da tarefa..."
                          value={progressNotes}
                          onChange={(e) => setProgressNotes(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="attachment">Anexar arquivo (opcional)</Label>
                        <Input
                          id="attachment"
                          type="file"
                          onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleProgressUpdate}
                          disabled={updating || !progressNotes.trim()}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {updating ? "Atualizando..." : "Atualizar Progresso"}
                        </Button>
                        <Button 
                          onClick={handleConcluirTarefa}
                          disabled={updating}
                          variant="secondary"
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {updating ? "Concluindo..." : "Concluir Tarefa"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {tarefa.status === 'aguardando-validacao' && (
              <Button 
                onClick={handleValidarTarefa}
                disabled={updating}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                {updating ? "Validando..." : "Validar Conclusão"}
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Tarefa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Criticidade</h3>
                  <Badge className={getCriticidadeColor(tarefa.configuracao.criticidade)} variant="outline">
                    {tarefa.configuracao.criticidade}
                  </Badge>
                </div>
                
                {tarefa.configuracao.recorrencia?.ativa && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Recorrência</h3>
                    <p>
                      Tarefa {tarefa.configuracao.recorrencia.frequencia}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Validação Requerida</h3>
                  <p>{tarefa.configuracao.requerValidacao ? 'Sim' : 'Não'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notificar Usuário</h3>
                  <p>{tarefa.configuracao.notificarUsuario ? 'Sim' : 'Não'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {tarefa.configuracao.recorrencia?.ativa && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Recorrência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Esta é a primeira ocorrência desta tarefa.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalheTarefa;
