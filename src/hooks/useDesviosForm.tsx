
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import { DesvioFormData } from "@/types/desvios";
import { calculateStatusAcao } from "@/utils/desviosUtils";
import { validateRequiredFields, getFieldDisplayNames } from "@/utils/desviosValidation";
import { transformFormDataToDesvio } from "@/utils/desviosDataTransform";
import { getDefaultFormValues } from "@/utils/desviosDefaults";

export const useDesviosForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<DesvioFormData>({
    defaultValues: getDefaultFormValues(),
  });

  // Watch para recalcular o status quando situação ou prazo mudarem
  const watchSituacao = form.watch("situacao");
  const watchPrazoCorrecao = form.watch("prazoCorrecao");

  useEffect(() => {
    if (watchSituacao) {
      const novoStatus = calculateStatusAcao(watchSituacao, watchPrazoCorrecao);
      form.setValue("situacaoAcao", novoStatus);
    }
  }, [watchSituacao, watchPrazoCorrecao, form]);

  const handleSave = async () => {
    console.log("Botão Salvar clicado");
    
    const formData = form.getValues();
    const validation = validateRequiredFields(formData);
    
    if (!validation.isValid) {
      const fieldNames = getFieldDisplayNames();
      const missingFieldNames = validation.missingFields.map(field => fieldNames[field] || field);
      
      toast({
        title: "Campos obrigatórios não preenchidos",
        description: `Por favor, preencha os seguintes campos: ${missingFieldNames.join(', ')}`,
        variant: "destructive",
      });
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Dados do formulário:", formData);
      
      const desvioData = transformFormDataToDesvio(formData);
      const result = await desviosCompletosService.create(desvioData);
      
      if (result) {
        setShowSuccessDialog(true);
      } else {
        throw new Error("Falha ao criar desvio");
      }
    } catch (error) {
      console.error("Erro ao salvar desvio:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o desvio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("Botão Cancelar clicado");
    form.reset();
    setActiveTab("identificacao");
    toast({
      title: "Formulário cancelado",
      description: "O formulário foi resetado.",
    });
  };

  const handleNewRecord = () => {
    form.reset();
    setActiveTab("identificacao");
  };

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSave,
    handleCancel,
    handleNewRecord,
  };
};
