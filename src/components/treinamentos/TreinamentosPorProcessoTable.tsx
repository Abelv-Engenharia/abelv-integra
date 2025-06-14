
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTreinamentosPorProcesso } from "@/services/treinamentos/treinamentosPorProcessoService";

type ProcessoDados = {
  processo: string;
  horasMOD: number;
  percentualMOD: number;
  horasMOI: number;
  percentualMOI: number;
};

export const TreinamentosPorProcessoTable = () => {
  // Query para buscar os dados, atualizando apenas se houver mudanças
  const { data = [], isLoading, error } = useQuery<ProcessoDados[]>({
    queryKey: ["treinamentos-por-processo"],
    queryFn: async () => {
      // Adaptar fetchTreinamentosPorProcesso para trazer todos os campos necessários
      // Retorno simulado abaixo para os campos MOI também
      const dadosDB: any[] = await fetchTreinamentosPorProcesso();
      // Simulação: fetchTreinamentosPorProcesso precisa ser ajustado se necessário para trazer MOI
      // Caso não haja MOI, manter 0
      return dadosDB.map(item => ({
        processo: item.processo,
        horasMOD: item.horasMOD ?? 0,
        percentualMOD: item.percentualMOD ?? 0,
        horasMOI: item.horasMOI ?? 0,
        percentualMOI: item.percentualMOI ?? 0,
      }));
    },
  });

  // Cálculo de totais
  const totalHorasMOD = data.reduce((sum, row) => sum + (row.horasMOD || 0), 0);
  const totalHorasMOI = data.reduce((sum, row) => sum + (row.horasMOI || 0), 0);

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
                <tr key={row.processo} className="text-center text-sm">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{row.processo}</td>
                  <td className="border border-gray-300 px-4 py-2">{Number(row.horasMOD).toLocaleString("pt-BR")}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.percentualMOD ? `${row.percentualMOD.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %` : "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">{Number(row.horasMOI).toLocaleString("pt-BR")}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.percentualMOI ? `${row.percentualMOI.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} %` : "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-center font-bold bg-gray-100 text-sm">
                <td className="border border-gray-300 px-4 py-2">
                  HORAS TOTAIS POR MÃO DE OBRA
                </td>
                <td className="border border-gray-300 px-4 py-2">{totalHorasMOD.toLocaleString("pt-BR")}</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">{totalHorasMOI.toLocaleString("pt-BR")}</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
