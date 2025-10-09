import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface EmpresaSiengeFormFieldsProps {
  form: UseFormReturn<any>;
}

export default function EmpresaSiengeFormFields({ form }: EmpresaSiengeFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="id_sienge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Id sienge <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Digite o id sienge"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                className={!field.value ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o nome"
                {...field}
                className={!field.value ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tradeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome fantasia</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome fantasia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cnpj</FormLabel>
            <FormControl>
              <Input placeholder="Digite o cnpj" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
