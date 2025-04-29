
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  useCCAOptions, 
  useTipoDesvioOptions, 
  useClassificacaoDesviosOptions, 
  useStatusDesviosOptions, 
  useDisciplinasOptions, 
  useEmpresasOptions 
} from "@/hooks/useDropdownOptions";

const filterSchema = z.object({
  dataInicio: z.date().optional(),
  dataFim: z.date().optional(),
  cca: z.string().optional(),
  empresa: z.string().optional(),
  disciplina: z.string().optional(),
  tipo: z.string().optional(),
  classificacao: z.string().optional(),
  status: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface RelatorioFiltersProps {
  onFilter: (filters: FilterValues) => void;
  showDisciplinas?: boolean;
  showTipoDesvio?: boolean;
}

const RelatorioFilters = ({ 
  onFilter, 
  showDisciplinas = false, 
  showTipoDesvio = true 
}: RelatorioFiltersProps) => {
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {},
  });
  
  // Fetch options from Supabase using our new hooks
  const { options: ccaOptions, isLoading: isLoadingCcas } = useCCAOptions();
  const { options: empresaOptions, isLoading: isLoadingEmpresas } = useEmpresasOptions();
  const { options: disciplinaOptions, isLoading: isLoadingDisciplinas } = useDisciplinasOptions();
  const { options: tipoDesvioOptions, isLoading: isLoadingTiposDesvio } = useTipoDesvioOptions();
  const { options: classificacaoOptions, isLoading: isLoadingClassificacoes } = useClassificacaoDesviosOptions();
  const { options: statusOptions, isLoading: isLoadingStatus } = useStatusDesviosOptions();

  const onSubmit = (data: FilterValues) => {
    onFilter(data);
  };

  const handleClear = () => {
    form.reset();
    onFilter({});
  };

  return (
    <div className="bg-white p-5 rounded-lg border shadow-sm mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data inicio */}
            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Data fim */}
            <FormField
              control={form.control}
              name="dataFim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data fim</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* CCA */}
            <FormField
              control={form.control}
              name="cca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CCA</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingCcas}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {ccaOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Empresa */}
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingEmpresas}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {empresaOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Disciplina - opcional */}
            {showDisciplinas && (
              <FormField
                control={form.control}
                name="disciplina"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoadingDisciplinas}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        {disciplinaOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {/* Tipo de Desvio - opcional */}
            {showTipoDesvio && (
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Desvio</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isLoadingTiposDesvio}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        {tipoDesvioOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {/* Classificação */}
            <FormField
              control={form.control}
              name="classificacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classificação</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingClassificacoes}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {classificacaoOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={String(option.value)}
                          className={option.color ? `text-${option.color}` : ''}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingStatus}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {statusOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={String(option.value)}
                          className={option.color ? `text-${option.color}` : ''}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpar filtros
            </Button>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" /> Filtrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RelatorioFilters;
