import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Funcionario } from "@/types/funcionarios";

interface InfratorFieldsProps {
  index: number;
  funcionarios: Funcionario[];
  selectedEmpresaId?: string;
}

const InfratorFields: React.FC<InfratorFieldsProps> = ({
  index,
  funcionarios,
  selectedEmpresaId
}) => {
  const { control, watch, setValue } = useFormContext();
  const isAbelvSelecionada = selectedEmpresaId?.toString() === "6";
  const colaboradorId = watch(`funcionarios_infratores.${index}.colaborador`);

  // Auto-popular função e matrícula quando colaborador for selecionado (ABELV)
  React.useEffect(() => {
    if (isAbelvSelecionada && colaboradorId && funcionarios.length > 0) {
      const funcionario = funcionarios.find(f => f.id === colaboradorId);
      if (funcionario) {
        setValue(`funcionarios_infratores.${index}.funcao`, funcionario.funcao || "");
        setValue(`funcionarios_infratores.${index}.matricula`, funcionario.matricula || "");
      }
    }
  }, [colaboradorId, funcionarios, setValue, index, isAbelvSelecionada]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Campo Colaborador */}
      <FormField
        control={control}
        name={`funcionarios_infratores.${index}.colaborador`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colaborador</FormLabel>
            {isAbelvSelecionada ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <FormControl>
                <Input
                  placeholder="Digite o nome do colaborador"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo Função */}
      <FormField
        control={control}
        name={`funcionarios_infratores.${index}.funcao`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={isAbelvSelecionada}
                disabled={isAbelvSelecionada}
                placeholder={!isAbelvSelecionada ? "Digite a função" : ""}
                onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Campo Matrícula */}
      <FormField
        control={control}
        name={`funcionarios_infratores.${index}.matricula`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Matrícula</FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={isAbelvSelecionada}
                disabled={isAbelvSelecionada}
                placeholder={!isAbelvSelecionada ? "Digite a matrícula" : ""}
                onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InfratorFields;
