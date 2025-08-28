
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, User, Clock, AlertCircle, CheckCircle, FileUp, X, FileText, Download, Eye } from "lucide-react";
import { Tarefa, TarefaStatus } from "@/types/tarefas";
import { tarefasService } from "@/services/tarefasService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [userProfile, setUserProfile] = useState<{ nome: string } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('nome')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

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
        console.log("Observações existentes:", data.observacoes_progresso);
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

  useEffect(() => {
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

  const handleObservacoesSubmit = async () => {
    if (!tarefa?.id) {
      toast({
        title: "Erro",
        description: "ID da tarefa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile?.nome) {
      toast({
        title: "Erro",
        description: "Perfil do usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (!observacoes.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma observação antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Criar registro da observação com informações do usuário
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const novaObservacao = `[${dataFormatada} às ${horaFormatada} - ${userProfile.nome}]\n${observacoes.trim()}`;
      
      // Buscar as observações mais atuais diretamente do banco
      const tarefaAtual = await tarefasService.getById(tarefa.id);
      const observacoesExistentes = tarefaAtual?.observacoes_progresso || "";
      
      let observacoesAtualizadas = "";
      
      if (observacoesExistentes.trim()) {
        // Adicionar nova observação ao FINAL, separada por duas quebras de linha
        observacoesAtualizadas = observacoesExistentes + "\n\n" + novaObservacao;
      } else {
        observacoesAtualizadas = novaObservacao;
      }

      console.log("Salvando observações:", {
        observacoesExistentes,
        novaObservacao,
        observacoesAtualizadas
      });

      const sucesso = await tarefasService.updateStatus(tarefa.id, { 
        observacoes_progresso: observacoesAtualizadas 
      });
      
      if (sucesso) {
        setObservacoes(""); // Limpar o campo após salvar
        
        toast({
          title: "Observação adicionada",
          description: "Observação salva com sucesso.",
        });

        console.log("Observação salva com sucesso");
        
        // Recarregar os dados da tarefa para garantir sincronização
        await fetchTarefa();
      } else {
        toast({
          title: "Erro ao salvar observação",
          description: "Não foi possível salvar a observação.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a observação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

    if (!userProfile?.nome) {
      toast({
        title: "Erro",
        description: "Perfil do usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Criar nome do arquivo com informações do usuário e timestamp
      const agora = new Date();
      const timestamp = agora.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', '-');
      const fileName = `${timestamp}_${userProfile.nome.replace(/\s+/g, '_')}_${anexo.name}`;
      
      // Simulação de upload (substitua pela lógica real de upload)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const sucesso = await tarefasService.updateStatus(tarefa.id, { anexo: fileName });

      if (sucesso) {
        setTarefa({ ...tarefa, anexo: fileName });
        setAnexo(null);
        // Reset input file
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
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

  const parseAnexoInfo = (anexoPath: string) => {
    if (!anexoPath) return null;
    
    // Tentar extrair informações do nome do arquivo
    const parts = anexoPath.split('_');
    if (parts.length >= 3) {
      try {
        const datePart = parts[0];
        const timePart = parts[1];
        const userName = parts[2].replace(/_/g, ' ');
        const originalName = parts.slice(3).join('_');
        
        return {
          userName,
          date: `${datePart} ${timePart.replace('-', ':')}`,
          originalName
        };
      } catch {
        return { originalName: anexoPath };
      }
    }
    
    return { originalName: anexoPath };
  };

  const anexoInfo = parseAnexoInfo(tarefa.anexo || "");

  const handleViewAttachment = () => {
    toast({
      title: "Visualizar anexo",
      description: "Funcionalidade de visualização será implementada em breve.",
    });
  };

  const handleDownloadAttachment = () => {
    toast({
      title: "Baixar anexo", 
      description: "Funcionalidade de download será implementada em breve.",
    });
  };

  // Função para parsear e exibir observações
  const parseObservacoes = (observacoesText: string) => {
    if (!observacoesText || !observacoesText.trim()) {
      return [];
    }

    console.log("Parseando observações:", observacoesText);

    // Dividir observações por dupla quebra de linha
    const observacoesList = observacoesText
      .split(/\n\n+/)
      .filter(obs => obs.trim())
      .map(obs => obs.trim());

    console.log("Observações divididas:", observacoesList);

    return observacoesList.map((observacao, index) => {
      // Verificar se tem o formato [data - usuário]
      const linhas = observacao.split('\n');
      const primeiraLinha = linhas[0];
      
      if (primeiraLinha.match(/^\[.*\]$/)) {
        // Formato com cabeçalho
        const cabecalho = primeiraLinha.replace(/[\[\]]/g, '');
        const conteudo = linhas.slice(1).join('\n');
        
        return {
          id: index,
          cabecalho,
          conteudo,
          temCabecalho: true
        };
      } else {
        // Formato sem cabeçalho (observações antigas)
        return {
          id: index,
          cabecalho: '',
          conteudo: observacao,
          temCabecalho: false
        };
      }
    });
  };

  const observacoesParsed = parseObservacoes(tarefa.observacoes_progresso || "");
  console.log("Observações parseadas:", observacoesParsed);

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
              <p>{new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}</p>
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        {anexoInfo?.originalName || tarefa.anexo}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Anexado
                      </Badge>
                    </div>
                    {anexoInfo?.userName && anexoInfo?.date && (
                      <div className="text-xs text-muted-foreground">
                        <User className="inline h-3 w-3 mr-1" />
                        Anexado por: {anexoInfo.userName} em {anexoInfo.date}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={handleViewAttachment}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 hover:text-green-800"
                      onClick={handleDownloadAttachment}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
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
            
            {/* Histórico de observações */}
            {observacoesParsed.length > 0 ? (
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-green-700">Histórico de Observações:</Label>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {observacoesParsed.length} observação{observacoesParsed.length > 1 ? 'ões' : ''}
                  </Badge>
                </div>
                
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {observacoesParsed.map((obs, index) => (
                    <div key={obs.id} className="border rounded-lg p-3 bg-white shadow-sm">
                      {obs.temCabecalho ? (
                        <div className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-xs text-blue-600 font-medium flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {obs.cabecalho}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              #{observacoesParsed.length - index}
                            </Badge>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{obs.conteudo}</div>
                        </div>
                      ) : (
                        <div className="border-l-4 border-gray-300 pl-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-xs text-gray-500 font-medium">
                              Observação sem data/usuário
                            </div>
                            <Badge variant="outline" className="text-xs">
                              #{observacoesParsed.length - index}
                            </Badge>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{obs.conteudo}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Nenhuma observação registrada ainda.</p>
              </div>
            )}
            
            {/* Campo para adicionar novas observações */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Adicionar Nova Observação:</Label>
              <Textarea
                placeholder="Digite sua observação aqui..."
                value={observacoes}
                onChange={handleObservacoesChange}
                className="min-h-24"
              />
              <Button 
                onClick={handleObservacoesSubmit} 
                className="mt-2" 
                disabled={!observacoes.trim() || loading}
              >
                {loading ? "Salvando..." : "Adicionar Observação"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalheTarefa;
