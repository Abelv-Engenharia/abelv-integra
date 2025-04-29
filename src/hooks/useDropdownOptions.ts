
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  ClassificacaoRisco, 
  TipoOcorrencia,
  StatusTarefa,
  TipoDesvio,
  ClassificacaoDesvio,
  StatusDesvio,
  TipoTreinamento,
  CCA,
  CriticidadeTarefa,
  Disciplina,
  ParteCorpo,
  Empresa
} from "@/types/database";

// Generic option type for dropdowns
export type DropdownOption = {
  value: string | number;
  label: string;
  color?: string;
  description?: string;
  disabled?: boolean;
};

// Hook to fetch and transform data for dropdown options
export function useDropdownOptions<T extends { id: number | string; nome: string; ativo?: boolean; cor?: string; descricao?: string }>(
  tableName: string,
  orderBy: string = "nome",
  orderDirection: "asc" | "desc" = "asc",
) {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from(tableName)
          .select("*");

        if (orderBy) {
          query = query.order(orderBy, { ascending: orderDirection === "asc" });
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Transform the data for dropdown options
        const mappedOptions: DropdownOption[] = data.map((item: T) => ({
          value: String(item.id), // Convert to string for consistency
          label: item.nome,
          color: item.cor,
          description: item.descricao,
          disabled: item.ativo === false
        }));
        
        setOptions(mappedOptions);
      } catch (err) {
        console.error(`Error fetching ${tableName} options:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [tableName, orderBy, orderDirection]);

  return { options, isLoading, error };
}

// Specific hooks for each dropdown type
export const useClassificacaoRiscosOptions = () => 
  useDropdownOptions<ClassificacaoRisco>("classificacao_riscos", "ordem");

export const useTipoOcorrenciaOptions = () => 
  useDropdownOptions<TipoOcorrencia>("tipos_ocorrencia");

export const useStatusTarefasOptions = () => 
  useDropdownOptions<StatusTarefa>("status_tarefas", "ordem");

export const useTipoDesvioOptions = () => 
  useDropdownOptions<TipoDesvio>("tipos_desvio");

export const useClassificacaoDesviosOptions = () => 
  useDropdownOptions<ClassificacaoDesvio>("classificacao_desvios", "ordem");

export const useStatusDesviosOptions = () => 
  useDropdownOptions<StatusDesvio>("status_desvios", "ordem");

export const useTipoTreinamentoOptions = () => 
  useDropdownOptions<TipoTreinamento>("tipos_treinamento");

export const useCCAOptions = () => 
  useDropdownOptions<CCA>("ccas");

export const useCriticidadeTarefasOptions = () => 
  useDropdownOptions<CriticidadeTarefa>("criticidade_tarefas", "ordem");

export const useDisciplinasOptions = () => 
  useDropdownOptions<Disciplina>("disciplinas");

export const usePartesCorpoOptions = () => 
  useDropdownOptions<ParteCorpo>("partes_corpo");

export const useEmpresasOptions = () => 
  useDropdownOptions<Empresa>("empresas");
