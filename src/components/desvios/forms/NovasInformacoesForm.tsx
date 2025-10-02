
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilteredFormData } from "@/hooks/useFilteredFormData";

interface NovasInformacoesFormProps {
  context: {
    baseLegalOpcoes: any[];
    supervisores: any[];
    encarregados: any[];
    funcionarios: any[];
  };
}

const NovasInformacoesForm = ({ context }: NovasInformacoesFormProps) => {
  const { control, watch } = useFormContext();
  const { baseLegalOpcoes } = context;

  // Watch do CCA selecionado para filtrar os outros campos
  const selectedCcaId = watch("ccaId");
  const empresaId = watch("empresaId");
  const isAbelvSelecionada = empresaId === "6";
  
  // Usar dados filtrados baseados no CCA selecionado
  const filteredData = useFilteredFormData({ selectedCcaId });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Desvio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="descricaoDesvio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Desvio*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o desvio identificado..."
                  className="min-h-[100px]"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="baseLegal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Legal*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a base legal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {baseLegalOpcoes.map((opcao) => (
                    <SelectItem key={opcao.id} value={opcao.id.toString()}>
                      {opcao.nome}
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
            name="supervisorResponsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor responsável</FormLabel>
                {isAbelvSelecionada ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedCcaId ? "Selecione o supervisor" : "Primeiro selecione um CCA"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredData.supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome do supervisor"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="encarregadoResponsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encarregado responsável</FormLabel>
                {isAbelvSelecionada ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedCcaId ? "Selecione o encarregado" : "Primeiro selecione um CCA"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredData.encarregados.map((encarregado) => (
                        <SelectItem key={encarregado.id} value={encarregado.id}>
                          {encarregado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome do encarregado"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="colaboradorInfrator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colaborador infrator</FormLabel>
              {isAbelvSelecionada ? (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCcaId ? "Selecione o colaborador" : "Primeiro selecione um CCA"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredData.funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome} - {funcionario.matricula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <Input 
                    placeholder="Digite o nome do colaborador"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="funcao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    readOnly={isAbelvSelecionada}
                    placeholder={!isAbelvSelecionada ? "Digite a função" : ""}
                    onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    readOnly={isAbelvSelecionada}
                    placeholder={!isAbelvSelecionada ? "Digite a matrícula" : ""}
                    onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NovasInformacoesForm;
