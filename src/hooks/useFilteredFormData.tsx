
import { useMemo } from "react";
import { useFormData } from "@/hooks/useFormData";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface UseFilteredFormDataProps {
  selectedCcaId?: string;
}

export const useFilteredFormData = ({ selectedCcaId }: UseFilteredFormDataProps) => {
  const allData = useFormData();
  const { data: userCCAs = [] } = useUserCCAs();

  const filteredData = useMemo(() => {
    // IDs dos CCAs que o usuário tem acesso
    const allowedCcaIds = userCCAs.map(cca => cca.id);

    if (!selectedCcaId) {
      return {
        ...allData,
        ccas: userCCAs, // Mostra apenas os CCAs permitidos
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

    const ccaIdNumber = parseInt(selectedCcaId);

    // Verifica se o CCA selecionado é permitido para o usuário
    if (!allowedCcaIds.includes(ccaIdNumber)) {
      return {
        ...allData,
        ccas: userCCAs,
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

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
      ccas: userCCAs, // Sempre mostra apenas os CCAs permitidos
      empresas: filteredEmpresas,
      engenheiros: filteredEngenheiros,
      supervisores: filteredSupervisores,
      encarregados: allData.encarregados.filter(encarregado => encarregado.cca_id === ccaIdNumber),
      funcionarios: allData.funcionarios.filter(funcionario => funcionario.cca_id === ccaIdNumber),
    };
  }, [allData, selectedCcaId, userCCAs]);

  return filteredData;
};
