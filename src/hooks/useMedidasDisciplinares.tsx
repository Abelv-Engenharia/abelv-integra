
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarCCAs,
  listarFuncionariosPorCCAOuTodos,
  criarMedidaDisciplinar,
  uploadArquivoPdf,
} from "@/services/medidasDisciplinaresService";
import { MedidaDisciplinarFormData } from "@/types/medidasDisciplinares";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function useCcas() {
  return useQuery({ queryKey: ["ccas"], queryFn: listarCCAs });
}

export function useFuncionarios(cca_id?: string) {
  return useQuery({
    queryKey: ["funcionarios", cca_id],
    queryFn: () => listarFuncionariosPorCCAOuTodos(cca_id),
    enabled: !!cca_id,
  });
}

export function useCriarMedidaDisciplinar() {
  const { toast } = useToast();
  const [arquivoUrl, setArquivoUrl] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ form, arquivo, userId }: {
      form: MedidaDisciplinarFormData, arquivo?: File | null, userId: string
    }) => {
      let pdfUrl = undefined;
      if (arquivo) {
        pdfUrl = await uploadArquivoPdf(arquivo, userId);
        setArquivoUrl(pdfUrl);
      }
      return criarMedidaDisciplinar(form, pdfUrl);
    },
    onSuccess: data => {
      toast({ title: "Sucesso", description: "Medida disciplinar registrada!" });
      queryClient.invalidateQueries({ queryKey: ["medidas-disciplinares"] });
    },
    onError: () => {
      toast({ title: "Erro ao registrar", variant: "destructive" });
    },
  });

  return { ...mutation, arquivoUrl };
}
