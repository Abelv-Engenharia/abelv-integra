import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import RiskBadge from "../RiskBadge";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  desvio: DesvioCompleto;
}

const ReadOnlyClassificacaoRiscoForm = ({ desvio }: Props) => {
  const [exposicaoOpcao, setExposicaoOpcao] = useState<any>(null);
  const [controleOpcao, setControleOpcao] = useState<any>(null);
  const [deteccaoOpcao, setDeteccaoOpcao] = useState<any>(null);
  const [efeitoFalhaOpcao, setEfeitoFalhaOpcao] = useState<any>(null);
  const [impactoOpcao, setImpactoOpcao] = useState<any>(null);

  useEffect(() => {
    const fetchOpcoes = async () => {
      try {
        if (desvio.exposicao) {
          const { data } = await supabase
            .from('exposicao_opcoes')
            .select('id, nome')
            .eq('id', desvio.exposicao)
            .maybeSingle();
          setExposicaoOpcao(data);
        }

        if (desvio.controle) {
          const { data } = await supabase
            .from('controle_opcoes')
            .select('id, nome')
            .eq('id', desvio.controle)
            .maybeSingle();
          setControleOpcao(data);
        }

        if (desvio.deteccao) {
          const { data } = await supabase
            .from('deteccao_opcoes')
            .select('id, nome')
            .eq('id', desvio.deteccao)
            .maybeSingle();
          setDeteccaoOpcao(data);
        }

        if (desvio.efeito_falha) {
          const { data } = await supabase
            .from('efeito_falha_opcoes')
            .select('id, nome')
            .eq('id', desvio.efeito_falha)
            .maybeSingle();
          setEfeitoFalhaOpcao(data);
        }

        if (desvio.impacto) {
          const { data } = await supabase
            .from('impacto_opcoes')
            .select('id, nome')
            .eq('id', desvio.impacto)
            .maybeSingle();
          setImpactoOpcao(data);
        }
      } catch (error) {
        console.error('Erro ao carregar opções de classificação:', error);
      }
    };

    fetchOpcoes();
  }, [desvio]);

  // Função para obter a cor da classificação
  const getClassificacaoColor = (classificacao?: string) => {
    if (!classificacao) return "bg-gray-400 text-white";
    
    switch (classificacao.toUpperCase()) {
      case "TRIVIAL":
        return "bg-cyan-400 text-white";
      case "TOLERÁVEL":
      case "TOLERAVEL":
        return "bg-green-400 text-white";
      case "MODERADO":
        return "bg-yellow-400 text-white";
      case "SUBSTANCIAL":
        return "bg-orange-400 text-white";
      case "INTOLERÁVEL":
      case "INTOLERAVEL":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <Card className="print:shadow-none print:border-2 print-no-break print-section">
      <CardHeader className="bg-purple-50 print:bg-gray-100 print-section-title">
        <CardTitle className="text-xl">4. Classificação de Risco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 print-section-content">
        {/* Seções de Probabilidade e Severidade lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-grid-2">
          {/* Seção de Probabilidade */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold print-label">Probabilidade</h3>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Exposição</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
                {exposicaoOpcao ? exposicaoOpcao.nome : "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Controle</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
                {controleOpcao ? controleOpcao.nome : "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Detecção</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
                {deteccaoOpcao ? deteccaoOpcao.nome : "-"}
              </p>
            </div>
          </div>

          {/* Seção de Severidade */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold print-label">Severidade</h3>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Efeito de Falha</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
                {efeitoFalhaOpcao ? efeitoFalhaOpcao.nome : "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Impacto</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
                {impactoOpcao ? impactoOpcao.nome : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Gradação de Risco */}
        <div className="mt-4 print-spacing-md">
          <h3 className="text-base font-semibold mb-3 print-label">Gradação de Risco</h3>
          
          {/* Resultados Calculados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print-grid-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-300 print:bg-white print:border-black">
              <div className="text-sm font-medium text-gray-600 mb-1 print-label">Probabilidade</div>
              <div className="text-xl font-bold text-gray-900">{desvio.probabilidade || "-"}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-300 print:bg-white print:border-black">
              <div className="text-sm font-medium text-gray-600 mb-1 print-label">Severidade</div>
              <div className="text-xl font-bold text-gray-900">{desvio.severidade || "-"}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-300 print:bg-white print:border-black">
              <div className="text-sm font-medium text-gray-600 mb-1 print-label">Classificação</div>
              {desvio.classificacao_risco ? (
                <div className="mt-1">
                  <RiskBadge risk={desvio.classificacao_risco} />
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-900">Não definida</div>
              )}
            </div>
          </div>

          {/* Legendas de Classificação */}
          <div className="space-y-2 print-spacing-sm">
            <h4 className="font-medium text-sm text-gray-700 print-label">Legendas de Classificação</h4>
            <div className="flex flex-wrap gap-3 text-xs print-legend">
              <div className="flex items-center gap-2 print-legend-item">
                <div className="w-3 h-3 bg-cyan-400 rounded print-legend-color print-risk-trivial"></div>
                <span>TRIVIAL (≤10)</span>
              </div>
              <div className="flex items-center gap-2 print-legend-item">
                <div className="w-3 h-3 bg-green-400 rounded print-legend-color print-risk-toleravel"></div>
                <span>TOLERÁVEL (≤21)</span>
              </div>
              <div className="flex items-center gap-2 print-legend-item">
                <div className="w-3 h-3 bg-yellow-400 rounded print-legend-color print-risk-moderado"></div>
                <span>MODERADO (≤40)</span>
              </div>
              <div className="flex items-center gap-2 print-legend-item">
                <div className="w-3 h-3 bg-orange-400 rounded print-legend-color print-risk-substancial"></div>
                <span>SUBSTANCIAL (≤56)</span>
              </div>
              <div className="flex items-center gap-2 print-legend-item">
                <div className="w-3 h-3 bg-red-500 rounded print-legend-color print-risk-intoleravel"></div>
                <span>INTOLERÁVEL (&gt;56)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyClassificacaoRiscoForm;