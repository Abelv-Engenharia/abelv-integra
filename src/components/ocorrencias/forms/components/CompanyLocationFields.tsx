
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

  // Garantir que os arrays existem e ordenar CCAs do menor para o maior
  const safeCcas = ccas ? [...ccas].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  ) : [];
  const safeEmpresas = empresas || [];
  const safeDisciplinas = disciplinas || [];

  console.log('CompanyLocationFields - Empresas recebidas:', safeEmpresas);
  console.log('CompanyLocationFields - Selected CCA ID:', selectedCcaId);

  return (
    <div className="space-y-4">
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
                {safeCcas.length > 0 ? (
                  safeCcas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-cca-available" disabled>
                    Nenhum CCA disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  console.log("Empresa selecionada (ID):", value);
                }}
                value={field.value || ""}
                disabled={!selectedCcaId || safeEmpresas.length === 0}
              >
                <FormControl>
                  <SelectTrigger
                    className={empresaObrigatoria ? "border-destructive ring-destructive" : ""}
                  >
                    <SelectValue placeholder={
                      !selectedCcaId 
                        ? "Selecione um CCA primeiro" 
                        : safeEmpresas.length === 0 
                          ? "Nenhuma empresa disponível" 
                          : "Selecione a empresa"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {safeEmpresas.length > 0 ? (
                    safeEmpresas.map((empresa) => (
                      <SelectItem
                        key={empresa.id}
                        value={empresa.id.toString()}
                      >
                        {empresa.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-empresa-available" disabled>
                      Nenhuma empresa disponível
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
                  {safeDisciplinas.length > 0 ? (
                    safeDisciplinas.map((disciplina) => (
                      <SelectItem key={disciplina.id} value={disciplina.nome}>
                        {disciplina.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-disciplina-available" disabled>
                      Nenhuma disciplina disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyLocationFields;
