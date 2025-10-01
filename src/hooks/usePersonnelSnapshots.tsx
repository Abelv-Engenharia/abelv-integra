import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonnelSnapshot, PersonType, PersonnelData } from "@/types/personnelSnapshot";
import { useToast } from "@/hooks/use-toast";

export const usePersonnelSnapshots = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar snapshots por pessoa
  const getSnapshotsByPerson = async (originalId: string, personType: PersonType) => {
    const { data, error } = await supabase
      .from('personnel_snapshots')
      .select('*')
      .eq('original_id', originalId)
      .eq('person_type', personType)
      .order('snapshot_date', { ascending: false });

    if (error) throw error;
    return data as unknown as PersonnelSnapshot[];
  };

  // Criar snapshot manualmente
  const createSnapshotMutation = useMutation({
    mutationFn: async ({ personId, personType }: { personId: string; personType: PersonType }) => {
      // Chamar a função específica de acordo com o tipo
      let result;
      switch (personType) {
        case 'funcionario':
          result = await supabase.rpc('create_funcionario_snapshot', { p_funcionario_id: personId });
          break;
        case 'engenheiro':
          result = await supabase.rpc('create_engenheiro_snapshot', { p_engenheiro_id: personId });
          break;
        case 'supervisor':
          result = await supabase.rpc('create_supervisor_snapshot', { p_supervisor_id: personId });
          break;
        case 'encarregado':
          result = await supabase.rpc('create_encarregado_snapshot', { p_encarregado_id: personId });
          break;
      }

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel_snapshots'] });
      toast({
        title: "Snapshot criado",
        description: "Dados históricos preservados com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar snapshot:', error);
      toast({
        title: "Erro ao criar snapshot",
        description: "Não foi possível preservar os dados históricos",
        variant: "destructive",
      });
    },
  });

  // Buscar dados de pessoal (com fallback para snapshot se inativo)
  const getPersonnelData = async (
    personId: string, 
    personType: PersonType, 
    preferCurrent: boolean = true
  ): Promise<PersonnelData | null> => {
    const { data, error } = await supabase.rpc('get_personnel_data', {
      p_person_id: personId,
      p_person_type: personType,
      p_prefer_current: preferCurrent
    });

    if (error) {
      console.error('Erro ao buscar dados de pessoal:', error);
      return null;
    }

    return data as unknown as PersonnelData;
  };

  // Hook para buscar dados de pessoal com cache
  const usePersonnelData = (personId: string | undefined, personType: PersonType) => {
    return useQuery({
      queryKey: ['personnel_data', personId, personType],
      queryFn: () => getPersonnelData(personId!, personType),
      enabled: !!personId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  // Hook para buscar snapshots
  const useSnapshots = (originalId: string | undefined, personType: PersonType) => {
    return useQuery({
      queryKey: ['personnel_snapshots', originalId, personType],
      queryFn: () => getSnapshotsByPerson(originalId!, personType),
      enabled: !!originalId,
    });
  };

  return {
    createSnapshot: createSnapshotMutation.mutate,
    getPersonnelData,
    usePersonnelData,
    useSnapshots,
    isCreatingSnapshot: createSnapshotMutation.isPending,
  };
};
