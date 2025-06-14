
import React, { useState } from "react";
import { TreinamentoNormativoForm } from "@/components/treinamentos/TreinamentoNormativoForm";
import { RegistroConcluidoCard } from "@/components/treinamentos/RegistroConcluidoCard";

const TreinamentosNormativo = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [formResetFn, setFormResetFn] = useState<() => void>(() => () => {});

  if (isSubmitSuccess) {
    return (
      <RegistroConcluidoCard
        onNovoRegistro={() => setIsSubmitSuccess(false)}
        formReset={formResetFn}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Registro de Treinamentos Normativos</h1>
      </div>
      <TreinamentoNormativoForm
        onSuccess={() => setIsSubmitSuccess(true)}
        setFormResetFn={setFormResetFn}
      />
    </div>
  );
};

export default TreinamentosNormativo;
