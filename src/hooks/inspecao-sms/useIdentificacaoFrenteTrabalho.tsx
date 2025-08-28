import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface IdentificacaoFrenteTrabalho {
  engenheiro?: string;
  supervisor?: string;
  encarregado?: string;
  empresa?: string;
  disciplina?: string;
}

export const useIdentificacaoFrenteTrabalho = (camposCabecalho: any) => {
  const [identificacao, setIdentificacao] = useState<IdentificacaoFrenteTrabalho>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchIdentificacao = async () => {
      if (!camposCabecalho) return;

      setIsLoading(true);
      const newIdentificacao: IdentificacaoFrenteTrabalho = {};

      try {
        // Buscar engenheiro responsável
        if (camposCabecalho.engenheiro_responsavel || camposCabecalho.engenheiro_responsavel_id) {
          const id = camposCabecalho.engenheiro_responsavel || camposCabecalho.engenheiro_responsavel_id;
          const { data } = await supabase.from('engenheiros').select('nome').eq('id', id).single();
          if (data) newIdentificacao.engenheiro = data.nome;
        }

        // Buscar supervisor responsável
        if (camposCabecalho.supervisor_responsavel || camposCabecalho.supervisor_responsavel_id) {
          const id = camposCabecalho.supervisor_responsavel || camposCabecalho.supervisor_responsavel_id;
          const { data } = await supabase.from('supervisores').select('nome').eq('id', id).single();
          if (data) newIdentificacao.supervisor = data.nome;
        }

        // Buscar encarregado responsável
        if (camposCabecalho.encarregado_responsavel || camposCabecalho.encarregado_responsavel_id) {
          const id = camposCabecalho.encarregado_responsavel || camposCabecalho.encarregado_responsavel_id;
          const { data } = await supabase.from('encarregados').select('nome').eq('id', id).single();
          if (data) newIdentificacao.encarregado = data.nome;
        }

        // Buscar empresa
        if (camposCabecalho.empresa || camposCabecalho.empresa_id) {
          const id = camposCabecalho.empresa || camposCabecalho.empresa_id;
          const { data } = await supabase.from('empresas').select('nome').eq('id', id).single();
          if (data) newIdentificacao.empresa = data.nome;
        }

        // Buscar disciplina
        if (camposCabecalho.disciplina || camposCabecalho.disciplina_id) {
          const id = camposCabecalho.disciplina || camposCabecalho.disciplina_id;
          const { data } = await supabase.from('disciplinas').select('nome').eq('id', id).single();
          if (data) newIdentificacao.disciplina = data.nome;
        }
      } catch (error) {
        console.error('Erro ao buscar dados da identificação:', error);
      }

      setIdentificacao(newIdentificacao);
      setIsLoading(false);
    };

    fetchIdentificacao();
  }, [camposCabecalho]);

  return { identificacao, isLoading };
};