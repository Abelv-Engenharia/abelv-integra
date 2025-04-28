
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Classification options
const exposicaoOptions = [
  { value: "1", label: "1 - Baixa", description: "Exposição baixa ao risco" },
  { value: "2", label: "2 - Média", description: "Exposição média ao risco" },
  { value: "3", label: "3 - Alta", description: "Exposição alta ao risco" }
];

const controleOptions = [
  { value: "0", label: "0 - Excelente", description: "Controle excelente" },
  { value: "1", label: "1 - Essencial", description: "Controle essencial" },
  { value: "2", label: "2 - Precário", description: "Controle precário" },
  { value: "3", label: "3 - Inexistente", description: "Sem controle" }
];

const deteccaoOptions = [
  { value: "1", label: "1 - Fácil", description: "Fácil detecção" },
  { value: "2", label: "2 - Moderada", description: "Detecção moderada" },
  { value: "3", label: "3 - Difícil", description: "Difícil detecção" }
];

const efeitoFalhaOptions = [
  { value: "1", label: "1 - Muito baixa", description: "Efeito muito baixo" },
  { value: "2", label: "2 - Baixa", description: "Efeito baixo" },
  { value: "3", label: "3 - Média", description: "Efeito médio" },
  { value: "4", label: "4 - Alta", description: "Efeito alto" },
  { value: "5", label: "5 - Muito Alta", description: "Efeito muito alto" }
];

const impactoOptions = [
  { value: "1", label: "1 - Baixo", description: "Impacto baixo" },
  { value: "2", label: "2 - Médio", description: "Impacto médio" },
  { value: "3", label: "3 - Alto", description: "Impacto alto" }
];

const getClassificacaoRisco = (probabilidade: number, severidade: number) => {
  if (!probabilidade || !severidade) return "";
  
  const total = probabilidade * severidade;
  
  if (total <= 10) return "TRIVIAL";
  if (total <= 21) return "TOLERÁVEL";
  if (total <= 40) return "MODERADO";
  if (total <= 56) return "SUBSTANCIAL";
  return "INTOLERÁVEL";
};

const getClassificacaoColor = (classificacao: string) => {
  switch (classificacao) {
    case "TRIVIAL": return "bg-[#34C6F4] border-[#34C6F4] text-white";
    case "TOLERÁVEL": return "bg-[#92D050] border-[#92D050] text-white";
    case "MODERADO": return "bg-[#FFE07D] border-[#FFE07D] text-gray-800";
    case "SUBSTANCIAL": return "bg-[#FFC000] border-[#FFC000] text-gray-800";
    case "INTOLERÁVEL": return "bg-[#D13F3F] border-[#D13F3F] text-white";
    default: return "bg-gray-100 border-gray-500 text-gray-800";
  }
};

const ClassificacaoRiscoForm = () => {
  const { control, watch, setValue } = useFormContext();
  
  const exposicao = watch("exposicao");
  const controle = watch("controle");
  const deteccao = watch("deteccao");
  const efeitoFalha = watch("efeitoFalha");
  const impacto = watch("impacto");
  
  // Calculate probability based on exposure, control, and detection
  useEffect(() => {
    if (exposicao && controle && deteccao) {
      const exposicaoVal = parseInt(exposicao, 10);
      const controleVal = parseInt(controle, 10);
      const deteccaoVal = parseInt(deteccao, 10);
      
      const probabilidadeVal = exposicaoVal + controleVal + deteccaoVal;
      setValue("probabilidade", probabilidadeVal);
    } else {
      setValue("probabilidade", null);
    }
  }, [exposicao, controle, deteccao, setValue]);
  
  // Calculate severity based on failure effect and impact
  useEffect(() => {
    if (efeitoFalha && impacto) {
      const efeitoFalhaVal = parseInt(efeitoFalha, 10);
      const impactoVal = parseInt(impacto, 10);
      
      const severidadeVal = efeitoFalhaVal + impactoVal;
      setValue("severidade", severidadeVal);
    } else {
      setValue("severidade", null);
    }
  }, [efeitoFalha, impacto, setValue]);
  
  // Update risk classification whenever probability or severity changes
  const probabilidadeVal = watch("probabilidade");
  const severidadeVal = watch("severidade");
  
  useEffect(() => {
    if (probabilidadeVal && severidadeVal) {
      const classificacao = getClassificacaoRisco(probabilidadeVal, severidadeVal);
      setValue("classificacaoRisco", classificacao);
    } else {
      setValue("classificacaoRisco", "");
    }
  }, [probabilidadeVal, severidadeVal, setValue]);
  
  const classificacao = watch("classificacaoRisco") || "";
  const classificacaoColor = getClassificacaoColor(classificacao);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Probabilidade</h3>
          
          <FormField
            control={control}
            name="exposicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposição</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a exposição" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {exposicaoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o controle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {controleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a detecção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deteccaoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Severidade</h3>
          
          <FormField
            control={control}
            name="efeitoFalha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efeito de Falha</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o efeito de falha" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {efeitoFalhaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o impacto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {impactoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Gradação de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Probabilidade</p>
              <p className="text-2xl font-bold">{probabilidadeVal || "-"}</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Severidade</p>
              <p className="text-2xl font-bold">{severidadeVal || "-"}</p>
            </div>
            
            <div className={`p-4 rounded-md border ${classificacaoColor}`}>
              <p className="text-sm font-medium">Classificação</p>
              <p className="text-2xl font-bold">{classificacao || "Não definida"}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Legendas de Classificação</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#34C6F4] mr-2" />
                <span className="text-sm">TRIVIAL (≤10)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#92D050] mr-2" />
                <span className="text-sm">TOLERÁVEL (≤21)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FFE07D] mr-2" />
                <span className="text-sm">MODERADO (≤40)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FFC000] mr-2" />
                <span className="text-sm">SUBSTANCIAL (≤56)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#D13F3F] mr-2" />
                <span className="text-sm">INTOLERÁVEL (>56)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificacaoRiscoForm;
