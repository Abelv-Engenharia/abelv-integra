import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface Props {
  desvio: DesvioCompleto;
}

const ReadOnlyInformacoesDesvioForm = ({ desvio }: Props) => {
  return (
    <Card className="print:shadow-none print:border-2 print-no-break print-section">
      <CardHeader className="bg-green-50 print:bg-gray-100 print-section-title">
        <CardTitle className="text-xl">2. Informações do Desvio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 print-section-content">
        {/* Descrição do Desvio - primeira linha */}
        <div className="mb-4 print-spacing-md">
          <label className="text-sm font-semibold text-gray-700 block mb-2 print-label">Descrição do Desvio</label>
          <div className="p-4 bg-gray-50 rounded border-2 border-gray-200 min-h-[80px] print-description">
            <p className="text-base whitespace-pre-wrap">{desvio.descricao_desvio || "-"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print-grid-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Base Legal</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
              {(desvio as any).base_legal_opcoes?.nome || "N/A"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Supervisor Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
              {(desvio as any).supervisores?.nome || "N/A"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Encarregado Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">
              {(desvio as any).encarregados?.nome || "N/A"}
            </p>
          </div>
        </div>

        {/* Funcionários Envolvidos */}
        {desvio.funcionarios_envolvidos && Array.isArray(desvio.funcionarios_envolvidos) && desvio.funcionarios_envolvidos.length > 0 && (
          <div className="space-y-3 print-spacing-md">
            <h3 className="text-base font-semibold print-label">Funcionários Envolvidos</h3>
            {desvio.funcionarios_envolvidos.map((funcionario: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-gray-300 rounded print:border-black">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Nome do Funcionário</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{funcionario.nome || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Função</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{funcionario.funcao || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1 print-label">Matrícula</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1 print-value">{funcionario.matricula || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ReadOnlyInformacoesDesvioForm;