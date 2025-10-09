import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const TipoDocumentoFormFields = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="codigo"
        rules={{
          required: "Código é obrigatório",
          maxLength: { value: 50, message: "Código deve ter no máximo 50 caracteres" },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: DOC-001" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="descricao"
        rules={{
          required: "Descrição é obrigatória",
          maxLength: { value: 200, message: "Descrição deve ter no máximo 200 caracteres" },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Certidão de Nascimento" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
