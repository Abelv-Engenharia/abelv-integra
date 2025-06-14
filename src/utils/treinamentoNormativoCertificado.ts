
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Funcionario } from "@/types/treinamentos";

// Função para buscar nome do treinamento pelo id selecionado
export function getTreinamentoNomeById(id: string, treinamentosNormativos: { id: string; nome: string }[]): string | null {
  const trein = treinamentosNormativos.find(t => t.id === id);
  return trein ? trein.nome : null;
}

// Função para construir o nome customizado do arquivo certificado
export function buildCertificadoFileName(
  nomeTreinamento: string,
  matriculaFuncionario: string,
  nomeFuncionario: string,
  ext: string
): string {
  let baseTreinamento = nomeTreinamento.split("-")[0].trim();
  baseTreinamento = baseTreinamento.replace(/\s+$/, "");

  function removeSpecialChars(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_\-\s]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  const baseNomeArquivo = `${removeSpecialChars(baseTreinamento)}_${matriculaFuncionario}_${removeSpecialChars(nomeFuncionario).toUpperCase()}`.replace(/ /g, " ");
  const arquivoFinal = `${baseNomeArquivo}.${ext.toLowerCase()}`;
  return arquivoFinal;
}


// Função para upload de certificado e retornar a URL segura
export async function uploadCertificadoPersonalizado({
  file,
  treinamentoId,
  funcionarioId,
  treinamentosNormativos,
  funcionarios,
  BUCKET_CERTIFICADOS = "certificados-treinamentos-normativos"
} : {
  file: File,
  treinamentoId: string,
  funcionarioId: string,
  treinamentosNormativos: { id: string; nome: string }[],
  funcionarios: Funcionario[],
  BUCKET_CERTIFICADOS?: string
}) : Promise<string | null> {
  const treinamentoNome = getTreinamentoNomeById(treinamentoId, treinamentosNormativos);
  const funcionario = funcionarios.find(f => f.id === funcionarioId);

  if (!treinamentoNome || !funcionario) {
    toast({
      title: "Dados insuficientes",
      description: "Selecione o treinamento e o funcionário antes de anexar o certificado.",
      variant: "destructive"
    });
    return null;
  }
  const ext = file.name.split(".").pop() || "pdf";
  const matricula = funcionario.matricula || "XXXX";
  const nomeFuncionario = funcionario.nome || "FUNCIONARIO_DESCONHECIDO";
  const fileName = buildCertificadoFileName(treinamentoNome, matricula, nomeFuncionario, ext);

  const { error } = await supabase.storage.from(BUCKET_CERTIFICADOS).upload(fileName, file, {
    upsert: true,
    contentType: "application/pdf"
  });

  if (error) {
    toast({
      title: "Erro ao anexar certificado",
      description: "Falha ao enviar arquivo para o storage.",
      variant: "destructive"
    });
    return null;
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKET_CERTIFICADOS)
    .createSignedUrl(fileName, 60 * 60 * 24 * 7);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    toast({
      title: "Erro ao gerar URL do certificado",
      description: "Não foi possível gerar a URL segura.",
      variant: "destructive"
    });
    return null;
  }
  return signedUrlData.signedUrl;
}
