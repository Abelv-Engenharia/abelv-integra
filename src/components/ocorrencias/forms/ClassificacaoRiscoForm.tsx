
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
const severidadeOptions = [
  { value: "1", label: "1 - Leve", description: "Sem afastamento, pequenas lesões" },
  { value: "2", label: "2 - Moderada", description: "Afastamento até 15 dias" },
  { value: "3", label: "3 - Grave", description: "Afastamento maior que 15 dias" },
  { value: "4", label: "4 - Crítica", description: "Incapacidade permanente" },
  { value: "5", label: "5 - Fatal", description: "Morte" }
];

const probabilidadeOptions = [
  { value: "1", label: "1 - Rara", description: "Praticamente impossível" },
  { value: "2", label: "2 - Improvável", description: "Pode ocorrer em situações excepcionais" },
  { value: "3", label: "3 - Ocasional", description: "Pode ocorrer eventualmente" },
  { value: "4", label: "4 - Provável", description: "Ocorre com frequência" },
  { value: "5", label: "5 - Muito provável", description: "Ocorre repetidamente" }
];

const getClassificacaoRisco = (severidade: string, probabilidade: string) => {
  if (!severidade || !probabilidade) return "";
  
  const sevValue = parseInt(severidade, 10);
  const probValue = parseInt(probabilidade, 10);
  const total = sevValue * probValue;
  
  if (total <= 3) return "Baixo";
  if (total <= 9) return "Médio";
  if (total <= 15) return "Alto";
  return "Crítico";
};

const getClassificacaoColor = (classificacao: string) => {
  switch (classificacao) {
    case "Baixo": return "bg-green-100 border-green-500 text-green-800";
    case "Médio": return "bg-yellow-100 border-yellow-500 text-yellow-800";
    case "Alto": return "bg-orange-100 border-orange-500 text-orange-800";
    case "Crítico": return "bg-red-100 border-red-500 text-red-800";
    default: return "bg-gray-100 border-gray-500 text-gray-800";
  }
};

const ClassificacaoRiscoForm = () => {
  const { control, watch, setValue } = useFormContext();
  
  const severidade = watch("severidade");
  const probabilidade = watch("probabilidade");
  
  // Update risk classification whenever severity or probability changes
  useEffect(() => {
    const classificacao = getClassificacaoRisco(severidade, probabilidade);
    setValue("classificacaoRisco", classificacao);
  }, [severidade, probabilidade, setValue]);
  
  const classificacao = getClassificacaoRisco(severidade, probabilidade);
  const classificacaoColor = getClassificacaoColor(classificacao);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={control}
            name="severidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a severidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {severidadeOptions.map((option) => (
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
        
        <div>
          <FormField
            control={control}
            name="probabilidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a probabilidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {probabilidadeOptions.map((option) => (
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
          <CardTitle>Classificação de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Severidade</p>
              <p className="text-2xl font-bold">{severidade || "-"}</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Probabilidade</p>
              <p className="text-2xl font-bold">{probabilidade || "-"}</p>
            </div>
            
            <div className={`p-4 rounded-md border ${classificacaoColor}`}>
              <p className="text-sm font-medium">Classificação</p>
              <p className="text-2xl font-bold">{classificacao || "Não definida"}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Matriz de Risco</h3>
            <div className="grid grid-cols-6 gap-0.5 border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">S/P</div>
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">1</div>
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">2</div>
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">3</div>
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">4</div>
              <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">5</div>
              
              {[1, 2, 3, 4, 5].map((s) => (
                <React.Fragment key={s}>
                  <div className="bg-gray-100 p-2 flex items-center justify-center font-bold">{s}</div>
                  {[1, 2, 3, 4, 5].map((p) => {
                    const value = s * p;
                    let bgColor = "bg-green-100";
                    
                    if (value <= 3) bgColor = "bg-green-100";
                    else if (value <= 9) bgColor = "bg-yellow-100";
                    else if (value <= 15) bgColor = "bg-orange-100";
                    else bgColor = "bg-red-100";
                    
                    const isSelected = s.toString() === severidade && p.toString() === probabilidade;
                    
                    return (
                      <div 
                        key={`${s}-${p}`} 
                        className={`${bgColor} p-2 flex items-center justify-center ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 mr-2" />
                <span className="text-sm">Baixo (1-3)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 mr-2" />
                <span className="text-sm">Médio (4-9)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-100 mr-2" />
                <span className="text-sm">Alto (10-15)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 mr-2" />
                <span className="text-sm">Crítico (16-25)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificacaoRiscoForm;
