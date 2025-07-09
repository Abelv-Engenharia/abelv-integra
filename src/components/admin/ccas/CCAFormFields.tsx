
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

export const CCAFormFields = () => {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="codigo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código</FormLabel>
            <FormControl>
              <Input placeholder="Digite o código do CCA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do CCA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <Input placeholder="Digite o tipo do CCA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Ativo</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
