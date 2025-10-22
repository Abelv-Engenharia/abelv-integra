import { useState } from 'react';
import { GRD, GRDDocument } from '@/types/document';

// Mock data for development
const mockGRDs: GRD[] = [
  {
    id: '1',
    numero: 'GRD-001',
    cca: '10.001',
    folha: '01/01',
    dataEnvio: '2024-01-15',
    remetente: 'João Silva - Engenharia',
    destinatario: 'Maria Santos - Petrobras',
    documentos: [
      {
        documentId: '1',
        discriminacao: 'Memorial Descritivo do Sistema de Ventilação',
        revisao: 'R00',
        numeroFolhas: 15,
        numeroCopias: 3,
        tipoVia: 'O'
      }
    ],
    providencias: {
      aprovar: true,
      arquivar: false,
      assinatura: false,
      comentar: false,
      devolver: false,
      informacao: false,
      revisar: false,
      liberadoConstrucao: false,
      liberadoDetalhamento: false,
      liberadoComentarios: false,
      liberadoRevisao: false,
      emitirParecer: false,
      outros: ''
    },
    observacoes: 'Documento para aprovação final',
    createdAt: '2024-01-15'
  }
];

export function useGRDs() {
  const [grds, setGRDs] = useState<GRD[]>(mockGRDs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateGRDNumber = () => {
    const nextNumber = grds.length + 1;
    return `GRD-${nextNumber.toString().padStart(3, '0')}`;
  };

  const addGRD = (grd: Omit<GRD, 'id' | 'numero' | 'createdAt'>) => {
    const newGRD: GRD = {
      ...grd,
      id: Date.now().toString(),
      numero: generateGRDNumber(),
      createdAt: new Date().toISOString()
    };
    setGRDs(prev => [...prev, newGRD]);
    return newGRD;
  };

  const getGRD = (id: string) => {
    return grds.find(grd => grd.id === id);
  };

  const deleteGRD = (id: string) => {
    setGRDs(prev => prev.filter(grd => grd.id !== id));
  };

  return {
    grds,
    loading,
    error,
    addGRD,
    getGRD,
    deleteGRD,
    generateGRDNumber
  };
}