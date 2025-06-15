
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

interface ResponsiblePersonFieldsProps {
  engenheiros: any[];
  supervisores: any[];
  encarregados: any[];
  selectedCcaId?: string;
}

const ResponsiblePersonFields: React.FC<ResponsiblePersonFieldsProps> = ({
  engenheiros,
  supervisores,
  encarregados,
  selectedCcaId
}) => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="engenheiro_responsavel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engenheiro responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedCcaId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o engenheiro"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {engenheiros.map((engenheiro) => (
                  <SelectItem key={engenheiro.engenheiro_id} value={engenheiro.engenheiros.nome}>
                    {engenheiro.engenheiros.nome}
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
        name="supervisor_responsavel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supervisor responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedCcaId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o supervisor"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {supervisores.map((supervisor) => (
                  <SelectItem key={supervisor.supervisor_id} value={supervisor.supervisores.nome}>
                    {supervisor.supervisores.nome}
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
        name="encarregado_responsavel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Encarregado responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedCcaId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o encarregado"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {encarregados.map((encarregado) => (
                  <SelectItem key={encarregado.id} value={encarregado.nome}>
                    {encarregado.nome}
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

export default ResponsiblePersonFields;
