
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockTarefas, getStatusColor, getCriticidadeColor } from "@/utils/tarefasUtils";
import { Tarefa } from "@/types/tarefas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Check, Clock, AlertTriangle, FileText, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DetalheTarefa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulando uma requisição à API
    const fetchTarefa = () => {
      setLoading(true);
      setTimeout(() => {
        const tarefaEncontrada = mockTarefas.find(t => t.id === id);
        if (tarefaEncontrada) {
          setTarefa(tarefaEncontrada);
        }
        setLoading(false);
      }, 500);
    };
    
    fetchTarefa();
  }, [id]);
  
  const handleIniciarTarefa = () => {
    if (!tarefa) return;
    
    // Simulando atualização de status
    setTarefa({
      ...tarefa,
      iniciada: true,
      status: 'em-andamento'
    });
    
    toast({
      title: "Tarefa iniciada",
      description: "O status da tarefa foi atualizado para Em Andamento"
    });
  };
  
  const handleConcluirTarefa = () => {
    if (!tarefa) return;
    
    // Simulando atualização de status
    setTarefa({
      ...tarefa,
      status: 'concluida'
    });
    
    toast({
      title: "Tarefa concluída",
      description: "Parabéns! A tarefa foi marcada como concluída."
    });
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
              <Button className="flex-1" onClick={handleIniciarTarefa}>
                <Clock className="h-4 w-4 mr-2" />
                Iniciar Tarefa
              </Button>
            )}
            {(tarefa.iniciada || tarefa.status === 'em-andamento') && tarefa.status !== 'concluida' && (
              <Button className="flex-1" onClick={handleConcluirTarefa}>
                <Check className="h-4 w-4 mr-2" />
                Concluir Tarefa
              </Button>
            )}
            {tarefa.configuracao.requerValidacao && (
              <Button variant="outline" className="flex-1" disabled={tarefa.status !== 'concluida'}>
                <Check className="h-4 w-4 mr-2" />
                Validar Conclusão
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/tarefas/editar/${tarefa.id}`)}>
              Editar Tarefa
            </Button>
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
