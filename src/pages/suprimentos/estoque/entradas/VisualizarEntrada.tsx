import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useNfeCompra } from "@/hooks/useNfeCompras";
import { useNfeCompraItens } from "@/hooks/useNfeCompraItens";
import { useCredores } from "@/hooks/useCredores";

export default function VisualizarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: nfe, isLoading: nfeLoading } = useNfeCompra(id);
  const { data: itens = [], isLoading: itensLoading } = useNfeCompraItens(id);
  const { data: credores = [] } = useCredores();

  const credor = credores.find(c => c.id_sienge === nfe?.id_credor);

  if (nfeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!nfe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Entrada não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/suprimentos/estoque/entradas")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Entrada de Material - NFe {nfe.numero}/{nfe.id_documento}
          </h1>
          <p className="text-muted-foreground">
            Visualização dos dados da nota fiscal
          </p>
        </div>
      </div>

      {/* Cabeçalho da NFe */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número/série</p>
              <p className="text-lg font-semibold">{nfe.numero}/{nfe.id_documento}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data emissão</p>
              <p className="text-lg">{format(new Date(nfe.emissao), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data movimento</p>
              <p className="text-lg">{format(new Date(nfe.Movimenbto), "dd/MM/yyyy")}</p>
            </div>
            {credor && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credor</p>
                <p className="text-lg">{credor.razao}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Credor</p>
              <p className="text-lg">{nfe.id_credor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Empresa</p>
              <p className="text-lg">{nfe.id_empresa}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens da NFe */}
      <Card>
        <CardHeader>
          <CardTitle>Itens da Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          {itensLoading ? (
            <p className="text-center py-8">Carregando itens...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>NCM</TableHead>
                  <TableHead>CFOP</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor unitário</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhum item encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>-</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{item.id_unidade ?? "-"}</TableCell>
                      <TableCell className="text-right">{(item.quantidade ?? 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">R$ {Number(item.unitario ?? 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right">R$ {((item.quantidade ?? 0) * Number(item.unitario ?? 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
