
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTreinamentosPorProcesso } from "@/services/treinamentosDashboardService";
import { Skeleton } from "@/components/ui/skeleton";

type ProcessoTreinamento = {
  processo: string;
  horasMOD: number;
  totalHoras: number;
  percentualMOD: number;
};

export const TreinamentosPorProcessoTable = () => {
  const [dados, setDados] = useState<ProcessoTreinamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDados = async () => {
      try {
        setLoading(true);
        const data = await fetchTreinamentosPorProcesso();
        setDados(data);
      } catch (error) {
        console.error("Erro ao carregar dados por processo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDados();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Treinamentos por Processo - Efetivo MOD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treinamentos por Processo - Efetivo MOD</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribuição de horas de treinamento por processo para o efetivo MOD
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead className="text-right">Horas MOD</TableHead>
                <TableHead className="text-right">Percentual MOD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.length > 0 ? (
                dados.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.processo}</TableCell>
                    <TableCell className="text-right">
                      {item.horasMOD.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h
                    </TableCell>
                    <TableCell className="text-right">
                      {item.percentualMOD.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    Nenhum registro de treinamento encontrado para o mês atual
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
