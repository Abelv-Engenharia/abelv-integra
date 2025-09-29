import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface Props {
  desvio: DesvioCompleto;
}

const ReadOnlyInformacoesDesvioForm = ({ desvio }: Props) => {
  return (
    <Card className="print:shadow-none print:border-2 print-no-break">
      <CardHeader className="bg-green-50 print:bg-gray-100">
        <CardTitle className="text-xl">2. INFORMAÇÕES DO DESVIO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Descrição do Desvio - primeira linha */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Descrição do Desvio</label>
          <div className="p-4 bg-gray-50 rounded border-2 border-gray-200 min-h-[100px]">
            <p className="text-base whitespace-pre-wrap">{desvio.descricao_desvio || "-"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Base Legal</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).base_legal_opcoes?.nome || "N/A"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Supervisor Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).supervisores?.nome || "N/A"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Encarregado Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).encarregados?.nome || "N/A"}
            </p>
          </div>
        </div>

        {/* Funcionários Envolvidos */}
        {desvio.funcionarios_envolvidos && Array.isArray(desvio.funcionarios_envolvidos) && desvio.funcionarios_envolvidos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funcionários Envolvidos</h3>
            {desvio.funcionarios_envolvidos.map((funcionario: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-2 border-gray-200 rounded-lg">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Nome do Funcionário</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1">{funcionario.nome || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Função</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1">{funcionario.funcao || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Matrícula</label>
                  <p className="text-base font-medium border-b border-gray-200 pb-1">{funcionario.matricula || "-"}</p>
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