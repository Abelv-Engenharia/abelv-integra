import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolicitacaoServico, StatusSolicitacao } from "@/types/solicitacao";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RelatorioSolicitacoesTableProps {
  dados: SolicitacaoServico[];
}

const getStatusBadge = (status: StatusSolicitacao) => {
  const variants = {
    [StatusSolicitacao.PENDENTE]: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    [StatusSolicitacao.EM_ANDAMENTO]: { label: "Em Andamento", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    [StatusSolicitacao.AGUARDANDO_APROVACAO]: { label: "Aguardando Aprovação", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
    [StatusSolicitacao.APROVADO]: { label: "Aprovado", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
    [StatusSolicitacao.CONCLUIDO]: { label: "Concluído", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    [StatusSolicitacao.REJEITADO]: { label: "Rejeitado", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

const getTipoServicoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    voucher_uber: "Voucher Uber",
    locacao_veiculo: "Locação de Veículo",
    cartao_abastecimento: "Cartão Abastecimento",
    veloe_go: "Veloe Go",
    passagens: "Passagens",
    hospedagem: "Hospedagem",
    logistica: "Logística",
    correios_loggi: "Correios/Loggi",
  };
  return labels[tipo] || tipo;
};

export function RelatorioSolicitacoesTable({ dados }: RelatorioSolicitacoesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('dataSolicitacao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const dadosOrdenados = [...dados].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'dataSolicitacao':
        aValue = new Date(a.dataSolicitacao).getTime();
        bValue = new Date(b.dataSolicitacao).getTime();
        break;
      case 'dataconclusao':
        aValue = a.dataconclusao ? new Date(a.dataconclusao).getTime() : 0;
        bValue = b.dataconclusao ? new Date(b.dataconclusao).getTime() : 0;
        break;
      case 'solicitante':
        aValue = a.solicitante.toLowerCase();
        bValue = b.solicitante.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'estimativavalor':
        aValue = a.estimativavalor || 0;
        bValue = b.estimativavalor || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      {sortField === field && (
        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>
              <SortButton field="id">ID</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="solicitante">Solicitante</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="dataSolicitacao">Data Abertura</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="dataconclusao">Data Conclusão</SortButton>
            </TableHead>
            <TableHead>CCA</TableHead>
            <TableHead>Tipo de Serviço</TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="estimativavalor">Valor Est.</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dadosOrdenados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                Nenhuma solicitação encontrada com os filtros aplicados
              </TableCell>
            </TableRow>
          ) : (
            dadosOrdenados.map((solicitacao) => {
              const isExpanded = expandedRows.has(solicitacao.id);
              const cca = 'cca' in solicitacao ? (solicitacao as any).cca : '-';

              return (
                <>
                  <TableRow
                    key={solicitacao.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRow(solicitacao.id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{solicitacao.id}</TableCell>
                    <TableCell>{solicitacao.solicitante}</TableCell>
                    <TableCell>
                      {format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {solicitacao.dataconclusao
                        ? format(new Date(solicitacao.dataconclusao), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>{cca}</TableCell>
                    <TableCell>{getTipoServicoLabel(solicitacao.tipoServico)}</TableCell>
                    <TableCell>{getStatusBadge(solicitacao.status)}</TableCell>
                    <TableCell className="text-right">
                      {solicitacao.estimativavalor
                        ? solicitacao.estimativavalor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-muted/30">
                        <div className="p-4 space-y-3 text-sm">
                          {/* Informações básicas */}
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <strong>Centro de Custo:</strong> {solicitacao.centroCusto}
                            </div>
                            <div>
                              <strong>Prioridade:</strong>{" "}
                              <Badge variant="outline">{solicitacao.prioridade}</Badge>
                            </div>
                          </div>

                          {/* Observações da solicitação */}
                          {solicitacao.observacoes && (
                            <div>
                              <strong>Observações:</strong>
                              <p className="text-muted-foreground mt-1">{solicitacao.observacoes}</p>
                            </div>
                          )}

                          {/* Gestão */}
                          {solicitacao.observacoesgestao && (
                            <div>
                              <strong>Observações de Gestão:</strong>
                              <p className="text-muted-foreground mt-1">{solicitacao.observacoesgestao}</p>
                            </div>
                          )}

                          {solicitacao.responsavelaprovacao && (
                            <div>
                              <strong>Responsável pela Aprovação:</strong> {solicitacao.responsavelaprovacao}
                            </div>
                          )}

                          {/* Aprovação */}
                          {solicitacao.dataaprovacao && (
                            <div className="border-t pt-3">
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <strong>Data de Aprovação:</strong>{" "}
                                  {format(new Date(solicitacao.dataaprovacao), "dd/MM/yyyy HH:mm", {
                                    locale: ptBR,
                                  })}
                                </div>
                                <div>
                                  <strong>Aprovado Por:</strong> {solicitacao.aprovadopor}
                                </div>
                              </div>
                              {solicitacao.justificativaaprovacao && (
                                <div className="mt-2">
                                  <strong>Justificativa:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    {solicitacao.justificativaaprovacao}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Reprovação */}
                          {solicitacao.justificativareprovacao && (
                            <div className="border-t pt-3">
                              <strong>Justificativa de Reprovação:</strong>
                              <p className="text-muted-foreground mt-1">
                                {solicitacao.justificativareprovacao}
                              </p>
                            </div>
                          )}

                          {/* Conclusão */}
                          {solicitacao.observacoesconclusao && (
                            <div className="border-t pt-3">
                              <strong>Observações de Conclusão:</strong>
                              <p className="text-muted-foreground mt-1">
                                {solicitacao.observacoesconclusao}
                              </p>
                              {solicitacao.concluidopor && (
                                <div className="mt-2">
                                  <strong>Concluído Por:</strong> {solicitacao.concluidopor}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
