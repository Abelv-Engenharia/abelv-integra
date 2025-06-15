
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

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
}) => (
  <div className="flex justify-between mt-6 pt-4 border-t">
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={activeTab === tabs[0].id}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Anterior
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        <X className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
    </div>
    {activeTab === "fechamento" ? (
      <Button type="submit" disabled={isSubmitting}>
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? "Salvando..." : (isEditMode ? "Salvar alterações" : "Salvar ocorrência")}
      </Button>
    ) : (
      <Button type="button" onClick={onNext}>
        Próximo
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    )}
  </div>
);
