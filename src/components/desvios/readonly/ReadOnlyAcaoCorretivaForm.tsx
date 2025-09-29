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
    <Card className="print:shadow-none print:border-2 print-no-break">
      <CardHeader className="bg-orange-50 print:bg-gray-100">
        <CardTitle className="text-xl">3. AÇÃO CORRETIVA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Ações Corretivas */}
        {desvio.acoes && Array.isArray(desvio.acoes) && desvio.acoes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ações Corretivas</h3>
            {desvio.acoes.map((acao: any, index: number) => (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Tratativa Aplicada</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{acao.tratativa || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Responsável pela Ação</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{acao.responsavel || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Prazo para Correção</label>
                    <p className="text-base font-medium border-b border-gray-200 pb-1">{formatDate(acao.prazo)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Situação</label>
                    <p className="text-base font-medium">
                      {acao.situacao && (
                        <ColoredBadge 
                          color={
                            acao.situacao === 'TRATADO' ? 'green' : 'orange'
                          }
                        >
                          {acao.situacao}
                        </ColoredBadge>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Prazo de Conclusão</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {formatDate(desvio.prazo_conclusao)}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Situação Geral</label>
            <p className="text-base font-medium">
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
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyAcaoCorretivaForm;