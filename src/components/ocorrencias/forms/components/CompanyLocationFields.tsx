
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

/**
 * ATENÇÃO: Mapeamento correto — agora o value da empresa sempre é empresa.empresas.nome,
 * mas pode ser salvo como o id caso queira garantir unicidade e evitar problemas de duplicidade.
 * Aqui vamos manter empresa.empresas.nome, mas registraremos um console.log em onValueChange
 * para depuração.
 */

interface CompanyLocationFieldsProps {
  ccas: any[];
  empresas: any[];
  disciplinas: any[];
  selectedCcaId?: string;
}

const CompanyLocationFields: React.FC<CompanyLocationFieldsProps> = ({
  ccas,
  empresas,
  disciplinas,
  selectedCcaId
}) => {
  const { control, setValue } = useFormContext();

  return (
    <>
      {/* CCA e Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="cca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCA *</FormLabel>
              <Select
                onValueChange={value => {
                  field.onChange(value);
                  // Limpar empresa se trocar o CCA
                  setValue("empresa", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
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
          name="empresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa *</FormLabel>
              <Select
                onValueChange={value => {
                  console.log("Empresa selecionada:", value);
                  field.onChange(value);
                }}
                value={field.value}
                disabled={!selectedCcaId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione a empresa"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem
                      key={empresa.empresa_id}
                      value={empresa.empresas.nome}
                    >
                      {empresa.empresas.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Disciplina */}
      <FormField
        control={control}
        name="disciplina"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disciplina *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {disciplinas.map((disciplina) => (
                  <SelectItem key={disciplina.id} value={disciplina.nome}>
                    {disciplina.nome}
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

export default CompanyLocationFields;
