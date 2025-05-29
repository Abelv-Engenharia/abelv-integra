
import React from "react";
import IndicadorForm from "@/components/idsms/IndicadorForm";

const InspecaoGestaoSMSForm = () => {
  return (
    <IndicadorForm
      tipo="INSPECAO_GESTAO_SMS"
      titulo="Registro de Inspeção Gestão SMS"
      descricao="Registre o resultado da Inspeção de Gestão SMS para o CCA selecionado."
    />
  );
};

export default InspecaoGestaoSMSForm;
