import { useState, useEffect } from 'react';
import { RNC } from '@/types/rnc';

// Mock data for demonstration
const mockRNCs: RNC[] = [
  {
    id: '1',
    numero: '001',
    data: '2024-12-09',
    cca: '24023',
    emitente: 'João Silva',
    setor_projeto: 'Engenharia',
    detectado_por: 'Inspeção de Qualidade',
    data_emissao: '2024-12-09',
    previsao_fechamento: '2024-12-20',
    origem: 'interna',
    prioridade: 'critica',
    disciplina: ['Civil', 'Estrutural'],
    descricao_nc: 'Não conformidade identificada na estrutura de concreto da viga principal',
    evidencias_nc: 'Fissuras visíveis na viga, medições fora do especificado',
    disposicao: ['Retrabalhar'],
    status: 'aberta',
    created_at: '2024-12-09T08:00:00Z',
    updated_at: '2024-12-09T08:00:00Z'
  },
  {
    id: '2',
    numero: '002',
    data: '2024-12-08',
    cca: '24024',
    emitente: 'Maria Santos',
    setor_projeto: 'Qualidade',
    detectado_por: 'Auditoria Interna',
    data_emissao: '2024-12-08',
    previsao_fechamento: '2024-12-15',
    origem: 'cliente',
    prioridade: 'moderada',
    disciplina: ['Mecânica', 'Soldagem'],
    descricao_nc: 'Solda apresentando porosidade acima do aceitável',
    evidencias_nc: 'Laudo de END com indicação de porosidade excessiva',
    disposicao: ['Reprovar', 'Retrabalhar'],
    status: 'aberta',
    anexos_evidencias_nc: [
      {
        id: 'att-001',
        file_name: 'foto_solda_defeituosa.jpg',
        file_path: 'evidencia_nc/foto_solda_defeituosa.jpg',
        file_size: 245680,
        file_type: 'image/jpeg',
        attachment_type: 'evidencia_nc',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        description: 'Vista geral da solda apresentando porosidade excessiva na região central do cordão, com descontinuidades visíveis a olho nu.',
        evidence_number: 1
      },
      {
        id: 'att-002',
        file_name: 'laudo_end.jpg',
        file_path: 'evidencia_nc/laudo_end.jpg',
        file_size: 180000,
        file_type: 'image/jpeg',
        attachment_type: 'evidencia_nc',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        description: 'Resultado do ensaio não destrutivo (END) por radiografia, evidenciando porosidade interna distribuída ao longo de 15cm do cordão de solda.',
        evidence_number: 2
      }
    ],
    created_at: '2024-12-08T14:30:00Z',
    updated_at: '2024-12-08T14:30:00Z'
  },
  {
    id: '3',
    numero: '003',
    data: '2024-12-07',
    cca: '24025',
    emitente: 'Pedro Costa',
    setor_projeto: 'Suprimentos',
    detectado_por: 'Recebimento de Material',
    data_emissao: '2024-12-07',
    previsao_fechamento: '2024-12-10',
    origem: 'fornecedor',
    prioridade: 'leve',
    disciplina: ['Suprimentos'],
    descricao_nc: 'Material entregue fora das especificações de embalagem',
    evidencias_nc: 'Fotos da embalagem danificada, material sem proteção adequada',
    disposicao: ['Devolver'],
    status: 'fechada',
    data_fechamento: '2024-12-09',
    eficacia: 'eficaz',
    anexos_evidencias_nc: [
      {
        id: 'att-003',
        file_name: 'embalagem_danificada.jpg',
        file_path: 'evidencia_nc/embalagem_danificada.jpg',
        file_size: 180000,
        file_type: 'image/jpeg',
        attachment_type: 'evidencia_nc'
      }
    ],
    anexos_evidencia_disposicao: [
      {
        id: 'att-004',
        file_name: 'relatorio_devolucao.pdf',
        file_path: 'evidencia_disposicao/relatorio_devolucao.pdf',
        file_size: 320000,  
        file_type: 'application/pdf',
        attachment_type: 'evidencia_disposicao'
      }
    ],
    created_at: '2024-12-07T10:15:00Z',
    updated_at: '2024-12-09T16:45:00Z'
  }
];

export const useRNCData = () => {
  const [rncs, setRNCs] = useState<RNC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadRNCs = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRNCs(mockRNCs);
      setLoading(false);
    };

    loadRNCs();
  }, []);

  const createRNC = async (rncData: Omit<RNC, 'id' | 'created_at' | 'updated_at'>) => {
    const newRNC: RNC = {
      ...rncData,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setRNCs(prev => [newRNC, ...prev]);
    return newRNC;
  };

  const updateRNC = async (id: string, updates: Partial<RNC>) => {
    setRNCs(prev => prev.map(rnc => 
      rnc.id === id 
        ? { ...rnc, ...updates, updated_at: new Date().toISOString() }
        : rnc
    ));
  };

  const getRNC = (id: string) => {
    return rncs.find(rnc => rnc.id === id);
  };

  return {
    rncs,
    loading,
    createRNC,
    updateRNC,
    getRNC
  };
};