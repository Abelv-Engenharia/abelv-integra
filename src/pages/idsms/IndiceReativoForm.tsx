
import React from "react";
import IndicadorForm from "@/components/idsms/IndicadorForm";

const IndiceReativoForm = () => {
  return (
    <IndicadorForm
      tipo="INDICE_REATIVO"
      titulo="Registro de Índice Reativo"
      descricao="Registre o Índice Reativo para o CCA selecionado. Este valor será subtraído do cálculo final do IDSMS."
      showMotivo={true}
    />
  );
};

export default IndiceReativoForm;
