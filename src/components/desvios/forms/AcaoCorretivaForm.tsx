
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateStatusAcao } from "@/utils/desviosUtils";

interface AcaoCorretivaFormProps {
  context?: any;
}

const AcaoCorretivaForm = ({ context }: AcaoCorretivaFormProps) => {
  const { control, watch, setValue } = useFormContext();

  const situacao = watch("situacao");
  const prazoCorrecao = watch("prazoCorrecao");

  // Calcular situação da ação automaticamente
  useEffect(() => {
    if (situacao) {
      const situacaoCalculada = calculateStatusAcao(situacao, prazoCorrecao);
      setValue("situacaoAcao", situacaoCalculada);
    }
  }, [situacao, prazoCorrecao, setValue]);

  const situacaoAcao = watch("situacaoAcao");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ação Corretiva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="tratativaAplicada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tratativa Aplicada*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva detalhadamente a tratativa aplicada para correção do desvio"
                  className="min-h-[100px]"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="responsavelAcao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável pela Ação*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome do responsável pela ação corretiva" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="prazoCorrecao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo para Correção*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="situacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EM TRATATIVA">EM TRATATIVA</SelectItem>
                    <SelectItem value="TRATADO">TRATADO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {situacaoAcao && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Status da Ação (Calculado Automaticamente):</span>
              <span className="text-sm font-bold text-blue-700">{situacaoAcao}</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <FormField
            control={control}
            name="aplicacaoMedidaDisciplinar"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    Aplicação de Medida Disciplinar
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Marque esta opção se foi aplicada alguma medida disciplinar ao colaborador.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AcaoCorretivaForm;
