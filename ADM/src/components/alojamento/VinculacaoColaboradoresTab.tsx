import { useState } from "react";
import { Plus, Edit, Trash2, Download, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dados mockados - integração com Nydhus
const vinculacoes = [
  {
    id: 1,
    nomeColaborador: "João Silva Santos",
    matricula: "NYD001",
    obra: "CCA001 - Obra Principal",
    contratoAlojamento: "CT001 - Pousada Boa Vista",
    dataEntrada: "2024-01-15",
    dataSaida: null,
    statusVinculacao: "ativo",
    funcao: "Soldador"
  },
  {
    id: 2,
    nomeColaborador: "Maria Oliveira Costa",
    matricula: "NYD002", 
    obra: "CCA002 - Expansão Norte",
    contratoAlojamento: "CT002 - Hotel Executivo",
    dataEntrada: "2024-02-01",
    dataSaida: null,
    statusVinculacao: "ativo",
    funcao: "Eletricista"
  },
  {
    id: 3,
    nomeColaborador: "Carlos Eduardo Lima",
    matricula: "NYD003",
    obra: "CCA001 - Obra Principal",
    contratoAlojamento: "CT001 - Pousada Boa Vista",
    dataEntrada: "2024-01-20",
    dataSaida: "2024-03-15",
    statusVinculacao: "finalizado",
    funcao: "Tubulador"
  },
  {
    id: 4,
    nomeColaborador: "Ana Paula Ferreira",
    matricula: "NYD004",
    obra: "CCA003 - Manutenção Sul",
    contratoAlojamento: null,
    dataEntrada: "2024-03-01",
    dataSaida: null,
    statusVinculacao: "sem_alojamento",
    funcao: "Mecânica"
  }
];

const estatisticas = {
  totalColaboradores: vinculacoes.length,
  comAlojamento: vinculacoes.filter(v => v.contratoAlojamento).length,
  semAlojamento: vinculacoes.filter(v => !v.contratoAlojamento).length,
  ativos: vinculacoes.filter(v => v.statusVinculacao === "ativo").length
};

export const VinculacaoColaboradoresTab = () => {
  const [busca, setBusca] = useState("");

  const vinculacoesFiltradas = vinculacoes.filter(vinculacao =>
    vinculacao.nomeColaborador.toLowerCase().includes(busca.toLowerCase()) ||
    vinculacao.matricula.toLowerCase().includes(busca.toLowerCase()) ||
    vinculacao.obra.toLowerCase().includes(busca.toLowerCase()) ||
    (vinculacao.contratoAlojamento && vinculacao.contratoAlojamento.toLowerCase().includes(busca.toLowerCase()))
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ativo":
        return {
          color: "bg-green-100 text-green-700",
          label: "Ativo"
        };
      case "finalizado":
        return {
          color: "bg-gray-100 text-gray-700",
          label: "Finalizado"
        };
      case "sem_alojamento":
        return {
          color: "bg-red-100 text-red-700",
          label: "Sem Alojamento"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          label: "Indefinido"
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalColaboradores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Alojamento</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.comAlojamento}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Alojamento</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.semAlojamento}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vínculos Ativos</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.ativos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta para colaboradores sem alojamento */}
      {estatisticas.semAlojamento > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-700">Atenção - Colaboradores sem Alojamento</CardTitle>
            <CardDescription>
              {estatisticas.semAlojamento} colaborador(es) ainda não possui(em) alojamento vinculado
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Vinculação de Colaboradores</h3>
          <p className="text-sm text-muted-foreground">Integração com dados do Nydhus</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Vinculação
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nome, matrícula, obra ou alojamento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Colaborador</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Obra (CCA)</TableHead>
              <TableHead>Contrato Alojamento</TableHead>
              <TableHead>Data Entrada</TableHead>
              <TableHead>Data Saída</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vinculacoesFiltradas.map((vinculacao) => {
              const statusConfig = getStatusConfig(vinculacao.statusVinculacao);
              
              return (
                <TableRow key={vinculacao.id}>
                  <TableCell className="font-medium">{vinculacao.nomeColaborador}</TableCell>
                  <TableCell className="font-mono text-sm">{vinculacao.matricula}</TableCell>
                  <TableCell>{vinculacao.funcao}</TableCell>
                  <TableCell>{vinculacao.obra}</TableCell>
                  <TableCell>
                    {vinculacao.contratoAlojamento ? (
                      <span className="text-sm">{vinculacao.contratoAlojamento}</span>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">
                        Não vinculado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(vinculacao.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {vinculacao.dataSaida ? 
                      new Date(vinculacao.dataSaida).toLocaleDateString('pt-BR') : 
                      <span className="text-muted-foreground">-</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {vinculacoesFiltradas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma vinculação encontrada com os filtros aplicados.
        </div>
      )}
    </div>
  );
};