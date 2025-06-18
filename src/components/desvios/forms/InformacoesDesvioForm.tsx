
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
import { Funcionario } from "@/types/funcionarios";
import { BaseLegalOpcao } from "@/services/desviosService";

interface InformacoesDesvioFormProps {
  context: {
    funcionarios: Funcionario[];
    supervisores: { id: string; nome: string }[];
    encarregados: { id: string; nome: string }[];
    baseLegalOpcoes: BaseLegalOpcao[];
  }
}

const InformacoesDesvioForm = ({ context }: InformacoesDesvioFormProps) => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Desvio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="descricaoDesvio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Desvio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva detalhadamente o desvio identificado"
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
          name="baseLegal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Legal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a base legal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(context.baseLegalOpcoes || []).map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {`${item.codigo} - ${item.nome}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="supervisorResponsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor Responsável</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o supervisor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(context.supervisores || []).map(sup => (
                      <SelectItem key={sup.id} value={sup.id}>
                        {sup.nome}
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
            name="encarregadoResponsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encarregado Responsável</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o encarregado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(context.encarregados || []).map(enc => (
                      <SelectItem key={enc.id} value={enc.id}>
                        {enc.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="colaboradorInfrator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador Infrator</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(context.funcionarios || []).map(func => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <FormField
            control={control}
            name="funcao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <FormControl>
                  <Input placeholder="Função do colaborador" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input placeholder="Matrícula do colaborador" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InformacoesDesvioForm;
