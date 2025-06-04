import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idsmsService } from "@/services/idsms/idsmsService";
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

const IDSMSDashboard = () => {
  const [selectedCCAs, setSelectedCCAs] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Query para dados do dashboard com filtros
  const { data: dashboardData = [], isLoading, refetch, error } = useQuery({
    queryKey: ['idsms-dashboard', selectedCCAs, selectedYears, selectedMonths],
    queryFn: () => {
      // Converter arrays para string ou "all" se vazio
      const ccaFilter = selectedCCAs.length > 0 ? selectedCCAs.join(',') : "all";
      const yearFilter = selectedYears.length > 0 ? selectedYears.join(',') : "all";
      const monthFilter = selectedMonths.length > 0 ? selectedMonths.join(',') : "all";
      
      return idsmsService.getDashboardData({
        cca_id: ccaFilter,
        ano: yearFilter,
        mes: monthFilter
      });
    },
    refetchOnWindowFocus: false,
  });

  const { data: filterOptions, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['idsms-filter-options'],
    queryFn: idsmsService.getFilterOptions,
    refetchOnWindowFocus: false,
  });

  console.log('Dashboard state:', { 
    dashboardData, 
    isLoading, 
    error,
    dataLength: dashboardData?.length,
    filterOptions,
    isLoadingFilters,
    filters: { selectedCCAs, selectedYears, selectedMonths }
  });

  // Dados já filtrados no backend
  const filteredData = dashboardData;

  // Verificar se os dados estão prontos para renderizar
  const filtersDataReady = !isLoadingFilters && 
    filterOptions && 
    filterOptions.ccas && 
    Array.isArray(filterOptions.ccas) &&
    filterOptions.anos && 
    Array.isArray(filterOptions.anos) &&
    filterOptions.meses && 
    Array.isArray(filterOptions.meses);

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

  const mesesNomes = {
    1: 'Janeiro',
    2: 'Fevereiro', 
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro'
  };

  const handleCCASelection = (ccaId: string, checked: boolean) => {
    if (checked) {
      setSelectedCCAs(prev => [...prev, ccaId]);
    } else {
      setSelectedCCAs(prev => prev.filter(id => id !== ccaId));
    }
  };

  const handleYearSelection = (year: string, checked: boolean) => {
    if (checked) {
      setSelectedYears(prev => [...prev, year]);
    } else {
      setSelectedYears(prev => prev.filter(y => y !== year));
    }
  };

  const handleMonthSelection = (month: string, checked: boolean) => {
    if (checked) {
      setSelectedMonths(prev => [...prev, month]);
    } else {
      setSelectedMonths(prev => prev.filter(m => m !== month));
    }
  };

  const clearAllFilters = () => {
    setSelectedCCAs([]);
    setSelectedYears([]);
    setSelectedMonths([]);
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

  // Calcular estatísticas para os novos cards
  const idsmsMedia = filteredData.length > 0 
    ? filteredData.reduce((sum, item) => sum + item.idsms_total, 0) / filteredData.length 
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

      {/* Filtros com Seleção Múltipla */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          {!filtersDataReady ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Carregando filtros...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro CCAs */}
                <div>
                  <label className="block text-sm font-medium mb-2">CCAs</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {selectedCCAs.length > 0 
                          ? `${selectedCCAs.length} CCA(s) selecionado(s)`
                          : "Selecionar CCAs"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <Command>
                        <CommandInput placeholder="Buscar CCAs..." />
                        <CommandEmpty>Nenhum CCA encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {filterOptions.ccas.map(cca => (
                            <CommandItem key={cca.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedCCAs.includes(cca.id.toString())}
                                onCheckedChange={(checked) => 
                                  handleCCASelection(cca.id.toString(), checked as boolean)
                                }
                              />
                              <span>{cca.codigo} - {cca.nome}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Filtro Anos */}
                <div>
                  <label className="block text-sm font-medium mb-2">Anos</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {selectedYears.length > 0 
                          ? `${selectedYears.length} ano(s) selecionado(s)`
                          : "Selecionar anos"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <Command>
                        <CommandInput placeholder="Buscar anos..." />
                        <CommandEmpty>Nenhum ano encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {filterOptions.anos.map(ano => (
                            <CommandItem key={ano} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedYears.includes(ano.toString())}
                                onCheckedChange={(checked) => 
                                  handleYearSelection(ano.toString(), checked as boolean)
                                }
                              />
                              <span>{ano}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Filtro Meses */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meses</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {selectedMonths.length > 0 
                          ? `${selectedMonths.length} mês(es) selecionado(s)`
                          : "Selecionar meses"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <Command>
                        <CommandInput placeholder="Buscar meses..." />
                        <CommandEmpty>Nenhum mês encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {filterOptions.meses.map(mes => (
                            <CommandItem key={mes} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedMonths.includes(mes.toString())}
                                onCheckedChange={(checked) => 
                                  handleMonthSelection(mes.toString(), checked as boolean)
                                }
                              />
                              <span>{mesesNomes[mes as keyof typeof mesesNomes]}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Filtros aplicados e botão limpar */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Filtros aplicados: 
                  {selectedCCAs.length > 0 && ` CCAs: ${selectedCCAs.length} selecionado(s)`}
                  {selectedYears.length > 0 && ` | Anos: ${selectedYears.length} selecionado(s)`}
                  {selectedMonths.length > 0 && ` | Meses: ${selectedMonths.length} selecionado(s)`}
                  {selectedCCAs.length === 0 && selectedYears.length === 0 && selectedMonths.length === 0 && " Nenhum filtro aplicado"}
                </div>
                {(selectedCCAs.length > 0 || selectedYears.length > 0 || selectedMonths.length > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFilters}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {filteredData.length > 0 ? (
        <>
          <div className="mb-6 text-sm text-gray-600">
            Exibindo dados de {filteredData.length} CCA(s) com indicadores IDSMS registrados
          </div>

          {/* Cards resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total de CCAs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.length}</div>
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
                  {Math.max(...filteredData.map(item => item.idsms_total)).toFixed(1)}%
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
                  {filteredData
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
            {filteredData
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
                {selectedCCAs.length > 0 || selectedYears.length > 0 || selectedMonths.length > 0
                  ? "Não foram encontrados indicadores IDSMS para os filtros selecionados."
                  : "Não foram encontrados indicadores IDSMS registrados na base de dados."
                }
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
