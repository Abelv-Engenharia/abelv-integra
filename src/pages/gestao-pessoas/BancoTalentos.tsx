import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCandidatos, useDeleteCandidato } from "@/hooks/gestao-pessoas/useCandidatos";
import { Candidato } from "@/types/gestao-pessoas/candidato";
import { CandidatoStatusBadge } from "@/components/gestao-pessoas/banco-talentos/CandidatoStatusBadge";
import { EtapaProcessoBadge } from "@/components/gestao-pessoas/banco-talentos/EtapaProcessoBadge";
import { OrigemIcon } from "@/components/gestao-pessoas/banco-talentos/OrigemIcon";
import { FiltrosBancoTalentos, FiltrosCandidato } from "@/components/gestao-pessoas/banco-talentos/FiltrosBancoTalentos";
import { NovoCandidatoModal } from "@/components/gestao-pessoas/banco-talentos/NovoCandidatoModal";
import { DetalhesCandidatoModal } from "@/components/gestao-pessoas/banco-talentos/DetalhesCandidatoModal";
import { EditarCandidatoModal } from "@/components/gestao-pessoas/banco-talentos/EditarCandidatoModal";
import { Plus, Users, UserCheck, Clock, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const BancoTalentos = () => {
  const { data: candidatos = [], isLoading } = useCandidatos();
  const deleteCandidato = useDeleteCandidato();
  const [modalNovo, setModalNovo] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);

  const [filtros, setFiltros] = useState<FiltrosCandidato>({
    busca: "",
    origem: undefined,
    etapa: undefined,
    status: undefined,
    unidadeObra: undefined,
    possibilidadeReaproveitamento: undefined
  });

  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((candidato) => {
      const matchBusca = 
        !filtros.busca ||
        candidato.nomeCompleto.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        candidato.cargoVagaPretendida.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        candidato.origemCandidato.toLowerCase().includes(filtros.busca.toLowerCase());

      const matchOrigem = !filtros.origem || candidato.origemCandidato === filtros.origem;
      const matchEtapa = !filtros.etapa || candidato.etapaProcesso === filtros.etapa;
      const matchStatus = !filtros.status || candidato.statusCandidato === filtros.status;
      const matchReaproveitamento = 
        filtros.possibilidadeReaproveitamento === undefined || 
        candidato.possibilidadeReaproveitamento === filtros.possibilidadeReaproveitamento;

      return matchBusca && matchOrigem && matchEtapa && matchStatus && matchReaproveitamento;
    });
  }, [candidatos, filtros]);

  const estatisticas = useMemo(() => {
    return {
      total: candidatos.length,
      disponiveis: candidatos.filter(c => c.statusCandidato === "Disponível").length,
      emProcesso: candidatos.filter(c => c.statusCandidato === "Em outro processo").length,
      contratados: candidatos.filter(c => c.statusCandidato === "Contratado").length
    };
  }, [candidatos]);

  const handleExcluirCandidato = (id: string) => {
    deleteCandidato.mutate(id);
  };

  const handleVerDetalhes = (candidato: Candidato) => {
    setCandidatoSelecionado(candidato);
    setModalDetalhes(true);
  };

  const handleEditar = (candidato: Candidato) => {
    setCandidatoSelecionado(candidato);
    setModalEditar(true);
  };

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      origem: undefined,
      etapa: undefined,
      status: undefined,
      unidadeObra: undefined,
      possibilidadeReaproveitamento: undefined
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Carregando candidatos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banco de Talentos</h1>
          <p className="text-muted-foreground">Gestão de Pessoas &gt; Recrutamento & Seleção &gt; Banco de Talentos</p>
        </div>
        <Button onClick={() => setModalNovo(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Candidato
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Candidatos</CardDescription>
            <CardTitle className="text-3xl">{estatisticas.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Candidatos Disponíveis</CardDescription>
            <CardTitle className="text-3xl text-green-600">{estatisticas.disponiveis}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Em Processo</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{estatisticas.emProcesso}</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contratados</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{estatisticas.contratados}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <FiltrosBancoTalentos
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimparFiltros={limparFiltros}
      />

      {/* Barra de ações */}
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </div>

      {/* Tabela de Candidatos */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Cargo / Vaga</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidatosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhum candidato encontrado
                </TableCell>
              </TableRow>
            ) : (
              candidatosFiltrados.map((candidato) => (
                <TableRow key={candidato.id}>
                  <TableCell className="font-medium">{candidato.nomeCompleto}</TableCell>
                  <TableCell>{candidato.cargoVagaPretendida}</TableCell>
                  <TableCell>
                    <OrigemIcon origem={candidato.origemCandidato} />
                  </TableCell>
                  <TableCell>
                    <EtapaProcessoBadge etapa={candidato.etapaProcesso} />
                  </TableCell>
                  <TableCell>
                    <CandidatoStatusBadge status={candidato.statusCandidato} />
                  </TableCell>
                  <TableCell>{format(candidato.dataCadastro, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleVerDetalhes(candidato)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditar(candidato)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleExcluirCandidato(candidato.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modais */}
      <NovoCandidatoModal
        open={modalNovo}
        onOpenChange={setModalNovo}
        onSubmit={() => setModalNovo(false)}
      />

      <DetalhesCandidatoModal
        open={modalDetalhes}
        onOpenChange={setModalDetalhes}
        candidato={candidatoSelecionado}
        onEdit={handleEditar}
      />

      <EditarCandidatoModal
        open={modalEditar}
        onOpenChange={setModalEditar}
        candidato={candidatoSelecionado}
        onSubmit={() => setModalEditar(false)}
      />
    </div>
  );
};

export default BancoTalentos;
