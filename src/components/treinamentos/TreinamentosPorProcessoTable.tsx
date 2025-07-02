
import React from "react";
import { useQuery } from "@tanstack/react-query";
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

interface TreinamentosPorProcessoTableProps {
  filters?: {
    year?: number;
    month?: number;
    ccaId?: number;
  };
}

const TreinamentosPorProcessoTable = ({ filters }: TreinamentosPorProcessoTableProps) => {
  const { data: userCCAs = [] } = useUserCCAs();
  const userCCAIds = userCCAs.map(cca => cca.id);
  
  // Aplicar filtros de CCA se especificado
  const filteredCCAIds = filters?.ccaId ? [filters.ccaId] : userCCAIds;

  const { data: treinamentosPorProcesso = [] } = useQuery({
    queryKey: ['treinamentos-por-processo', filteredCCAIds, filters],
    queryFn: () => fetchTreinamentosPorProcesso(filteredCCAIds),
    enabled: filteredCCAIds.length > 0,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treinamentos por Processo</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Processo</TableHead>
              <TableHead className="text-right">Horas MOD</TableHead>
              <TableHead className="text-right">Total Horas</TableHead>
              <TableHead className="text-right">% MOD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treinamentosPorProcesso.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.processo}</TableCell>
                <TableCell className="text-right">{item.horasMOD.toFixed(1)}</TableCell>
                <TableCell className="text-right">{item.totalHoras.toFixed(1)}</TableCell>
                <TableCell className="text-right">{item.percentualMOD.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TreinamentosPorProcessoTable;
