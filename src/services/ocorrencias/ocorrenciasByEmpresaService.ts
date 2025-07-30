
import { supabase } from '@/integrations/supabase/client';
import { OcorrenciasByEmpresa } from './types';

export async function fetchOcorrenciasByEmpresa(ccaIds?: number[], year?: string, month?: string): Promise<OcorrenciasByEmpresa[]> {
  try {
    let query = supabase
      .from('ocorrencias')
      .select(`
        empresa,
        cca
      `);

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Converter ccaIds para string e filtrar diretamente
      const ccaIdsAsString = ccaIds.map(id => id.toString());
      query = query.in('cca', ccaIdsAsString);
    }

    // Aplicar filtro de ano se fornecido
    if (year && year !== 'todos') {
      query = query.eq('ano', parseInt(year));
    }

    // Aplicar filtro de mês se fornecido
    if (month && month !== 'todos') {
      query = query.eq('mes', parseInt(month));
    }

    const { data, error } = await query.order('empresa');

    if (error) throw error;

    // Buscar os nomes das empresas
    const empresaIds = [...new Set(data?.map(item => parseInt(item.empresa)).filter(id => !isNaN(id)))];
    let empresasMap: Record<string, string> = {};
    
    if (empresaIds.length > 0) {
      const { data: empresasData } = await supabase
        .from('empresas')
        .select('id, nome')
        .in('id', empresaIds);
      
      if (empresasData) {
        empresasMap = empresasData.reduce((acc, emp) => {
          acc[emp.id.toString()] = emp.nome;
          return acc;
        }, {});
      }
    }

    // Agrupar e contar as ocorrências por empresa
    const empresasContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const empresaId = ocorrencia.empresa;
      const empresaNome = empresasMap[empresaId] || `Empresa ${empresaId}` || 'Não especificada';
      empresasContagem[empresaNome] = (empresasContagem[empresaNome] || 0) + 1;
    });

    return Object.entries(empresasContagem).map(([empresa, quantidade]) => ({
      name: empresa,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por empresa:', error);
    return [];
  }
}
