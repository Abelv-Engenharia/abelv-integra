import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import OcorrenciasSummaryCards from "@/components/ocorrencias/OcorrenciasSummaryCards";
import OcorrenciasByTipoColumnChart from "@/components/ocorrencias/OcorrenciasByTipoColumnChart";
import OcorrenciasByEmpresaChart from "@/components/ocorrencias/OcorrenciasByEmpresaChart";
import OcorrenciasTimelineChart from "@/components/ocorrencias/OcorrenciasTimelineChart";
import TaxaFrequenciaChart from "@/components/ocorrencias/TaxaFrequenciaChart";
import TaxaFrequenciaAcCpdChart from "@/components/ocorrencias/TaxaFrequenciaAcCpdChart";
import TaxaFrequenciaAcSpdChart from "@/components/ocorrencias/TaxaFrequenciaAcSpdChart";
import TaxaGravidadeChart from "@/components/ocorrencias/TaxaGravidadeChart";
import OcorrenciasTable from "@/components/ocorrencias/OcorrenciasTable";
import { OcorrenciasFiltros } from "@/components/ocorrencias/OcorrenciasFiltros";

const OcorrenciasDashboard = () => {
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Ocorrências</h2>
        <OcorrenciasFiltros onFilter={() => setFiltroAtivo(true)} />
      </div>
      
      {filtroAtivo && (
        <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
          <p className="text-sm text-muted-foreground">
            Filtros aplicados - <button className="text-primary underline" onClick={() => setFiltroAtivo(false)}>Limpar filtros</button>
          </p>
        </div>
      )}

      <OcorrenciasSummaryCards />

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="table">Ocorrências Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ocorrências por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <OcorrenciasByTipoColumnChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ocorrências por Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <OcorrenciasByEmpresaChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Frequência AC CPD</CardTitle>
              </CardHeader>
              <CardContent>
                <TaxaFrequenciaAcCpdChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Frequência AC SPD</CardTitle>
              </CardHeader>
              <CardContent>
                <TaxaFrequenciaAcSpdChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Gravidade</CardTitle>
              </CardHeader>
              <CardContent>
                <TaxaGravidadeChart />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent>
              <OcorrenciasTimelineChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <OcorrenciasTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OcorrenciasDashboard;
