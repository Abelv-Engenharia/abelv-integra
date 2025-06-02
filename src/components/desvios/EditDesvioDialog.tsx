
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

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
      // Identificação
      dataDesvio: "",
      horaDesvio: "",
      local: "",
      ccaId: "",
      empresaId: "",
      baseLegalOpcaoId: "",
      engenheiroResponsavelId: "",
      supervisorResponsavelId: "",
      encarregadoResponsavelId: "",
      
      // Informações do Desvio
      tipoRegistroId: "",
      processoId: "",
      eventoIdentificadoId: "",
      causaProvavelId: "",
      disciplinaId: "",
      descricaoDesvio: "",
      acaoImediata: "",
      imagemUrl: "",
      
      // Classificação de Risco
      exposicao: "",
      controle: "",
      deteccao: "",
      efeitoFalha: "",
      impacto: "",
      
      // Status
      status: "",
      classificacaoRisco: "",
      responsavelId: "",
      prazoConclusao: "",
    },
  });

  useEffect(() => {
    if (desvio && open) {
      form.reset({
        dataDesvio: desvio.data_desvio || "",
        horaDesvio: desvio.hora_desvio || "",
        local: desvio.local || "",
        ccaId: desvio.cca_id?.toString() || "",
        empresaId: desvio.empresa_id?.toString() || "",
        baseLegalOpcaoId: desvio.base_legal_opcao_id?.toString() || "",
        engenheiroResponsavelId: desvio.engenheiro_responsavel_id || "",
        supervisorResponsavelId: desvio.supervisor_responsavel_id || "",
        encarregadoResponsavelId: desvio.encarregado_responsavel_id || "",
        tipoRegistroId: desvio.tipo_registro_id?.toString() || "",
        processoId: desvio.processo_id?.toString() || "",
        eventoIdentificadoId: desvio.evento_identificado_id?.toString() || "",
        causaProvavelId: desvio.causa_provavel_id?.toString() || "",
        disciplinaId: desvio.disciplina_id?.toString() || "",
        descricaoDesvio: desvio.descricao_desvio || "",
        acaoImediata: desvio.acao_imediata || "",
        imagemUrl: desvio.imagem_url || "",
        exposicao: desvio.exposicao?.toString() || "",
        controle: desvio.controle?.toString() || "",
        deteccao: desvio.deteccao?.toString() || "",
        efeitoFalha: desvio.efeito_falha?.toString() || "",
        impacto: desvio.impacto?.toString() || "",
        status: desvio.status || "PENDENTE",
        classificacaoRisco: desvio.classificacao_risco || "",
        responsavelId: desvio.responsavel_id || "",
        prazoConclusao: desvio.prazo_conclusao || "",
      });
    }
  }, [desvio, open, form]);

  const onSubmit = async (data: any) => {
    if (!desvio?.id) return;

    setIsLoading(true);
    try {
      const updatedDesvio = await desviosCompletosService.update(desvio.id, {
        data_desvio: data.dataDesvio,
        hora_desvio: data.horaDesvio,
        local: data.local,
        cca_id: data.ccaId ? parseInt(data.ccaId) : null,
        empresa_id: data.empresaId ? parseInt(data.empresaId) : null,
        base_legal_opcao_id: data.baseLegalOpcaoId ? parseInt(data.baseLegalOpcaoId) : null,
        engenheiro_responsavel_id: data.engenheiroResponsavelId || null,
        supervisor_responsavel_id: data.supervisorResponsavelId || null,
        encarregado_responsavel_id: data.encarregadoResponsavelId || null,
        tipo_registro_id: data.tipoRegistroId ? parseInt(data.tipoRegistroId) : null,
        processo_id: data.processoId ? parseInt(data.processoId) : null,
        evento_identificado_id: data.eventoIdentificadoId ? parseInt(data.eventoIdentificadoId) : null,
        causa_provavel_id: data.causaProvavelId ? parseInt(data.causaProvavelId) : null,
        disciplina_id: data.disciplinaId ? parseInt(data.disciplinaId) : null,
        descricao_desvio: data.descricaoDesvio,
        acao_imediata: data.acaoImediata,
        imagem_url: data.imagemUrl,
        exposicao: data.exposicao ? parseInt(data.exposicao) : null,
        controle: data.controle ? parseInt(data.controle) : null,
        deteccao: data.deteccao ? parseInt(data.deteccao) : null,
        efeito_falha: data.efeitoFalha ? parseInt(data.efeitoFalha) : null,
        impacto: data.impacto ? parseInt(data.impacto) : null,
        status: data.status,
        classificacao_risco: data.classificacaoRisco,
        responsavel_id: data.responsavelId || null,
        prazo_conclusao: data.prazoConclusao || null,
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Desvio</DialogTitle>
          <DialogDescription>
            Edite as informações do desvio selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Identificação do Desvio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identificação do Desvio</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dataDesvio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Desvio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="horaDesvio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora do Desvio</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Local do desvio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ccaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CCA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">CCA 001</SelectItem>
                          <SelectItem value="2">CCA 002</SelectItem>
                          <SelectItem value="3">CCA 003</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empresaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Empresa A</SelectItem>
                          <SelectItem value="2">Empresa B</SelectItem>
                          <SelectItem value="3">Empresa C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="baseLegalOpcaoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Legal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a base legal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">NR-01</SelectItem>
                        <SelectItem value="2">NR-06</SelectItem>
                        <SelectItem value="3">NR-10</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="engenheiroResponsavelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engenheiro Responsável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eng1">João Silva</SelectItem>
                          <SelectItem value="eng2">Maria Santos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisorResponsavelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor Responsável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sup1">Carlos Lima</SelectItem>
                          <SelectItem value="sup2">Ana Costa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="encarregadoResponsavelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encarregado Responsável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="enc1">Pedro Oliveira</SelectItem>
                          <SelectItem value="enc2">Lucia Ferreira</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informações do Desvio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Desvio</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoRegistroId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Registro</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Incidente</SelectItem>
                          <SelectItem value="2">Acidente</SelectItem>
                          <SelectItem value="3">Quase Acidente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="processoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o processo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Processo A</SelectItem>
                          <SelectItem value="2">Processo B</SelectItem>
                          <SelectItem value="3">Processo C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventoIdentificadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evento Identificado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Evento 1</SelectItem>
                          <SelectItem value="2">Evento 2</SelectItem>
                          <SelectItem value="3">Evento 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="causaProvavelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Causa Provável</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a causa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Causa Humana</SelectItem>
                          <SelectItem value="2">Causa Material</SelectItem>
                          <SelectItem value="3">Causa Ambiental</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="disciplinaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Segurança do Trabalho</SelectItem>
                        <SelectItem value="2">Meio Ambiente</SelectItem>
                        <SelectItem value="3">Qualidade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricaoDesvio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Desvio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhadamente o desvio identificado"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acaoImediata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ação Imediata</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as ações imediatas tomadas"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagemUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Classificação de Risco */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Classificação de Risco</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="exposicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exposição</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Muito rara</SelectItem>
                          <SelectItem value="2">2 - Rara</SelectItem>
                          <SelectItem value="3">3 - Ocasional</SelectItem>
                          <SelectItem value="4">4 - Frequente</SelectItem>
                          <SelectItem value="5">5 - Contínua</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="controle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Controle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Muito alto</SelectItem>
                          <SelectItem value="2">2 - Alto</SelectItem>
                          <SelectItem value="3">3 - Moderado</SelectItem>
                          <SelectItem value="4">4 - Baixo</SelectItem>
                          <SelectItem value="5">5 - Muito baixo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deteccao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detecção</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Muito alta</SelectItem>
                          <SelectItem value="2">2 - Alta</SelectItem>
                          <SelectItem value="3">3 - Moderada</SelectItem>
                          <SelectItem value="4">4 - Baixa</SelectItem>
                          <SelectItem value="5">5 - Muito baixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="efeitoFalha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Efeito da Falha</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Insignificante</SelectItem>
                          <SelectItem value="2">2 - Menor</SelectItem>
                          <SelectItem value="3">3 - Moderado</SelectItem>
                          <SelectItem value="4">4 - Maior</SelectItem>
                          <SelectItem value="5">5 - Catastrófico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="impacto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impacto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Muito baixo</SelectItem>
                          <SelectItem value="2">2 - Baixo</SelectItem>
                          <SelectItem value="3">3 - Moderado</SelectItem>
                          <SelectItem value="4">4 - Alto</SelectItem>
                          <SelectItem value="5">5 - Muito alto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status e Controle */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status e Controle</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                          <SelectItem value="EM ANDAMENTO">EM ANDAMENTO</SelectItem>
                          <SelectItem value="CONCLUÍDO">CONCLUÍDO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classificacaoRisco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classificação de Risco</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a classificação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TRIVIAL">TRIVIAL</SelectItem>
                          <SelectItem value="TOLERÁVEL">TOLERÁVEL</SelectItem>
                          <SelectItem value="MODERADO">MODERADO</SelectItem>
                          <SelectItem value="SUBSTANCIAL">SUBSTANCIAL</SelectItem>
                          <SelectItem value="INTOLERÁVEL">INTOLERÁVEL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsavelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável pela Ação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o responsável" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="resp1">João Silva</SelectItem>
                          <SelectItem value="resp2">Maria Santos</SelectItem>
                          <SelectItem value="resp3">Carlos Lima</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prazoConclusao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Conclusão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
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
