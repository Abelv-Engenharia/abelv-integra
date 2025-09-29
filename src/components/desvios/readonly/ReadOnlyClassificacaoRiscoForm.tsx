import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import RiskBadge from "../RiskBadge";

interface Props {
  desvio: DesvioCompleto;
}

const ReadOnlyClassificacaoRiscoForm = ({ desvio }: Props) => {
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
    <Card className="print:shadow-none print:border-2">
      <CardHeader className="bg-purple-50 print:bg-gray-100">
        <CardTitle className="text-xl">4. CLASSIFICAÇÃO DE RISCO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Seções de Probabilidade e Severidade lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seção de Probabilidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Probabilidade</h3>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Exposição</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{desvio.exposicao || "-"}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Controle</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{desvio.controle || "-"}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Detecção</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{desvio.deteccao || "-"}</p>
            </div>
          </div>

          {/* Seção de Severidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Severidade</h3>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Efeito de Falha</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{desvio.efeito_falha || "-"}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Impacto</label>
              <p className="text-base font-medium border-b border-gray-200 pb-1">{desvio.impacto || "-"}</p>
            </div>
          </div>
        </div>

        {/* Seção de Gradação de Risco */}
        <Card>
          <CardHeader>
            <CardTitle>Gradação de Risco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resultados Calculados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-gray-600 mb-1">Probabilidade</div>
                <div className="text-2xl font-bold text-gray-900">{desvio.probabilidade || "-"}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-gray-600 mb-1">Severidade</div>
                <div className="text-2xl font-bold text-gray-900">{desvio.severidade || "-"}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm font-medium text-gray-600 mb-1">Classificação</div>
                {desvio.classificacao_risco ? (
                  <RiskBadge risk={desvio.classificacao_risco} />
                ) : (
                  <div className="text-2xl font-bold text-gray-900">Não definida</div>
                )}
              </div>
            </div>

            {/* Legendas de Classificação */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Legendas de Classificação</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                  <span>TRIVIAL (≤10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>TOLERÁVEL (≤21)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>MODERADO (≤40)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span>SUBSTANCIAL (≤56)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>INTOLERÁVEL (&gt;56)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyClassificacaoRiscoForm;