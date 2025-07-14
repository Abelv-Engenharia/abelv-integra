
import { useMemo } from "react";

// Define explicit types to prevent infinite type recursion
interface EmpresaWithCCA {
  empresa_id: number;
  cca_id: number;
  empresas: {
    id: number;
    nome: string;
    cnpj: string;
    ativo: boolean;
  };
}

interface EngenheiroWithCCA {
  engenheiro_id: string;
  cca_id: number;
  engenheiros: {
    id: string;
    nome: string;
    funcao: string;
    matricula: string | null;
    email: string | null;
    ativo: boolean;
  };
}

interface SupervisorWithCCA {
  supervisor_id: string;
  cca_id: number;
  supervisores: {
    id: string;
    nome: string;
    funcao: string;
    matricula: string | null;
    email: string | null;
    ativo: boolean;
  };
}

interface EncarregadoWithCCA {
  encarregado_id: string;
  cca_id: number;
  encarregados: {
    id: string;
    nome: string;
    funcao: string;
    matricula: string | null;
    email: string | null;
    ativo: boolean;
  };
}

interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  cca_id: number | null;
}

interface UseFilteredPersonnelDataProps {
  selectedCcaId?: string;
  allEmpresas: EmpresaWithCCA[];
  allEngenheiros: EngenheiroWithCCA[];
  allSupervisores: SupervisorWithCCA[];
  allEncarregados: EncarregadoWithCCA[];
  allFuncionarios: Funcionario[];
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
    console.log('All Empresas before filtering:', allEmpresas);

    // Filtrar empresas que têm relacionamento com o CCA selecionado
    const filteredEmpresas = allEmpresas.filter(empresa => {
      console.log('Checking empresa CCA ID:', empresa.cca_id, 'against selected:', ccaIdNumber);
      return empresa.cca_id === ccaIdNumber;
    });

    // Filtrar engenheiros que têm relacionamento com o CCA selecionado
    const filteredEngenheiros = allEngenheiros
      .filter(item => {
        console.log('Checking engenheiro CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
        return item.cca_id === ccaIdNumber;
      })
      .map(item => item.engenheiros)
      .filter(Boolean);

    // Filtrar supervisores que têm relacionamento com o CCA selecionado
    const filteredSupervisores = allSupervisores
      .filter(item => {
        console.log('Checking supervisor CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
        return item.cca_id === ccaIdNumber;
      })
      .map(item => item.supervisores)
      .filter(Boolean);

    // Filtrar encarregados que têm relacionamento com o CCA selecionado
    const filteredEncarregados = allEncarregados
      .filter(item => {
        console.log('Checking encarregado CCA ID:', item.cca_id, 'against selected:', ccaIdNumber);
        return item.cca_id === ccaIdNumber;
      })
      .map(item => item.encarregados)
      .filter(Boolean);

    // Filtrar funcionários pelo CCA (tem cca_id direto)
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
