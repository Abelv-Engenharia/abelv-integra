
import React from "react";
import { useFormContext } from "react-hook-form";
import { PersonnelSelect } from "@/components/common/PersonnelSelect";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ResponsiblePersonFieldsProps {
  engenheiros: any[];
  supervisores: any[];
  encarregados: any[];
  selectedCcaId?: string;
  selectedEmpresaId?: string;
}

const ResponsiblePersonFields: React.FC<ResponsiblePersonFieldsProps> = ({
  engenheiros,
  supervisores,
  encarregados,
  selectedCcaId,
  selectedEmpresaId
}) => {
  const { control } = useFormContext();
  const isAbelvSelecionada = selectedEmpresaId === "6";
  // Mapear dados para o formato esperado pelo PersonnelSelect
  const mappedEngenheiros = engenheiros.map(item => {
    const eng = item.engenheiros || item;
    return {
      id: eng.id || item.engenheiro_id,
      nome: eng.nome,
      funcao: eng.funcao,
      matricula: eng.matricula,
      ativo: eng.ativo
    };
  });

  const mappedSupervisores = supervisores.map(item => {
    const sup = item.supervisores || item;
    return {
      id: sup.id || item.supervisor_id,
      nome: sup.nome,
      funcao: sup.funcao,
      matricula: sup.matricula,
      ativo: sup.ativo
    };
  });

  const mappedEncarregados = encarregados.map(item => {
    const enc = item.encarregados || item;
    return {
      id: enc.id || item.encarregado_id,
      nome: enc.nome,
      funcao: enc.funcao,
      matricula: enc.matricula,
      ativo: enc.ativo
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PersonnelSelect
        name="engenheiro_responsavel"
        label="Engenheiro responsável"
        placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o engenheiro"}
        people={mappedEngenheiros}
        disabled={!selectedCcaId}
        showInactive={true}
      />
      
      {isAbelvSelecionada ? (
        <PersonnelSelect
          name="supervisor_responsavel"
          label="Supervisor responsável"
          placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o supervisor"}
          people={mappedSupervisores}
          disabled={!selectedCcaId}
          showInactive={true}
        />
      ) : (
        <FormField
          control={control}
          name="supervisor_responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor responsável</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o nome do supervisor"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {isAbelvSelecionada ? (
        <PersonnelSelect
          name="encarregado_responsavel"
          label="Encarregado responsável"
          placeholder={!selectedCcaId ? "Selecione um CCA primeiro" : "Selecione o encarregado"}
          people={mappedEncarregados}
          disabled={!selectedCcaId}
          showInactive={true}
        />
      ) : (
        <FormField
          control={control}
          name="encarregado_responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Encarregado responsável</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o nome do encarregado"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ResponsiblePersonFields;
