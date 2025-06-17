
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { getOcorrenciaById, updateOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import { toast } from "sonner";

const OcorrenciasAtualizarStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ocorrencia, setOcorrencia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acoes, setAcoes] = useState<any[]>([]);

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        const data = await getOcorrenciaById(id);
        setOcorrencia(data);
        setAcoes(data.acoes || []);
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        toast.error("Erro ao carregar dados da ocorrência");
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencia();
  }, [id]);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedAcoes = [...acoes];
    updatedAcoes[index] = { ...updatedAcoes[index], status: newStatus };
    setAcoes(updatedAcoes);
  };

  const handleSituacaoChange = (index: number, newSituacao: string) => {
    const updatedAcoes = [...acoes];
    updatedAcoes[index] = { ...updatedAcoes[index], situacao: newSituacao };
    setAcoes(updatedAcoes);
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSubmitting(true);

    try {
      await updateOcorrencia(id, { acoes });
      toast.success("Status das ações atualizado com sucesso!");
      navigate("/ocorrencias/consulta");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status das ações");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ocorrência não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate("/ocorrencias/consulta")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Consulta
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Atualizar Status das Ações</h2>
          <p className="text-muted-foreground">
            Ocorrência de {ocorrencia.data ? new Date(ocorrencia.data).toLocaleDateString('pt-BR') : ''} - {ocorrencia.empresa}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plano de Ação</CardTitle>
        </CardHeader>
        <CardContent>
          {acoes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma ação cadastrada para esta ocorrência.
            </p>
          ) : (
            <div className="space-y-6">
              {acoes.map((acao, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Ação {index + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Tratativa Aplicada
                      </label>
                      <p className="text-sm p-2 bg-gray-50 rounded border mt-1">
                        {acao.tratativa_aplicada || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Responsável
                      </label>
                      <p className="text-sm p-2 bg-gray-50 rounded border mt-1">
                        {acao.responsavel_acao || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Data de Adequação
                      </label>
                      <p className="text-sm p-2 bg-gray-50 rounded border mt-1">
                        {acao.data_adequacao ? new Date(acao.data_adequacao).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Função do Responsável
                      </label>
                      <p className="text-sm p-2 bg-gray-50 rounded border mt-1">
                        {acao.funcao_responsavel || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Situação *
                      </label>
                      <Select
                        value={acao.situacao || ""}
                        onValueChange={(value) => handleSituacaoChange(index, value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Concluída">Concluída</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status *
                      </label>
                      <Select
                        value={acao.status || ""}
                        onValueChange={(value) => handleStatusChange(index, value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aberto">Aberto</SelectItem>
                          <SelectItem value="Em execução">Em execução</SelectItem>
                          <SelectItem value="Concluído">Concluído</SelectItem>
                          <SelectItem value="Atrasado">Atrasado</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasAtualizarStatus;
