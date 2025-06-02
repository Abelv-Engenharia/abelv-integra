
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
import NovaIdentificacaoForm from "@/components/desvios/forms/NovaIdentificacaoForm";
import NovasInformacoesForm from "@/components/desvios/forms/NovasInformacoesForm";
import AcaoCorretivaForm from "@/components/desvios/forms/AcaoCorretivaForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";

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
      descricao: "",
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
      situacaoAcao: "",
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

  // Mock data para os contextos dos formulários
  const mockContext = {
    ccas: [
      { id: 1, codigo: "CCA-001", nome: "CCA 001" },
      { id: 2, codigo: "CCA-002", nome: "CCA 002" },
      { id: 3, codigo: "CCA-003", nome: "CCA 003" }
    ],
    tiposRegistro: [
      { id: 1, nome: "Incidente" },
      { id: 2, nome: "Acidente" },
      { id: 3, nome: "Quase Acidente" }
    ],
    processos: [
      { id: 1, nome: "Processo A" },
      { id: 2, nome: "Processo B" },
      { id: 3, nome: "Processo C" }
    ],
    eventosIdentificados: [
      { id: 1, nome: "Evento 1" },
      { id: 2, nome: "Evento 2" },
      { id: 3, nome: "Evento 3" }
    ],
    causasProvaveis: [
      { id: 1, nome: "Causa Humana" },
      { id: 2, nome: "Causa Material" },
      { id: 3, nome: "Causa Ambiental" }
    ],
    empresas: [
      { id: 1, nome: "Empresa A" },
      { id: 2, nome: "Empresa B" },
      { id: 3, nome: "Empresa C" }
    ],
    disciplinas: [
      { id: 1, nome: "Segurança do Trabalho" },
      { id: 2, nome: "Meio Ambiente" },
      { id: 3, nome: "Qualidade" }
    ],
    engenheiros: [
      { id: "eng1", nome: "João Silva" },
      { id: "eng2", nome: "Maria Santos" }
    ],
    baseLegalOpcoes: [
      { id: 1, nome: "NR-01" },
      { id: 2, nome: "NR-06" },
      { id: 3, nome: "NR-10" }
    ],
    supervisores: [
      { id: "sup1", nome: "Carlos Lima" },
      { id: "sup2", nome: "Ana Costa" }
    ],
    encarregados: [
      { id: "enc1", nome: "Pedro Oliveira" },
      { id: "enc2", nome: "Lucia Ferreira" }
    ],
    funcionarios: [
      { id: "func1", nome: "José Santos" },
      { id: "func2", nome: "Maria Oliveira" }
    ]
  };

  useEffect(() => {
    if (desvio && open) {
      const dataDesvio = new Date(desvio.data_desvio);
      
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
        responsavelInspecao: "", // Campo não existe na tabela desvios_completos
        empresa: desvio.empresa_id?.toString() || "",
        disciplina: desvio.disciplina_id?.toString() || "",
        engenheiroResponsavel: desvio.engenheiro_responsavel_id || "",
        
        // Novas Informações
        descricao: desvio.descricao_desvio || "",
        baseLegal: desvio.base_legal_opcao_id?.toString() || "",
        supervisorResponsavel: desvio.supervisor_responsavel_id || "",
        encarregadoResponsavel: desvio.encarregado_responsavel_id || "",
        colaboradorInfrator: "", // Campo não existe na tabela desvios_completos
        funcao: "", // Campo não existe na tabela desvios_completos
        matricula: "", // Campo não existe na tabela desvios_completos
        
        // Ação Corretiva
        tratativaAplicada: desvio.acao_imediata || "",
        responsavelAcao: desvio.responsavel_id || "",
        prazoCorrecao: desvio.prazo_conclusao || "",
        situacaoAcao: desvio.status || "",
        aplicacaoMedidaDisciplinar: false, // Campo não existe na tabela desvios_completos
        
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
    }
  }, [desvio, open, form]);

  const onSubmit = async (data: any) => {
    if (!desvio?.id) return;

    setIsLoading(true);
    try {
      const updatedDesvio = await desviosCompletosService.update(desvio.id, {
        data_desvio: data.data,
        hora_desvio: data.hora,
        local: desvio.local, // Mantém o local original
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
        descricao_desvio: data.descricao,
        acao_imediata: data.tratativaAplicada,
        exposicao: data.exposicao ? parseInt(data.exposicao) : null,
        controle: data.controle ? parseInt(data.controle) : null,
        deteccao: data.deteccao ? parseInt(data.deteccao) : null,
        efeito_falha: data.efeitoFalha ? parseInt(data.efeitoFalha) : null,
        impacto: data.impacto ? parseInt(data.impacto) : null,
        status: data.situacaoAcao,
        classificacao_risco: data.classificacaoRisco,
        responsavel_id: data.responsavelAcao || null,
        prazo_conclusao: data.prazoCorrecao || null,
      });

      if (updatedDesvio) {
        toast({
          title: "Desvio atualizado",
          description: "O desvio foi atualizado com sucesso.",
        });
        onDesvioUpdated();
        onOpenChange(false);
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
            <NovaIdentificacaoForm context={mockContext} />
            <NovasInformacoesForm context={mockContext} />
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
