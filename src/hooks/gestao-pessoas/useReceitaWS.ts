import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrasilAPIResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
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
  grauderisco: string;
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
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('CNPJ não encontrado na Receita Federal.');
        } else if (response.status === 429) {
          setError('Limite de consultas atingido. Tente novamente em alguns minutos.');
        } else {
          setError('Erro ao consultar CNPJ. Tente novamente.');
        }
        return null;
      }

      const data: BrasilAPIResponse = await response.json();

      console.log('📋 Resposta BrasilAPI:', data);

      // Verificar se a empresa está ativa
      if (data.descricao_situacao_cadastral !== "ATIVA") {
        setError(`Esta empresa está com situação cadastral: ${data.descricao_situacao_cadastral}`);
        return null;
      }

      // Formatar CEP (adicionar hífen)
      const cepFormatado = data.cep ? `${data.cep.substring(0, 5)}-${data.cep.substring(5)}` : '';
      
      // Formatar telefone (adicionar parênteses e hífen)
      const telefoneFormatado = data.ddd_telefone_1 
        ? `(${data.ddd_telefone_1.substring(0, 2)}) ${data.ddd_telefone_1.substring(2, 7)}-${data.ddd_telefone_1.substring(7)}`
        : '';

      // Formatar CNPJ (adicionar pontos, barra e hífen)
      const cnpjFormatado = data.cnpj
        ? `${data.cnpj.substring(0, 2)}.${data.cnpj.substring(2, 5)}.${data.cnpj.substring(5, 8)}/${data.cnpj.substring(8, 12)}-${data.cnpj.substring(12)}`
        : '';

      // Montar endereço completo
      const enderecoCompleto = [
        data.logradouro,
        data.numero,
        data.complemento ? `- ${data.complemento}` : '',
        data.bairro ? `- ${data.bairro}` : '',
        `${data.municipio}/${data.uf}`,
        cepFormatado ? `- CEP: ${cepFormatado}` : ''
      ].filter(Boolean).join(' ');

      // Buscar grau de risco na tabela cnae_grau_risco
      const cnaeNumero = data.cnae_fiscal?.toString() || '';
      let grauRisco = '';

      if (cnaeNumero) {
        try {
          const { data: grauRiscoData, error: grauRiscoError } = await supabase
            .from('cnae_grau_risco')
            .select('grau_risco')
            .eq('codigo_cnae', cnaeNumero)
            .single();

          if (grauRiscoData && !grauRiscoError) {
            grauRisco = grauRiscoData.grau_risco.toString();
            console.log(`✅ Grau de risco encontrado para CNAE ${cnaeNumero}: ${grauRisco}`);
          } else {
            console.log(`⚠️ Grau de risco não encontrado para CNAE ${cnaeNumero}`);
          }
        } catch (err) {
          console.error('❌ Erro ao buscar grau de risco:', err);
        }
      }

      return {
        razaosocial: data.razao_social || '',
        fantasia: data.nome_fantasia || '',
        cnpj: cnpjFormatado || '',
        endereco: enderecoCompleto,
        telefone: telefoneFormatado,
        email: data.email || '',
        descricaoatividade: data.cnae_fiscal_descricao || '',
        numerocnae: cnaeNumero,
        situacao: data.descricao_situacao_cadastral || '',
        abertura: data.data_inicio_atividade || '',
        grauderisco: grauRisco,
      };
    } catch (err) {
      console.error('❌ Erro ao buscar CNPJ:', err);
      setError('Erro ao buscar CNPJ. Verifique sua conexão e tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCNPJ, loading, error };
}
