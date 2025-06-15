import { useForm, FormProvider } from "react-hook-form";
import { MedidaDisciplinarFormData, tiposMedidaAplicada } from "@/types/medidasDisciplinares";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PdfUpload } from "./PdfUpload";
import { useCcas, useFuncionarios, useCriarMedidaDisciplinar } from "@/hooks/useMedidasDisciplinares";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

const schema = z.object({
  cca_id: z.string().nonempty("CCA obrigatório"),
  funcionario_id: z.string().nonempty("Funcionário obrigatório"),
  tipo_medida: z.enum([
    "ADVERTÊNCIA VERBAL",
    "ADVERTÊNCIA ESCRITA",
    "SUSPENSÃO",
    "DEMISSÃO POR JUSTA CAUSA"
  ], { errorMap: () => ({ message: "Tipo obrigatório" }) }),
  data_aplicacao: z.string().nonempty("Data obrigatória"),
  descricao: z.string().optional(),
  arquivo: z
    .custom<File | null>()
    .refine(f => !f || f.type === "application/pdf", "Selecione um PDF"),
});

type Schema = z.infer<typeof schema>;

export default function MedidaDisciplinarForm({ onSuccess }: { onSuccess: () => void }) {
  const methods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      cca_id: "",
      funcionario_id: "",
      tipo_medida: undefined,
      data_aplicacao: "",
      descricao: "",
      arquivo: null,
    },
  });
  const { watch, setValue, handleSubmit, reset } = methods;
  const cca_id = watch("cca_id");
  const { data: ccas, isLoading: ccasLoading } = useCcas();
  const { data: funcionarios, isLoading: funcLoading } = useFuncionarios(cca_id);
  const { mutateAsync, isPending } = useCriarMedidaDisciplinar();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    setValue("funcionario_id", "");
  }, [cca_id, setValue]);

  useEffect(() => {
    setValue("arquivo", pdfFile);
  }, [pdfFile, setValue]);

  const onSubmit = async (data: Schema) => {
    if (!profile?.id) return;
    await mutateAsync({
      form: {
        cca_id: data.cca_id,
        funcionario_id: data.funcionario_id,
        tipo_medida: data.tipo_medida,
        data_aplicacao: data.data_aplicacao,
        descricao: data.descricao ?? "",
        arquivo: data.arquivo ?? null,
      },
      arquivo: pdfFile,
      userId: profile.id
    });
    reset({
      cca_id: "",
      funcionario_id: "",
      tipo_medida: undefined,
      data_aplicacao: "",
      descricao: "",
      arquivo: null,
    });
    onSuccess();
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form className="space-y-6 max-w-xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
          {/* CCA */}
          <FormField
            control={methods.control}
            name="cca_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CCA *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={ccasLoading ? "Carregando..." : "Selecione o CCA"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ccas?.map((cca: any) => (
                      <SelectItem key={cca.id} value={String(cca.id)}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Funcionário */}
          <FormField
            control={methods.control}
            name="funcionario_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funcionário *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""} disabled={!cca_id}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={!cca_id ? "Selecione um CCA" : (funcLoading ? "Carregando..." : "Selecione o funcionário")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {funcionarios?.map((f: any) => (
                      <SelectItem value={f.id} key={f.id}>{f.nome} ({f.matricula})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo de medida */}
          <FormField
            control={methods.control}
            name="tipo_medida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de medida *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposMedidaAplicada.map(tipo => (
                      <SelectItem value={tipo.value} key={tipo.value}>{tipo.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data da aplicação */}
          <FormField
            control={methods.control}
            name="data_aplicacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da aplicação *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={methods.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações/Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva detalhes relevantes da medida (opcional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Upload PDF */}
          <FormField
            control={methods.control}
            name="arquivo"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Anexar documento (PDF, opcional)</FormLabel>
                <FormControl>
                  <PdfUpload file={pdfFile} onFileChange={setPdfFile} error={fieldState.error?.message} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Salvar Medida Disciplinar
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
