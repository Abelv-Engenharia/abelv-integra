import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FeriasParaAprovacaoRH } from "@/hooks/gestao-pessoas/useFeriasParaAprovacaoRH";
import { useAuth } from "@/contexts/AuthContext";

interface AprovacaoFeriasRHModalProps {
  aberto: boolean;
  onFechar: () => void;
  ferias: FeriasParaAprovacaoRH | null;
  onSucesso: () => void;
}

export function AprovacaoFeriasRHModal({
  aberto,
  onFechar,
  ferias,
  onSucesso
}: AprovacaoFeriasRHModalProps) {
  const { user } = useAuth();
  const [observacoes, setObservacoes] = useState("");
  const [processando, setProcessando] = useState(false);

  const handleAprovar = async () => {
    if (!ferias || !user) return;

    setProcessando(true);
    try {
      const { error } = await supabase
        .from('prestadores_ferias')
        .update({
          status: 'aprovado',
          observacoes_aprovacao_rh: observacoes || null,
          dataaprovacao_rh: new Date().toISOString(),
          aprovadopor_rh_id: user.id,
          aprovadopor_rh: user.email || user.user_metadata?.nome || 'RH'
        })
        .eq('id', ferias.id);

      if (error) throw error;

      toast({
        title: "Férias Aprovadas pelo RH",
        description: `As férias de ${ferias.nomeprestador} foram aprovadas com sucesso.`
      });

      onSucesso();
      onFechar();
      setObservacoes("");
    } catch (error) {
      console.error('Erro ao aprovar férias pelo RH:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar férias",
        variant: "destructive"
      });
    } finally {
      setProcessando(false);
    }
  };

  const handleReprovar = async () => {
    if (!ferias || !user) return;

    if (!observacoes.trim()) {
      toast({
        title: "Atenção",
        description: "É necessário informar o motivo da reprovação",
        variant: "destructive"
      });
      return;
    }

    setProcessando(true);
    try {
      const { error } = await supabase
        .from('prestadores_ferias')
        .update({
          status: 'reprovado',
          observacoes_aprovacao_rh: observacoes,
          dataaprovacao_rh: new Date().toISOString(),
          aprovadopor_rh_id: user.id,
          aprovadopor_rh: user.email || user.user_metadata?.nome || 'RH'
        })
        .eq('id', ferias.id);

      if (error) throw error;

      toast({
        title: "Férias Reprovadas pelo RH",
        description: `As férias de ${ferias.nomeprestador} foram reprovadas.`
      });

      onSucesso();
      onFechar();
      setObservacoes("");
    } catch (error) {
      console.error('Erro ao reprovar férias pelo RH:', error);
      toast({
        title: "Erro",
        description: "Erro ao reprovar férias",
        variant: "destructive"
      });
    } finally {
      setProcessando(false);
    }
  };

  if (!ferias) return null;

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aprovação de Férias - RH</DialogTitle>
          <DialogDescription>
            Analise a solicitação de férias já aprovada pelo gestor e tome uma decisão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Prestador */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-sm">{ferias.nomeprestador}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Empresa</p>
              <p className="text-sm">{ferias.empresa}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Função</p>
              <p className="text-sm">{ferias.funcaocargo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CCA</p>
              <p className="text-sm">{ferias.cca_codigo} - {ferias.cca_nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Início</p>
              <p className="text-sm">
                {format(new Date(ferias.datainicioferias), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dias de Férias</p>
              <p className="text-sm">{ferias.diasferias} dias</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Responsável Direto</p>
              <p className="text-sm">{ferias.responsaveldireto}</p>
            </div>
            {ferias.observacoes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Observações do Solicitante</p>
                <p className="text-sm">{ferias.observacoes}</p>
              </div>
            )}
          </div>

          {/* Informações da Aprovação do Gestor */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
              Aprovado pelo Gestor
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovado por</p>
                <p className="text-sm">{ferias.aprovadopor_gestor || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Aprovação</p>
                <p className="text-sm">
                  {ferias.dataaprovacao_gestor 
                    ? format(new Date(ferias.dataaprovacao_gestor), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : 'N/A'
                  }
                </p>
              </div>
              {ferias.observacoes_aprovacao_gestor && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Observações do Gestor</p>
                  <p className="text-sm">{ferias.observacoes_aprovacao_gestor}</p>
                </div>
              )}
            </div>
          </div>

          {/* Campo de Observações para Aprovação/Reprovação do RH */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">
              Observações do RH {observacoes.trim() ? "" : "(Obrigatório para reprovação)"}
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre a decisão do RH..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onFechar}
            disabled={processando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReprovar}
            disabled={processando}
          >
            Reprovar
          </Button>
          <Button
            type="button"
            onClick={handleAprovar}
            disabled={processando}
          >
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
