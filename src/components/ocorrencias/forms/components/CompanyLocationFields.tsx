
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
 * Atualizado: O value da empresa agora é SEMPRE o empresa_id.
 *
 * Isso evita problemas de unicidade e compatibilidade com banco.
 * O form armazena empresa como string (empresa_id).
 *
 * O onValueChange e value são ajustados.
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
  const { control, setValue, watch } = useFormContext();
  const empresaValue = watch("empresa");
  const ccaValue = watch("cca");

  // Empresa obrigatória: destaca caso <string vazia>
  const empresaObrigatoria = !empresaValue && !!ccaValue;

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
                  if (value !== field.value) {
                    field.onChange(value);
                    // Limpar campos dependentes do CCA
                    setValue("empresa", "");
                    setValue("engenheiro_responsavel", "");
                    setValue("supervisor_responsavel", "");
                    setValue("encarregado_responsavel", "");
                    setValue("colaboradores_acidentados", [{ colaborador: "", funcao: "", matricula: "" }]);
                  }
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
              <FormLabel>
                Empresa *{" "}
                {empresaObrigatoria && (
                  <span className="text-destructive ml-1 animate-pulse">(obrigatório)</span>
                )}
              </FormLabel>
              <Select
                onValueChange={value => {
                  field.onChange(value);
                  console.log("Empresa selecionada (empresa_id):", value);
                }}
                value={field.value || ""}
                disabled={!selectedCcaId}
              >
                <FormControl>
                  <SelectTrigger
                    className={empresaObrigatoria ? "border-destructive ring-destructive" : ""}
                  >
                    <SelectValue placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione a empresa"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem
                      key={empresa.empresa_id?.toString()}
                      value={empresa.empresa_id?.toString()}
                    >
                      {empresa.empresas?.nome || empresa.nome}
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
