import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Plane, FileText, AlertCircle, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LinhaTempoFolgas from "@/components/folga-campo/LinhaTempoFolgas"

export default function Colaboradores() {
  const [filtros, setFiltros] = useState({
    nome: "",
    matricula: "",
    funcao: "",
    ccaObra: "",
    status: "",
    periodo: ""
  })

  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<any>(null)

  const colaboradores = [
    {
      id: 1,
      nome: "João Silva",
      matricula: "12345",
      funcao: "Engenheiro",
      ccaObra: "Obra ABC - CCA 001",
      status: "ativo",
      proxFolga: "2024-02-15",
      saldoFolgas: 5,
      alertasPendentes: 2,
      pendenciasForm: 1,
      passagensStatus: "em_compra"
    },
    {
      id: 2,
      nome: "Maria Santos",
      matricula: "67890",
      funcao: "Técnico",
      ccaObra: "Obra XYZ - CCA 002",
      status: "ativo",
      proxFolga: "2024-03-10",
      saldoFolgas: 3,
      alertasPendentes: 0,
      pendenciasForm: 0,
      passagensStatus: "comprada"
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "default",
      inativo: "secondary"
    }
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>
  }

  const getPassagemBadge = (status: string) => {
    const variants = {
      em_compra: { variant: "outline", text: "Em Compra", color: "text-yellow-600" },
      comprada: { variant: "default", text: "Comprada", color: "text-green-600" },
      cancelada: { variant: "destructive", text: "Cancelada", color: "text-red-600" }
    }
    const config = variants[status as keyof typeof variants] || variants.em_compra
    return <Badge variant={config.variant as any} className={config.color}>{config.text}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Colaboradores - Folga de Campo</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do colaborador"
                value={filtros.nome}
                onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                placeholder="Matrícula"
                value={filtros.matricula}
                onChange={(e) => setFiltros({...filtros, matricula: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="funcao">Função</Label>
              <Select value={filtros.funcao} onValueChange={(value) => setFiltros({...filtros, funcao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engenheiro">Engenheiro</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ccaObra">CCA/Obra</Label>
              <Select value={filtros.ccaObra} onValueChange={(value) => setFiltros({...filtros, ccaObra: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obra-abc">Obra ABC - CCA 001</SelectItem>
                  <SelectItem value="obra-xyz">Obra XYZ - CCA 002</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Input
                id="periodo"
                type="month"
                value={filtros.periodo}
                onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Filtrar</Button>
            <Button variant="outline" onClick={() => setFiltros({nome: "", matricula: "", funcao: "", ccaObra: "", status: "", periodo: ""})}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>CCA/Obra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Próx. Folga</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Alertas</TableHead>
                <TableHead>Passagens</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradores.map((colaborador) => (
                <TableRow key={colaborador.id}>
                  <TableCell className="font-medium">{colaborador.nome}</TableCell>
                  <TableCell>{colaborador.matricula}</TableCell>
                  <TableCell>{colaborador.funcao}</TableCell>
                  <TableCell>{colaborador.ccaObra}</TableCell>
                  <TableCell>{getStatusBadge(colaborador.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {colaborador.proxFolga}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{colaborador.saldoFolgas} dias</Badge>
                  </TableCell>
                  <TableCell>
                    {colaborador.alertasPendentes > 0 ? (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        {colaborador.alertasPendentes}
                      </div>
                    ) : (
                      <span className="text-green-600">OK</span>
                    )}
                  </TableCell>
                  <TableCell>{getPassagemBadge(colaborador.passagensStatus)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setColaboradorSelecionado(colaborador)}
                        >
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalhes - {colaborador.nome}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Resumo do Colaborador */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Saldo de Folgas</p>
                                    <p className="text-2xl font-bold">{colaborador.saldoFolgas} dias</p>
                                  </div>
                                  <Clock className="h-8 w-8 text-muted-foreground" />
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Alertas Pendentes</p>
                                    <p className="text-2xl font-bold">{colaborador.alertasPendentes}</p>
                                  </div>
                                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pendências Form.</p>
                                    <p className="text-2xl font-bold">{colaborador.pendenciasForm}</p>
                                  </div>
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Linha do Tempo de Folgas */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Linha do Tempo de Folgas</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <LinhaTempoFolgas colaborador={colaborador} />
                            </CardContent>
                          </Card>

                          {/* Passagens Vinculadas */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Passagens Vinculadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Data Folga</TableHead>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Ações</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>15/02/2024</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        São Paulo → Fortaleza
                                      </div>
                                    </TableCell>
                                    <TableCell>{getPassagemBadge("em_compra")}</TableCell>
                                    <TableCell>R$ 580,00</TableCell>
                                    <TableCell>
                                      <Button variant="outline" size="sm">
                                        <Plane className="h-4 w-4 mr-1" />
                                        Ver Voucher
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}