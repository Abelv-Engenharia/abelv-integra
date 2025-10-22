import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { FileCheck, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Funções auxiliares para formatação de CPF
const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

const removeCPFMask = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

const formSchema = z.object({
  nome_condutor: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  categoria_cnh: z.string().min(1, "Categoria é obrigatória"),
  validade_cnh: z.string().min(1, "Validade é obrigatória"),
  status_cnh: z.string().min(1, "Status é obrigatório"),
  numero_cnh: z.string().optional(),
  observacao: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CondutorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemParaEdicao?: any;
  onSuccess?: () => void;
}

export function CondutorFormModal({ open, onOpenChange, itemParaEdicao, onSuccess }: CondutorFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!itemParaEdicao;
  const [uploadingTermo, setUploadingTermo] = useState(false);
  const [termoFile, setTermoFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: itemParaEdicao ? {
      nome_condutor: itemParaEdicao.nome_condutor,
      cpf: formatCPF(itemParaEdicao.cpf),
      categoria_cnh: itemParaEdicao.categoria_cnh,
      validade_cnh: itemParaEdicao.validade_cnh ? format(new Date(itemParaEdicao.validade_cnh), "yyyy-MM-dd") : "",
      status_cnh: itemParaEdicao.status_cnh,
      numero_cnh: itemParaEdicao.numero_cnh || "",
      observacao: itemParaEdicao.observacao || "",
    } : {
      status_cnh: "ativa"
    }
  });

  useEffect(() => {
    if (open && itemParaEdicao) {
      reset({
        nome_condutor: itemParaEdicao.nome_condutor,
        cpf: formatCPF(itemParaEdicao.cpf),
        categoria_cnh: itemParaEdicao.categoria_cnh,
        validade_cnh: itemParaEdicao.validade_cnh ? format(new Date(itemParaEdicao.validade_cnh), "yyyy-MM-dd") : "",
        status_cnh: itemParaEdicao.status_cnh,
        numero_cnh: itemParaEdicao.numero_cnh || "",
        observacao: itemParaEdicao.observacao || "",
      });
    } else if (open && !itemParaEdicao) {
      reset({
        nome_condutor: "",
        cpf: "",
        categoria_cnh: "",
        validade_cnh: "",
        status_cnh: "ativa",
        numero_cnh: "",
        observacao: "",
      });
    }
  }, [open, itemParaEdicao, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTermoFile(e.target.files[0]);
    }
  };

  const uploadTermo = async () => {
    if (!termoFile) return null;

    setUploadingTermo(true);
    try {
      const fileExt = termoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `termos-condutores/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('veiculos')
        .upload(filePath, termoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('veiculos')
        .getPublicUrl(filePath);

      return { url: publicUrl, nome: termoFile.name };
    } catch (error: any) {
      toast({ title: "Erro", description: "Erro ao fazer upload do termo", variant: "destructive" });
      return null;
    } finally {
      setUploadingTermo(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (values: FormData) => {
      let termoData = null;
      if (termoFile) {
        termoData = await uploadTermo();
      }

      const { data, error } = await supabase
        .from('veiculos_condutores')
        .insert([{ 
          nome_condutor: values.nome_condutor,
          cpf: removeCPFMask(values.cpf),
          categoria_cnh: values.categoria_cnh,
          validade_cnh: values.validade_cnh,
          status_cnh: values.status_cnh,
          numero_cnh: values.numero_cnh,
          observacao: values.observacao,
          termo_anexado_url: termoData?.url,
          termo_anexado_nome: termoData?.nome
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condutores'] });
      toast({ title: "Sucesso", description: "Condutor cadastrado com sucesso!" });
      reset();
      setTermoFile(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormData) => {
      let termoData = null;
      if (termoFile) {
        termoData = await uploadTermo();
      }

      const updateData: any = { 
        ...values,
        cpf: removeCPFMask(values.cpf)
      };
      if (termoData) {
        updateData.termo_anexado_url = termoData.url;
        updateData.termo_anexado_nome = termoData.nome;
      }

      const { error } = await supabase
        .from('veiculos_condutores')
        .update(updateData)
        .eq('id', itemParaEdicao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condutores'] });
      toast({ title: "Sucesso", description: "Condutor atualizado com sucesso!" });
      setTermoFile(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Condutor" : "Novo Condutor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={errors.nome_condutor ? "text-destructive" : ""}>Nome Completo *</Label>
              <Input {...register("nome_condutor")} className={errors.nome_condutor ? "border-destructive" : ""} />
              {errors.nome_condutor && <p className="text-sm text-destructive mt-1">{errors.nome_condutor.message}</p>}
            </div>

            <div>
              <Label className={errors.cpf ? "text-destructive" : ""}>CPF *</Label>
              <Input {...register("cpf")} className={errors.cpf ? "border-destructive" : ""} placeholder="000.000.000-00" />
              {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>}
            </div>

            <div>
              <Label>Número CNH</Label>
              <Input {...register("numero_cnh")} />
            </div>

            <div>
              <Label className={errors.categoria_cnh ? "text-destructive" : ""}>Categoria CNH *</Label>
              <Select onValueChange={(value) => setValue("categoria_cnh", value)} defaultValue={watch("categoria_cnh")}>
                <SelectTrigger className={errors.categoria_cnh ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria_cnh && <p className="text-sm text-destructive mt-1">{errors.categoria_cnh.message}</p>}
            </div>

            <div>
              <Label className={errors.validade_cnh ? "text-destructive" : ""}>Validade CNH *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch("validade_cnh") && "text-muted-foreground",
                      errors.validade_cnh && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch("validade_cnh") ? (
                      format(new Date(watch("validade_cnh")), "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch("validade_cnh") ? new Date(watch("validade_cnh")) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setValue("validade_cnh", format(date, "yyyy-MM-dd"));
                      }
                    }}
                    locale={ptBR}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.validade_cnh && <p className="text-sm text-destructive mt-1">{errors.validade_cnh.message}</p>}
            </div>

            <div>
              <Label className={errors.status_cnh ? "text-destructive" : ""}>Status CNH *</Label>
              <Select onValueChange={(value) => setValue("status_cnh", value)} defaultValue={watch("status_cnh")}>
                <SelectTrigger className={errors.status_cnh ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="suspensa">Suspensa</SelectItem>
                </SelectContent>
              </Select>
              {errors.status_cnh && <p className="text-sm text-destructive mt-1">{errors.status_cnh.message}</p>}
            </div>

            <div className="col-span-2">
              <Label>CNH</Label>
              
              {isEditMode && itemParaEdicao.termo_anexado_url && (
                <div className="mb-2 p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">CNH anexada:</span>
                    <a 
                      href={itemParaEdicao.termo_anexado_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {itemParaEdicao.termo_anexado_nome || "Visualizar CNH"}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {termoFile ? (
                  <span className="text-sm text-muted-foreground">{termoFile.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {isEditMode ? "Selecione para substituir" : "Nenhum arquivo escolhido"}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea {...register("observacao")} rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploadingTermo}>
              {createMutation.isPending || updateMutation.isPending || uploadingTermo ? "Salvando..." : isEditMode ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
