
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { useClassificacaoRiscoData } from "@/hooks/useClassificacaoRiscoData";

interface ClassificacaoRiscoFormProps {
  onSave: () => void;
  isSubmitting: boolean;
}

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

const ClassificacaoRiscoForm = ({ onSave, isSubmitting }: ClassificacaoRiscoFormProps) => {
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

  const handleCancel = () => {
    window.location.href = "/desvios/consulta";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Carregando opções...</p>
      </div>
    );
  }

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
                    {exposicaoOpcoes.map((option) => (
                      <SelectItem key={option.id} value={option.valor.toString()}>
                        <div className="flex flex-col">
                          <span>{option.nome}</span>
                          {option.descricao && (
                            <span className="text-xs text-muted-foreground">{option.descricao}</span>
                          )}
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
                    {controleOpcoes.map((option) => (
                      <SelectItem key={option.id} value={option.valor.toString()}>
                        <div className="flex flex-col">
                          <span>{option.nome}</span>
                          {option.descricao && (
                            <span className="text-xs text-muted-foreground">{option.descricao}</span>
                          )}
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
                    {deteccaoOpcoes.map((option) => (
                      <SelectItem key={option.id} value={option.valor.toString()}>
                        <div className="flex flex-col">
                          <span>{option.nome}</span>
                          {option.descricao && (
                            <span className="text-xs text-muted-foreground">{option.descricao}</span>
                          )}
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
                    {efeitoFalhaOpcoes.map((option) => (
                      <SelectItem key={option.id} value={option.valor.toString()}>
                        <div className="flex flex-col">
                          <span>{option.nome}</span>
                          {option.descricao && (
                            <span className="text-xs text-muted-foreground">{option.descricao}</span>
                          )}
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
                    {impactoOpcoes.map((option) => (
                      <SelectItem key={option.id} value={option.valor.toString()}>
                        <div className="flex flex-col">
                          <span>{option.nome}</span>
                          {option.descricao && (
                            <span className="text-xs text-muted-foreground">{option.descricao}</span>
                          )}
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
                <span className="text-sm">INTOLERÁVEL (&gt;56)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t">
        <div></div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          
          <Button
            type="button"
            onClick={onSave}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default ClassificacaoRiscoForm;
