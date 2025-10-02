import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import InfratorFields from "./InfratorFields";
import { Funcionario } from "@/types/funcionarios";

interface MultipleInfratoresFieldsProps {
  funcionarios: Funcionario[];
  selectedEmpresaId?: string;
}

const MultipleInfratoresFields: React.FC<MultipleInfratoresFieldsProps> = ({
  funcionarios,
  selectedEmpresaId
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "funcionarios_infratores"
  });

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-md font-semibold">Colaboradores infratores</h3>
      
      {fields.map((field, index) => (
        <div key={field.id} className="relative border rounded-lg p-4 bg-muted/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Colaborador #{index + 1}</span>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </Button>
            )}
          </div>
          
          <InfratorFields
            index={index}
            funcionarios={funcionarios}
            selectedEmpresaId={selectedEmpresaId}
          />
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ colaborador: "", funcao: "", matricula: "" })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar colaborador
      </Button>
    </div>
  );
};

export default MultipleInfratoresFields;
