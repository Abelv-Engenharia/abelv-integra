import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { useFilteredFormData } from "@/hooks/useFilteredFormData";
import NovaIdentificacaoForm from "@/components/desvios/forms/NovaIdentificacaoForm";
import InformacoesDesvioForm from "@/components/desvios/forms/InformacoesDesvioForm";
import AcaoCorretivaForm from "@/components/desvios/forms/AcaoCorretivaForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";
import { calculateStatusAcao } from "@/utils/desviosUtils";

interface EditDesvioDialogProps {
  desvio: DesvioCompleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDesvioUpdated: () => void;
}

const EditDesvioDialog = ({ desvio, open, onOpenChange, onDesvioUpdated }: EditDesvioDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      // Nova Identificação
      data: "",
      hora: "",
      ano: "",
      mes: "",
      ccaId: "",
      tipoRegistro: "",
      processo: "",
      eventoIdentificado: "",
      causaProvavel: "",
      responsavelInspecao: "",
      empresa: "",
      disciplina: "",
      engenheiroResponsavel: "",
      
      // Novas Informações
      descricaoDesvio: "",
      baseLegal: "",
      supervisorResponsavel: "",
      encarregadoResponsavel: "",
      colaboradorInfrator: "",
      funcao: "",
      matricula: "",
      
      // Ação Corretiva
      tratativaAplicada: "",
      responsavelAcao: "",
      prazoCorrecao: "",
      situacao: "EM ANDAMENTO",
      situacaoAcao: "EM ANDAMENTO",
      aplicacaoMedidaDisciplinar: false,
      
      // Classificação de Risco
      exposicao: "",
      controle: "",
      deteccao: "",
      efeitoFalha: "",
      impacto: "",
      probabilidade: 0,
      severidade: 0,
      classificacaoRisco: "",
    },
  });

  // Usar dados filtrados baseados no CCA selecionado
  const selectedCcaId = form.watch("ccaId");
  const formContext = useFilteredFormData({ selectedCcaId });

  useEffect(() => {
    if (desvio && open) {
      console.log('Desvio completo para edição:', desvio);
      
      const dataDesvio = new Date(desvio.data_desvio);
      
      // Buscar funcionário infrator nos funcionarios_envolvidos
      let colaboradorInfratorId = "";
      let funcionarioData = null;
      
      if (desvio.funcionarios_envolvidos && Array.isArray(desvio.funcionarios_envolvidos)) {
        funcionarioData = desvio.funcionarios_envolvidos.find((f: any) => f.tipo === 'infrator') || desvio.funcionarios_envolvidos[0];
        if (funcionarioData) {
          colaboradorInfratorId = funcionarioData.funcionario_id || "";
        }
      }
      
      const acao = desvio.acoes && Array.isArray(desvio.acoes) && desvio.acoes.length > 0 ? desvio.acoes[0] : {};

      // Reset form with all the values from the desvio
      form.reset({
        // Nova Identificação
        data: desvio.data_desvio || "",
        hora: desvio.hora_desvio || "",
        ano: dataDesvio.getFullYear().toString(),
        mes: (dataDesvio.getMonth() + 1).toString().padStart(2, '0'),
        ccaId: desvio.cca_id?.toString() || "",
        tipoRegistro: desvio.tipo_registro_id?.toString() || "",
        processo: desvio.processo_id?.toString() || "",
        eventoIdentificado: desvio.evento_identificado_id?.toString() || "",
        causaProvavel: desvio.causa_provavel_id?.toString() || "",
        responsavelInspecao: (desvio as any).responsavel_inspecao || "",
        empresa: desvio.empresa_id?.toString() || "",
        disciplina: desvio.disciplina_id?.toString() || "",
        engenheiroResponsavel: desvio.engenheiro_responsavel_id || "",
        
        // Novas Informações
        descricaoDesvio: desvio.descricao_desvio || "",
        baseLegal: desvio.base_legal_opcao_id?.toString() || "",
        supervisorResponsavel: desvio.supervisor_responsavel_id || "",
        encarregadoResponsavel: desvio.encarregado_responsavel_id || "",
        colaboradorInfrator: colaboradorInfratorId,
        funcao: funcionarioData?.funcao || "",
        matricula: funcionarioData?.matricula || "",
        
        // Ação Corretiva
        tratativaAplicada: desvio.acao_imediata || acao.tratativa || "",
        responsavelAcao: acao.responsavel || "",
        prazoCorrecao: desvio.prazo_conclusao || acao.prazo || "",
        situacao: acao.situacao || desvio.status || "EM ANDAMENTO",
        situacaoAcao: acao.situacao_acao || calculateStatusAcao(acao.situacao || desvio.status, desvio.prazo_conclusao),
        aplicacaoMedidaDisciplinar: acao.medida_disciplinar || false,
        
        // Classificação de Risco
        exposicao: desvio.exposicao?.toString() || "",
        controle: desvio.controle?.toString() || "",
        deteccao: desvio.deteccao?.toString() || "",
        efeitoFalha: desvio.efeito_falha?.toString() || "",
        impacto: desvio.impacto?.toString() || "",
        probabilidade: desvio.probabilidade || 0,
        severidade: desvio.severidade || 0,
        classificacaoRisco: desvio.classificacao_risco || "",
      });

      console.log('Form values after reset:', form.getValues());
    }
  }, [desvio, open, form]);

  const onSubmit = async (data: any) => {
    if (!desvio?.id) return;

    setIsLoading(true);
    try {
      console.log('Dados do formulário de edição:', data);
      console.log('ID do desvio para atualização:', desvio.id);
      
      const situacaoAcaoCalculada = calculateStatusAcao(data.situacao, data.prazoCorrecao);

      console.log('Dados que serão enviados para atualização:', {
        data_desvio: data.data,
        hora_desvio: data.hora,
        responsavel_inspecao: data.responsavelInspecao,
        descricao_desvio: data.descricaoDesvio
      });

      const updatedDesvio = await desviosCompletosService.update(desvio.id, {
        data_desvio: data.data,
        hora_desvio: data.hora,
        responsavel_inspecao: data.responsavelInspecao,
        cca_id: data.ccaId ? parseInt(data.ccaId) : null,
        empresa_id: data.empresa ? parseInt(data.empresa) : null,
        base_legal_opcao_id: data.baseLegal ? parseInt(data.baseLegal) : null,
        engenheiro_responsavel_id: data.engenheiroResponsavel || null,
        supervisor_responsavel_id: data.supervisorResponsavel || null,
        encarregado_responsavel_id: data.encarregadoResponsavel || null,
        tipo_registro_id: data.tipoRegistro ? parseInt(data.tipoRegistro) : null,
        processo_id: data.processo ? parseInt(data.processo) : null,
        evento_identificado_id: data.eventoIdentificado ? parseInt(data.eventoIdentificado) : null,
        causa_provavel_id: data.causaProvavel ? parseInt(data.causaProvavel) : null,
        disciplina_id: data.disciplina ? parseInt(data.disciplina) : null,
        descricao_desvio: data.descricaoDesvio,
        acao_imediata: data.tratativaAplicada,
        exposicao: data.exposicao ? parseInt(data.exposicao) : null,
        controle: data.controle ? parseInt(data.controle) : null,
        deteccao: data.deteccao ? parseInt(data.deteccao) : null,
        efeito_falha: data.efeitoFalha ? parseInt(data.efeitoFalha) : null,
        impacto: data.impacto ? parseInt(data.impacto) : null,
        probabilidade: data.probabilidade,
        severidade: data.severidade,
        status: data.situacao,
        classificacao_risco: data.classificacaoRisco,
        responsavel_id: desvio.responsavel_id,
        prazo_conclusao: data.prazoCorrecao || null,
        funcionarios_envolvidos: data.colaboradorInfrator ? [{
          funcionario_id: data.colaboradorInfrator,
          tipo: 'infrator',
          funcao: data.funcao,
          matricula: data.matricula
        }] : [],
        acoes: data.tratativaAplicada || data.responsavelAcao ? [{
            responsavel: data.responsavelAcao,
            prazo: data.prazoCorrecao || null,
            situacao: data.situacao,
            situacao_acao: situacaoAcaoCalculada,
            medida_disciplinar: data.aplicacaoMedidaDisciplinar,
            tratativa: data.tratativaAplicada
        }] : [],
      });

      if (updatedDesvio) {
        console.log('Desvio atualizado com sucesso:', updatedDesvio);
        toast({
          title: "Desvio atualizado",
          description: "O desvio foi atualizado com sucesso.",
        });
        onDesvioUpdated();
        onOpenChange(false);
      } else {
        console.error('Nenhum desvio foi retornado na atualização');
        toast({
          title: "Erro na atualização",
          description: "A atualização não retornou dados.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar desvio:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o desvio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Desvio</DialogTitle>
          <DialogDescription>
            Edite as informações do desvio selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <NovaIdentificacaoForm context={formContext} />
            <InformacoesDesvioForm context={formContext} />
            <AcaoCorretivaForm />
            <ClassificacaoRiscoForm />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDesvioDialog;
