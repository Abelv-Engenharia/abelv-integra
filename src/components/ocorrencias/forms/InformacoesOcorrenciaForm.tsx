
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
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import AbsenceFields from "./components/AbsenceFields";
import BodyPartLateralityFields from "./components/BodyPartLateralityFields";
import CauseFields from "./components/CauseFields";

const InformacoesOcorrenciaForm = () => {
  const { control } = useFormContext();
  const { partesCorpo, lateralidades, agentesCausadores, situacoesGeradoras, naturezasLesao } = useOcorrenciasFormData();

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
        name="arquivoCAT"
        render={({ field: { value, onChange, ...field } }) => (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="cat-upload">Anexar CAT (PDF, máx. 2MB)</Label>
            <Input
              id="cat-upload"
              type="file"
              accept=".pdf"
              {...field}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                  onChange(file);
                } else if (file) {
                  alert("O arquivo deve ter no máximo 2MB");
                }
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default InformacoesOcorrenciaForm;
