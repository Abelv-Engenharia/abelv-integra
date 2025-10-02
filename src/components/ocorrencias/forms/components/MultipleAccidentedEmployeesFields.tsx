import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import AccidentedEmployeeHealthFields from "./AccidentedEmployeeHealthFields";

interface MultipleAccidentedEmployeesFieldsProps {
  funcionarios: any[];
  partesCorpo: any[];
  lateralidades: any[];
  agentesCausadores: any[];
  situacoesGeradoras: any[];
  naturezasLesao: any[];
  selectedEmpresaId?: string;
}

const MultipleAccidentedEmployeesFields: React.FC<MultipleAccidentedEmployeesFieldsProps> = ({
  funcionarios,
  partesCorpo,
  lateralidades,
  agentesCausadores,
  situacoesGeradoras,
  naturezasLesao,
  selectedEmpresaId,
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "colaboradores_acidentados",
  });

  const handleAddEmployee = () => {
    append({
      envolvido: false,
      colaborador: "",
      funcao: "",
      matricula: "",
      houve_afastamento: "",
      dias_perdidos: null,
      dias_debitados: null,
      parte_corpo_atingida: "",
      lateralidade: "",
      agente_causador: "",
      situacao_geradora: "",
      natureza_lesao: "",
      numero_cat: "",
      cid: "",
      arquivo_cat: null,
    });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-md font-semibold">Colaboradores acidentados</h3>
      
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg bg-muted/30 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Colaborador {index + 1}
            </h3>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remover
              </Button>
            )}
          </div>

          <AccidentedEmployeeHealthFields
            index={index}
            funcionarios={funcionarios}
            partesCorpo={partesCorpo}
            lateralidades={lateralidades}
            agentesCausadores={agentesCausadores}
            situacoesGeradoras={situacoesGeradoras}
            naturezasLesao={naturezasLesao}
            selectedEmpresaId={selectedEmpresaId}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddEmployee}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar outro colaborador acidentado
      </Button>
    </div>
  );
};

export default MultipleAccidentedEmployeesFields;
