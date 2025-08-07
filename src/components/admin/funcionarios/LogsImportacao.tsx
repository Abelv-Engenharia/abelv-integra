
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, User, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LogImportacao {
  id: string;
  data_importacao: string;
  total_registros: number;
  registros_criados: number;
  registros_atualizados: number;
  registros_com_erro: number;
  status: string;
  detalhes_erro?: string;
  nome_arquivo?: string;
  usuario_id: string;
  created_at: string;
}

const fetchLogsImportacao = async (): Promise<LogImportacao[]> => {
  const { data, error } = await supabase
    .from('logs_importacao_funcionarios')
    .select('*')
    .order('data_importacao', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Erro ao buscar logs de importação:', error);
    throw error;
  }

  return data || [];
};

export const LogsImportacao = () => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['logs-importacao-funcionarios'],
    queryFn: fetchLogsImportacao,
  });

  const getStatusBadge = (status: string, registros_com_erro: number) => {
    if (status === 'erro') {
      return <Badge variant="destructive">Erro</Badge>;
    }
    if (registros_com_erro > 0) {
      return <Badge variant="secondary">Concluída com erros</Badge>;
    }
    return <Badge variant="default">Concluída</Badge>;
  };

  const getStatusIcon = (status: string, registros_com_erro: number) => {
    if (status === 'erro') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (registros_com_erro > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            Carregando logs de importação...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle className="h-6 w-6 mr-2" />
            Erro ao carregar logs de importação
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Histórico de Importações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma importação realizada ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Criados</TableHead>
                  <TableHead className="text-center">Atualizados</TableHead>
                  <TableHead className="text-center">Erros</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(log.data_importacao), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(log.data_importacao), 'HH:mm:ss', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {log.usuario_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {log.nome_arquivo || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{log.total_registros}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-green-600">
                        {log.registros_criados}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-blue-600">
                        {log.registros_atualizados}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-red-600">
                        {log.registros_com_erro}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status, log.registros_com_erro)}
                        {getStatusBadge(log.status, log.registros_com_erro)}
                      </div>
                      {log.detalhes_erro && (
                        <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                          {log.detalhes_erro}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
