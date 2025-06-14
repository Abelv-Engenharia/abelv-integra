import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type LinhaTabela = {
  tipoTreinamento: string;
  horasTotaisMOD: number;
  percentualMOD: number;
  horasTotaisMOI: number;
  percentualMOI: number;
};

// Nova função que soma horas totais corretamente
async function fetchTreinamentosPorTipoTreinamento(): Promise<LinhaTabela[]> {
  const { data, error } = await supabase
    .from("execucao_treinamentos")
    .select(
      "tipo_treinamento, carga_horaria, efetivo_mod, efetivo_moi"
    );

  if (error) {
    throw new Error("Erro ao buscar execucao_treinamentos: " + error.message);
  }

  // Agrupa por tipo de treinamento e soma as horas totais
  const agrupados: Record<string, { horasTotaisMOD: number; horasTotaisMOI: number }> = {};

  (data || []).forEach((linha) => {
    const tipo = linha.tipo_treinamento || "Não informado";
    const cargaHoraria = Number(linha.carga_horaria) || 0;
    const efetivoMOD = Number(linha.efetivo_mod) || 0;
    const efetivoMOI = Number(linha.efetivo_moi) || 0;

    if (!agrupados[tipo]) {
      agrupados[tipo] = { horasTotaisMOD: 0, horasTotaisMOI: 0 };
    }
    agrupados[tipo].horasTotaisMOD += cargaHoraria * efetivoMOD;
    agrupados[tipo].horasTotaisMOI += cargaHoraria * efetivoMOI;
  });

  const totalMOD = Object.values(agrupados).reduce((s, v) => s + v.horasTotaisMOD, 0);
  const totalMOI = Object.values(agrupados).reduce((s, v) => s + v.horasTotaisMOI, 0);

  return Object.entries(agrupados).map(([tipoTreinamento, valores]) => ({
    tipoTreinamento,
    horasTotaisMOD: valores.horasTotaisMOD,
    percentualMOD: totalMOD ? (valores.horasTotaisMOD / totalMOD) * 100 : 0,
    horasTotaisMOI: valores.horasTotaisMOI,
    percentualMOI: totalMOI ? (valores.horasTotaisMOI / totalMOI) * 100 : 0,
  }));
}

export const TreinamentosPorProcessoTable = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["treinamentos-por-processo-tipo-treinamento-horas"],
    queryFn: fetchTreinamentosPorTipoTreinamento,
  });

  // Totais
  const totalMOD = data.reduce((sum, row) => sum + (row.horasTotaisMOD || 0), 0);
  const totalMOI = data.reduce((sum, row) => sum + (row.horasTotaisMOI || 0), 0);
  const totalGeral = totalMOD + totalMOI;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase text-center text-base font-bold tracking-widest bg-blue-900 text-white rounded-t-md py-2">
          Treinamentos por Processo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-b-md border border-gray-300">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-800 text-white text-center text-sm font-semibold">
                <th className="border border-white px-4 py-2">PROCESSO</th>
                <th className="border border-white px-4 py-2">
                  HORAS TREINAMENTO MOD
                </th>
                <th className="border border-white px-4 py-2">
                  PERCENTUAL % MOD
                </th>
                <th className="border border-white px-4 py-2">
                  HORAS TREINAMENTO MOI
                </th>
                <th className="border border-white px-4 py-2">
                  PERCENTUAL % MOI
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="text-center text-red-600 p-4">Erro ao carregar dados.</td>
                </tr>
              )}
              {!isLoading && !error && data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum dado de treinamento encontrado.
                  </td>
                </tr>
              )}
              {data.map((row) => (
                <tr key={row.tipoTreinamento} className="text-center text-sm">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{row.tipoTreinamento}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.horasTotaisMOD}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {totalGeral > 0 && row.horasTotaisMOD > 0
                      ? `${((row.horasTotaisMOD / totalGeral) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %`
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{row.horasTotaisMOI}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {totalGeral > 0 && row.horasTotaisMOI > 0
                      ? `${((row.horasTotaisMOI / totalGeral) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-center font-bold bg-gray-100 text-sm">
                <td className="border border-gray-300 px-4 py-2">
                  HORAS TOTAIS POR MÃO DE OBRA
                </td>
                <td className="border border-gray-300 px-4 py-2">{totalMOD}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {totalGeral > 0 ? `${((totalMOD / totalGeral) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %` : "0 %"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{totalMOI}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {totalGeral > 0 ? `${((totalMOI / totalGeral) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %` : "0 %"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
