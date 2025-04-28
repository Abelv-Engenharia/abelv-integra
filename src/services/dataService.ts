
import { supabase } from '@/lib/supabase';
import { Funcionario, Treinamento, TreinamentoNormativo, ExecucaoTreinamento } from '@/types/treinamentos';

// Base service for handling common operations
const baseService = {
  handleError: (error: any) => {
    console.error('Database error:', error);
    throw new Error(error.message || 'Ocorreu um erro ao acessar o banco de dados');
  }
};

// Funcionarios service
export const funcionariosService = {
  async getAll(): Promise<Funcionario[]> {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('ativo', true)
      .order('nome');
      
    if (error) baseService.handleError(error);
    return data as Funcionario[];
  },
  
  async getById(id: string): Promise<Funcionario> {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) baseService.handleError(error);
    return data as Funcionario;
  },
  
  async create(funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> {
    const { data, error } = await supabase
      .from('funcionarios')
      .insert(funcionario)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    return data as Funcionario;
  },
  
  async update(id: string, funcionario: Partial<Funcionario>): Promise<Funcionario> {
    const { data, error } = await supabase
      .from('funcionarios')
      .update(funcionario)
      .eq('id', id)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    return data as Funcionario;
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('funcionarios')
      .update({ ativo: false })
      .eq('id', id);
      
    if (error) baseService.handleError(error);
  },
  
  async uploadFoto(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('funcionarios')
      .upload(filePath, file);
      
    if (error) baseService.handleError(error);
    
    const { data: { publicUrl } } = supabase.storage
      .from('funcionarios')
      .getPublicUrl(filePath);
      
    return publicUrl;
  }
};

// Treinamentos service
export const treinamentosService = {
  async getAll(): Promise<Treinamento[]> {
    const { data, error } = await supabase
      .from('treinamentos')
      .select('*')
      .order('nome');
      
    if (error) baseService.handleError(error);
    return data as Treinamento[];
  },
  
  async getById(id: string): Promise<Treinamento> {
    const { data, error } = await supabase
      .from('treinamentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) baseService.handleError(error);
    return data as Treinamento;
  },
  
  async create(treinamento: Omit<Treinamento, 'id'>): Promise<Treinamento> {
    const { data, error } = await supabase
      .from('treinamentos')
      .insert(treinamento)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    return data as Treinamento;
  },
  
  async update(id: string, treinamento: Partial<Treinamento>): Promise<Treinamento> {
    const { data, error } = await supabase
      .from('treinamentos')
      .update(treinamento)
      .eq('id', id)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    return data as Treinamento;
  }
};

// Treinamentos Normativos service
export const treinamentosNormativosService = {
  async getAll(): Promise<TreinamentoNormativo[]> {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        *,
        funcionarios:funcionario_id(*),
        treinamentos:treinamento_id(*)
      `)
      .order('data_validade');
      
    if (error) baseService.handleError(error);
    
    // Transform the data to match our type
    return data.map((item: any) => ({
      id: item.id,
      funcionarioId: item.funcionario_id,
      treinamentoId: item.treinamento_id,
      tipo: item.tipo,
      dataRealizacao: new Date(item.data_realizacao),
      dataInicio: new Date(item.data_inicio),
      dataValidade: new Date(item.data_validade),
      certificadoUrl: item.certificado_url,
      status: item.status,
      arquivado: item.arquivado
    }));
  },
  
  async getByFuncionarioId(funcionarioId: string): Promise<TreinamentoNormativo[]> {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        *,
        treinamentos:treinamento_id(*)
      `)
      .eq('funcionario_id', funcionarioId)
      .order('data_validade');
      
    if (error) baseService.handleError(error);
    
    // Transform the data to match our type
    return data.map((item: any) => ({
      id: item.id,
      funcionarioId: item.funcionario_id,
      treinamentoId: item.treinamento_id,
      tipo: item.tipo,
      dataRealizacao: new Date(item.data_realizacao),
      dataInicio: new Date(item.data_inicio),
      dataValidade: new Date(item.data_validade),
      certificadoUrl: item.certificado_url,
      status: item.status,
      arquivado: item.arquivado
    }));
  },
  
  async create(treinamento: Omit<TreinamentoNormativo, 'id'>): Promise<TreinamentoNormativo> {
    const dataToInsert = {
      funcionario_id: treinamento.funcionarioId,
      treinamento_id: treinamento.treinamentoId,
      tipo: treinamento.tipo,
      data_inicio: treinamento.dataInicio.toISOString(),
      data_realizacao: treinamento.dataRealizacao.toISOString(),
      data_validade: treinamento.dataValidade.toISOString(),
      certificado_url: treinamento.certificadoUrl,
      status: treinamento.status,
      arquivado: treinamento.arquivado
    };
    
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .insert(dataToInsert)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    
    // Transform the data to match our type
    return {
      id: data.id,
      funcionarioId: data.funcionario_id,
      treinamentoId: data.treinamento_id,
      tipo: data.tipo,
      dataRealizacao: new Date(data.data_realizacao),
      dataInicio: new Date(data.data_inicio),
      dataValidade: new Date(data.data_validade),
      certificadoUrl: data.certificado_url,
      status: data.status,
      arquivado: data.arquivado
    };
  },
  
  async uploadCertificado(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('certificados')
      .upload(filePath, file);
      
    if (error) baseService.handleError(error);
    
    const { data: { publicUrl } } = supabase.storage
      .from('certificados')
      .getPublicUrl(filePath);
      
    return publicUrl;
  }
};

