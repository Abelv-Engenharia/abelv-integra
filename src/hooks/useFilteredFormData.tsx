
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

    // Filtrar empresas que têm relacionamento com o CCA selecionado
    const filteredEmpresas = allData.empresas.filter(empresa => 
      empresa.empresa_ccas?.some((ec: any) => ec.cca_id === ccaIdNumber)
    );

    // Filtrar engenheiros que têm relacionamento com o CCA selecionado
    const filteredEngenheiros = allData.engenheiros.filter(engenheiro => 
      engenheiro.engenheiro_ccas?.some((ec: any) => ec.cca_id === ccaIdNumber)
    );

    // Filtrar supervisores que têm relacionamento com o CCA selecionado
    const filteredSupervisores = allData.supervisores.filter(supervisor => 
      supervisor.supervisor_ccas?.some((sc: any) => sc.cca_id === ccaIdNumber)
    );

    return {
      ...allData,
      empresas: filteredEmpresas,
      engenheiros: filteredEngenheiros,
      supervisores: filteredSupervisores,
      encarregados: allData.encarregados.filter(encarregado => encarregado.cca_id === ccaIdNumber),
      funcionarios: allData.funcionarios.filter(funcionario => funcionario.cca_id === ccaIdNumber),
    };
  }, [allData, selectedCcaId]);

  return filteredData;
};
