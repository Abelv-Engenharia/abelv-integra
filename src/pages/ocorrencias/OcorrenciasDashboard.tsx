
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OcorrenciasSummaryCards from "@/components/ocorrencias/OcorrenciasSummaryCards";
import OcorrenciasByTipoChart from "@/components/ocorrencias/OcorrenciasByTipoChart";
import OcorrenciasByEmpresaChart from "@/components/ocorrencias/OcorrenciasByEmpresaChart";
import OcorrenciasTimelineChart from "@/components/ocorrencias/OcorrenciasTimelineChart";
import TaxaFrequenciaAcCpdChart from "@/components/ocorrencias/TaxaFrequenciaAcCpdChart";
import TaxaFrequenciaAcSpdChart from "@/components/ocorrencias/TaxaFrequenciaAcSpdChart";
import TaxaGravidadeChart from "@/components/ocorrencias/TaxaGravidadeChart";
import OcorrenciasSimpleFilters from "@/components/ocorrencias/OcorrenciasSimpleFilters";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { OcorrenciasFilterProvider, useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const OcorrenciasDashboardContent = () => {
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId, clearFilters } = useOcorrenciasFilter();
  
  const hasActiveFilters = year !== 'todos' || month !== 'todos' || ccaId !== 'todos';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Ocorrências</h2>
        {userCCAs.length > 0 && <OcorrenciasSimpleFilters />}
      </div>
      
      {hasActiveFilters && (
        <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
          <p className="text-sm text-muted-foreground">
            Filtros aplicados - <button className="text-primary underline" onClick={clearFilters}>Limpar filtros</button>
          </p>
        </div>
      )}

      {userCCAs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-yellow-600">Você não possui acesso a nenhum CCA.</p>
        </div>
      ) : (
        <>
          <OcorrenciasSummaryCards />

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ocorrências por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <OcorrenciasByTipoChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ocorrências por Classificação de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <OcorrenciasByEmpresaChart />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ocorrências por CCA</CardTitle>
              </CardHeader>
              <CardContent>
                <OcorrenciasTimelineChart />
              </CardContent>
            </Card>

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
        </>
      )}
    </div>
  );
};

const OcorrenciasDashboard = () => {
  return (
    <OcorrenciasFilterProvider>
      <OcorrenciasDashboardContent />
    </OcorrenciasFilterProvider>
  );
};

export default OcorrenciasDashboard;