// Execução de Treinamentos service
export const execucaoTreinamentosService = {
  async getAll(): Promise<ExecucaoTreinamento[]> {
    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .select(`
        *,
        treinamentos:treinamento_id(*)
      `)
      .order('data', { ascending: false });
      
    if (error) baseService.handleError(error);
    
    // Transform the data to match our type
    return data.map((item: any) => ({
      id: item.id,
      data: new Date(item.data),
      mes: item.mes,
      ano: item.ano,
      cca: item.cca,
      processoTreinamento: item.processo_treinamento,
      tipoTreinamento: item.tipo_treinamento,
      treinamentoId: item.treinamento_id,
      treinamentoNome: item.treinamento_nome || (item.treinamentos ? item.treinamentos.nome : null),
      cargaHoraria: item.carga_horaria,
      observacoes: item.observacoes,
      listaPresencaUrl: item.lista_presenca_url
    }));
  },
  
  async create(execucao: Omit<ExecucaoTreinamento, 'id'>): Promise<ExecucaoTreinamento> {
    const dataToInsert = {
      data: execucao.data.toISOString(),
      mes: execucao.mes,
      ano: execucao.ano,
      cca: execucao.cca,
      processo_treinamento: execucao.processoTreinamento,
      tipo_treinamento: execucao.tipoTreinamento,
      treinamento_id: execucao.treinamentoId,
      treinamento_nome: execucao.treinamentoNome,
      carga_horaria: execucao.cargaHoraria,
      observacoes: execucao.observacoes,
      lista_presenca_url: execucao.listaPresencaUrl
    };
    
    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .insert(dataToInsert)
      .select()
      .single();
      
    if (error) baseService.handleError(error);
    
    // Transform the data to match our type
    return {
      id: data.id,
      data: new Date(data.data),
      mes: data.mes,
      ano: data.ano,
      cca: data.cca,
      processoTreinamento: data.processo_treinamento,
      tipoTreinamento: data.tipo_treinamento,
      treinamentoId: data.treinamento_id,
      treinamentoNome: data.treinamento_nome,
      cargaHoraria: data.carga_horaria,
      observacoes: data.observacoes,
      listaPresencaUrl: data.lista_presenca_url
    };
  },
  
  async uploadListaPresenca(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('treinamentos')
      .upload(filePath, file);
      
    if (error) baseService.handleError(error);
    
    const { data: { publicUrl } } = supabase.storage
      .from('treinamentos')
      .getPublicUrl(filePath);
      
    return publicUrl;
  }
};

// Add services for other entities (desvios, ocorrencias, etc.) following the same pattern
