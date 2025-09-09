import { useNavigate } from "react-router-dom";
import { useDesviosFilters } from "./useDesviosFilters";

export interface NavigationFilters {
  disciplina?: string;
  empresa?: string;
  classificacao?: string;
  tipo?: string;
  evento?: string;
  processo?: string;
  baseLegal?: string;
}

export const useDesviosNavigation = () => {
  const navigate = useNavigate();
  const { year, month, ccaId, disciplinaId, empresaId } = useDesviosFilters();

  const navigateToConsulta = (additionalFilters: NavigationFilters = {}) => {
    const params = new URLSearchParams();
    
    // Adiciona filtros do dashboard atual
    if (year && year !== "todos") params.set("year", year);
    if (month && month !== "todos") params.set("month", month);
    if (ccaId && ccaId !== "todos") params.set("cca", ccaId);
    if (disciplinaId && disciplinaId !== "todos") params.set("disciplina", disciplinaId);
    if (empresaId && empresaId !== "todos") params.set("empresa", empresaId);
    
    // Adiciona filtros específicos do clique no gráfico
    if (additionalFilters.disciplina) params.set("disciplina", additionalFilters.disciplina);
    if (additionalFilters.empresa) params.set("empresa", additionalFilters.empresa);
    if (additionalFilters.classificacao) params.set("classificacao", additionalFilters.classificacao);
    if (additionalFilters.tipo) params.set("tipo", additionalFilters.tipo);
    if (additionalFilters.evento) params.set("evento", additionalFilters.evento);
    if (additionalFilters.processo) params.set("processo", additionalFilters.processo);
    if (additionalFilters.baseLegal) params.set("baseLegal", additionalFilters.baseLegal);
    
    const queryString = params.toString();
    const path = queryString ? `/desvios/consulta?${queryString}` : "/desvios/consulta";
    
    navigate(path);
  };

  return { navigateToConsulta };
};