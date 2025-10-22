import { useState } from 'react';

interface ReceitaWSResponse {
  status: "OK" | "ERROR";
  message?: string;
  nome: string; // Razão Social
  fantasia: string; // Nome Fantasia
  cnpj: string; // CNPJ formatado
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string; // Cidade
  uf: string;
  cep: string; // CEP formatado
  telefone: string; // Telefone formatado
  email: string;
  atividade_principal: Array<{
    code: string; // Código CNAE
    text: string; // Descrição da atividade
  }>;
  situacao: string; // "ATIVA", "BAIXADA", etc
  data_situacao: string;
  abertura: string; // Data de abertura
  capital_social: string;
}

interface EmpresaData {
  razaosocial: string;
  fantasia: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  descricaoatividade: string;
  numerocnae: string;
  situacao: string;
  abertura: string;
}

export function useReceitaWS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCNPJ = async (cnpj: string): Promise<EmpresaData | null> => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      setError('CNPJ deve conter 14 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
      const data: ReceitaWSResponse = await response.json();

      console.log('📋 Resposta ReceitaWS:', data);

      if (data.status === "ERROR") {
        if (data.message?.includes("limite")) {
          setError('Limite de consultas atingido. Tente novamente em alguns minutos.');
        } else if (data.message?.includes("CNPJ inválido")) {
          setError('CNPJ inválido. Verifique o número digitado.');
        } else {
          setError('Empresa não encontrada na Receita Federal.');
        }
        return null;
      }

      // Verificar se a empresa está ativa
      if (data.situacao !== "ATIVA") {
        setError(`Esta empresa está com situação cadastral: ${data.situacao}`);
        return null;
      }

      // Montar endereço completo
      const enderecoCompleto = [
        data.logradouro,
        data.numero,
        data.complemento ? `- ${data.complemento}` : '',
        data.bairro ? `- ${data.bairro}` : '',
        `${data.municipio}/${data.uf}`,
        data.cep ? `- CEP: ${data.cep}` : ''
      ].filter(Boolean).join(' ');

      return {
        razaosocial: data.nome || '',
        fantasia: data.fantasia || '',
        cnpj: data.cnpj || '',
        endereco: enderecoCompleto,
        telefone: data.telefone || '',
        email: data.email || '',
        descricaoatividade: data.atividade_principal?.[0]?.text || '',
        numerocnae: data.atividade_principal?.[0]?.code || '',
        situacao: data.situacao || '',
        abertura: data.abertura || '',
      };
    } catch (err) {
      console.error('❌ Erro ao buscar CNPJ:', err);
      setError('Erro ao buscar CNPJ. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCNPJ, loading, error };
}
