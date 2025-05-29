
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ccaService } from "@/services/treinamentos/ccaService";
import { idsmsService } from "@/services/idsms/idsmsService";
import { IDSMSFormValues } from "@/types/treinamentos";

interface IndicadorFormProps {
  tipo: 'IID' | 'HSA' | 'HT' | 'IPOM' | 'INSPECAO_ALTA_LIDERANCA' | 'INSPECAO_GESTAO_SMS' | 'INDICE_REATIVO';
  titulo: string;
  descricao?: string;
  showMotivo?: boolean;
}

const IndicadorForm: React.FC<IndicadorFormProps> = ({ tipo, titulo, descricao, showMotivo = false }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ccaOptions = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: ccaService.getAll,
  });

  const form = useForm<IDSMSFormValues>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      cca_id: "",
      resultado: 0,
      motivo: "",
    },
  });

  const onSubmit = async (data: IDSMSFormValues) => {
    setIsSubmitting(true);
    try {
      const currentDate = new Date(data.data);
      
      const indicadorData = {
        data: data.data,
        mes: currentDate.getMonth() + 1,
        ano: currentDate.getFullYear(),
        cca_id: parseInt(data.cca_id),
        resultado: data.resultado,
        tipo,
        motivo: showMotivo ? data.motivo : undefined,
      };

      const result = await idsmsService.createIndicador(indicadorData);
      
      if (result) {
        toast({
          title: "Indicador registrado com sucesso!",
          description: `${titulo} foi registrado para o CCA selecionado.`,
        });
        form.reset();
      } else {
        throw new Error("Falha ao registrar indicador");
      }
    } catch (error) {
      console.error("Erro ao registrar indicador:", error);
      toast({
        title: "Erro ao registrar",
        description: "Ocorreu um erro ao registrar o indicador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{titulo}</CardTitle>
            {descricao && (
              <p className="text-sm text-gray-600">{descricao}</p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    {...form.register("data", { required: "Data é obrigatória" })}
                  />
                  {form.formState.errors.data && (
                    <p className="text-sm text-red-600">{form.formState.errors.data.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cca">CCA</Label>
                  <Select onValueChange={(value) => form.setValue("cca_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {ccaOptions.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id.toString()}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.cca_id && (
                    <p className="text-sm text-red-600">CCA é obrigatório</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultado">Resultado (%)</Label>
                <Input
                  id="resultado"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  {...form.register("resultado", { 
                    required: "Resultado é obrigatório",
                    min: { value: 0, message: "Resultado não pode ser negativo" },
                    max: { value: 100, message: "Resultado não pode ser maior que 100%" }
                  })}
                />
                {form.formState.errors.resultado && (
                  <p className="text-sm text-red-600">{form.formState.errors.resultado.message}</p>
                )}
              </div>

              {showMotivo && (
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Descreva o motivo do índice reativo..."
                    {...form.register("motivo")}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Registrando..." : "Registrar Indicador"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                  className="flex-1"
                >
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndicadorForm;
