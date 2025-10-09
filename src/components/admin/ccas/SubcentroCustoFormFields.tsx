import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SubcentroCustoFormFields = () => {
  const form = useFormContext();

  // Buscar empresas Sienge
  const { data: empresasSienge = [] } = useQuery({
    queryKey: ['empresas-sienge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas_sienge')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="id_sienge"
        rules={{ required: "Id sienge é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={!field.value ? "text-destructive" : ""}>
              Id sienge
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Digite o ID Sienge"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                className={!field.value ? "border-destructive" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="faturamento"
        rules={{ required: "Faturamento é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={!field.value ? "text-destructive" : ""}>
              Faturamento
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o faturamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Abelv">Abelv</SelectItem>
                <SelectItem value="FATD">FATD</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="empresa_sienge_id"
        rules={{ required: "Empresa é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={!field.value ? "text-destructive" : ""}>
              Empresa
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {empresasSienge.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export { SubcentroCustoFormFields };
