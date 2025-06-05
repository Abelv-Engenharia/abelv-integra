
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ClassificacaoRiscoFormProps {
  context?: any;
  onSave: () => void;
  isSubmitting: boolean;
}

const ClassificacaoRiscoForm = ({ context, onSave, isSubmitting }: ClassificacaoRiscoFormProps) => {
  const { control, watch, setValue } = useFormContext();

  const exposicao = watch("exposicao");
  const controle = watch("controle");
  const deteccao = watch("deteccao");
  const efeitoFalha = watch("efeitoFalha");
  const impacto = watch("impacto");

  // Calcular probabilidade automaticamente
  React.useEffect(() => {
    if (exposicao && controle && deteccao) {
      const prob = parseInt(exposicao) * parseInt(controle) * parseInt(deteccao);
      setValue("probabilidade", prob);
    }
  }, [exposicao, controle, deteccao, setValue]);

  // Calcular severidade automaticamente
  React.useEffect(() => {
    if (efeitoFalha && impacto) {
      const sev = parseInt(efeitoFalha) * parseInt(impacto);
      setValue("severidade", sev);
    }
  }, [efeitoFalha, impacto, setValue]);

  // Calcular classificação de risco automaticamente
  const probabilidade = watch("probabilidade");
  const severidade = watch("severidade");
  
  React.useEffect(() => {
    if (probabilidade && severidade) {
      const risco = probabilidade * severidade;
      let classificacao = "";
      
      if (risco <= 8) {
        classificacao = "BAIXO";
      } else if (risco <= 64) {
        classificacao = "MÉDIO";
      } else {
        classificacao = "ALTO";
      }
      
      setValue("classificacaoRisco", classificacao);
    }
  }, [probabilidade, severidade, setValue]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Botão Salvar clicado na aba Classificação de Risco");
    onSave();
  };

  return (
    <div className="space-y-6">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Raro</SelectItem>
                      <SelectItem value="2">2 - Raro</SelectItem>
                      <SelectItem value="3">3 - Ocasional</SelectItem>
                      <SelectItem value="4">4 - Provável</SelectItem>
                      <SelectItem value="5">5 - Frequente</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Eficaz</SelectItem>
                      <SelectItem value="2">2 - Eficaz</SelectItem>
                      <SelectItem value="3">3 - Moderado</SelectItem>
                      <SelectItem value="4">4 - Pouco Eficaz</SelectItem>
                      <SelectItem value="5">5 - Ineficaz</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Provável</SelectItem>
                      <SelectItem value="2">2 - Provável</SelectItem>
                      <SelectItem value="3">3 - Moderada</SelectItem>
                      <SelectItem value="4">4 - Improvável</SelectItem>
                      <SelectItem value="5">5 - Muito Improvável</SelectItem>
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
                  <FormLabel>Efeito da Falha*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Mínimo</SelectItem>
                      <SelectItem value="2">2 - Menor</SelectItem>
                      <SelectItem value="3">3 - Moderado</SelectItem>
                      <SelectItem value="4">4 - Maior</SelectItem>
                      <SelectItem value="5">5 - Máximo</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Muito Baixo</SelectItem>
                      <SelectItem value="2">2 - Baixo</SelectItem>
                      <SelectItem value="3">3 - Médio</SelectItem>
                      <SelectItem value="4">4 - Alto</SelectItem>
                      <SelectItem value="5">5 - Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {probabilidade && severidade && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Probabilidade:</span>
                  <span className="ml-2">{probabilidade}</span>
                </div>
                <div>
                  <span className="font-medium">Severidade:</span>
                  <span className="ml-2">{severidade}</span>
                </div>
                <div>
                  <span className="font-medium">Classificação:</span>
                  <span className="ml-2 font-bold">{watch("classificacaoRisco")}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Salvando..." : "Salvar Desvio"}
        </Button>
      </div>
    </div>
  );
};

export default ClassificacaoRiscoForm;
