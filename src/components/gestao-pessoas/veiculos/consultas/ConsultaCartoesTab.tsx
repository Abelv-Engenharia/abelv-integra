import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";
interface Cartao {
  id: string;
  status: string;
  condutor: string;
  placa: string;
  modelo: string;
  numeroCartao: string;
  dataValidade: Date;
  tipo: string;
  limiteCredito: number;
}
export function ConsultaCartoesTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  useEffect(() => {
    const dadosLocalStorage = localStorage.getItem("cartoes");
    if (dadosLocalStorage) {
      setCartoes(JSON.parse(dadosLocalStorage));
    }
  }, []);
  const cartoesFiltrados = cartoes.filter(cartao => {
    const matchBusca = busca === "" || cartao.placa?.toLowerCase().includes(busca.toLowerCase()) || cartao.condutor?.toLowerCase().includes(busca.toLowerCase()) || cartao.numeroCartao?.includes(busca);
    const matchStatus = filtroStatus === "todos" || cartao.status.toLowerCase() === filtroStatus;
    const matchTipo = filtroTipo === "todos" || cartao.tipo.toLowerCase() === filtroTipo;
    return matchBusca && matchStatus && matchTipo;
  });
  const mascaraCartao = (numero: string) => {
    if (!numero || numero.length < 4) return numero;
    return `**** **** **** ${numero.slice(-4)}`;
  };
  return <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros de Busca</CardTitle>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por placa, condutor ou nº cartão..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="crédito">Crédito</SelectItem>
                <SelectItem value="débito">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Cartões Cadastrados ({cartoesFiltrados.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {cartoesFiltrados.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todos" || filtroTipo !== "todos" ? "Nenhum cartão encontrado com os filtros aplicados." : "Nenhum cartão cadastrado ainda."}
              </p>
              
            </div> : <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Número Cartão</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Limite</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartoesFiltrados.map(cartao => <TableRow key={cartao.id}>
                      <TableCell>
                        <Badge variant={cartao.status === "ativo" ? "default" : "secondary"}>
                          {cartao.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{cartao.condutor}</TableCell>
                      <TableCell className="font-mono">{cartao.placa}</TableCell>
                      <TableCell>{cartao.modelo}</TableCell>
                      <TableCell className="font-mono">
                        {mascaraCartao(cartao.numeroCartao)}
                      </TableCell>
                      <TableCell>{format(new Date(cartao.dataValidade), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cartao.tipo === "crédito" ? "Crédito" : "Débito"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        R$ {cartao.limiteCredito?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </CardContent>
      </Card>
    </div>;
}