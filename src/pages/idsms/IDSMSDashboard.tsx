
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idsmsService } from "@/services/idsms/idsmsService";
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const IDSMSDashboard = () => {
  // Query para dados do dashboard sem filtros
  const { data: dashboardData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['idsms-dashboard'],
    queryFn: () => idsmsService.getDashboardData({
      cca_id: "all",
      ano: "all",
      mes: "all"
    }),
    refetchOnWindowFocus: false,
  });

  console.log('Dashboard state:', { 
    dashboardData, 
    isLoading, 
    error,
    dataLength: dashboardData?.length
  });

  const getIndicatorIcon = (value: number) => {
    if (value > 100) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 95) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-blue-500" />;
  };

  const getIndicatorColor = (value: number) => {
    if (value > 100) return "text-green-600";
    if (value < 95) return "text-red-600";
    return "text-blue-600";
  };

  const getStatusBadge = (value: number) => {
    if (value > 100) return "bg-green-100 text-green-800";
    if (value < 95) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusLabel = (value: number) => {
    if (value > 100) return 'Excelente';
    if (value >= 95) return 'Bom';
    return 'Atenção - Índice necessita ser melhorado';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard IDSMS</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Erro no dashboard:', error);
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard IDSMS</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={() => refetch()}>Tentar novamente</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const idsmsMedia = dashboardData.length > 0 
    ? dashboardData.reduce((sum, item) => sum + item.idsms_total, 0) / dashboardData.length 
    : 0;

  const statusGeral = getStatusLabel(idsmsMedia);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard IDSMS</h1>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {dashboardData.length > 0 ? (
        <>
          <div className="mb-6 text-sm text-gray-600">
            Exibindo dados de {dashboardData.length} CCA(s) com indicadores IDSMS registrados
          </div>

          {/* Cards resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total de CCAs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.length}</div>
                <p className="text-xs text-gray-500">com dados IDSMS</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">IDSMS Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {idsmsMedia.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500">média geral</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Melhor CCA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...dashboardData.map(item => item.idsms_total)).toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500">maior IDSMS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Status Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getIndicatorColor(idsmsMedia)}`}>
                  {statusGeral.split(' - ')[0]}
                </div>
                <p className="text-xs text-gray-500">baseado no IDSMS médio</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela detalhada */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por CCA</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CCA</TableHead>
                    <TableHead className="text-right">IDSMS Total</TableHead>
                    <TableHead className="text-right">IID</TableHead>
                    <TableHead className="text-right">HSA</TableHead>
                    <TableHead className="text-right">HT</TableHead>
                    <TableHead className="text-right">IPOM</TableHead>
                    <TableHead className="text-right">Insp. Alta Lid.</TableHead>
                    <TableHead className="text-right">Insp. Gestão SMS</TableHead>
                    <TableHead className="text-right">Índice Reativo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData
                    .sort((a, b) => b.idsms_total - a.idsms_total)
                    .map((cca) => (
                    <TableRow key={cca.cca_id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{cca.cca_codigo}</div>
                          <div className="text-sm text-gray-500">{cca.cca_nome}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold text-lg ${getIndicatorColor(cca.idsms_total)}`}>
                          {cca.idsms_total.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{cca.iid.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{cca.hsa.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{cca.ht.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{cca.ipom.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{cca.inspecao_alta_lideranca.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{cca.inspecao_gestao_sms.toFixed(1)}%</TableCell>
                      <TableCell className="text-right text-red-600">{cca.indice_reativo.toFixed(1)}%</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(cca.idsms_total)}`}>
                          {getIndicatorIcon(cca.idsms_total)}
                          <span className="ml-1">
                            {getStatusLabel(cca.idsms_total).split(' - ')[0]}
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Cards individuais para visão mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 lg:hidden">
            {dashboardData
              .sort((a, b) => b.idsms_total - a.idsms_total)
              .map((cca) => (
              <Card key={cca.cca_id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{cca.cca_codigo} - {cca.cca_nome}</span>
                    {getIndicatorIcon(cca.idsms_total)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getIndicatorColor(cca.idsms_total)}`}>
                        {cca.idsms_total.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">IDSMS Total</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>IID:</span>
                        <span className="font-medium">{cca.iid.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HSA:</span>
                        <span className="font-medium">{cca.hsa.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HT:</span>
                        <span className="font-medium">{cca.ht.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IPOM:</span>
                        <span className="font-medium">{cca.ipom.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span>Insp. Alta Lid.:</span>
                        <span className="font-medium">{cca.inspecao_alta_lideranca.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span>Insp. Gestão SMS:</span>
                        <span className="font-medium">{cca.inspecao_gestao_sms.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span>Índice Reativo:</span>
                        <span className="font-medium text-red-600">{cca.indice_reativo.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
              <p className="text-gray-600 mb-4">
                Não foram encontrados indicadores IDSMS registrados na base de dados.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Registre indicadores usando os formulários IDSMS para visualizar dados no dashboard.
              </p>
              <Button 
                onClick={() => {
                  console.log('Forçando atualização do dashboard...');
                  refetch();
                }} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IDSMSDashboard;
