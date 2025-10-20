import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FuelReportImportComponent } from "@/components/gestao-pessoas/fuel/FuelReportImportComponent";
import { FuelDataTable } from "@/components/gestao-pessoas/fuel/FuelDataTable";
import { FuelFilters } from "@/components/gestao-pessoas/fuel/FuelFilters";
import { PlateSearchComponent } from "@/components/gestao-pessoas/fuel/PlateSearchComponent";
import { ExportButtons } from "@/components/gestao-pessoas/fuel/ExportButtons";
import { FuelStats } from "@/components/gestao-pessoas/fuel/FuelStats";
import { DashboardTab } from "@/components/gestao-pessoas/fuel/DashboardTab";
import { MapaMOITab } from "@/components/gestao-pessoas/fuel/MapaMOITab";
import { ProcessamentoTab } from "@/components/gestao-pessoas/fuel/ProcessamentoTab";
import { 
  FuelTransaction, 
  FuelFilters as FuelFiltersType,
  MapaMOI,
  ProcessamentoQuinzenal,
  DashboardData
} from "@/types/gestao-pessoas/fuel";

const ControleAbastecimento = () => {
  const [fuelData, setFuelData] = useState<FuelTransaction[]>([]);
  const [filters, setFilters] = useState<FuelFiltersType>({});
  const [plateSearch, setPlateSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estados do sistema quinzenal
  const [mapaMOI, setMapaMOI] = useState<MapaMOI | null>(null);
  const [primeiraQuinzena, setPrimeiraQuinzena] = useState<ProcessamentoQuinzenal | null>(null);
  const [segundaQuinzena, setSegundaQuinzena] = useState<ProcessamentoQuinzenal | null>(null);
  const [historicoMOI, setHistoricoMOI] = useState<MapaMOI[]>([]);

  const filteredData = useMemo(() => {
    let filtered = [...fuelData];

    // Filtro por placa
    if (plateSearch) {
      filtered = filtered.filter(item => 
        item.placa.toLowerCase().includes(plateSearch.toLowerCase())
      );
    }

    // Outros filtros
    if (filters.motorista) {
      filtered = filtered.filter(item => item.motorista === filters.motorista);
    }
    if (filters.centro_custo) {
      filtered = filtered.filter(item => item.centro_custo === filters.centro_custo);
    }
    if (filters.tipo_mercadoria) {
      filtered = filtered.filter(item => item.tipo_mercadoria === filters.tipo_mercadoria);
    }
    if (filters.cidade_ec) {
      filtered = filtered.filter(item => item.cidade_ec === filters.cidade_ec);
    }
    if (filters.uf_ec) {
      filtered = filtered.filter(item => item.uf_ec === filters.uf_ec);
    }

    // Filtro por período
    if (filters.data_inicial && filters.data_final) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data_hora_transacao);
        return itemDate >= filters.data_inicial! && itemDate <= filters.data_final!;
      });
    }

    return filtered;
  }, [fuelData, filters, plateSearch]);

  const handleImportData = (newData: FuelTransaction[]) => {
    setFuelData(prev => [...prev, ...newData]);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPlateSearch("");
  };

  const handleMapaMOIChange = (novoMapa: MapaMOI) => {
    if (mapaMOI) {
      // Arquivar o MOI anterior
      const moiArquivado = { ...mapaMOI, status: 'Arquivado' as const };
      setHistoricoMOI(prev => [...prev, moiArquivado]);
    }
    setMapaMOI(novoMapa);
  };

  const handleProcessamentoChange = (periodo: '1ª quinzena' | '2ª quinzena', processamento: ProcessamentoQuinzenal) => {
    if (periodo === '1ª quinzena') {
      setPrimeiraQuinzena(processamento);
      // Atualizar fuelData com as transações da primeira quinzena
      setFuelData(prev => [...prev, ...processamento.transacoes]);
    } else {
      setSegundaQuinzena(processamento);
      // Atualizar fuelData com as transações da segunda quinzena
      setFuelData(prev => [...prev, ...processamento.transacoes]);
    }
  };

  // Dados para o dashboard
  const dashboardData: DashboardData = useMemo(() => {
    const alertas: string[] = [];
    
    if (!mapaMOI) {
      alertas.push("Mapa MOI do mês atual não foi carregado");
    }
    
    if (mapaMOI && !primeiraQuinzena) {
      alertas.push("Primeira quinzena ainda não processada");
    }
    
    if (primeiraQuinzena && !segundaQuinzena) {
      alertas.push("Segunda quinzena ainda não processada");
    }

    return {
      moi_atual: mapaMOI,
      primeira_quinzena: primeiraQuinzena,
      segunda_quinzena: segundaQuinzena,
      mes_completo: !!(primeiraQuinzena && segundaQuinzena),
      alertas
    };
  }, [mapaMOI, primeiraQuinzena, segundaQuinzena]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Controle de Abastecimento</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="mapa-moi">Mapa MOI</TabsTrigger>
          <TabsTrigger value="processamento">Processamento</TabsTrigger>
          <TabsTrigger value="primeira-quinzena">1ª Quinzena</TabsTrigger>
          <TabsTrigger value="segunda-quinzena">2ª Quinzena</TabsTrigger>
          <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <DashboardTab dashboardData={dashboardData} />
        </TabsContent>

        <TabsContent value="mapa-moi" className="space-y-4">
          <MapaMOITab
            mapaMOI={mapaMOI}
            onMapaMOIChange={handleMapaMOIChange}
            historico={historicoMOI}
          />
        </TabsContent>

        <TabsContent value="processamento" className="space-y-4">
          <ProcessamentoTab
            mapaMOI={mapaMOI}
            primeira_quinzena={primeiraQuinzena}
            segunda_quinzena={segundaQuinzena}
            onProcessamentoChange={handleProcessamentoChange}
          />
        </TabsContent>

        <TabsContent value="primeira-quinzena" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>1ª Quinzena - Transações Processadas</CardTitle>
            </CardHeader>
            <CardContent>
              {primeiraQuinzena ? (
                <div className="space-y-4">
                  <FuelStats data={primeiraQuinzena.transacoes} />
                  <div className="border rounded-lg">
                    <FuelDataTable 
                      data={primeiraQuinzena.transacoes}
                      loading={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Primeira quinzena ainda não processada
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segunda-quinzena" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2ª Quinzena - Transações Processadas</CardTitle>
            </CardHeader>
            <CardContent>
              {segundaQuinzena ? (
                <div className="space-y-4">
                  <FuelStats data={segundaQuinzena.transacoes} />
                  <div className="border rounded-lg">
                    <FuelDataTable 
                      data={segundaQuinzena.transacoes}
                      loading={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Segunda quinzena ainda não processada
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consolidado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consolidado Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.mes_completo ? (
                <div className="space-y-4">
                  <FuelStats data={filteredData} />
                  
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/10 rounded-lg">
                    <FuelFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      data={fuelData}
                      onReset={handleResetFilters}
                    />
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <PlateSearchComponent
                      value={plateSearch}
                      onChange={setPlateSearch}
                    />
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <ExportButtons
                      data={filteredData}
                      filters={filters}
                      plateSearch={plateSearch}
                    />
                  </div>

                  <div className="border rounded-lg">
                    <FuelDataTable 
                      data={filteredData}
                      loading={loading}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aguardando processamento de ambas as quinzenas para consolidação
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Especializados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Conferência MOI</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Motoristas com divisão no período
                  </p>
                  <ExportButtons
                    data={mapaMOI?.motoristas.map(m => ({ 
                      motorista: m.motorista, 
                      divisao_ccas: m.divisao_ccas.map(d => `${d.cca}: ${d.percentual}%`).join(', ')
                    } as any)) || []}
                    filters={{}}
                    plateSearch=""
                  />
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Rateio Contábil</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Distribuição final por CCA
                  </p>
                  <ExportButtons
                    data={filteredData}
                    filters={filters}
                    plateSearch={plateSearch}
                  />
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Auditoria</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rastreamento completo
                  </p>
                  <ExportButtons
                    data={filteredData}
                    filters={filters}
                    plateSearch={plateSearch}
                  />
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControleAbastecimento;