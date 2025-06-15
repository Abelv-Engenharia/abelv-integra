
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

interface CauseFieldsProps {
  agentesCausadores: any[];
  situacoesGeradoras: any[];
  naturezasLesao: any[];
}

const CauseFields: React.FC<CauseFieldsProps> = ({
  agentesCausadores,
  situacoesGeradoras,
  naturezasLesao
}) => {
  const { control } = useFormContext();

  return (
    <>
      {/* Agente causador */}
      <FormField
        control={control}
        name="agenteCausador"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agente causador</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {agentesCausadores.map((agente) => (
                  <SelectItem key={agente.id} value={agente.nome}>
                    <span className="-ml-4">{agente.codigo} - {agente.nome}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Situação geradora */}
      <FormField
        control={control}
        name="situacaoGeradora"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situação geradora</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {situacoesGeradoras.map((situacao) => (
                  <SelectItem key={situacao.id} value={situacao.nome}>
                    <span className="-ml-4">{situacao.codigo} - {situacao.nome}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Natureza da lesão */}
      <FormField
        control={control}
        name="naturezaLesao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Natureza da lesão</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {naturezasLesao.map((natureza) => (
                  <SelectItem key={natureza.id} value={natureza.nome}>
                    {natureza.codigo} - {natureza.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CauseFields;
