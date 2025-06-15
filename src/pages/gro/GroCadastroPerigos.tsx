
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import EvidenciaUpload from "@/components/gro/EvidenciaUpload";
import { toast } from "@/hooks/use-toast";

const perigoTypes = [
  { value: "fisico", label: "Físico" },
  { value: "quimico", label: "Químico" },
  { value: "biologico", label: "Biológico" },
  { value: "ergonomico", label: "Ergonômico" },
  { value: "acidente", label: "Acidente" },
] as const;

const CadastroPerigosSchema = z.object({
  atividade: z.string().min(1, "Informe a atividade"),
  setor: z.string().min(1, "Informe o setor"),
  tarefa: z.string().min(1, "Informe a tarefa"),
  funcao: z.string().min(1, "Informe a função"),
  tipoPerigo: z.enum(["fisico", "quimico", "biologico", "ergonomico", "acidente"], {
    required_error: "Selecione o tipo de perigo",
  }),
  descricao: z.string().min(1, "Descreva o perigo"),
  condicaoGeradora: z.string().min(1, "Descreva a condição geradora"),
  evidencias: z.array(z.instanceof(File)).optional(),
});

type CadastroPerigosForm = z.infer<typeof CadastroPerigosSchema>;

export default function GroCadastroPerigos() {
  const form = useForm<CadastroPerigosForm>({
    resolver: zodResolver(CadastroPerigosSchema),
    defaultValues: {
      atividade: "",
      setor: "",
      tarefa: "",
      funcao: "",
      tipoPerigo: undefined,
      descricao: "",
      condicaoGeradora: "",
      evidencias: [],
    },
  });
  const [files, setFiles] = useState<File[]>([]);

  function onSubmit(data: CadastroPerigosForm) {
    // Aqui deve ir a lógica de envio à API/back-end (não implementada ainda)
    toast({
      title: "Perigo cadastrado!",
      description: (
        <div className="space-y-1 text-left">
          <div><strong>Tipo:</strong> {perigoTypes.find(t => t.value === data.tipoPerigo)?.label}</div>
          <div><strong>Atividade:</strong> {data.atividade}</div>
          <div><strong>Setor:</strong> {data.setor}</div>
          <div><strong>Tarefa:</strong> {data.tarefa}</div>
          <div><strong>Função:</strong> {data.funcao}</div>
        </div>
      ),
      variant: "default",
    });
    form.reset();
    setFiles([]);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Cadastro de Perigos e Riscos Ocupacionais</h1>
      <p className="mb-6 text-muted-foreground">
        Utilize este formulário para identificar perigos, categorizar o tipo de perigo e anexar evidências conforme prevê a NR-01/NR-09.
      </p>
      <Card className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="atividade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atividade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Manutenção elétrica" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Oficina, Produção" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tarefa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarefa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Troca de equipamento" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="funcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Eletricista, Operador" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tipoPerigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Perigo</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {perigoTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Tipos de perigo conforme NR-09/NR-01 (Físico, Químico, Biológico, Ergonômico, Acidente)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Detalhada do Perigo</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Detalhe o perigo identificado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condicaoGeradora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condição Geradora</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Descreva a condição em que o perigo é gerado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload de Evidências */}
            <FormItem>
              <FormLabel>Anexar Evidências</FormLabel>
              <FormDescription>
                Anexe fotos, vídeos ou documentos (PDF, JPG, PNG, MP4, MOV etc).
              </FormDescription>
              <EvidenciaUpload files={files} setFiles={setFiles} />
            </FormItem>
            <Button type="submit" className="w-full mt-2">Salvar Perigo</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
