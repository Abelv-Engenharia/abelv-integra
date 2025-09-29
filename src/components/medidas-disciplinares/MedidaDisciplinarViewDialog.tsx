import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MedidaDisciplinar } from "@/types/medidasDisciplinares";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface Props {
  medida: MedidaDisciplinar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedidaDisciplinarViewDialog = ({ medida, open, onOpenChange }: Props) => {
  const [funcionarioNome, setFuncionarioNome] = useState("");
  const [ccaNome, setCcaNome] = useState("");
  const { toast } = useToast();

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
        .createSignedUrl(filePath, 3600); // URL válida por 1 hora
      
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

  useEffect(() => {
    const fetchData = async () => {
      // Buscar nome do funcionário
      if (medida.funcionario_id) {
        const { data: funcData } = await supabase
          .from("funcionarios")
          .select("nome, matricula")
          .eq("id", medida.funcionario_id)
          .maybeSingle();
        if (funcData) {
          setFuncionarioNome(`${funcData.nome} (${funcData.matricula})`);
        }
      }

      // Buscar nome do CCA
      if (medida.cca_id) {
        const { data: ccaData } = await supabase
          .from("ccas")
          .select("codigo, nome")
          .eq("id", Number(medida.cca_id))
          .maybeSingle();
        if (ccaData) {
          setCcaNome(`${ccaData.codigo} - ${ccaData.nome}`);
        }
      }
    };

    if (open) {
      fetchData();
    }
  }, [medida, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Medida Disciplinar</DialogTitle>
          <DialogDescription>
            Visualização completa dos dados registrados desta medida disciplinar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Data de aplicação</label>
              <p className="text-sm mt-1">
                {medida.data_aplicacao ? new Date(medida.data_aplicacao).toLocaleDateString("pt-BR") : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de medida</label>
              <p className="text-sm mt-1">{medida.tipo_medida}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Funcionário</label>
            <p className="text-sm mt-1">{funcionarioNome || "-"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">CCA</label>
            <p className="text-sm mt-1">{ccaNome || "-"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Descrição/Motivo</label>
            <p className="text-sm mt-1 whitespace-pre-wrap">{medida.descricao || "-"}</p>
          </div>

          {medida.arquivo_url && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Anexo</label>
              <div className="mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewPdf(medida.arquivo_url!)}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Abrir documento PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedidaDisciplinarViewDialog;
