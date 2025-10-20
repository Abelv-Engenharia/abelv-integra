import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plane, FileText, DollarSign, Clock, ExternalLink } from "lucide-react";

export default function ComprasFolgaCampo() {
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroValor, setFiltroValor] = useState("");

  // Mock data
  const compras = [
    {
      id: 1,
      colaborador: "João Silva",
      obra: "Obra Alpha",
      fornecedor: "BIZZTRIP",
      itinerario: "São Paulo → Rio de Janeiro",
      dataIda: "15/01/2024",
      dataVolta: "30/01/2024",
      status: "emitida",
      localizador: "BZ123456",
      valor: 850.00,
      dataEmissao: "10/01/2024",
      centroCusto: "CCA-001"
    },
    {
      id: 2,
      colaborador: "Maria Santos", 
      obra: "Obra Beta",
      fornecedor: "ONFLY",
      itinerario: "Brasília → Salvador",
      dataIda: "20/01/2024",
      dataVolta: "05/02/2024",
      status: "solicitada",
      localizador: "-",
      valor: 0,
      dataEmissao: "-",
      centroCusto: "CCA-002"
    },
    {
      id: 3,
      colaborador: "Pedro Costa",
      obra: "Obra Gamma",
      fornecedor: "BIZZTRIP", 
      itinerario: "Recife → Fortaleza",
      dataIda: "25/01/2024",
      dataVolta: "10/02/2024",
      status: "em_compra",
      localizador: "-",
      valor: 0,
      dataEmissao: "-",
      centroCusto: "CCA-003"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      emitida: { variant: "default" as const, label: "Emitida" },
      solicitada: { variant: "destructive" as const, label: "Solicitada" },
      em_compra: { variant: "secondary" as const, label: "Em compra" },
      cancelada: { variant: "outline" as const, label: "Cancelada" }
    };
    const config = variants[status as keyof typeof variants] || variants.solicitada;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compras de Passagens</h1>
          <p className="text-muted-foreground">Controle de solicitações e emissão de passagens</p>
        </div>
        <Button>
          <ExternalLink className="h-4 w-4 mr-2" />
          Integração BIZZTRIP/ONFLY
        </Button>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Aguardando compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Compra</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Em processamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emitidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foregreen">Confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 38.250</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as compras por status, fornecedor ou valor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status da compra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="solicitada">Solicitada</SelectItem>
                  <SelectItem value="em_compra">Em compra</SelectItem>
                  <SelectItem value="emitida">Emitida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroFornecedor} onValueChange={setFiltroFornecedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="BIZZTRIP">BIZZTRIP</SelectItem>
                  <SelectItem value="ONFLY">ONFLY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Filtro por valor"
                value={filtroValor}
                onChange={(e) => setFiltroValor(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Compras */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
          <CardDescription>Acompanhamento de solicitações e emissões</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra/CCA</TableHead>
                <TableHead>Itinerário</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Localizador</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell className="font-medium">{compra.colaborador}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{compra.obra}</div>
                      <div className="text-sm text-muted-foreground">{compra.centroCusto}</div>
                    </div>
                  </TableCell>
                  <TableCell>{compra.itinerario}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">Ida: {compra.dataIda}</div>
                      <div className="text-sm">Volta: {compra.dataVolta}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{compra.fornecedor}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(compra.status)}</TableCell>
                  <TableCell>
                    {compra.localizador !== "-" ? (
                      <code className="text-sm bg-muted px-1 rounded">{compra.localizador}</code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {compra.valor > 0 ? (
                      <span className="font-medium">R$ {compra.valor.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Detalhes</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes da Compra</DialogTitle>
                            <DialogDescription>
                              Informações completas da passagem de {compra.colaborador}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Colaborador</label>
                                <p>{compra.colaborador}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Fornecedor</label>
                                <p>{compra.fornecedor}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Itinerário Completo</label>
                              <p>{compra.itinerario}</p>
                              <p className="text-sm text-muted-foreground">
                                {compra.dataIda} até {compra.dataVolta}
                              </p>
                            </div>
                            {compra.localizador !== "-" && (
                              <div>
                                <label className="text-sm font-medium">Localizador</label>
                                <p><code>{compra.localizador}</code></p>
                              </div>
                            )}
                            {compra.valor > 0 && (
                              <div>
                                <label className="text-sm font-medium">Valor</label>
                                <p className="font-medium">R$ {compra.valor.toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {compra.status === "solicitada" && (
                        <Button variant="outline" size="sm">Comprar</Button>
                      )}
                      
                      {compra.status === "emitida" && (
                        <Button variant="outline" size="sm">Voucher</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}