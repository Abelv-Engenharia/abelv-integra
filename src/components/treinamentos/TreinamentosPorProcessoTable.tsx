
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchTreinamentosPorProcesso } from "@/services/treinamentos/treinamentosPorProcessoService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface ProcessoData {
  processo: string;
  horasMOD: number;
  totalHoras: number;
  percentualMOD: number;
  percentualMOI: number;
}

interface TreinamentosPorProcessoTableProps {
  filters?: {
    year: string;
    month: string;
    ccaId: string;
  };
}

export const TreinamentosPorProcessoTable: React.FC<TreinamentosPorProcessoTableProps> = ({ filters }) => {
  const [data, setData] = useState<ProcessoData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userCCAIds = userCCAs.map(cca => cca.id);
        const processData = await fetchTreinamentosPorProcesso(userCCAIds, filters);
        setData(processData);
      } catch (error) {
        console.error("Error loading training process data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userCCAs, filters]);

  const totalHorasMOD = data.reduce((sum, item) => sum + item.horasMOD, 0);
  const totalHorasMOI = data.reduce((sum, item) => sum + (item.totalHoras - item.horasMOD), 0);
  const totalHorasGeral = totalHorasMOD + totalHorasMOI;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white bg-primary py-2 rounded">
            TREINAMENTOS POR PROCESSO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-white bg-primary py-2 rounded">
          TREINAMENTOS POR PROCESSO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary text-white hover:bg-primary">
              <TableHead className="text-white text-center font-bold">PROCESSO</TableHead>
              <TableHead className="text-white text-center font-bold">HORAS TREINAMENTO MOD</TableHead>
              <TableHead className="text-white text-center font-bold">PERCENTUAL % MOD</TableHead>
              <TableHead className="text-white text-center font-bold">HORAS TREINAMENTO MOI</TableHead>
              <TableHead className="text-white text-center font-bold">PERCENTUAL % MOI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum dado disponível para o período atual
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data.map((item, index) => {
                  const horasMOI = item.totalHoras - item.horasMOD;
                  
                  return (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <TableCell className="font-medium text-center">{item.processo}</TableCell>
                      <TableCell className="text-center">{Math.round(item.horasMOD)}</TableCell>
                      <TableCell className="text-center">{item.percentualMOD.toFixed(1)}%</TableCell>
                      <TableCell className="text-center">{Math.round(horasMOI)}</TableCell>
                      <TableCell className="text-center">{item.percentualMOI.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-primary text-white font-bold">
                  <TableCell className="text-center">HORAS TOTAIS POR MÃO DE OBRA</TableCell>
                  <TableCell className="text-center">{Math.round(totalHorasMOD)}</TableCell>
                  <TableCell className="text-center">{totalHorasGeral > 0 ? ((totalHorasMOD / totalHorasGeral) * 100).toFixed(1) : 0}%</TableCell>
                  <TableCell className="text-center">{Math.round(totalHorasMOI)}</TableCell>
                  <TableCell className="text-center">{totalHorasGeral > 0 ? ((totalHorasMOI / totalHorasGeral) * 100).toFixed(1) : 0}%</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
