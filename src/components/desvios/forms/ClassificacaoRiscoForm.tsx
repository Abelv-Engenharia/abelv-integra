
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
      const resultado = probabilidade * severidade;
      
      if (resultado <= 10) {
        classificacao = "TRIVIAL";
      } else if (resultado <= 21) {
        classificacao = "TOLERÁVEL";
      } else if (resultado <= 40) {
        classificacao = "MODERADO";
      } else if (resultado <= 56) {
        classificacao = "SUBSTANCIAL";
      } else {
        classificacao = "INTOLERÁVEL";
      }
      
      setValue("classificacaoRisco", classificacao);
    }
  }, [probabilidade, severidade, setValue]);

  const classificacaoRisco = watch("classificacaoRisco");

  // Função para obter a cor da classificação
  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case "TRIVIAL":
        return "bg-cyan-400 text-white";
      case "TOLERÁVEL":
        return "bg-green-400 text-white";
      case "MODERADO":
        return "bg-yellow-400 text-white";
      case "SUBSTANCIAL":
        return "bg-orange-400 text-white";
      case "INTOLERÁVEL":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return <div>Carregando opções de classificação...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Seções de Probabilidade e Severidade lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seção de Probabilidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Probabilidade</h3>
          
          <FormField
            control={control}
            name="exposicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposição</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a exposição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {exposicaoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.valor} - {opcao.nome}
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
                <FormLabel>Controle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o controle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {controleOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.valor} - {opcao.nome}
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
                <FormLabel>Detecção</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a detecção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deteccaoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.valor} - {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção de Severidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Severidade</h3>
          
          <FormField
            control={control}
            name="efeitoFalha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efeito de Falha</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o efeito de falha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {efeitoFalhaOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.valor} - {opcao.nome}
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
                <FormLabel>Impacto</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o impacto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {impactoOpcoes.map((opcao) => (
                      <SelectItem key={opcao.id} value={opcao.id.toString()}>
                        {opcao.valor} - {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Seção de Gradação de Risco */}
      <Card>
        <CardHeader>
          <CardTitle>Gradação de Risco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resultados Calculados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-600 mb-1">Probabilidade</div>
              <div className="text-2xl font-bold text-gray-900">{probabilidade || "-"}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-600 mb-1">Severidade</div>
              <div className="text-2xl font-bold text-gray-900">{severidade || "-"}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-600 mb-1">Classificação</div>
              {classificacaoRisco ? (
                <div className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${getClassificacaoColor(classificacaoRisco)}`}>
                  {classificacaoRisco}
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-900">Não definida</div>
              )}
            </div>
          </div>

          {/* Legendas de Classificação */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Legendas de Classificação</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                <span>TRIVIAL (≤10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>TOLERÁVEL (≤21)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>MODERADO (≤40)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span>SUBSTANCIAL (≤56)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>INTOLERÁVEL (&gt;56)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificacaoRiscoForm;
