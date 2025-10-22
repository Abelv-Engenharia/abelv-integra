import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ChecklistToken {
  id: string;
  token: string;
  placa: string;
  marca_modelo: string;
  condutor_nome: string;
  tipo_operacao: "Retirada" | "Devolução";
  validade: string;
  usado: boolean;
  created_at: string;
}

export function useChecklistTokens() {
  // Gerar novo token (1 hora de validade)
  const gerarToken = useMutation({
    mutationFn: async (dados: {
      placa: string;
      marca_modelo: string;
      condutor_nome: string;
      tipo_operacao: "Retirada" | "Devolução";
    }) => {
      const token = crypto.randomUUID();
      const validade = new Date();
      validade.setHours(validade.getHours() + 1);

      const { data, error } = await supabase
        .from("veiculos_checklists_tokens")
        .insert([{
          token,
          ...dados,
          validade: validade.toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Link gerado!",
        description: "Link de acesso criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar link",
        description: error.message || "Ocorreu um erro ao gerar o link de acesso",
        variant: "destructive",
      });
    },
  });

  // Validar e obter token
  const validarToken = async (token: string): Promise<ChecklistToken | null> => {
    const { data, error } = await supabase
      .from("veiculos_checklists_tokens")
      .select("*")
      .eq("token", token)
      .gt("validade", new Date().toISOString())
      .eq("usado", false)
      .single();

    if (error) return null;
    return data as ChecklistToken;
  };

  // Marcar token como usado
  const marcarTokenUsado = useMutation({
    mutationFn: async (dados: { token: string; checklistId: string }) => {
      const { error } = await supabase
        .from("veiculos_checklists_tokens")
        .update({ 
          usado: true,
          checklist_id: dados.checklistId 
        })
        .eq("token", dados.token);

      if (error) throw error;
    },
  });

  return {
    gerarToken: gerarToken.mutate,
    isGerandoToken: gerarToken.isPending,
    validarToken,
    marcarTokenUsado: marcarTokenUsado.mutate,
  };
}
