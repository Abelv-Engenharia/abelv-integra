import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MedidaDisciplinar } from "@/types/medidasDisciplinares";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  medida: MedidaDisciplinar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedidaDisciplinarViewDialog = ({ medida, open, onOpenChange }: Props) => {
  const [funcionarioNome, setFuncionarioNome] = useState("");
  const [ccaNome, setCcaNome] = useState("");

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
                <a 
                  href={medida.arquivo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Abrir documento PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedidaDisciplinarViewDialog;
