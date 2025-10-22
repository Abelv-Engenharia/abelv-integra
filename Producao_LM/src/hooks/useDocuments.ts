import { useState, useEffect } from 'react';
import { Document, DocumentRevision } from '@/types/document';

// Mock data for development
const mockDocuments: Document[] = [
  {
    id: '1',
    numero: 'ENG-001-R00',
    titulo: 'Memorial Descritivo do Sistema de Ventilação',
    disciplina: 'Mecânica',
    tipo: 'Memorial Descritivo',
    formato: 'PDF',
    versaoAtual: 'R00',
    dataRevisao: '2024-01-15',
    status: 'aprovado',
    responsavelEmissao: 'João Silva',
    responsavelRevisao: 'Maria Santos',
    cliente: 'Petrobras',
    projeto: 'RNEST - Unidade 200',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    numero: 'ENG-002-R01',
    titulo: 'Especificação de Válvulas de Controle',
    disciplina: 'Instrumentação',
    tipo: 'Especificação Técnica',
    formato: 'DOCX',
    versaoAtual: 'R01',
    dataRevisao: '2024-02-20',
    status: 'revisao',
    responsavelEmissao: 'Carlos Lima',
    responsavelRevisao: 'Ana Costa',
    cliente: 'Vale',
    projeto: 'Projeto Ferro Carajás',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-20'
  },
  {
    id: '3',
    numero: 'ARQ-001-R00',
    titulo: 'Projeto Arquitetônico Casa de Controle',
    disciplina: 'Arquitetura',
    tipo: 'Projeto Executivo',
    formato: 'DWG',
    versaoAtual: 'R00',
    dataRevisao: '2024-03-10',
    status: 'elaboracao',
    responsavelEmissao: 'Paula Oliveira',
    responsavelRevisao: 'Ricardo Sousa',
    cliente: 'Braskem',
    projeto: 'Complexo Petroquímico',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10'
  }
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument
  };
}