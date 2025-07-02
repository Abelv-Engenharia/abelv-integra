
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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface TabelaTreinamentosNormativosVencidosProps {
  filters?: {
    year?: number;
    month?: number;
    ccaId?: number;
  };
}

const TabelaTreinamentosNormativosVencidos = ({ filters }: TabelaTreinamentosNormativosVencidosProps) => {
  const { data: userCCAs = [] } = useUserCCAs();
  const userCCAIds = userCCAs.map(cca => cca.id);
  
  // Aplicar filtros de CCA se especificado
  const filteredCCAIds = filters?.ccaId ? [filters.ccaId] : userCCAIds;

  const { data: treinamentosVencidos = [], isLoading } = useQuery({
    queryKey: ['treinamentos-normativos-vencidos', filteredCCAIds, filters],
    queryFn: async () => {
      if (filteredCCAIds.length === 0) return [];

      // Buscar funcionários dos CCAs permitidos
      const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id, nome, ccas!inner(codigo, nome)')
        .in('cca_id', filteredCCAIds)
        .eq('ativo', true);

      if (!funcionarios || funcionarios.length === 0) return [];

      const funcionarioIds = funcionarios.map(f => f.id);

      // Buscar treinamentos vencidos
      const { data: treinamentos } = await supabase
        .from('treinamentos_normativos')
        .select(`
          id,
          funcionario_id,
          data_validade,
          status,
          treinamentos!inner(nome)
        `)
        .in('funcionario_id', funcionarioIds)
        .eq('arquivado', false)
        .in('status', ['Vencido', 'Próximo ao vencimento'])
        .order('data_validade', { ascending: true })
        .limit(10);

      if (!treinamentos) return [];

      // Combinar dados
      return treinamentos.map(treinamento => {
        const funcionario = funcionarios.find(f => f.id === treinamento.funcionario_id);
        return {
          id: treinamento.id,
          funcionario: funcionario?.nome || 'N/A',
          cca: funcionario?.ccas?.codigo || 'N/A',
          treinamento: treinamento.treinamentos?.nome || 'N/A',
          dataValidade: treinamento.data_validade,
          status: treinamento.status,
        };
      });
    },
    enabled: filteredCCAIds.length > 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vencido':
        return 'bg-red-100 text-red-800';
      case 'Próximo ao vencimento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Treinamentos Normativos Vencidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treinamentos Normativos Vencidos</CardTitle>
      </CardHeader>
      <CardContent>
        {treinamentosVencidos.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhum treinamento vencido encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Treinamento</TableHead>
                <TableHead>Data Validade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treinamentosVencidos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.funcionario}</TableCell>
                  <TableCell>{item.cca}</TableCell>
                  <TableCell>{item.treinamento}</TableCell>
                  <TableCell>{formatDate(item.dataValidade)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export { TabelaTreinamentosNormativosVencidos };
