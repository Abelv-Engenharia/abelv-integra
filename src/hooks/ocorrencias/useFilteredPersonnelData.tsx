
import { useMemo } from "react";

interface UseFilteredPersonnelDataProps {
  selectedCcaId?: string;
  allEmpresas: any[];
  allEngenheiros: any[];
  allSupervisores: any[];
  allEncarregados: any[];
  allFuncionarios: any[];
}

export const useFilteredPersonnelData = ({
  selectedCcaId,
  allEmpresas,
  allEngenheiros,
  allSupervisores,
  allEncarregados,
  allFuncionarios,
}: UseFilteredPersonnelDataProps) => {
  return useMemo(() => {
    if (!selectedCcaId) {
      return {
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

    const ccaIdNumber = parseInt(selectedCcaId);

    console.log('=== FILTERING DATA ===');
    console.log('Selected CCA ID:', ccaIdNumber);

    // Filtrar empresas que têm relacionamento com o CCA selecionado
    const filteredEmpresas = allEmpresas.filter(item => {
      console.log('Checking empresa CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
      return item.cca_id === ccaIdNumber;
    });

    // Filtrar engenheiros que têm relacionamento com o CCA selecionado
    const filteredEngenheiros = allEngenheiros.filter(item => {
      console.log('Checking engenheiro CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
      return item.cca_id === ccaIdNumber;
    });

    // Filtrar supervisores que têm relacionamento com o CCA selecionado
    const filteredSupervisores = allSupervisores.filter(item => {
      console.log('Checking supervisor CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
      return item.cca_id === ccaIdNumber;
    });

    // Filtrar encarregados e funcionários pelo CCA
    const filteredEncarregados = allEncarregados.filter(item => {
      console.log('Checking encarregado CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
      return item.cca_id === ccaIdNumber;
    });

    const filteredFuncionarios = allFuncionarios.filter(item => {
      console.log('Checking funcionario CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
      return item.cca_id === ccaIdNumber;
    });

    console.log('=== FILTERED RESULTS ===');
    console.log('Filtered empresas:', filteredEmpresas);
    console.log('Filtered engenheiros:', filteredEngenheiros);
    console.log('Filtered supervisores:', filteredSupervisores);
    console.log('Filtered encarregados:', filteredEncarregados);
    console.log('Filtered funcionarios:', filteredFuncionarios);

    return {
      empresas: filteredEmpresas,
      engenheiros: filteredEngenheiros,
      supervisores: filteredSupervisores,
      encarregados: filteredEncarregados,
      funcionarios: filteredFuncionarios,
    };
  }, [allEmpresas, allEngenheiros, allSupervisores, allEncarregados, allFuncionarios, selectedCcaId]);
};
