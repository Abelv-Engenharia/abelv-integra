
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data
const parteCorpoOptions = ["Cabeça", "Tronco", "Braços", "Mãos", "Pernas", "Pés", "Múltiplas partes"];
const lateralidadeOptions = ["Não aplicável", "Esquerdo", "Direito"];
const agenteCausadorOptions = ["Máquina/Equipamento", "Ferramenta", "Material", "Eletricidade", "Altura", "Temperatura", "Objeto cortante", "Produto químico", "Outro"];
const situacaoGeradoraOptions = ["Operação incorreta de equipamento", "Condição insegura", "Falta de EPI", "Ato inseguro", "Falha operacional", "Falha mecânica", "Erro de procedimento", "Outro"];
const naturezaLesaoOptions = ["Corte", "Contusão", "Fratura", "Queimadura", "Entorse", "Luxação", "Esmagamento", "Amputação", "Intoxicação", "Outro"];

const InformacoesOcorrenciaForm = () => {
  const { control, watch } = useFormContext();
  const houveAfastamento = watch("houveAfastamento");

  return (
    <div className="space-y-6">
      {/* First row: Afastamento e dias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="houveAfastamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Houve afastamento?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="diasPerdidos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias perdidos</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  disabled={houveAfastamento !== "Sim"} 
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="diasDebitados"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias debitados</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  disabled={houveAfastamento !== "Sim"} 
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Second row: Parte do corpo e lateralidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="parteCorpoAtingida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parte do corpo atingida</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parteCorpoOptions.map((parte) => (
                    <SelectItem key={parte} value={parte}>{parte}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="lateralidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lateralidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lateralidadeOptions.map((lateral) => (
                    <SelectItem key={lateral} value={lateral}>{lateral}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Agente causador */}
      <FormField
        control={control}
        name="agenteCausador"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agente causador</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {agenteCausadorOptions.map((agente) => (
                  <SelectItem key={agente} value={agente}>{agente}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Situação geradora */}
      <FormField
        control={control}
        name="situacaoGeradora"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situação geradora</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {situacaoGeradoraOptions.map((situacao) => (
                  <SelectItem key={situacao} value={situacao}>{situacao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Natureza da lesão */}
      <FormField
        control={control}
        name="naturezaLesao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Natureza da lesão</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {naturezaLesaoOptions.map((natureza) => (
                  <SelectItem key={natureza} value={natureza}>{natureza}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
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
