
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface FormNavigationProps {
  currentTabIndex: number;
  totalTabs: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
}

const FormNavigation = ({
  currentTabIndex,
  totalTabs,
  onPrevious,
  onNext,
  onCancel,
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
