
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, Edit } from "lucide-react";
import { getOcorrenciaById } from "@/services/ocorrencias/ocorrenciasService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OcorrenciasVisualizacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ocorrencia, setOcorrencia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ccaInfo, setCcaInfo] = useState<any>(null);
  const [empresaInfo, setEmpresaInfo] = useState<any>(null);
  const [colaboradoresInfo, setColaboradoresInfo] = useState<any[]>([]);

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        const data = await getOcorrenciaById(id);
        setOcorrencia(data);
        
        // Buscar informações do CCA
        if (data.cca && !isNaN(Number(data.cca))) {
          const { data: cca } = await supabase
            .from('ccas')
            .select('codigo, nome')
            .eq('id', Number(data.cca))
            .single();
          if (cca) setCcaInfo(cca);
        }
        
        // Buscar informações da empresa
        if (data.empresa && !isNaN(Number(data.empresa))) {
          const { data: empresa } = await supabase
            .from('empresas')
            .select('nome')
            .eq('id', Number(data.empresa))
            .single();
          if (empresa) setEmpresaInfo(empresa);
        }
        
        // Buscar informações dos colaboradores acidentados
        if (data.colaboradores_acidentados && Array.isArray(data.colaboradores_acidentados)) {
          const colaboradoresCompletos = [];
          for (const colaborador of data.colaboradores_acidentados) {
            if (colaborador.colaborador && !isNaN(Number(colaborador.colaborador))) {
              const { data: funcionario } = await supabase
                .from('funcionarios')
                .select('nome')
                .eq('id', colaborador.colaborador)
                .single();
              
              colaboradoresCompletos.push({
                ...colaborador,
                nome: funcionario?.nome || colaborador.colaborador
              });
            } else {
              colaboradoresCompletos.push({
                ...colaborador,
                nome: colaborador.colaborador || '-'
              });
            }
          }
          setColaboradoresInfo(colaboradoresCompletos);
        }
        
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
      {/* Header para tela */}
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
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Ocorrência</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Header para impressão */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">RELATÓRIO DE OCORRÊNCIA DE SEGURANÇA</h1>
        <p className="text-lg text-gray-600">
          Protocolo: {ocorrencia.id?.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data de geração: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* 1. IDENTIFICAÇÃO */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="bg-blue-50 print:bg-gray-100">
          <CardTitle className="text-xl">1. IDENTIFICAÇÃO DA OCORRÊNCIA</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Data da Ocorrência</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {ocorrencia.data ? new Date(ocorrencia.data).toLocaleDateString('pt-BR') : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Hora</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.hora || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">CCA</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {ccaInfo ? `${ccaInfo.codigo} - ${ccaInfo.nome}` : (ocorrencia.cca || '-')}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Empresa</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {empresaInfo ? empresaInfo.nome : (ocorrencia.empresa || '-')}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Disciplina</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.disciplina || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Tipo de Ocorrência</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.tipo_ocorrencia || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Tipo de Evento</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.tipo_evento || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Classificação</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.classificacao_ocorrencia || '-'}</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. LIDERANÇA DA OBRA E DISCIPLINA */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="bg-green-50 print:bg-gray-100">
          <CardTitle className="text-xl">2. LIDERANÇA DA OBRA E DISCIPLINA</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Engenheiro Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.engenheiro_responsavel || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Supervisor Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.supervisor_responsavel || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Encarregado Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.encarregado_responsavel || '-'}</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. COLABORADORES ACIDENTADOS */}
      {colaboradoresInfo.length > 0 && (
        <Card className="print:shadow-none print:border-2">
          <CardHeader className="bg-red-50 print:bg-gray-100">
            <CardTitle className="text-xl">3. COLABORADORES ACIDENTADOS</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {colaboradoresInfo.map((colaborador: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-2 border-gray-200 rounded-lg">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Nome do Colaborador</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{colaborador.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Função</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{colaborador.funcao || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Matrícula</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{colaborador.matricula || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. INFORMAÇÕES DA OCORRÊNCIA */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="bg-orange-50 print:bg-gray-100">
          <CardTitle className="text-xl">4. INFORMAÇÕES DA OCORRÊNCIA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Descrição da ocorrência - primeira linha */}
          {ocorrencia.descricao_ocorrencia && (
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Descrição da Ocorrência</label>
              <div className="p-4 bg-gray-50 rounded border-2 border-gray-200 min-h-[100px]">
                <p className="text-base whitespace-pre-wrap">{ocorrencia.descricao_ocorrencia}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Houve Afastamento</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.houve_afastamento || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Dias Perdidos</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.dias_perdidos || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Dias Debitados</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.dias_debitados || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Parte do Corpo Atingida</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.parte_corpo_atingida || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Lateralidade</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.lateralidade || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Agente Causador</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.agente_causador || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Situação Geradora</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.situacao_geradora || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Natureza da Lesão</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.natureza_lesao || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Número CAT</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.numero_cat || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">CID</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.cid || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. CLASSIFICAÇÃO DE RISCO */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="bg-purple-50 print:bg-gray-100">
          <CardTitle className="text-xl">5. CLASSIFICAÇÃO DE RISCO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Exposição</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.exposicao || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Controle</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.controle || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Detecção</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.deteccao || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Efeito da Falha</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.efeito_falha || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Impacto</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.impacto || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Probabilidade</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.probabilidade || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Severidade</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{ocorrencia.severidade || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Classificação de Risco</label>
              <p className="text-base font-medium">
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
          </div>
        </CardContent>
      </Card>

      {/* 6. STATUS */}
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="bg-gray-50 print:bg-gray-100">
          <CardTitle className="text-xl">6. STATUS</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Status Atual</label>
            <p className="text-base font-medium">
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

export default OcorrenciasVisualizacao;
