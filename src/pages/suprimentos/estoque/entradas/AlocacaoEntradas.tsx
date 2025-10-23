import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useCCAs } from "@/hooks/useCCAs";
import { useNfeCompras } from "@/hooks/useNfeCompras";
import { almoxarifadoService } from "@/services/almoxarifadoService";
import { estoqueMovimentacoesService } from "@/services/estoqueMovimentacoesService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package } from "lucide-react";

export default function AlocacaoEntradas() {
  const [selectedCcaId, setSelectedCcaId] = useState<number | undefined>();
  const [alocacoes, setAlocacoes] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();
  const { data: ccas = [], isLoading: ccasLoading } = useCCAs();
  const { data: nfeCompras = [], isLoading: nfeLoading } = useNfeCompras(selectedCcaId, true);
  
  const { data: almoxarifados = [], isLoading: almoxarifadosLoading } = useQuery({
    queryKey: ['almoxarifados', selectedCcaId],
    queryFn: () => selectedCcaId ? almoxarifadoService.getByCCA(selectedCcaId) : Promise.resolve([]),
    enabled: !!selectedCcaId,
  });

  const alocarMutation = useMutation({
    mutationFn: async ({ nfeId, almoxarifadoId, ccaId }: { nfeId: string; almoxarifadoId: string; ccaId: number }) => {
      return await estoqueMovimentacoesService.createFromNfeItens(ccaId, almoxarifadoId, nfeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfe_compras"] });
      toast({
        title: "Sucesso",
        description: "Alocação salva com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar alocação",
        variant: "destructive",
      });
    },
  });

  const handleAlocacaoChange = (nfeId: string, almoxarifadoId: string) => {
    setAlocacoes(prev => ({ ...prev, [nfeId]: almoxarifadoId }));
  };

  const handleSalvarAlocacao = (nfeId: string) => {
    const almoxarifadoId = alocacoes[nfeId];
    if (!almoxarifadoId || !selectedCcaId) {
      toast({
        title: "Erro",
        description: "Selecione um almoxarifado",
        variant: "destructive",
      });
      return;
    }

    alocarMutation.mutate({ nfeId, almoxarifadoId, ccaId: selectedCcaId });
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alocação das Entradas</h1>
        <p className="text-muted-foreground">
          Aloque as notas fiscais nos almoxarifados dos CCAs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CCA</Label>
              <Select
                value={selectedCcaId?.toString()}
                onValueChange={(value) => {
                  setSelectedCcaId(parseInt(value));
                  setAlocacoes({});
                }}
                disabled={ccasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ccasLoading ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCcaId && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Fiscais Encontradas</CardTitle>
          </CardHeader>
          <CardContent>
            {nfeLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando notas fiscais...
              </div>
            ) : nfeCompras.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhuma nota fiscal encontrada para este CCA</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Nome do Credor</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Almoxarifado</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nfeCompras.map((nfe) => (
                      <TableRow key={nfe.id}>
                        <TableCell className="font-medium">{nfe.numero}</TableCell>
                        <TableCell>{nfe.id_documento}</TableCell>
                        <TableCell>{nfe.credor?.razao || "-"}</TableCell>
                        <TableCell>{nfe.empresa?.name || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={alocacoes[nfe.id]}
                            onValueChange={(value) => handleAlocacaoChange(nfe.id, value)}
                            disabled={almoxarifadosLoading}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {almoxarifados
                                .filter(alm => alm.ativo)
                                .map((almoxarifado) => (
                                  <SelectItem key={almoxarifado.id} value={almoxarifado.id}>
                                    {almoxarifado.nome}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleSalvarAlocacao(nfe.id)}
                            disabled={!alocacoes[nfe.id] || alocarMutation.isPending}
                          >
                            {alocarMutation.isPending ? "Alocando..." : "Alocar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
