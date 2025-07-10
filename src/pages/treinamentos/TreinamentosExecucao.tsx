
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTreinamentoForm } from "@/hooks/useTreinamentoForm";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import CCASelector from "@/components/treinamentos/execucao/CCASelector";
import ProcessoTipoFields from "@/components/treinamentos/execucao/ProcessoTipoFields";
import TreinamentoSelector from "@/components/treinamentos/execucao/TreinamentoSelector";
import CargaHorariaEfetivoFields from "@/components/treinamentos/execucao/CargaHorariaEfetivoFields";
import ObservacoesAnexoFields from "@/components/treinamentos/execucao/ObservacoesAnexoFields";
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SuccessExecucaoCard from "@/components/treinamentos/execucao/SuccessExecucaoCard";
import { supabase } from "@/integrations/supabase/client";

const TreinamentosExecucao = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Novo estado para gerenciamento do arquivo anexo
  const [listaPresencaFile, setListaPresencaFile] = useState<File | null>(null);

  const {
    form,
    ccaOptions,
    processoOptions,
    tipoOptions,
    treinamentoOptions,
    calculateHorasTotais
  } = useTreinamentoForm();

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      const dataExecucao = new Date(formData.data);
      
      // Get selected CCA name
      const selectedCCA = ccaOptions.find(cca => cca.id === Number(formData.cca_id));
      const selectedProcesso = processoOptions.find(p => p.id === formData.processo_treinamento_id);
      const selectedTipo = tipoOptions.find(t => t.id === formData.tipo_treinamento_id);
      const selectedTreinamento = treinamentoOptions.find(t => t.id === formData.treinamento_id);

      let lista_presenca_url = formData.lista_presenca_url;

      // 1. Se tiver anexo, realiza upload no Supabase Storage antes de salvar
      if (listaPresencaFile) {
        // Crie um nome único para evitar sobrescritas
        const ext = listaPresencaFile.name.split(".").pop();
        const path = `presenca_${Date.now()}.${ext}`;

        let { data: uploadData, error: uploadError } = await supabase.storage
          .from("treinamentos-anexos")
          .upload(path, listaPresencaFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: "application/pdf",
          });

        if (uploadError) {
          throw uploadError;
        }

        // O URL público pode ser composto assim:
        lista_presenca_url = supabase.storage
          .from("treinamentos-anexos")
          .getPublicUrl(uploadData.path).data.publicUrl;
      }

      const execucaoData = {
        data: formData.data,
        mes: formData.mes || dataExecucao.getMonth() + 1,
        ano: formData.ano || dataExecucao.getFullYear(),
        cca: selectedCCA ? `${selectedCCA.codigo} - ${selectedCCA.nome}` : '',
        cca_id: Number(formData.cca_id),
        processo_treinamento: selectedProcesso?.nome || '',
        processo_treinamento_id: formData.processo_treinamento_id,
        tipo_treinamento: selectedTipo?.nome || '',
        tipo_treinamento_id: formData.tipo_treinamento_id,
        treinamento_id: formData.treinamento_id === 'outro' ? null : formData.treinamento_id,
        treinamento_nome: formData.treinamento_id === 'outro' ? formData.treinamento_nome : selectedTreinamento?.nome,
        carga_horaria: formData.carga_horaria,
        efetivo_mod: formData.efetivo_mod,
        efetivo_moi: formData.efetivo_moi,
        horas_totais: calculateHorasTotais(),
        observacoes: formData.observacoes,
        lista_presenca_url, // Salva url caso tenha anexo
      };

      console.log("Salvando dados de execução:", execucaoData);
      
      await execucaoTreinamentoService.create(execucaoData);

      setSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar treinamento:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o treinamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      title: "Formulário cancelado",
      description: "O formulário foi resetado.",
    });
  };

  const handleNewTraining = () => {
    form.reset();
    setSuccess(false);
  };

  const handleGoToDashboard = () => {
    navigate("/treinamentos/dashboard");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registro de Realização de Treinamento</h1>
      </div>
      {success ? (
        <SuccessExecucaoCard
          onNewTraining={handleNewTraining}
          onGoToDashboard={handleGoToDashboard}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <DateTimeFields form={form} />
                <CCASelector form={form} ccaOptions={ccaOptions} />
                <ProcessoTipoFields form={form} processoOptions={processoOptions} tipoOptions={tipoOptions} />
                <TreinamentoSelector form={form} treinamentoOptions={treinamentoOptions} />
                <CargaHorariaEfetivoFields form={form} calculateHorasTotais={calculateHorasTotais} />
                {/* ---------------------------------- */}
                {/* Observações e Anexo */}
                <ObservacoesAnexoFields
                  form={form}
                  onListaPresencaFileChange={setListaPresencaFile}
                />
                {/* ---------------------------------- */}
                <div className="flex justify-end gap-2 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TreinamentosExecucao;
