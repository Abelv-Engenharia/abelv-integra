import { useNavigate } from "react-router-dom";
import { useDesviosFilters } from "./useDesviosFilters";
import { supabase } from "@/integrations/supabase/client";

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
  const context = useDesviosFilters();

  const navigateToConsulta = async (additionalFilters: NavigationFilters = {}) => {
    const params = new URLSearchParams();
    
    // Adiciona filtros do dashboard atual
    if (context.year && context.year !== "todos") params.set("year", context.year);
    if (context.month && context.month !== "todos") params.set("month", context.month);
    
    // Para CCA, precisamos converter o ID para código
    if (context.ccaId && context.ccaId !== "todos") {
      const selectedCca = context.userCCAs.find(cca => cca.id.toString() === context.ccaId);
      if (selectedCca) {
        params.set("cca", selectedCca.codigo);
      }
    }
    
    // Para disciplina, precisamos converter o ID para nome
    if (context.disciplinaId && context.disciplinaId !== "todos") {
      const { data: disciplinaData } = await supabase
        .from('disciplinas')
        .select('nome')
        .eq('id', parseInt(context.disciplinaId))
        .single();
      
      if (disciplinaData?.nome) {
        params.set("disciplina", disciplinaData.nome);
      }
    }
    
    // Para empresa, precisamos converter o ID para nome
    if (context.empresaId && context.empresaId !== "todos") {
      const { data: empresaData } = await supabase
        .from('empresas')
        .select('nome')
        .eq('id', parseInt(context.empresaId))
        .single();
      
      if (empresaData?.nome) {
        params.set("empresa", empresaData.nome);
      }
    }
    
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