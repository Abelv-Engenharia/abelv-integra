
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InspecaoStatusBadge } from "./InspecaoStatusBadge";
import { format } from "date-fns";

interface InspecaoAcompanhamentoCardProps {
  inspecao: any;
  onUpdateStatus: (inspecao: any) => void;
  onDelete: (id: string) => void;
}

export function InspecaoAcompanhamentoCard({
  inspecao,
  onUpdateStatus,
  onDelete
}: InspecaoAcompanhamentoCardProps) {
  return (
    <Card className="animate-fade-in relative min-h-[72px] p-1.5">
      {/* Status badge canto superior direito */}
      <div className="absolute right-2 top-2 z-10">
        <InspecaoStatusBadge status={inspecao.status} />
      </div>
      <CardHeader className="pb-1 pt-2 px-2">
        <CardTitle className="text-xs flex flex-col gap-0.5 min-h-0 leading-tight">
          <span className="font-bold text-sm leading-tight">
            {inspecao.cca?.codigo
              ? `${inspecao.cca.codigo} - ${inspecao.cca.nome}`
              : "CCA não definido"}
          </span>
          <span className="font-bold text-[11px] mt-0.5">
            {inspecao.data ? format(new Date(inspecao.data), "dd/MM/yyyy") : "--"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-0 px-2 pb-2">
        <div className="text-[10px] leading-snug">
          <span className="font-medium">Responsável:</span>{" "}
          {inspecao.responsavel_inspecao}
        </div>
        <div className="text-[10px] leading-snug">
          <span className="font-medium">Função:</span>{" "}
          {inspecao.funcao}
        </div>
        <div className="text-[10px] leading-snug">
          <span className="font-medium">Inspeção programada:</span>{" "}
          {inspecao.inspecao_programada}
        </div>
        <div className="text-[10px] leading-snug">
          <span className="font-medium">Desvios identificados:</span>{" "}
          {inspecao.desvios_identificados ?? 0}
        </div>
      </CardContent>
      {/* Botões canto inferior direito, menores */}
      <CardFooter className="pt-0 px-2 pb-2 justify-end">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(inspecao)}
            className="flex items-center gap-1 px-2 py-0.5 h-6 min-h-0 text-[10px] leading-none"
          >
            Atualizar Status
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 px-2 py-0.5 h-6 min-h-0 text-[10px] leading-none"
            onClick={() => onDelete(inspecao.id)}
          >
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
