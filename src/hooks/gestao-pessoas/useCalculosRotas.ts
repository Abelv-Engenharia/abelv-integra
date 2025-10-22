import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { CalculoEstimativaCartao } from "@/types/gestao-pessoas/route";

export function useCalculosRotas() {
  const queryClient = useQueryClient();

  const { data: calculos = [], isLoading } = useQuery({
    queryKey: ['calculos-rotas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos_calculos_rotas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformar dados do banco para o formato esperado pelo componente
      return (data || []).map(item => ({
        id: item.id,
        veiculoId: item.veiculo_id || '',
        placa: item.placa,
        modelo: item.modelo,
        cartaoId: item.cartao_id || undefined,
        consumoKmL: Number(item.consumo_km_l),
        precoCombustivelPorLitro: Number(item.preco_combustivel_litro),
        tipoCombustivel: item.tipo_combustivel,
        margemSegurancaPct: item.margem_seguranca_pct,
        rotaPrincipal: item.rota_principal as unknown as any,
        trajetosAdicionais: (item.trajetos_adicionais as unknown as any) || [],
        distanciaTotalMensalKm: Number(item.distancia_total_mensal_km),
        litrosNecessarios: Number(item.litros_necessarios),
        custoEstimadoBase: Number(item.custo_estimado_base),
        valorMargemSeguranca: Number(item.valor_margem_seguranca),
        custoEstimadoComMargem: Number(item.custo_estimado_com_margem),
        limiteAtualCartao: item.limite_atual_cartao ? Number(item.limite_atual_cartao) : undefined,
        diferencaLimite: item.diferenca_limite ? Number(item.diferenca_limite) : undefined,
        percentualDiferenca: item.percentual_diferenca ? Number(item.percentual_diferenca) : undefined,
        dataCalculo: new Date(item.created_at),
        observacoes: item.observacoes || undefined,
        // Campos adicionais para exibição
        enderecoBaseNome: item.endereco_base_nome,
        enderecoBase: item.endereco_base,
        enderecoObraNome: item.endereco_obra_nome,
        enderecoObra: item.endereco_obra,
      } as CalculoEstimativaCartao));
    }
  });

  const salvarCalculo = useMutation({
    mutationFn: async (calculo: CalculoEstimativaCartao) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('veiculos_calculos_rotas')
        .insert([{
          veiculo_id: calculo.veiculoId,
          placa: calculo.placa,
          modelo: calculo.modelo,
          cartao_id: calculo.cartaoId || null,
          consumo_km_l: calculo.consumoKmL,
          preco_combustivel_litro: calculo.precoCombustivelPorLitro,
          tipo_combustivel: calculo.tipoCombustivel,
          margem_seguranca_pct: calculo.margemSegurancaPct,
          dias_uteis: calculo.rotaPrincipal.diasUteis,
          frequencia_diaria: calculo.rotaPrincipal.frequenciaDiaria,
          endereco_base_nome: calculo.enderecoBaseNome || calculo.rotaPrincipal.origem,
          endereco_base: calculo.enderecoBase || '',
          endereco_obra_nome: calculo.enderecoObraNome || calculo.rotaPrincipal.destino,
          endereco_obra: calculo.enderecoObra || '',
          rota_principal: calculo.rotaPrincipal as any,
          trajetos_adicionais: calculo.trajetosAdicionais as any,
          distancia_total_mensal_km: calculo.distanciaTotalMensalKm,
          litros_necessarios: calculo.litrosNecessarios,
          custo_estimado_base: calculo.custoEstimadoBase,
          valor_margem_seguranca: calculo.valorMargemSeguranca,
          custo_estimado_com_margem: calculo.custoEstimadoComMargem,
          limite_atual_cartao: calculo.limiteAtualCartao || null,
          diferenca_limite: calculo.diferencaLimite || null,
          percentual_diferenca: calculo.percentualDiferenca || null,
          observacoes: calculo.observacoes || null,
          created_by: userData.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculos-rotas'] });
      toast({
        title: "Cálculo salvo",
        description: "O cálculo foi salvo com sucesso no histórico."
      });
    },
    onError: (error) => {
      console.error('Erro ao salvar cálculo:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o cálculo.",
        variant: "destructive"
      });
    }
  });

  const excluirCalculo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('veiculos_calculos_rotas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculos-rotas'] });
      toast({
        title: "Cálculo excluído",
        description: "O cálculo foi removido do histórico."
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o cálculo.",
        variant: "destructive"
      });
    }
  });

  return {
    calculos,
    isLoading,
    salvarCalculo: salvarCalculo.mutate,
    excluirCalculo: excluirCalculo.mutate,
    isSalvando: salvarCalculo.isPending,
    isExcluindo: excluirCalculo.isPending
  };
}
