
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const AcaoCorretivaForm = () => {
  const { control } = useFormContext();

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
                <Input placeholder="Nome do responsável pela ação corretiva" {...field} />
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
            name="situacaoAcao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação da Ação*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pendente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
