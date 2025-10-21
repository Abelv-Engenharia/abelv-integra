import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PrestadorPJ {
  id: string;
  nomeCompleto: string;
  razaoSocial: string;
  cpf: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  ccaId: number | null;
  ccaCodigo: string | null;
  ccaNome: string | null;
  valorPrestacaoServico: number;
  dataInicioContrato: string;
  servico: string;
  chavePix: string | null;
  ajudaAluguel: boolean;
  ajudaCusto: boolean;
  almoco: boolean;
  cafeManha: boolean;
  cafeTarde: boolean;
  valorAlmoco: number;
  valorCafeManha: number;
  valorCafeTarde: number;
  contratoUrl: string | null;
  contratoNome: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FiltrosPrestadoresPJ {
  ccaId?: number;
  nome?: string;
  cnpj?: string;
  ativo?: boolean;
}

export function usePrestadoresPJ() {
  return useQuery({
    queryKey: ["prestadores-pj"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores_pj")
        .select("*")
        .eq("ativo", true)
        .order("nomecompleto");

      if (error) throw error;

      return (data || []).map(mapPrestadorFromDB);
    },
  });
}

export function usePrestadoresPJFiltrados(filtros: FiltrosPrestadoresPJ) {
  return useQuery({
    queryKey: ["prestadores-pj-filtrados", filtros],
    queryFn: async () => {
      let query = supabase
        .from("prestadores_pj")
        .select("*")
        .eq("ativo", filtros.ativo ?? true);

      if (filtros.ccaId) {
        query = query.eq("cca_id", filtros.ccaId);
      }

      if (filtros.nome) {
        query = query.ilike("nomecompleto", `%${filtros.nome}%`);
      }

      if (filtros.cnpj) {
        query = query.ilike("cnpj", `%${filtros.cnpj}%`);
      }

      const { data, error } = await query.order("nomecompleto");

      if (error) throw error;

      return (data || []).map(mapPrestadorFromDB);
    },
  });
}

export function usePrestadorPJById(id: string | undefined) {
  return useQuery({
    queryKey: ["prestador-pj", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("prestadores_pj")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return mapPrestadorFromDB(data);
    },
    enabled: !!id,
  });
}

export function useCreatePrestadorPJ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prestador: Omit<PrestadorPJ, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("prestadores_pj")
        .insert([mapPrestadorToDB(prestador)])
        .select()
        .single();

      if (error) throw error;

      return mapPrestadorFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-pj"] });
      toast.success("Prestador PJ criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar prestador: ${error.message}`);
    },
  });
}

export function useUpdatePrestadorPJ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...prestador }: Partial<PrestadorPJ> & { id: string }) => {
      const { data, error } = await supabase
        .from("prestadores_pj")
        .update(mapPrestadorToDB(prestador))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return mapPrestadorFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-pj"] });
      toast.success("Prestador PJ atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar prestador: ${error.message}`);
    },
  });
}

export function useDeletePrestadorPJ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prestadores_pj")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores-pj"] });
      toast.success("Prestador PJ desativado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao desativar prestador: ${error.message}`);
    },
  });
}

function mapPrestadorFromDB(data: any): PrestadorPJ {
  return {
    id: data.id,
    nomeCompleto: data.nomecompleto,
    razaoSocial: data.razaosocial,
    cpf: data.cpf,
    cnpj: data.cnpj,
    email: data.email,
    telefone: data.telefone,
    endereco: data.endereco,
    ccaId: data.cca_id,
    ccaCodigo: data.cca_codigo,
    ccaNome: data.cca_nome,
    valorPrestacaoServico: data.valorprestacaoservico,
    dataInicioContrato: data.datainiciocontrato,
    servico: data.servico,
    chavePix: data.chavepix,
    ajudaAluguel: data.ajudaaluguel,
    ajudaCusto: data.ajudacusto,
    almoco: data.almoco,
    cafeManha: data.cafemanha,
    cafeTarde: data.cafetarde,
    valorAlmoco: data.valoralmoco,
    valorCafeManha: data.valorcafemanha,
    valorCafeTarde: data.valorcafetarde,
    contratoUrl: data.contrato_url,
    contratoNome: data.contrato_nome,
    ativo: data.ativo,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapPrestadorToDB(data: any): any {
  return {
    nomecompleto: data.nomeCompleto,
    razaosocial: data.razaoSocial,
    cpf: data.cpf,
    cnpj: data.cnpj,
    email: data.email,
    telefone: data.telefone,
    endereco: data.endereco,
    cca_id: data.ccaId,
    cca_codigo: data.ccaCodigo,
    cca_nome: data.ccaNome,
    valorprestacaoservico: data.valorPrestacaoServico,
    datainiciocontrato: data.dataInicioContrato,
    servico: data.servico,
    chavepix: data.chavePix,
    ajudaaluguel: data.ajudaAluguel,
    ajudacusto: data.ajudaCusto,
    almoco: data.almoco,
    cafemanha: data.cafeManha,
    cafetarde: data.cafeTarde,
    valoralmoco: data.valorAlmoco,
    valorcafemanha: data.valorCafeManha,
    valorcafetarde: data.valorCafeTarde,
    contrato_url: data.contratoUrl,
    contrato_nome: data.contratoNome,
    ativo: data.ativo ?? true,
  };
}
