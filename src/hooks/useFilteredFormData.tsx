
import { useMemo } from "react";
import { useFormData } from "@/hooks/useFormData";

interface UseFilteredFormDataProps {
  selectedCcaId?: string;
}

export const useFilteredFormData = ({ selectedCcaId }: UseFilteredFormDataProps) => {
  const allData = useFormData();

  const filteredData = useMemo(() => {
    if (!selectedCcaId) {
      return {
        ...allData,
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

    const ccaIdNumber = parseInt(selectedCcaId);

    return {
      ...allData,
      empresas: allData.empresas.filter(empresa => empresa.cca_id === ccaIdNumber),
      engenheiros: allData.engenheiros.filter(engenheiro => engenheiro.cca_id === ccaIdNumber),
      supervisores: allData.supervisores.filter(supervisor => supervisor.cca_id === ccaIdNumber),
      encarregados: allData.encarregados.filter(encarregado => encarregado.cca_id === ccaIdNumber),
      funcionarios: allData.funcionarios.filter(funcionario => funcionario.cca_id === ccaIdNumber),
    };
  }, [allData, selectedCcaId]);

  return filteredData;
};
