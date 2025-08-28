
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InspecaoStatusBadge } from "./InspecaoStatusBadge";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { generate, loading, error } = useSignedUrl();
  const { toast } = useToast();

  // Função para formatar a data corretamente, evitando problemas de timezone
  const formatDateSafely = (dateString: string) => {
    if (!dateString) return "--";
    // Adiciona 'T00:00:00' para garantir que seja tratada como data local
    return format(new Date(dateString + 'T00:00:00'), "dd/MM/yyyy");
  };

  const handleViewReport = async () => {
    if (!inspecao.relatorio_url) return;
    
    try {
      // Extrai o path do arquivo da URL completa
      const url = new URL(inspecao.relatorio_url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      // Gera signed URL diretamente
      const { data, error: storageError } = await supabase.storage
        .from('relatorios-inspecao-hsa')
        .createSignedUrl(fileName, 120);
      
      if (storageError || !data?.signedUrl) {
        toast({
          title: "Erro ao abrir relatório",
          description: storageError?.message || "Não foi possível gerar link do arquivo",
          variant: "destructive",
        });
        return;
      }

      // O Supabase já retorna a URL completa
      window.open(data.signedUrl, '_blank');
      
    } catch (err) {
      toast({
        title: "Erro ao abrir relatório",
        description: "Não foi possível acessar o arquivo",
        variant: "destructive",
      });
    }
  };

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
            {formatDateSafely(inspecao.data)}
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
          {inspecao.relatorio_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewReport}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-0.5 h-6 min-h-0 text-[10px] leading-none"
            >
              <FileText className="h-3 w-3" />
              {loading ? "Carregando..." : "Relatório"}
            </Button>
          )}
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
