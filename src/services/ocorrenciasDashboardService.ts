
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

export const fetchOcorrenciasStats = async () => {
  // Get today's date
  const today = new Date();
  
  // Calculate start and end of current month
  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);
  
  try {
    // Fetch total occurrences
    const { count: totalOcorrencias } = await supabase
      .from('ocorrencias')
      .select('*', { count: 'exact', head: true });
    
    // Fetch occurrences this month
    const { count: ocorrenciasMes } = await supabase
      .from('ocorrencias')
      .select('*', { count: 'exact', head: true })
      .gte('data', startMonth.toISOString())
      .lte('data', endMonth.toISOString());
    
    // Fetch pending occurrences
    const { count: ocorrenciasPendentes } = await supabase
      .from('ocorrencias')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pendente');
    
    // Calculate risk percentage (high risk)
    const { data: ocorrenciasRisco } = await supabase
      .from('ocorrencias')
      .select('classificacao_risco')
      .in('classificacao_risco', ['Alto', 'Muito Alto'])
      .limit(1000);
    
    const riscoPercentage = totalOcorrencias ? 
      Math.round((ocorrenciasRisco?.length || 0) / totalOcorrencias * 100) : 0;
    
    return {
      totalOcorrencias: totalOcorrencias || 0,
      ocorrenciasMes: ocorrenciasMes || 0,
      ocorrenciasPendentes: ocorrenciasPendentes || 0,
      riscoPercentage
    };
  } catch (error) {
    console.error("Error fetching ocorrencias stats:", error);
    return {
      totalOcorrencias: 0,
      ocorrenciasMes: 0,
      ocorrenciasPendentes: 0,
      riscoPercentage: 0
    };
  }
};

export const fetchOcorrenciasByTipo = async () => {
  try {
    // Fetch occurrences by type
    const { data } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia')
      .limit(1000);
    
    // Count occurrences by type
    const tipoCount = (data || []).reduce((acc: Record<string, number>, ocorrencia) => {
      if (!acc[ocorrencia.tipo_ocorrencia]) {
        acc[ocorrencia.tipo_ocorrencia] = 0;
      }
      acc[ocorrencia.tipo_ocorrencia] += 1;
      return acc;
    }, {});
    
    // Format data for chart
    return Object.entries(tipoCount).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error("Error fetching ocorrencias by tipo:", error);
    return [];
  }
};

export const fetchOcorrenciasByRisco = async () => {
  try {
    // Fetch occurrences by risk
    const { data } = await supabase
      .from('ocorrencias')
      .select('classificacao_risco')
      .limit(1000);
    
    // Count occurrences by risk
    const riscoCount = (data || []).reduce((acc: Record<string, number>, ocorrencia) => {
      if (!acc[ocorrencia.classificacao_risco]) {
        acc[ocorrencia.classificacao_risco] = 0;
      }
      acc[ocorrencia.classificacao_risco] += 1;
      return acc;
    }, {});
    
    // Format data for chart
    return Object.entries(riscoCount).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error("Error fetching ocorrencias by risco:", error);
    return [];
  }
};

export const fetchOcorrenciasByEmpresa = async () => {
  try {
    // Fetch occurrences by company
    const { data } = await supabase
      .from('ocorrencias')
      .select('empresa')
      .limit(1000);
    
    // Count occurrences by company
    const empresaCount = (data || []).reduce((acc: Record<string, number>, ocorrencia) => {
      if (!acc[ocorrencia.empresa]) {
        acc[ocorrencia.empresa] = 0;
      }
      acc[ocorrencia.empresa] += 1;
      return acc;
    }, {});
    
    // Format data for chart
    return Object.entries(empresaCount).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error("Error fetching ocorrencias by empresa:", error);
    return [];
  }
};

export const fetchOcorrenciasTimeline = async () => {
  try {
    // Fetch occurrences with date
    const { data } = await supabase
      .from('ocorrencias')
      .select('data, tipo_ocorrencia')
      .order('data', { ascending: true })
      .limit(1000);
    
    // Group occurrences by month and type
    const timelineData = (data || []).reduce((acc: Record<string, Record<string, number>>, ocorrencia) => {
      const date = new Date(ocorrencia.data);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear };
      }
      
      if (!acc[monthYear][ocorrencia.tipo_ocorrencia]) {
        acc[monthYear][ocorrencia.tipo_ocorrencia] = 0;
      }
      
      acc[monthYear][ocorrencia.tipo_ocorrencia] += 1;
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(timelineData).sort((a, b) => {
      const [aMonth, aYear] = a.name.split('/').map(Number);
      const [bMonth, bYear] = b.name.split('/').map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });
  } catch (error) {
    console.error("Error fetching ocorrencias timeline:", error);
    return [];
  }
};

export const fetchLatestOcorrencias = async () => {
  try {
    // Fetch latest occurrences
    const { data } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false })
      .limit(10);
    
    return data || [];
  } catch (error) {
    console.error("Error fetching latest ocorrencias:", error);
    return [];
  }
};
