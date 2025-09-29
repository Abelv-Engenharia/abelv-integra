import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { format, parseISO } from "date-fns";
import ColoredBadge from "./ColoredBadge";

interface Props {
  desvio: DesvioCompleto;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "-";
  }
};

const ReadOnlyAcaoCorretivaForm = ({ desvio }: Props) => {
  return (
    <Card className="print:shadow-none print:border-2 print-no-break print-section">
      <CardHeader className="bg-orange-50 print:bg-gray-100 print-section-title">
        <CardTitle className="text-xl">3. Ação Corretiva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 print-section-content">
        {/* Ações Corretivas */}
        {desvio.acoes && Array.isArray(desvio.acoes) && desvio.acoes.length > 0 && (
          <div className="space-y-3 print-spacing-md">
            <h3 className="text-base font-semibold print-label">Ações Corretivas</h3>
            {desvio.acoes.map((acao: any, index: number) => (
              <div key={index} className="p-3 border border-gray-300 rounded print:border-black space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Tratativa Aplicada</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{acao.tratativa || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Responsável pela Ação</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{acao.responsavel || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Prazo para Correção</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{formatDate(acao.prazo)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Situação</label>
                    <div className="text-base font-medium">
                      {acao.situacao && (
                        <ColoredBadge 
                          color={
                            acao.situacao === 'TRATADO' ? 'green' : 'orange'
                          }
                        >
                          {acao.situacao}
                        </ColoredBadge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-grid-2 print-spacing-md">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Prazo de Conclusão</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
              {formatDate(desvio.prazo_conclusao)}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Situação Geral</label>
            <div className="text-base font-medium">
              {desvio.situacao && (
                <ColoredBadge 
                  color={
                    desvio.situacao === 'CONCLUÍDO' ? 'green' :
                    desvio.situacao === 'EM ANDAMENTO' ? 'orange' :
                    'red'
                  }
                >
                  {desvio.situacao}
                </ColoredBadge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyAcaoCorretivaForm;