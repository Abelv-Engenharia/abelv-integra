import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MedidaDisciplinar, MedidaDisciplinarFormData, tiposMedidaAplicada, TipoMedidaAplicada } from "@/types/medidasDisciplinares";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PdfUpload } from "./PdfUpload";
import { uploadArquivoPdf } from "@/services/medidasDisciplinaresService";
import { useProfile } from "@/hooks/useProfile";
import { UI_TO_DB_TIPO_MAP } from "@/types/medidasDisciplinares";
import { Button as ButtonUI } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface Props {
  medida: MedidaDisciplinar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const schema = z.object({
  tipo_medida: z.string().nonempty("Tipo obrigatório"),
  data_aplicacao: z.string().nonempty("Data obrigatória"),
  descricao: z.string().optional(),
  arquivo: z.custom<File | null>().refine(f => !f || f.type === "application/pdf", "Selecione um PDF"),
});

const MedidaDisciplinarEditDialog = ({ medida, open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleViewPdf = async (pdfUrl: string) => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = pdfUrl.split('/storage/v1/object/public/medidas_disciplinares/');
      if (urlParts.length < 2) {
        throw new Error("URL inválida");
      }
      
      const filePath = urlParts[1];
      
      // Obter URL assinada do Supabase
      const { data, error } = await supabase
        .storage
        .from('medidas_disciplinares')
        .createSignedUrl(filePath, 3600);
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      toast({
        title: "Erro ao abrir arquivo",
        description: "Não foi possível acessar o arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo_medida: medida.tipo_medida,
      data_aplicacao: medida.data_aplicacao,
      descricao: medida.descricao || "",
      arquivo: null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        tipo_medida: medida.tipo_medida,
        data_aplicacao: medida.data_aplicacao,
        descricao: medida.descricao || "",
        arquivo: null,
      });
      setPdfFile(null);
    }
  }, [open, medida, form]);

  useEffect(() => {
    form.setValue("arquivo", pdfFile);
  }, [pdfFile, form]);

  const onSubmit = async (data: any) => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      let pdfUrl = medida.arquivo_url;

      // Upload novo arquivo se fornecido
      if (pdfFile) {
        pdfUrl = await uploadArquivoPdf(pdfFile, profile.id);
      }

      // Extrair ano e mês
      const [ano, mes] = data.data_aplicacao.split("-");

      // Converter tipo de medida para formato do banco
      const medidaBanco = UI_TO_DB_TIPO_MAP[data.tipo_medida as TipoMedidaAplicada];

      // Atualizar no banco
      const { error } = await supabase
        .from("medidas_disciplinares")
        .update({
          medida: medidaBanco as "ADVERTÊNCIA VERBAL" | "ADVERTÊNCIA ESCRITA" | "SUSPENSÃO" | "DEMISSÃO POR JUSTA CAUSA",
          data: data.data_aplicacao,
          motivo: data.descricao || "",
          pdf_url: pdfUrl,
          ano,
          mes,
        })
        .eq("id", medida.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Medida disciplinar atualizada!",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast({
        title: "Erro ao atualizar",
        variant: "destructive",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Medida Disciplinar</DialogTitle>
          <DialogDescription>
            Atualize os dados da medida disciplinar e anexe novos documentos se necessário
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo_medida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de medida *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposMedidaAplicada.map((tipo) => (
                        <SelectItem value={tipo.value} key={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações/Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descreva detalhes relevantes da medida (opcional)" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arquivo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Anexar novo documento (PDF, opcional)</FormLabel>
                  <FormControl>
                    <PdfUpload file={pdfFile} onFileChange={setPdfFile} error={fieldState.error?.message} />
                  </FormControl>
                  {medida.arquivo_url && !pdfFile && (
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      Anexo atual: 
                      <ButtonUI
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => handleViewPdf(medida.arquivo_url!)}
                        className="p-0 h-auto text-blue-600"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Ver PDF
                      </ButtonUI>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MedidaDisciplinarEditDialog;
