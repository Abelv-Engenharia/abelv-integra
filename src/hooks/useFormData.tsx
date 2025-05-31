
import { useQuery } from "@tanstack/react-query";
import {
  fetchCCAs,
  fetchTiposRegistro,
  fetchProcessos,
  fetchEventosIdentificados,
  fetchCausasProvaveis,
  fetchEmpresas,
  fetchDisciplinas,
  fetchEngenheiros,
  fetchBaseLegalOpcoes,
  fetchSupervisores,
  fetchEncarregados,
  fetchFuncionarios,
} from "@/services/desviosService";

export const useFormData = () => {
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: fetchCCAs,
  });

  const { data: tiposRegistro = [] } = useQuery({
    queryKey: ['tipos-registro'],
    queryFn: fetchTiposRegistro,
  });

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: fetchProcessos,
  });

  const { data: eventosIdentificados = [] } = useQuery({
    queryKey: ['eventos-identificados'],
    queryFn: fetchEventosIdentificados,
  });

  const { data: causasProvaveis = [] } = useQuery({
    queryKey: ['causas-provaveis'],
    queryFn: fetchCausasProvaveis,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: fetchEmpresas,
  });

  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: fetchDisciplinas,
  });

  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros'],
    queryFn: fetchEngenheiros,
  });

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores'],
    queryFn: fetchSupervisores,
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados'],
    queryFn: fetchEncarregados,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: fetchFuncionarios,
  });

  return {
    ccas,
    tiposRegistro,
    processos,
    eventosIdentificados,
    causasProvaveis,
    empresas,
    disciplinas,
    engenheiros,
    baseLegalOpcoes,
    supervisores,
    encarregados,
    funcionarios,
  };
};
