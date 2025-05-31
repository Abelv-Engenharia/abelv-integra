
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

interface FormNavigationProps {
  currentTabIndex: number;
  totalTabs: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const FormNavigation = ({
  currentTabIndex,
  totalTabs,
  onPrevious,
  onNext,
  onSave,
  onCancel,
  isSubmitting,
}: FormNavigationProps) => {
  const handlePrevious = () => {
    console.log("Botão Anterior clicado");
    onPrevious();
  };

  const handleNext = () => {
    console.log("Botão Próximo clicado");
    onNext();
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentTabIndex === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
        
        <Button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Button
        type="button"
        onClick={handleNext}
        disabled={currentTabIndex === totalTabs - 1}
        className="flex items-center gap-2"
      >
        Próximo
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FormNavigation;
