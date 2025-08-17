import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface para o log de importação HSA
interface LogImportacaoHSA {
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

// Função para buscar logs de importação HSA
const fetchLogsImportacaoHSA = async (): Promise<LogImportacaoHSA[]> => {
  const { data, error } = await supabase
    .from('logs_importacao_hsa' as any)
    .select(`
      id,
      data_importacao,
      total_registros,
      registros_criados,
      registros_atualizados,
      registros_com_erro,
      status,
      detalhes_erro,
      nome_arquivo,
      usuario_id,
      created_at
    `)
    .order('data_importacao', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Erro ao buscar logs de importação HSA:', error);
    throw error;
  }

  return (data as any) || [];
};

export const LogsImportacaoHSA = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['logs-importacao-hsa'],
    queryFn: fetchLogsImportacaoHSA,
  });

  const getStatusBadge = (status: string, registrosComErro: number) => {
    if (status === 'erro') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Erro</Badge>;
    }
    if (registrosComErro > 0) {
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Parcial</Badge>;
    }
    return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Sucesso</Badge>;
  };

  const getStatusIcon = (status: string, registrosComErro: number) => {
    if (status === 'erro') {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    if (registrosComErro > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Importações HSA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Importações HSA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            Erro ao carregar histórico de importações
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
          Histórico de Importações HSA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!logs || logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma importação realizada ainda
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data/Hora</th>
                    <th className="text-left p-2">Usuário</th>
                    <th className="text-left p-2">Arquivo</th>
                    <th className="text-center p-2">Total</th>
                    <th className="text-center p-2">Criados</th>
                    <th className="text-center p-2">Atualizados</th>
                    <th className="text-center p-2">Erros</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status, log.registros_com_erro)}
                          <div>
                            <div className="font-medium">
                              {format(new Date(log.data_importacao), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(log.data_importacao), "HH:mm:ss", { locale: ptBR })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs text-muted-foreground">
                          {log.usuario_id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs">
                          {log.nome_arquivo || 'N/A'}
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline">{log.total_registros}</Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="secondary">{log.registros_criados}</Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="secondary">{log.registros_atualizados}</Badge>
                      </td>
                      <td className="text-center p-2">
                        {log.registros_com_erro > 0 ? (
                          <Badge variant="destructive">{log.registros_com_erro}</Badge>
                        ) : (
                          <Badge variant="outline">0</Badge>
                        )}
                      </td>
                      <td className="text-center p-2">
                        {getStatusBadge(log.status, log.registros_com_erro)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};