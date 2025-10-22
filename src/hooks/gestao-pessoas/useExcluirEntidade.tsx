import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseExcluirEntidadeProps {
  tabela: any;
  queryKey: string[];
  onSuccess?: () => void;
}

export function useExcluirEntidade({ tabela, queryKey, onSuccess }: UseExcluirEntidadeProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso!",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir registro. Tente novamente.",
        variant: "destructive",
      });
    }
  });
}
