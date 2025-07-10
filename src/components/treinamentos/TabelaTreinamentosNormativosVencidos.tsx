
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { treinamentosNormativosService } from "@/services/treinamentos/treinamentosNormativosService";
import { Funcionario, TreinamentoNormativo } from "@/types/treinamentos";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { supabase } from "@/integrations/supabase/client";

export const TabelaTreinamentosNormativosVencidos: React.FC = () => {
  const [treinamentos, setTreinamentos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState<TreinamentoNormativo | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const { data: userCCAs = [] } = useUserCCAs();

  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, [userCCAs]);

  const carregarDados = async () => {
    setLoading(true);
    
    // Get funcionários with their CCAs through the new relationship
    const { data: funcionariosComCCAs, error: funcionariosError } = await supabase
      .from('funcionario_ccas')
      .select(`
        funcionario_id,
        cca_id,
        funcionarios!inner(
          id,
          nome,
          funcao,
          matricula,
          ativo,
          foto,
          data_admissao
        ),
        ccas!inner(
          id,
          codigo,
          nome
        )
      `)
      .eq('funcionarios.ativo', true);

    if (funcionariosError) {
      console.error("Erro ao buscar funcionários:", funcionariosError);
      setLoading(false);
      return;
    }

    // Filter funcionários by user's allowed CCAs
    const userCCAIds = userCCAs.map(cca => cca.id);
    const funcionariosFiltrados = funcionariosComCCAs?.filter(item => 
      userCCAIds.includes(item.cca_id)
    ) || [];

    // Transform data to match expected structure
    const funcionariosProcessados: Funcionario[] = funcionariosFiltrados.map(item => ({
      ...item.funcionarios,
      funcionario_ccas: [{
        id: crypto.randomUUID(),
        cca_id: item.cca_id,
        ccas: item.ccas
      }]
    }));

    // Get treinamentos
    const treinamentos = await treinamentosNormativosService.getAll();
    
    // Filter treinamentos by funcionários permitidos
    const funcionariosPermitidosIds = funcionariosProcessados.map(f => f.id);
    const treinamentosFiltrados = treinamentos.filter(treinamento =>
      funcionariosPermitidosIds.includes(treinamento.funcionario_id)
    );
    
    setTreinamentos(treinamentosFiltrados);
    setFuncionarios(funcionariosProcessados);
    setLoading(false);
  };

  const treinamentosFiltrados = treinamentos
    .filter(t => (t.status === "Vencido" || t.status === "Próximo ao vencimento") && !t.arquivado)
    .sort((a, b) => {
      const dataA = a.data_validade ? new Date(a.data_validade).getTime() : 0;
      const dataB = b.data_validade ? new Date(b.data_validade).getTime() : 0;
      return dataA - dataB;
    });

  function getFuncionarioInfo(id: string) {
    return funcionarios.find(f => f.id === id);
  }

  const handleOpenModal = (treinamento: TreinamentoNormativo) => {
    setTreinamentoSelecionado(treinamento);
    setJustificativa("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTreinamentoSelecionado(null);
    setJustificativa("");
  };

  const handleExcluir = async () => {
    if (!treinamentoSelecionado || justificativa.trim().length < 5) return;
    setExcluindo(true);
    await treinamentosNormativosService.arquivar(treinamentoSelecionado.id, justificativa);
    setExcluindo(false);
    setModalOpen(false);
    setTreinamentoSelecionado(null);
    setJustificativa("");
    carregarDados();
  };

  const handleRenovar = (treinamento: TreinamentoNormativo) => {
    const funcionario = getFuncionarioInfo(treinamento.funcionario_id);
    if (!funcionario) return;
    
    // Get the first CCA from the funcionario_ccas relationship
    const ccaId = funcionario.funcionario_ccas?.[0]?.cca_id;
    
    navigate("/treinamentos/normativo", {
      state: {
        ccaId: ccaId ? String(ccaId) : "",
        funcionarioId: funcionario.id,
        funcao: funcionario.funcao,
        matricula: funcionario.matricula,
        treinamentoId: treinamento.treinamento_id,
        tipo: "Reciclagem",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 w-full">
        <p className="text-muted-foreground">Carregando registros...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <h3 className="font-semibold text-lg mb-2 px-6 pt-6">
        Treinamentos Vencidos e Próximos ao Vencimento
      </h3>
      <div className="min-w-[700px] max-w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Treinamento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data de Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treinamentosFiltrados.length > 0 ? (
              treinamentosFiltrados.map((t) => {
                const funcionario = getFuncionarioInfo(t.funcionario_id);
                return (
                  <TableRow key={t.id}>
                    <TableCell>{funcionario?.nome || "-"}</TableCell>
                    <TableCell>{funcionario?.matricula || "-"}</TableCell>
                    <TableCell>{t.treinamentoNome || "-"}</TableCell>
                    <TableCell>{t.tipo || "-"}</TableCell>
                    <TableCell>
                      {t.data_validade
                        ? format(new Date(t.data_validade), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          t.status === "Vencido"
                            ? "text-red-600 font-semibold"
                            : "text-amber-600 font-semibold"
                        }
                      >
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRenovar(t)}
                        title="Renovar treinamento"
                      >
                        Renovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleOpenModal(t)}
                        title="Excluir trein. vencido"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                  Nenhum treinamento vencido ou próximo ao vencimento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Modal de justificativa para exclusão */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Justificativa para exclusão</h4>
            <textarea
              className="w-full min-h-[80px] border rounded px-2 py-1"
              placeholder="Insira a justificativa (mínimo 5 caracteres)"
              value={justificativa}
              onChange={e => setJustificativa(e.target.value)}
              disabled={excluindo}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={excluindo}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleExcluir}
                disabled={excluindo || justificativa.trim().length < 5}
              >
                {excluindo ? "Excluindo..." : "Confirmar Exclusão"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
