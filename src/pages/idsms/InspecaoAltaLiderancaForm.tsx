
import React from "react";
import IndicadorForm from "@/components/idsms/IndicadorForm";

const InspecaoAltaLiderancaForm = () => {
  return (
    <IndicadorForm
      tipo="INSPECAO_ALTA_LIDERANCA"
      titulo="Registro de Inspeção Alta Liderança"
      descricao="Registre o resultado da Inspeção de Alta Liderança para o CCA selecionado."
    />
  );
};

export default InspecaoAltaLiderancaForm;
