import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useCCAs } from "@/hooks/useCCAs";

interface RetornoBeneficiamento {
  id: string;
  cca: number;
  fornecedorOrigem: string;
  almoxarifadoDestino: string;
  dataMovimento: string;
  observacao: string;
  totalItens: number;
}

const EstoqueRetornoBeneficiamento = () => {
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  const [cca, setCca] = useState("");
  const [fornecedorOrigem, setFornecedorOrigem] = useState("");
  const [almoxarifadoDestino, setAlmoxarifadoDestino] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [observacao, setObservacao] = useState("");

  // Mock de dados
  const retornos: RetornoBeneficiamento[] = [
    {
      id: "1",
      cca: 1001,
      fornecedorOrigem: "Fornecedor 1",
      almoxarifadoDestino: "Interno",
      dataMovimento: "2024-03-15",
      observacao: "Retorno de tubos beneficiados",
      totalItens: 3
    },
    {
      id: "2",
      cca: 1002,
      fornecedorOrigem: "Fornecedor 2",
      almoxarifadoDestino: "Externo",
      dataMovimento: "2024-03-14",
      observacao: "Retorno de cabos elétricos",
      totalItens: 2
    },
    {
      id: "3",
      cca: 1003,
      fornecedorOrigem: "Fornecedor 3",
      almoxarifadoDestino: "Interno",
      dataMovimento: "2024-03-13",
      observacao: "Retorno de materiais pintados",
      totalItens: 4
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retorno de Beneficiamento</h1>
          <p className="text-muted-foreground">
            Registro de retorno de materiais do beneficiamento
          </p>
        </div>
        <Link to="/suprimentos/estoque/beneficiamento/novo-retorno-beneficiamento">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Retorno
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-cca">Cca</Label>
              <Select value={cca} onValueChange={setCca} disabled={isLoadingCcas}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas?.map((ccaItem) => (
                    <SelectItem key={ccaItem.id} value={ccaItem.id.toString()}>
                      {ccaItem.codigo} - {ccaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-fornecedor">Fornecedor de origem</Label>
              <Select value={fornecedorOrigem} onValueChange={setFornecedorOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                  <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                  <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-almoxarifado">Almoxarifado de destino</Label>
              <Select value={almoxarifadoDestino} onValueChange={setAlmoxarifadoDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-data-inicio">Data do movimento (início)</Label>
              <Input
                id="filtro-data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-data-fim">Data do movimento (fim)</Label>
              <Input
                id="filtro-data-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-observacao">Observação</Label>
              <Input
                id="filtro-observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Digite a observação"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setCca("");
              setFornecedorOrigem("");
              setAlmoxarifadoDestino("");
              setDataInicio("");
              setDataFim("");
              setObservacao("");
            }}>
              Limpar Filtros
            </Button>
            <Button>Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retornos de Beneficiamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cca</TableHead>
                  <TableHead>Fornecedor de origem</TableHead>
                  <TableHead>Almoxarifado de destino</TableHead>
                  <TableHead>Data do movimento</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Total de itens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retornos.map((retorno) => (
                  <TableRow key={retorno.id}>
                    <TableCell>{retorno.cca}</TableCell>
                    <TableCell>{retorno.fornecedorOrigem}</TableCell>
                    <TableCell>{retorno.almoxarifadoDestino}</TableCell>
                    <TableCell>{new Date(retorno.dataMovimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{retorno.observacao}</TableCell>
                    <TableCell>{retorno.totalItens}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/suprimentos/estoque/beneficiamento/editar-retorno-beneficiamento/${retorno.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueRetornoBeneficiamento;
