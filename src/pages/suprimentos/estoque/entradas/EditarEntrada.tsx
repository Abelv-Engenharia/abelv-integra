import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useNfeCompra } from "@/hooks/useNfeCompras";
import { useNfeCompraItens } from "@/hooks/useNfeCompraItens";

export default function EditarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: nfe, isLoading: nfeLoading } = useNfeCompra(id);
  const { data: itens = [], isLoading: itensLoading } = useNfeCompraItens(id);

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
            Entrada de Material - NFe {nfe.numero_nota}/{nfe.serie}
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
              <p className="text-lg font-semibold">{nfe.numero_nota}/{nfe.serie}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data emissão</p>
              <p className="text-lg">{format(new Date(nfe.data_emissao), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data movimento</p>
              <p className="text-lg">{format(new Date(nfe.data_movimento), "dd/MM/yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fornecedor</p>
              <p className="text-lg">{nfe.fornecedor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
              <p className="text-lg">{nfe.cnpj_fornecedor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor total</p>
              <p className="text-lg font-semibold">R$ {nfe.valor_total.toFixed(2)}</p>
            </div>
            {nfe.chave_acesso && (
              <div className="col-span-full">
                <p className="text-sm font-medium text-muted-foreground">Chave de acesso</p>
                <p className="text-sm font-mono">{nfe.chave_acesso}</p>
              </div>
            )}
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
                      <TableCell>{item.codigo_produto}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.ncm || "-"}</TableCell>
                      <TableCell>{item.cfop || "-"}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">{item.quantidade.toFixed(2)}</TableCell>
                      <TableCell className="text-right">R$ {item.valor_unitario.toFixed(2)}</TableCell>
                      <TableCell className="text-right">R$ {item.valor_total.toFixed(2)}</TableCell>
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
