
import { useMemo } from "react";
import { useFormData } from "@/hooks/useFormData";

interface UseFilteredFormDataProps {
  selectedCcaId?: string;
}

export const useFilteredFormData = ({ selectedCcaId }: UseFilteredFormDataProps) => {
  // Get all the basic form data first
  const formData = useFormData();

  const filteredData = useMemo(() => {
    if (!selectedCcaId) {
      // If no CCA selected, return basic data with empty filtered arrays
      return {
        ...formData,
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

    const ccaIdNumber = parseInt(selectedCcaId);

    // Filter empresas that have relationship with the selected CCA
    const filteredEmpresas = formData.empresas ? formData.empresas.filter((empresa: any) => 
      empresa.cca_id === ccaIdNumber
    ) : [];

    // Filter engenheiros that have relationship with the selected CCA
    const filteredEngenheiros = formData.engenheiros ? formData.engenheiros.filter((engenheiro: any) => 
      engenheiro.cca_id === ccaIdNumber
    ) : [];

    // Filter supervisores that have relationship with the selected CCA
    const filteredSupervisores = formData.supervisores ? formData.supervisores.filter((supervisor: any) => 
      supervisor.cca_id === ccaIdNumber
    ) : [];

    // Filter encarregados and funcionarios by cca_id
    const filteredEncarregados = formData.encarregados ? formData.encarregados.filter((encarregado: any) => 
      encarregado.cca_id === ccaIdNumber
    ) : [];

    const filteredFuncionarios = formData.funcionarios ? formData.funcionarios.filter((funcionario: any) => 
      funcionario.cca_id === ccaIdNumber
    ) : [];

    return {
      ...formData,
      empresas: filteredEmpresas,
      engenheiros: filteredEngenheiros,
      supervisores: filteredSupervisores,
      encarregados: filteredEncarregados,
      funcionarios: filteredFuncionarios,
    };
  }, [formData, selectedCcaId]);

  return filteredData;
};
