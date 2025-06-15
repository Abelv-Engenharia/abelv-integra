
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import AbsenceFields from "./components/AbsenceFields";
import BodyPartLateralityFields from "./components/BodyPartLateralityFields";
import CauseFields from "./components/CauseFields";
import { uploadCatFileToBucket } from "@/utils/uploadCatFileToBucket";

const InformacoesOcorrenciaForm = () => {
  const { control, watch, setValue } = useFormContext();
  const { partesCorpo, lateralidades, agentesCausadores, situacoesGeradoras, naturezasLesao, funcionarios } = useOcorrenciasFormData();

  const [uploadingCat, setUploadingCat] = React.useState(false);

  const dataOcorrencia = watch("data") as Date | null;
  const colaboradores = watch("colaboradores_acidentados");
  let colaboradorAcidentadoId: string | null = null;
  if (colaboradores && colaboradores.length > 0) {
    if (typeof colaboradores[0] === "object" && colaboradores[0] !== null) {
      colaboradorAcidentadoId = colaboradores[0].colaborador || null;
    } else {
      colaboradorAcidentadoId = colaboradores[0] || null;
    }
  }
  // Buscar nome do colaborador pelo id selecionado (garante nome para upload)
  let colaboradorAcidentadoNome: string | null = null;
  if (colaboradorAcidentadoId && funcionarios) {
    const found = funcionarios.find((f: any) => f.id?.toString() === colaboradorAcidentadoId?.toString());
    colaboradorAcidentadoNome = found?.nome || colaboradorAcidentadoId; // fallback para compatibilidade
  }

  return (
    <div className="space-y-6">
      <AbsenceFields />

      <BodyPartLateralityFields
        partesCorpo={partesCorpo}
        lateralidades={lateralidades}
      />

      <CauseFields
        agentesCausadores={agentesCausadores}
        situacoesGeradoras={situacoesGeradoras}
        naturezasLesao={naturezasLesao}
      />

      {/* Descrição da ocorrência */}
      <FormField
        control={control}
        name="descricaoOcorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da ocorrência</FormLabel>
            <FormControl>
              <Textarea 
                rows={5} 
                placeholder="Descreva a ocorrência em detalhes" 
                className="resize-none"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CAT e CID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="numeroCat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da CAT</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CID</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ex: M54.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Anexar CAT */}
      <Controller
        control={control}
        name="arquivo_cat"
        render={({ field: { value, onChange, ...field } }) => (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="cat-upload">Anexar CAT (PDF, máx. 2MB)</Label>
            <Input
              id="cat-upload"
              type="file"
              accept=".pdf"
              {...field}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 2 * 1024 * 1024) {
                  if (!dataOcorrencia || !colaboradorAcidentadoNome) {
                    alert("Preencha a data da ocorrência e o colaborador acidentado antes de anexar o CAT.");
                    return;
                  }
                  setUploadingCat(true);
                  const url = await uploadCatFileToBucket(file, dataOcorrencia, colaboradorAcidentadoNome);
                  setUploadingCat(false);
                  if (url) {
                    onChange(url);
                  } else {
                    alert("Erro ao fazer upload do arquivo CAT.");
                  }
                } else if (file) {
                  alert("O arquivo deve ter no máximo 2MB");
                }
              }}
            />
            {uploadingCat && (
              <span className="text-sm text-gray-500">Enviando arquivo...</span>
            )}
            {value && typeof value === "string" && (
              <div className="flex items-center space-x-2 mt-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs"
                >
                  Visualizar CAT anexada
                </a>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onChange(null);
                    setValue("arquivo_cat", null);
                  }}
                  className="text-xs px-2 py-0.5 h-7"
                >
                  Remover CAT
                </Button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default InformacoesOcorrenciaForm;
