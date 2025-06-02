
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilteredFormData } from "@/hooks/useFilteredFormData";

interface NovaIdentificacaoFormProps {
  context: {
    ccas: any[];
    tiposRegistro: any[];
    processos: any[];
    eventosIdentificados: any[];
    causasProvaveis: any[];
    empresas: any[];
    disciplinas: any[];
    engenheiros: any[];
  };
}

const NovaIdentificacaoForm = ({ context }: NovaIdentificacaoFormProps) => {
  const { control, watch } = useFormContext();

  const {
    ccas,
    tiposRegistro,
    processos,
    eventosIdentificados,
    causasProvaveis,
    disciplinas,
  } = context;

  // Watch do CCA selecionado para filtrar os outros campos
  const selectedCcaId = watch("ccaId");
  
  // Usar dados filtrados baseados no CCA selecionado
  const filteredData = useFilteredFormData({ selectedCcaId });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="hora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora*</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="mes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="ccaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CCA*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="tipoRegistro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Registro*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de registro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposRegistro.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
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
            name="processo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o processo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {processos.map((processo) => (
                      <SelectItem key={processo.id} value={processo.id.toString()}>
                        {processo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="eventoIdentificado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento Identificado*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventosIdentificados.map((evento) => (
                      <SelectItem key={evento.id} value={evento.id.toString()}>
                        {evento.nome}
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
            name="causaProvavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Causa Provável*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a causa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {causasProvaveis.map((causa) => (
                      <SelectItem key={causa.id} value={causa.id.toString()}>
                        {causa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="responsavelInspecao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável pela Inspeção*</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nome do responsável" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCcaId ? "Selecione a empresa" : "Primeiro selecione um CCA"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredData.empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        {empresa.nome}
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
            name="disciplina"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disciplinas.map((disciplina) => (
                      <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                        {disciplina.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="engenheiroResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Engenheiro Responsável*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCcaId ? "Selecione o engenheiro responsável" : "Primeiro selecione um CCA"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredData.engenheiros.map((engenheiro) => (
                    <SelectItem key={engenheiro.id} value={engenheiro.id}>
                      {engenheiro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default NovaIdentificacaoForm;
