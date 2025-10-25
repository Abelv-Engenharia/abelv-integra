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
  ajudaAluguel: number;
  ajudaCusto: number;
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
  // Novos campos
  descricaoAtividade: string | null;
  numeroCnae: string | null;
  grauDeRisco: string | null;
  contaBancaria: string | null;
  numeroCredorSienge: string | null;
  dataNascimento: string | null;
  rg: string | null;
  registroFuncional: string | null;
  telefoneRepresentante: string | null;
  emailRepresentante: string | null;
  usuarioSistemaId: string | null;
  enderecoRepresentante: string | null;
  tempoContrato: string;
  dataInicioContratoDeterminado: string | null;
  dataFimContratoDeterminado: string | null;
  auxilioConvenioMedico: boolean;
  valorAuxilioConvenioMedico: number;
  valeRefeicao: number;
  veiculo: boolean;
  celular: boolean;
  alojamento: boolean;
  folgaCampo: string | null;
  periodoFerias: string | null;
  quantidadeDiasFerias: number | null;
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
        .select(`
          *,
          ccas:cca_id (
            id,
            codigo,
            nome
          )
        `)
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
    ccaCodigo: data.ccas?.codigo || data.cca_codigo,
    ccaNome: data.ccas?.nome || data.cca_nome,
    valorPrestacaoServico: data.valorprestacaoservico || 0,
    dataInicioContrato: data.datainiciocontrato,
    servico: data.servico,
    chavePix: data.chavepix,
    ajudaAluguel: data.ajudaaluguel || 0,
    ajudaCusto: data.ajudacusto || 0,
    almoco: data.almoco,
    cafeManha: data.cafemanha,
    cafeTarde: data.cafetarde,
    valorAlmoco: data.valoralmoco || 0,
    valorCafeManha: data.valorcafemanha || 0,
    valorCafeTarde: data.valorcafetarde || 0,
    contratoUrl: data.contrato_url,
    contratoNome: data.contrato_nome,
    ativo: data.ativo,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    // Novos campos
    descricaoAtividade: data.descricaoatividade,
    numeroCnae: data.numerocnae,
    grauDeRisco: data.grauderisco,
    contaBancaria: data.contabancaria,
    numeroCredorSienge: data.numerocredorsienge,
    dataNascimento: data.datanascimento,
    rg: data.rg,
    registroFuncional: data.registrofuncional,
    telefoneRepresentante: data.telefonerepresentante,
    emailRepresentante: data.emailrepresentante,
    usuarioSistemaId: data.usuario_sistema_id,
    enderecoRepresentante: data.enderecorepresentante,
    tempoContrato: data.tempocontrato || 'padrao',
    dataInicioContratoDeterminado: data.datainiciocontratodeterminado,
    dataFimContratoDeterminado: data.datafimcontratodeterminado,
    auxilioConvenioMedico: data.auxilioconveniomedico || false,
    valorAuxilioConvenioMedico: data.valorauxilioconveniomedico || 0,
    valeRefeicao: data.valerefeicao || 0,
    veiculo: data.veiculo || false,
    celular: data.celular || false,
    alojamento: data.alojamento || false,
    folgaCampo: data.folgacampo,
    periodoFerias: data.periodoferias,
    quantidadeDiasFerias: data.quantidadediasferias,
  };
}

function mapPrestadorToDB(data: any): any {
  const cleanData: any = {
    nomecompleto: data.nomeCompleto || null,
    razaosocial: data.razaoSocial || null,
    cpf: data.cpf || null,
    cnpj: data.cnpj || null,
    email: data.email || null,
    telefone: data.telefone || null,
    endereco: data.endereco || null,
    cca_id: data.ccaId || null,
    cca_codigo: data.ccaCodigo || null,
    cca_nome: data.ccaNome || null,
    valorprestacaoservico: typeof data.valorPrestacaoServico === 'number' ? data.valorPrestacaoServico : 0,
    datainiciocontrato: data.dataInicioContrato || null,
    servico: data.servico || null,
    chavepix: data.chavePix || null,
    ajudaaluguel: typeof data.ajudaAluguel === 'number' ? data.ajudaAluguel : 0,
    ajudacusto: typeof data.ajudaCusto === 'number' ? data.ajudaCusto : 0,
    almoco: Boolean(data.almoco),
    cafemanha: Boolean(data.cafeManha),
    cafetarde: Boolean(data.cafeTarde),
    valoralmoco: typeof data.valorAlmoco === 'number' ? data.valorAlmoco : 0,
    valorcafemanha: typeof data.valorCafeManha === 'number' ? data.valorCafeManha : 0,
    valorcafetarde: typeof data.valorCafeTarde === 'number' ? data.valorCafeTarde : 0,
    contrato_url: data.contratoUrl || null,
    contrato_nome: data.contratoNome || null,
    ativo: data.ativo ?? true,
    // Novos campos
    descricaoatividade: data.descricaoAtividade || null,
    numerocnae: data.numeroCnae || null,
    grauderisco: data.grauDeRisco || null,
    contabancaria: data.contaBancaria || null,
    numerocredorsienge: data.numeroCredorSienge || null,
    datanascimento: data.dataNascimento || null,
    rg: data.rg || null,
    registrofuncional: data.registroFuncional || null,
    telefonerepresentante: data.telefoneRepresentante || null,
    emailrepresentante: data.emailRepresentante || null,
    usuario_sistema_id: data.usuarioSistemaId || null,
    enderecorepresentante: data.enderecoRepresentante || null,
    tempocontrato: data.tempoContrato || 'padrao',
    datainiciocontratodeterminado: data.dataInicioContratoDeterminado || null,
    datafimcontratodeterminado: data.dataFimContratoDeterminado || null,
    auxilioconveniomedico: Boolean(data.auxilioConvenioMedico),
    valorauxilioconveniomedico: typeof data.valorAuxilioConvenioMedico === 'number' ? data.valorAuxilioConvenioMedico : 0,
    valerefeicao: typeof data.valeRefeicao === 'number' ? data.valeRefeicao : 0,
    veiculo: Boolean(data.veiculo),
    celular: Boolean(data.celular),
    alojamento: Boolean(data.alojamento),
    folgacampo: data.folgaCampo || null,
    periodoferias: data.periodoFerias || null,
    quantidadediasferias: data.quantidadeDiasFerias ? parseInt(String(data.quantidadeDiasFerias)) : null,
  };

  // Remove campos undefined para evitar sobrescrever valores no update
  Object.keys(cleanData).forEach(key => {
    if (cleanData[key] === undefined) {
      delete cleanData[key];
    }
  });

  return cleanData;
}
