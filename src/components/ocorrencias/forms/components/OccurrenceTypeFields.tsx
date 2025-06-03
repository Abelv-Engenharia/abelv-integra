
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

interface OccurrenceTypeFieldsProps {
  tiposOcorrencia: any[];
  tiposEvento: any[];
  classificacoesOcorrencia: any[];
}

const OccurrenceTypeFields: React.FC<OccurrenceTypeFieldsProps> = ({
  tiposOcorrencia,
  tiposEvento,
  classificacoesOcorrencia
}) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="tipoOcorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de ocorrência *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposOcorrencia.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.nome}>
                    {tipo.nome}
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
        name="tipoEvento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de evento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposEvento.map((evento) => (
                  <SelectItem key={evento.id} value={evento.nome}>
                    {evento.nome}
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
        name="classificacaoOcorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Classificação da ocorrência</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classificação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {classificacoesOcorrencia.map((classificacao) => (
                  <SelectItem key={classificacao.id} value={classificacao.nome}>
                    {classificacao.codigo} - {classificacao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default OccurrenceTypeFields;
