
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User, Clock, AlertCircle, CheckCircle, FileUp, X, FileText, Download } from "lucide-react";
import { Tarefa, TarefaStatus } from "@/types/tarefas";
import { tarefasService } from "@/services/tarefasService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const DetalheTarefa = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
          // Carregar observações existentes no campo de texto
          if (data.observacoes_progresso) {
            setObservacoes(data.observacoes_progresso);
          }
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

  const handleObservacoesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacoes(event.target.value);
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
      // Simulação de upload (substitua pela lógica real de upload)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Atualizar a tarefa com o nome do anexo (simulação)
      const anexoNome = anexo.name;
      const sucesso = await tarefasService.updateStatus(tarefa.id, { anexo: anexoNome });

      if (sucesso) {
        setTarefa({ ...tarefa, anexo: anexoNome });
        toast({
          title: "Anexo enviado",
          description: "Anexo enviado com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao enviar anexo",
          description: "Não foi possível enviar o anexo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar anexo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o anexo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleObservacoesSubmit = async () => {
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
      const sucesso = await tarefasService.updateStatus(tarefa.id, { observacoes_progresso: observacoes });
      if (sucesso) {
        setTarefa({ ...tarefa, observacoes_progresso: observacoes });
        toast({
          title: "Observações atualizadas",
          description: "Observações atualizadas com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao atualizar observações",
          description: "Não foi possível atualizar as observações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar observações:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as observações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

          {/* Seção de arquivos anexados */}
          <div>
            <Label className="text-muted-foreground">
              <FileUp className="mr-2 h-4 w-4 inline-block" />
              Anexos
            </Label>
            
            {/* Mostrar anexo existente se houver */}
            {tarefa.anexo && (
              <div className="mb-4 p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{tarefa.anexo}</span>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Anexado
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Upload de novo anexo */}
            <div className="flex items-center space-x-4">
              <Input type="file" onChange={handleAnexoChange} />
              <Button onClick={handleUploadAnexo} disabled={!anexo || uploading}>
                {uploading ? "Enviando..." : "Enviar Anexo"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Seção de observações */}
          <div>
            <Label className="text-muted-foreground mb-2 block">Observações de Progresso</Label>
            
            {/* Mostrar observações existentes se houver e não estiver editando */}
            {tarefa.observacoes_progresso && tarefa.observacoes_progresso.trim() !== "" && (
              <div className="mb-4 p-3 border rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <Label className="text-sm font-medium text-green-700">Observações Salvas:</Label>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Salvo
                  </Badge>
                </div>
                <p className="text-sm whitespace-pre-wrap">{tarefa.observacoes_progresso}</p>
              </div>
            )}
            
            {/* Campo para editar/adicionar observações */}
            <Textarea
              placeholder="Adicione suas observações aqui..."
              value={observacoes}
              onChange={handleObservacoesChange}
              className="min-h-24"
            />
            <Button onClick={handleObservacoesSubmit} className="mt-2">
              {tarefa.observacoes_progresso ? "Atualizar Observações" : "Salvar Observações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalheTarefa;
