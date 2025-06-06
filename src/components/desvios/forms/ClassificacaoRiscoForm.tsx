
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClassificacaoRiscoData } from "@/hooks/useClassificacaoRiscoData";

const ClassificacaoRiscoForm = () => {
  const { control, watch, setValue } = useFormContext();
  const {
    exposicaoOpcoes,
    controleOpcoes,
    deteccaoOpcoes,
    efeitoFalhaOpcoes,
    impactoOpcoes,
    loading
  } = useClassificacaoRiscoData();

  const exposicao = watch("exposicao");
  const controle = watch("controle");
  const deteccao = watch("deteccao");
  const efeitoFalha = watch("efeitoFalha");
  const impacto = watch("impacto");

  // Calcular Probabilidade automaticamente
  useEffect(() => {
    if (exposicao && controle && deteccao) {
      const exposicaoVal = exposicaoOpcoes.find(e => e.id.toString() === exposicao)?.valor || 0;
      const controleVal = controleOpcoes.find(c => c.id.toString() === controle)?.valor || 0;
      const deteccaoVal = deteccaoOpcoes.find(d => d.id.toString() === deteccao)?.valor || 0;
      
      const probabilidade = exposicaoVal + controleVal + deteccaoVal;
      setValue("probabilidade", probabilidade);
    }
  }, [exposicao, controle, deteccao, exposicaoOpcoes, controleOpcoes, deteccaoOpcoes, setValue]);

  // Calcular Severidade automaticamente
  useEffect(() => {
    if (efeitoFalha && impacto) {
      const efeitoFalhaVal = efeitoFalhaOpcoes.find(e => e.id.toString() === efeitoFalha)?.valor || 0;
      const impactoVal = impactoOpcoes.find(i => i.id.toString() === impacto)?.valor || 0;
      
      const severidade = efeitoFalhaVal + impactoVal;
      setValue("severidade", severidade);
    }
  }, [efeitoFalha, impacto, efeitoFalhaOpcoes, impactoOpcoes, setValue]);

  // Calcular Classificação de Risco automaticamente
  const probabilidade = watch("probabilidade");
  const severidade = watch("severidade");
  
  useEffect(() => {
    if (probabilidade !== undefined && severidade !== undefined) {
      let classificacao = "";
      const soma = probabilidade + severidade;
      
      if (soma <= 3) {
        classificacao = "BAIXO";
      } else if (soma <= 6) {
        classificacao = "MÉDIO";
      } else {
        classificacao = "ALTO";
      }
      
      setValue("classificacaoRisco", classificacao);
    }
  }, [probabilidade, severidade, setValue]);

  const classificacaoRisco = watch("classificacaoRisco");

  if (loading) {
    return <div>Carregando opções de classificação...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificação de Risco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="exposicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposição*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a exposição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {exposicaoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="controle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Controle*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o controle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {controleOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="deteccao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detecção*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a detecção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deteccaoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="efeitoFalha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efeito de Falha*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o efeito de falha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {efeitoFalhaOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="impacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impacto*</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o impacto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {impactoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Resultados Calculados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Probabilidade (Calculada)</div>
            <div className="text-lg font-bold text-blue-700">{probabilidade || 0}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-900 mb-1">Severidade (Calculada)</div>
            <div className="text-lg font-bold text-green-700">{severidade || 0}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-900 mb-1">Classificação de Risco</div>
            <div className="text-lg font-bold text-purple-700">{classificacaoRisco || "Pendente"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassificacaoRiscoForm;
