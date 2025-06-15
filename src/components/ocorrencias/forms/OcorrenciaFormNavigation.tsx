
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OcorrenciaFormNavigationProps {
  activeTab: string;
  tabs: Array<{ id: string; label: string }>;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const OcorrenciaFormNavigation: React.FC<OcorrenciaFormNavigationProps> = ({
  activeTab,
  tabs,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
  isSubmitting,
  isEditMode,
}) => {
  const { toast } = useToast();

  return (
    <div className="flex justify-between mt-6 pt-4 border-t">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log("Botão anterior clicado");
            onPrevious();
          }}
          disabled={activeTab === tabs[0].id}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log("Botão cancelar clicado");
            onCancel();
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
      {activeTab === "fechamento" ? (
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={(e: React.MouseEvent) => {
            console.log("Botão Salvar ocorrência clicado");
            toast({
              title: "Clique detectado",
              description: "Tentando enviar o formulário para salvar a ocorrência!",
            });
            // O submit deve ser disparado pelo tipo submit no form.
            // Se o toast aparece, o click do botão responde!
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Salvando..." : (isEditMode ? "Salvar alterações" : "Salvar ocorrência")}
        </Button>
      ) : (
        <Button type="button" onClick={() => {
          console.log("Botão próximo clicado");
          onNext();
        }}>
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
