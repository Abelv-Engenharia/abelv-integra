
import { useOcorrenciasBasicData } from "./ocorrencias/useOcorrenciasBasicData";
import { useOcorrenciasPersonnelData } from "./ocorrencias/useOcorrenciasPersonnelData";
import { useOcorrenciasReferenceData } from "./ocorrencias/useOcorrenciasReferenceData";
import { useFilteredPersonnelData } from "./ocorrencias/useFilteredPersonnelData";
import { useUserCCAs } from "./useUserCCAs";

interface UseOcorrenciasFormDataProps {
  selectedCcaId?: string;
}

export const useOcorrenciasFormData = ({ selectedCcaId }: UseOcorrenciasFormDataProps = {}) => {
  const basicData = useOcorrenciasBasicData();
  const personnelData = useOcorrenciasPersonnelData();
  const referenceData = useOcorrenciasReferenceData();
  const { data: userCCAs = [], isLoading: ccasLoading } = useUserCCAs();
  
  const filteredData = useFilteredPersonnelData({
    selectedCcaId,
    ...personnelData,
  });

  // Se ainda está carregando os CCAs, retorna dados vazios mas estruturados
  if (ccasLoading) {
    return {
      ccas: [],
      empresas: [],
      disciplinas: [],
      engenheiros: [],
      supervisores: [],
      encarregados: [],
      funcionarios: [],
      tiposOcorrencia: [],
      tiposEvento: [],
      classificacoesOcorrencia: [],
      partesCorpo: [],
      lateralidades: [],
      agentesCausadores: [],
      situacoesGeradoras: [],
      naturezasLesao: [],
    };
  }

  return {
    ...basicData,
    ...referenceData,
    ccas: userCCAs || [], // Usa apenas os CCAs permitidos ao usuário
    empresas: filteredData.empresas || [],
    engenheiros: filteredData.engenheiros || [],
    supervisores: filteredData.supervisores || [],
    encarregados: filteredData.encarregados || [],
    funcionarios: filteredData.funcionarios || [],
    disciplinas: basicData.disciplinas || [], // Disciplinas não são filtradas por CCA
    tiposOcorrencia: basicData.tiposOcorrencia || [],
    tiposEvento: basicData.tiposEvento || [],
    classificacoesOcorrencia: basicData.classificacoesOcorrencia || [],
    // Adicionar os dados de referência que estavam faltando
    partesCorpo: referenceData.partesCorpo || [],
    lateralidades: referenceData.lateralidades || [],
    agentesCausadores: referenceData.agentesCausadores || [],
    situacoesGeradoras: referenceData.situacoesGeradoras || [],
    naturezasLesao: referenceData.naturezasLesao || [],
  };
};
