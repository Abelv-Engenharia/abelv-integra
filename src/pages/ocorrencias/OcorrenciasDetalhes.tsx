
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, Edit, FileText } from "lucide-react";
import { getOcorrenciaById } from "@/services/ocorrencias/ocorrenciasService";
import { toast } from "sonner";
import DocumentosAnexados from "@/components/ocorrencias/DocumentosAnexados";

const OcorrenciasDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ocorrencia, setOcorrencia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        const data = await getOcorrenciaById(id);
        setOcorrencia(data);
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        toast.error("Erro ao carregar dados da ocorrência");
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencia();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/ocorrencias/editar/${id}`);
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
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
          <h2 className="text-3xl font-bold tracking-tight">Detalhes da Ocorrência</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <DocumentosAnexados ocorrencia={ocorrencia} />
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Header para impressão */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">RELATÓRIO DE OCORRÊNCIA</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Data de geração: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data</label>
            <p className="text-sm">{ocorrencia.data ? new Date(ocorrencia.data).toLocaleDateString('pt-BR') : '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Hora</label>
            <p className="text-sm">{ocorrencia.hora || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Cca</label>
            <p className="text-sm">
              {ocorrencia.cca_nome 
                ? `${ocorrencia.cca_codigo} - ${ocorrencia.cca_nome}` 
                : ocorrencia.cca_codigo || ocorrencia.cca || '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Empresa</label>
            <p className="text-sm">{ocorrencia.empresa_nome || ocorrencia.empresa || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Disciplina</label>
            <p className="text-sm">{ocorrencia.disciplina || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tipo de Ocorrência</label>
            <p className="text-sm">{ocorrencia.tipo_ocorrencia || '-'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Responsáveis */}
      <Card>
        <CardHeader>
          <CardTitle>Responsáveis</CardTitle>
        </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Engenheiro Responsável</label>
              <p className="text-sm">{ocorrencia.engenheiro_responsavel_nome || ocorrencia.engenheiro_responsavel || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Supervisor Responsável</label>
              <p className="text-sm">{ocorrencia.supervisor_responsavel_nome || ocorrencia.supervisor_responsavel || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Encarregado Responsável</label>
              <p className="text-sm">{ocorrencia.encarregado_responsavel_nome || ocorrencia.encarregado_responsavel || '-'}</p>
            </div>
          </CardContent>
      </Card>

      {/* Colaboradores Acidentados */}
      {ocorrencia.colaboradores_acidentados && ocorrencia.colaboradores_acidentados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores Acidentados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ocorrencia.colaboradores_acidentados.map((colaborador: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-sm">{colaborador.colaborador || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Função</label>
                    <p className="text-sm">{colaborador.funcao || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Matrícula</label>
                    <p className="text-sm">{colaborador.matricula || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações da Ocorrência */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Ocorrência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Houve Afastamento</label>
              <p className="text-sm">{ocorrencia.houve_afastamento || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dias Perdidos</label>
              <p className="text-sm">{ocorrencia.dias_perdidos || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dias Debitados</label>
              <p className="text-sm">{ocorrencia.dias_debitados || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parte do Corpo Atingida</label>
              <p className="text-sm">{ocorrencia.parte_corpo_atingida || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Lateralidade</label>
              <p className="text-sm">{ocorrencia.lateralidade || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Agente Causador</label>
              <p className="text-sm">{ocorrencia.agente_causador || '-'}</p>
            </div>
          </div>
          {ocorrencia.descricao_ocorrencia && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição da Ocorrência</label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">{ocorrencia.descricao_ocorrencia}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Classificação de Risco */}
      <Card>
        <CardHeader>
          <CardTitle>Classificação de Risco</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Probabilidade</label>
            <p className="text-sm">{ocorrencia.probabilidade || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Severidade</label>
            <p className="text-sm">{ocorrencia.severidade || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Classificação de Risco</label>
            <p className="text-sm">
              {ocorrencia.classificacao_risco && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  ocorrencia.classificacao_risco === 'TRIVIAL' ? 'bg-blue-100 text-blue-800' :
                  ocorrencia.classificacao_risco === 'TOLERÁVEL' ? 'bg-green-100 text-green-800' :
                  ocorrencia.classificacao_risco === 'MODERADO' ? 'bg-yellow-100 text-yellow-800' :
                  ocorrencia.classificacao_risco === 'SUBSTANCIAL' ? 'bg-orange-100 text-orange-800' :
                  ocorrencia.classificacao_risco === 'INTOLERÁVEL' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ocorrencia.classificacao_risco}
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plano de Ação */}
      {ocorrencia.acoes && ocorrencia.acoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Plano de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ocorrencia.acoes.map((acao: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Tratativa Aplicada</label>
                      <p className="text-sm mt-1">{acao.tratativa_aplicada || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Adequação</label>
                      <p className="text-sm">{acao.data_adequacao ? new Date(acao.data_adequacao).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                      <p className="text-sm">{acao.responsavel_acao || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Função do Responsável</label>
                      <p className="text-sm">{acao.funcao_responsavel || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <p className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          acao.status?.toUpperCase() === 'CONCLUÍDO' || acao.status?.toUpperCase() === 'CONCLUIDO'
                            ? 'bg-green-100 text-green-800'
                            : acao.status?.toUpperCase() === 'ATRASADO'
                            ? 'bg-red-100 text-red-800'
                            : acao.status?.toUpperCase().includes('EXECUÇÃO') || acao.status?.toUpperCase().includes('EXECUCAO')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {acao.status || '-'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status Atual</label>
            <p className="text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                ocorrencia.status === 'Em tratativa' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {ocorrencia.status || 'Em tratativa'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasDetalhes;
