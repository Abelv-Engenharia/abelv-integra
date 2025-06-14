import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LinhaTabela = {
  tipoTreinamento: string;
  horasTotaisMOD: number;
  percentualMOD: number;
  horasTotaisMOI: number;
  percentualMOI: number;
};

export const TreinamentosPorProcessoTable = ({ data = [], isLoading = false }: { data?: any[]; isLoading?: boolean }) => {
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
              {!isLoading && data.length === 0 && (
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

export default TreinamentosPorProcessoTable;
