
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
  funcionarios: any[];
  selectedCcaId?: string;
}

const ResponsiblePersonFields: React.FC<ResponsiblePersonFieldsProps> = ({
  funcionarios,
  selectedCcaId
}) => {
  const { control } = useFormContext();

  console.log('ResponsiblePersonFields - Funcionários recebidos:', funcionarios);

  // Filtrar funcionários por função e CCA selecionado
  const filtrarPorFuncao = (funcao: string) => {
    return funcionarios.filter(func => {
      const funcaoMatch = func.funcao?.toLowerCase().includes(funcao.toLowerCase());
      const ccaMatch = !selectedCcaId || func.cca_id === parseInt(selectedCcaId);
      return funcaoMatch && ccaMatch;
    });
  };

  const engenheiros = filtrarPorFuncao('engenheiro');
  const supervisores = filtrarPorFuncao('supervisor');
  const encarregados = filtrarPorFuncao('encarregado');

  console.log('ResponsiblePersonFields - Engenheiros filtrados:', engenheiros);
  console.log('ResponsiblePersonFields - Supervisores filtrados:', supervisores);
  console.log('ResponsiblePersonFields - Encarregados filtrados:', encarregados);

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
                {engenheiros.length > 0 ? (
                  engenheiros.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.nome}>
                      {funcionario.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-engenheiro-available" disabled>
                    {!selectedCcaId ? "Selecione um CCA primeiro" : "Nenhum engenheiro disponível"}
                  </SelectItem>
                )}
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
                {supervisores.length > 0 ? (
                  supervisores.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.nome}>
                      {funcionario.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-supervisor-available" disabled>
                    {!selectedCcaId ? "Selecione um CCA primeiro" : "Nenhum supervisor disponível"}
                  </SelectItem>
                )}
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
                {encarregados.length > 0 ? (
                  encarregados.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.nome}>
                      {funcionario.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-encarregado-available" disabled>
                    {!selectedCcaId ? "Selecione um CCA primeiro" : "Nenhum encarregado disponível"}
                  </SelectItem>
                )}
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
