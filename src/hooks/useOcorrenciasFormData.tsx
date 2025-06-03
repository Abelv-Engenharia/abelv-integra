
import { useOcorrenciasBasicData } from "./ocorrencias/useOcorrenciasBasicData";
import { useOcorrenciasPersonnelData } from "./ocorrencias/useOcorrenciasPersonnelData";
import { useOcorrenciasReferenceData } from "./ocorrencias/useOcorrenciasReferenceData";
import { useFilteredPersonnelData } from "./ocorrencias/useFilteredPersonnelData";

interface UseOcorrenciasFormDataProps {
  selectedCcaId?: string;
}

export const useOcorrenciasFormData = ({ selectedCcaId }: UseOcorrenciasFormDataProps = {}) => {
  const basicData = useOcorrenciasBasicData();
  const personnelData = useOcorrenciasPersonnelData();
  const referenceData = useOcorrenciasReferenceData();
  
  const filteredData = useFilteredPersonnelData({
    selectedCcaId,
    ...personnelData,
  });

  return {
    ...basicData,
    ...referenceData,
    empresas: filteredData.empresas,
    engenheiros: filteredData.engenheiros,
    supervisores: filteredData.supervisores,
    encarregados: filteredData.encarregados,
    funcionarios: filteredData.funcionarios,
  };
};
