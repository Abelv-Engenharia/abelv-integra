
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InspecoesSummaryCards from "@/components/hora-seguranca/InspecoesSummaryCards";
import { InspecoesByCCAChart } from "@/components/hora-seguranca/InspecoesByCCAChart";
import { InspecoesBarChart } from "@/components/hora-seguranca/InspecoesBarChart";
import { DesviosResponsaveisChart } from "@/components/hora-seguranca/DesviosResponsaveisChart";
import { DesviosTipoInspecaoChart } from "@/components/hora-seguranca/DesviosTipoInspecaoChart";

export function HSAChartsSection() {
  return (
    <div className="space-y-6">
      <InspecoesSummaryCards />

      <Card>
        <CardHeader>
          <CardTitle>Inspeções por CCA</CardTitle>
        </CardHeader>
        <CardContent>
          <InspecoesByCCAChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspeções por Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <InspecoesBarChart dataType="responsible" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desvios por Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <DesviosResponsaveisChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desvios por Tipo de Inspeção</CardTitle>
        </CardHeader>
        <CardContent>
          <DesviosTipoInspecaoChart />
        </CardContent>
      </Card>
    </div>
  );
}
