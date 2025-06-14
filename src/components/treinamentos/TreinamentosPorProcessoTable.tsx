
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const linhasProcessos = [
  "ADMISSÃO - FORMAÇÃO (PROCESSO DE MOBILIZAÇÃO)",
  "FORMAÇÃO (REALIZADOS APÓS O INÍCIO DAS ATIVIDADES)",
  "RECICLAGEM",
  "TRANSFERÊNCIA - MOBILIZAÇÃO",
];

export const TreinamentosPorProcessoTable = () => {
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
              {linhasProcessos.map((processo, idx) => (
                <tr key={processo} className="text-center text-sm">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{processo}</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-center font-bold bg-gray-100 text-sm">
                <td className="border border-gray-300 px-4 py-2">
                  HORAS TOTAIS POR MÃO DE OBRA
                </td>
                <td className="border border-gray-300 px-4 py-2">0</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">0</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
