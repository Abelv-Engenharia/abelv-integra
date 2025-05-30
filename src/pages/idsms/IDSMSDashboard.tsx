
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idsmsService } from "@/services/idsms/idsmsService";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const IDSMSDashboard = () => {
  const { data: dashboardData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['idsms-dashboard'],
    queryFn: idsmsService.getDashboardData,
    refetchOnWindowFocus: false,
  });

  console.log('Dashboard state:', { 
    dashboardData, 
    isLoading, 
    error,
    dataLength: dashboardData?.length 
  });

  const getIndicatorIcon = (value: number) => {
    if (value > 75) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 50) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  const getIndicatorColor = (value: number) => {
    if (value > 75) return "text-green-600";
    if (value < 50) return "text-red-600";
    return "text-yellow-600";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard IDSMS</h1>
        <div className="text-center">
          <p>Carregando dados do dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Erro no dashboard:', error);
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard IDSMS</h1>
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error.message}</p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

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
          <div className="mb-4 text-sm text-gray-600">
            {dashboardData.length} CCA(s) com dados de indicadores IDSMS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.map((cca) => (
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

                    <div className="space-y-2 text-sm">
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
                      <div className="flex justify-between">
                        <span>Insp. Alta Liderança:</span>
                        <span className="font-medium">{cca.inspecao_alta_lideranca.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insp. Gestão SMS:</span>
                        <span className="font-medium">{cca.inspecao_gestao_sms.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
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
          <p className="text-gray-500 mb-4">Nenhum dado encontrado na tabela idsms_indicadores.</p>
          <p className="text-sm text-gray-400 mb-4">Registre indicadores usando os formulários IDSMS para visualizar dados no dashboard.</p>
          <div className="space-y-2 text-xs text-gray-400">
            <p>Debug: Verifique o console do navegador (F12) para mais detalhes sobre a busca de dados.</p>
            <Button 
              onClick={() => {
                console.log('Forçando atualização do dashboard...');
                refetch();
              }} 
              variant="outline" 
              size="sm"
            >
              Forçar Atualização
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDSMSDashboard;
