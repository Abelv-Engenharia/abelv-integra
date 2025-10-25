import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FeriasParaAprovacao } from "@/hooks/gestao-pessoas/useFeriasParaAprovacao";

interface AprovacaoFeriasModalProps {
  aberto: boolean;
  onFechar: () => void;
  ferias: FeriasParaAprovacao | null;
  onSucesso: () => void;
}

export function AprovacaoFeriasModal({
  aberto,
  onFechar,
  ferias,
  onSucesso
}: AprovacaoFeriasModalProps) {
  const [observacoes, setObservacoes] = useState("");
  const [processando, setProcessando] = useState(false);

  const handleAprovar = async () => {
    if (!ferias) return;

    setProcessando(true);
    try {
      const { error } = await supabase
        .from('prestadores_ferias')
        .update({
          status: 'aguardando_aprovacao',
          observacoes_aprovacao_gestor: observacoes || null,
          dataaprovacao_gestor: new Date().toISOString(),
          aprovadopor_gestor: ferias.responsaveldireto
        })
        .eq('id', ferias.id);

      if (error) throw error;

      toast({
        title: "Férias Aprovadas pelo Gestor",
        description: `As férias de ${ferias.nomeprestador} foram aprovadas. Aguardando aprovação do RH.`
      });

      onSucesso();
      onFechar();
      setObservacoes("");
    } catch (error) {
      console.error('Erro ao aprovar férias:', error);
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
    if (!ferias) return;

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
          justificativareprovacao: observacoes,
          dataaprovacao_gestor: new Date().toISOString(),
          aprovadopor_gestor: ferias.responsaveldireto
        })
        .eq('id', ferias.id);

      if (error) throw error;

      toast({
        title: "Férias Reprovadas",
        description: `As férias de ${ferias.nomeprestador} foram reprovadas.`
      });

      onSucesso();
      onFechar();
      setObservacoes("");
    } catch (error) {
      console.error('Erro ao reprovar férias:', error);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aprovação de Férias</DialogTitle>
          <DialogDescription>
            Analise a solicitação de férias e tome uma decisão
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
            {ferias.observacoes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Observações do Solicitante</p>
                <p className="text-sm">{ferias.observacoes}</p>
              </div>
            )}
          </div>

          {/* Campo de Observações para Aprovação/Reprovação */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">
              Observações {observacoes.trim() ? "" : "(Obrigatório para reprovação)"}
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre a decisão..."
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
