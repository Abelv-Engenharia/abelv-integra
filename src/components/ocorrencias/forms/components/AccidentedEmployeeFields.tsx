
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccidentedEmployeeFieldsProps {
  funcionarios: any[];
  selectedCcaId?: string;
  namePrefix?: string;
}

const AccidentedEmployeeFields: React.FC<AccidentedEmployeeFieldsProps> = ({
  funcionarios,
  selectedCcaId,
  namePrefix = "colaboradores_acidentados",
}) => {
  const { control, watch, setValue } = useFormContext();

  console.log('AccidentedEmployeeFields - Funcionarios recebidos:', funcionarios);
  console.log('AccidentedEmployeeFields - Selected CCA ID:', selectedCcaId);

  // Auto-popular função e matrícula quando colaborador for selecionado
  const watchColaborador = watch(`${namePrefix}.0.colaborador`);
  
  React.useEffect(() => {
    if (watchColaborador && funcionarios.length > 0) {
      const funcionario = funcionarios.find(f => f.id.toString() === watchColaborador);
      if (funcionario) {
        setValue(`${namePrefix}.0.funcao`, funcionario.funcao || "");
        setValue(`${namePrefix}.0.matricula`, funcionario.matricula || "");
      }
    }
  }, [watchColaborador, funcionarios, setValue, namePrefix]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name={`${namePrefix}.0.colaborador`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador acidentado *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCcaId}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o colaborador"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {funcionarios && funcionarios.length > 0 ? (
                  funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                      {funcionario.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-funcionario-available" disabled>
                    {!selectedCcaId ? "Selecione um CCA primeiro" : "Nenhum funcionário disponível para este CCA"}
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
        name={`${namePrefix}.0.funcao`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name={`${namePrefix}.0.matricula`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Matrícula</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccidentedEmployeeFields;
