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
import { getStatusColor, getCriticidadeColor } from "@/utils/tarefasUtils";
import { Tarefa } from "@/types/tarefas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Check, Clock, AlertTriangle, FileText, Calendar, Upload, Play } from "lucide-react";
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
      
      const updateData: TarefaUpdateData = {
        status: 'concluida',
        anexo: anexoUrl
      };
      
      const success = await tarefasService.updateStatus(tarefa.id, updateData);
      
      if (success) {
        setTarefa({
          ...tarefa,
          status: 'concluida',
          anexo: anexoUrl
        });
        
        setShowProgressDialog(false);
        setProgressNotes("");
        setAttachmentFile(null);
        
        toast.success("Tarefa concluída com sucesso!");
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
  
  const handleProgressUpdate = async () => {
    if (!tarefa) return;
    
    setUpdating(true);
    try {
      let anexoUrl = tarefa.anexo;
      
      // Se há um arquivo anexado, simular upload
      if (attachmentFile) {
        anexoUrl = `anexo_${Date.now()}_${attachmentFile.name}`;
        console.log("Arquivo anexado:", attachmentFile.name);
      }
      
      const updateData: TarefaUpdateData = {
        anexo: anexoUrl
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
                  {tarefa.status.replace('-', ' ')}
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Conclusão</h3>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(tarefa.dataConclusao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                {tarefa.anexo && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Anexo</h3>
                      <Button variant="outline" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {tarefa.anexo}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!tarefa.iniciada && tarefa.status !== 'concluida' && (
              <Button 
                className="flex-1" 
                onClick={handleIniciarTarefa}
                disabled={updating}
              >
                <Play className="h-4 w-4 mr-2" />
                {updating ? "Iniciando..." : "Iniciar Tarefa"}
              </Button>
            )}

            {(tarefa.iniciada || tarefa.status === 'em-andamento') && tarefa.status !== 'concluida' && (
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
                        <Label htmlFor="progress-notes">Observações do progresso</Label>
                        <Textarea
                          id="progress-notes"
                          placeholder="Descreva o andamento da tarefa..."
                          value={progressNotes}
                          onChange={(e) => setProgressNotes(e.target.value)}
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
                          disabled={updating}
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

            {tarefa.configuracao.requerValidacao && (
              <Button variant="outline" className="flex-1" disabled={tarefa.status !== 'concluida'}>
                <Check className="h-4 w-4 mr-2" />
                Validar Conclusão
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
