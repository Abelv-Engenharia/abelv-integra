import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AlertasMedicaoAluguel() {
  const [ccaFiltro, setCcaFiltro] = useState<string>("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  
  // Buscar CCAs
  const { data: ccas } = useQuery({
    queryKey: ["nydhus_ccas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nydhus_ccas")
        .select("codigo, nome")
        .eq("ativo", true)
        .order("codigo");
      if (error) throw error;
      return data;
    },
  });

  // Buscar alertas
  const { data: alertas, isLoading } = useQuery({
    queryKey: ["alertas_medicao_aluguel", ccaFiltro, statusFiltro],
    queryFn: async () => {
      let query = supabase
        .from("alertas_medicao_aluguel")
        .select(`
          *,
          contratos_alojamento (
            codigo,
            nome,
            proprietario
          )
        `)
        .order("data_referencia", { ascending: false });

      if (ccaFiltro) {
        query = query.eq("cca_codigo", ccaFiltro);
      }
      
      if (statusFiltro) {
        query = query.eq("status", statusFiltro);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'realizado':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'atrasado':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pendente: 'bg-orange-100 text-orange-700',
      realizado: 'bg-green-100 text-green-700',
      atrasado: 'bg-red-100 text-red-700',
    };

    return (
      <Badge className={variants[status] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const resumo = {
    total: alertas?.length || 0,
    pendentes: alertas?.filter(a => a.status === 'pendente').length || 0,
    realizados: alertas?.filter(a => a.status === 'realizado').length || 0,
    atrasados: alertas?.filter(a => a.status === 'atrasado').length || 0,
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas de Medição - Aluguel</h1>
          <p className="text-muted-foreground">Controle mensal de medições de aluguel</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.pendentes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realizados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.realizados}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumo.atrasados}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={ccaFiltro} onValueChange={setCcaFiltro}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os CCAs</SelectItem>
                  {ccas?.map((cca) => (
                    <SelectItem key={cca.codigo} value={cca.codigo}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Alertas */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Medição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CCA</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Data Referência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Medição</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Carregando alertas...
                      </TableCell>
                    </TableRow>
                  ) : alertas?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum alerta encontrado com os filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    alertas?.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell className="font-medium">{alerta.cca_codigo}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{alerta.contratos_alojamento?.codigo}</div>
                            <div className="text-sm text-muted-foreground">
                              {alerta.contratos_alojamento?.nome}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {format(new Date(alerta.competencia + '-01'), 'MMM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(alerta.data_referencia), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(alerta.status)}
                            {getStatusBadge(alerta.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {alerta.data_medicao 
                            ? format(new Date(alerta.data_medicao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
