
import { useState, useEffect } from "react";
import { classificacaoRiscoService, OpcaoClassificacao } from "@/services/desvios/classificacaoRiscoService";

export const useClassificacaoRiscoData = () => {
  const [exposicaoOpcoes, setExposicaoOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [controleOpcoes, setControleOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [deteccaoOpcoes, setDeteccaoOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [efeitoFalhaOpcoes, setEfeitoFalhaOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [impactoOpcoes, setImpactoOpcoes] = useState<OpcaoClassificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [exposicao, controle, deteccao, efeitoFalha, impacto] = await Promise.all([
          classificacaoRiscoService.getExposicaoOpcoes(),
          classificacaoRiscoService.getControleOpcoes(),
          classificacaoRiscoService.getDeteccaoOpcoes(),
          classificacaoRiscoService.getEfeitoFalhaOpcoes(),
          classificacaoRiscoService.getImpactoOpcoes()
        ]);

        setExposicaoOpcoes(exposicao);
        setControleOpcoes(controle);
        setDeteccaoOpcoes(deteccao);
        setEfeitoFalhaOpcoes(efeitoFalha);
        setImpactoOpcoes(impacto);
      } catch (error) {
        console.error('Erro ao carregar dados de classificação de risco:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    exposicaoOpcoes,
    controleOpcoes,
    deteccaoOpcoes,
    efeitoFalhaOpcoes,
    impactoOpcoes,
    loading
  };
};
