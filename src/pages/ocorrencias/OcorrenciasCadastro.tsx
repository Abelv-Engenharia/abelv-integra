
import React from "react";
import { OcorrenciaFormProvider } from "@/components/ocorrencias/OcorrenciaFormProvider";

const OcorrenciasCadastro: React.FC = () => {
  return (
    <div className="container py-6">
      <h2 className="text-2xl font-bold mb-6">Cadastro de Ocorrências</h2>
      <OcorrenciaFormProvider />
    </div>
  );
};

export default OcorrenciasCadastro;

