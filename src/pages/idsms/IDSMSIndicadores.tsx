import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idsmsService } from "@/services/idsms/idsmsService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, AlertCircle, FileText, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditIndicadorDialog } from "@/components/idsms/EditIndicadorDialog";
import { IDSMSIndicador } from "@/types/treinamentos";

const IDSMSIndicadores = () => {
  const [selectedCCA, setSelectedCCA] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [editingIndicador, setEditingIndicador] = useState<IDSMSIndicador | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: filterOptions = { ccas: [], anos: [], meses: [] } } = useQuery({
    queryKey: ['idsms-filter-options'],
    queryFn: idsmsService.getFilterOptions,
    refetchOnWindowFocus: false,
  });

  const { data: indicadores = [], isLoading, refetch, error } = useQuery({
    queryKey: ['idsms-all-indicadores', selectedCCA, selectedYear, selectedMonth],
    queryFn: () => idsmsService.getAllIndicadores({
      cca_id: selectedCCA,
      ano: selectedYear,
      mes: selectedMonth
    }),
    refetchOnWindowFocus: false,
  });

  const mesesNomes = {
    1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
    5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
    9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
  };

  const tipoNomes = {
    'IID': 'IID',
    'HSA': 'HSA', 
    'HT': 'HT',
    'IPOM': 'IPOM',
    'INSPECAO_ALTA_LIDERANCA': 'Inspeção Alta Liderança',
    'INSPECAO_GESTAO_SMS': 'Inspeção Gestão SMS',
    'INDICE_REATIVO': 'Índice Reativo'
  };

  // Filtrar dados localmente se necessário
  const filteredIndicadores = indicadores.filter(indicador => {
    if (selectedCCA !== "all" && indicador.cca_id.toString() !== selectedCCA) return false;
    if (selectedYear !== "all" && indicador.ano.toString() !== selectedYear) return false;
    if (selectedMonth !== "all" && indicador.mes.toString() !== selectedMonth) return false;
    return true;
  });

  // Agrupar por mês/ano para exibição
  const indicadoresPorPeriodo = filteredIndicadores.reduce((acc, indicador) => {
    const key = `${indicador.ano}-${indicador.mes.toString().padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(indicador);
    return acc;
  }, {} as Record<string, typeof filteredIndicadores>);

  const getIndicatorBadge = (tipo: string) => {
    const colors = {
      'IID': 'bg-blue-100 text-blue-800',
      'HSA': 'bg-green-100 text-green-800',
      'HT': 'bg-purple-100 text-purple-800',
      'IPOM': 'bg-orange-100 text-orange-800',
      'INSPECAO_ALTA_LIDERANCA': 'bg-indigo-100 text-indigo-800',
      'INSPECAO_GESTAO_SMS': 'bg-cyan-100 text-cyan-800',
      'INDICE_REATIVO': 'bg-red-100 text-red-800'
    };
    
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEditIndicador = (indicador: IDSMSIndicador) => {
    setEditingIndicador(indicador);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingIndicador(null);
    setIsEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Indicadores IDSMS Registrados</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando indicadores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Indicadores IDSMS Registrados</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
              <p className="text-gray-600 mb-4">Não foi possível carregar os indicadores</p>
              <Button onClick={() => refetch()}>Tentar novamente</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Indicadores IDSMS Registrados</h1>
          <p className="text-muted-foreground">
            Visualize todos os indicadores IDSMS registrados por período
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
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
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CCA</label>
              <Select value={selectedCCA} onValueChange={setSelectedCCA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  {filterOptions.ccas.map(cca => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {filterOptions.anos.map(ano => (
                    <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  {filterOptions.meses.map(mes => (
                    <SelectItem key={mes} value={mes.toString()}>
                      {mesesNomes[mes as keyof typeof mesesNomes]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Filtros aplicados: 
            {selectedCCA !== "all" && ` CCA: ${filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.codigo}`}
            {selectedYear !== "all" && ` | Ano: ${selectedYear}`}
            {selectedMonth !== "all" && ` | Mês: ${mesesNomes[parseInt(selectedMonth) as keyof typeof mesesNomes]}`}
            {selectedCCA === "all" && selectedYear === "all" && selectedMonth === "all" && " Nenhum filtro aplicado"}
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredIndicadores.length}</div>
            <p className="text-xs text-gray-500">indicadores registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Períodos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(indicadoresPorPeriodo).length}</div>
            <p className="text-xs text-gray-500">meses com dados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Índices Reativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredIndicadores.filter(ind => ind.tipo === 'INDICE_REATIVO').length}
            </div>
            <p className="text-xs text-gray-500">registros reativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CCAs Distintos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredIndicadores.map(ind => ind.cca_id)).size}
            </div>
            <p className="text-xs text-gray-500">CCAs com dados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Indicadores */}
      {filteredIndicadores.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Indicadores por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(indicadoresPorPeriodo)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([periodo, indicadoresDoPeriodo]) => {
                  const [ano, mes] = periodo.split('-');
                  const mesNome = mesesNomes[parseInt(mes) as keyof typeof mesesNomes];
                  
                  return (
                    <div key={periodo} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {mesNome} de {ano}
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data</TableHead>
                              <TableHead>CCA</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead className="text-right">Resultado (%)</TableHead>
                              <TableHead>Motivo</TableHead>
                              <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {indicadoresDoPeriodo
                              .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                              .map((indicador) => {
                                const cca = filterOptions.ccas.find(c => c.id === indicador.cca_id);
                                
                                return (
                                  <TableRow key={indicador.id}>
                                    <TableCell>
                                      {format(new Date(indicador.data), "dd/MM/yyyy", { locale: ptBR })}
                                    </TableCell>
                                    <TableCell>
                                      <div>
                                        <div className="font-medium">{cca?.codigo || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{cca?.nome || 'CCA não encontrado'}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndicatorBadge(indicador.tipo)}`}>
                                        {tipoNomes[indicador.tipo as keyof typeof tipoNomes] || indicador.tipo}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <span className={`font-medium ${indicador.tipo === 'INDICE_REATIVO' ? 'text-red-600' : 'text-gray-900'}`}>
                                        {Number(indicador.resultado).toFixed(1)}%
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      {indicador.motivo ? (
                                        <div className="max-w-xs">
                                          <p className="text-sm text-gray-600 truncate" title={indicador.motivo}>
                                            {indicador.motivo}
                                          </p>
                                        </div>
                                      ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditIndicador(indicador)}
                                        className="flex items-center gap-1"
                                      >
                                        <Edit className="h-4 w-4" />
                                        Editar
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum indicador encontrado</h3>
              <p className="text-gray-600 mb-4">
                Não foram encontrados indicadores IDSMS para os filtros selecionados.
              </p>
              <Button 
                onClick={() => refetch()} 
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

      {/* Dialog de Edição */}
      {editingIndicador && (
        <EditIndicadorDialog
          indicador={editingIndicador}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
          ccas={filterOptions.ccas}
        />
      )}
    </div>
  );
};

export default IDSMSIndicadores;
