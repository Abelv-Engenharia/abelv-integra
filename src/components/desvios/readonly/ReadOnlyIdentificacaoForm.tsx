import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { format, parseISO } from "date-fns";

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

const ReadOnlyIdentificacaoForm = ({ desvio }: Props) => {
  return (
    <Card className="print:shadow-none print:border-2 print-no-break">
      <CardHeader className="bg-blue-50 print:bg-gray-100">
        <CardTitle className="text-xl">1. IDENTIFICAÇÃO</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Data</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {formatDate(desvio.data_desvio)}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Hora</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {desvio.hora_desvio || "-"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">CCA</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {(desvio as any).ccas ? `${(desvio as any).ccas.codigo} - ${(desvio as any).ccas.nome}` : "N/A"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Tipo de Registro</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).tipos_registro?.nome || "N/A"}
            </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Processo</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).processos?.nome || "N/A"}
            </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Evento Identificado</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {(desvio as any).eventos_identificados?.nome || "N/A"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Causa Provável</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {(desvio as any).causas_provaveis?.nome || "N/A"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Responsável pela Inspeção</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {desvio.responsavel_inspecao || "-"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Empresa</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {(desvio as any).empresas?.nome || "N/A"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Disciplina</label>
          <p className="text-base font-medium border-b border-gray-200 pb-1">
            {(desvio as any).disciplinas?.nome || "N/A"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Engenheiro Responsável</label>
            <p className="text-base font-medium border-b border-gray-200 pb-1">
              {(desvio as any).engenheiros?.nome || "N/A"}
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyIdentificacaoForm;