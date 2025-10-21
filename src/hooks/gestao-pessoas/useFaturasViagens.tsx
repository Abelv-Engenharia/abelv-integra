import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FaturaIntegra } from "@/types/gestao-pessoas/travel";

export const useFaturasViagens = (filters?: {
  dataInicial?: string;
  dataFinal?: string;
  agencia?: string[];
  tipo?: string[];
  cca?: string[];
  viajante?: string;
  dentroPolitica?: 'Sim' | 'Não' | 'Todas';
}) => {
  return useQuery({
    queryKey: ['faturas-viagens', filters],
    queryFn: async () => {
      let query = supabase
        .from('faturas_viagens_integra')
        .select('*')
        .order('dataemissaofat', { ascending: false });

      // Aplicar filtros
      if (filters?.dataInicial) {
        query = query.gte('dataemissaofat', filters.dataInicial);
      }
      if (filters?.dataFinal) {
        query = query.lte('dataemissaofat', filters.dataFinal);
      }
      if (filters?.agencia && filters.agencia.length > 0) {
        query = query.in('agencia', filters.agencia);
      }
      if (filters?.tipo && filters.tipo.length > 0) {
        query = query.in('tipo', filters.tipo);
      }
      if (filters?.cca && filters.cca.length > 0) {
        query = query.in('cca', filters.cca);
      }
      if (filters?.viajante) {
        query = query.ilike('viajante', `%${filters.viajante}%`);
      }
      if (filters?.dentroPolitica && filters.dentroPolitica !== 'Todas') {
        query = query.eq('dentrodapolitica', filters.dentroPolitica);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Converter os dados do Supabase para o formato esperado pelo frontend
      return (data || []).map(row => ({
        id: row.id,
        dataemissaofat: row.dataemissaofat,
        agencia: row.agencia,
        numerodefat: row.numerodefat,
        protocolo: row.protocolo,
        datadacompra: row.datadacompra,
        viajante: row.viajante,
        tipo: row.tipo,
        hospedagem: row.hospedagem || '',
        origem: row.origem,
        destino: row.destino,
        checkin: row.checkin || '',
        checkout: row.checkout || '',
        comprador: row.comprador,
        valorpago: row.valorpago,
        motivoevento: row.motivoevento,
        cca: row.cca,
        centrodecusto: row.centrodecusto,
        antecedencia: row.antecedencia || 0,
        ciaida: row.ciaida || '',
        ciavolta: row.ciavolta || '',
        possuibagagem: row.possuibagagem,
        valorpagodebagagem: row.valorpagodebagagem || 0,
        observacao: row.observacao || '',
        quemsolicitouforapolitica: row.quemsolicitouforapolitica || '',
        dentrodapolitica: row.dentrodapolitica,
        codconta: row.codconta || '',
        contafinanceira: row.contafinanceira || ''
      })) as FaturaIntegra[];
    }
  });
};

export const useFaturasViagensPorPeriodo = (dataInicial: string, dataFinal: string) => {
  return useFaturasViagens({ dataInicial, dataFinal });
};
