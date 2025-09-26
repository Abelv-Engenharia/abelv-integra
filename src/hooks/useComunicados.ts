import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { comunicadosService } from "@/services/comunicadosService";
import { Comunicado } from "@/types/comunicados";
import { toast } from "@/hooks/use-toast";

export const useComunicados = () => {
  return useQuery({
    queryKey: ['comunicados'],
    queryFn: comunicadosService.getComunicados,
  });
};

export const useComunicadosAtivos = () => {
  return useQuery({
    queryKey: ['comunicados-ativos'],
    queryFn: comunicadosService.getComunicadosAtivos,
  });
};

export const useComunicadosPendentes = () => {
  return useQuery({
    queryKey: ['comunicados-pendentes'],
    queryFn: comunicadosService.getComunicadosPendentes,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCriarComunicado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comunicadosService.criarComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast({
        title: "Sucesso",
        description: "Comunicado criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar comunicado: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAtualizarComunicado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Comunicado>) =>
      comunicadosService.atualizarComunicado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast({
        title: "Sucesso",
        description: "Comunicado atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar comunicado: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useExcluirComunicado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comunicadosService.excluirComunicado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast({
        title: "Sucesso",
        description: "Comunicado excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir comunicado: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRegistrarCiencia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: comunicadosService.registrarCiencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['comunicados-ativos'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao registrar ciência: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useComunicadoPorId = (id: string) => {
  return useQuery({
    queryKey: ['comunicado', id],
    queryFn: () => comunicadosService.getComunicadoPorId(id),
    enabled: !!id,
  });
};