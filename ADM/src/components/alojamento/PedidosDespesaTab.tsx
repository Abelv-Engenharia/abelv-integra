import { useState } from "react";
import { Plus, Edit, Trash2, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dados mockados
const pedidosDespesa = [
  {
    id: "PD001",
    obra: "CCA001 - Obra Principal",
    contrato: "CT001 - Pousada Boa Vista",
    valorSolicitado: 13500.00,
    data: "2024-01-05",
    status: "aprovado",
    observacoes: "Despesa inicial para inauguração"
  },
  {
    id: "PD002",
    obra: "CCA002 - Expansão Norte", 
    contrato: "CT002 - Hotel Executivo",
    valorSolicitado: 31200.00,
    data: "2024-02-01",
    status: "pendente",
    observacoes: "Aguardando aprovação da diretoria"
  },
  {
    id: "PD003",
    obra: "CCA001 - Obra Principal",
    contrato: "CT003 - Alojamento Industrial",
    valorSolicitado: 25200.00,
    data: "2024-01-15",
    status: "rejeitado",
    observacoes: "Valor acima do orçamento aprovado"
  },
  {
    id: "PD004",
    obra: "CCA003 - Manutenção Sul",
    contrato: "CT004 - Residencial Norte",
    valorSolicitado: 8500.00,
    data: "2024-03-10",
    status: "pendente",
    observacoes: "Em análise pelo financeiro"
  }
];

export const PedidosDespesaTab = () => {
  const [busca, setBusca] = useState("");

  const pedidosFiltrados = pedidosDespesa.filter(pedido =>
    pedido.id.toLowerCase().includes(busca.toLowerCase()) ||
    pedido.obra.toLowerCase().includes(busca.toLowerCase()) ||
    pedido.contrato.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "aprovado":
        return {
          color: "bg-green-100 text-green-700",
          icon: CheckCircle
        };
      case "pendente":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: Clock
        };
      case "rejeitado":
        return {
          color: "bg-red-100 text-red-700",
          icon: XCircle
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: Clock
        };
    }
  };

  const totalSolicitado = pedidosFiltrados.reduce((sum, pedido) => sum + pedido.valorSolicitado, 0);
  const totalAprovado = pedidosFiltrados
    .filter(pedido => pedido.status === "aprovado")
    .reduce((sum, pedido) => sum + pedido.valorSolicitado, 0);

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-700">Total Solicitado</h4>
          <p className="text-2xl font-bold text-blue-900">
            R$ {totalSolicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-700">Total Aprovado</h4>
          <p className="text-2xl font-bold text-green-900">
            R$ {totalAprovado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="text-sm font-medium text-orange-700">Pendentes</h4>
          <p className="text-2xl font-bold text-orange-900">
            {pedidosFiltrados.filter(p => p.status === "pendente").length}
          </p>
        </div>
      </div>

      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Pedidos de Despesa Inicial</h3>
          <p className="text-sm text-muted-foreground">Solicitações de despesas para alojamentos</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por ID, obra ou contrato..."
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
              <TableHead>ID Pedido</TableHead>
              <TableHead>Obra (CCA)</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead className="text-right">Valor Solicitado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidosFiltrados.map((pedido) => {
              const statusConfig = getStatusConfig(pedido.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium font-mono">{pedido.id}</TableCell>
                  <TableCell>{pedido.obra}</TableCell>
                  <TableCell>{pedido.contrato}</TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {pedido.valorSolicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{new Date(pedido.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <Badge className={statusConfig.color}>
                        {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-sm text-muted-foreground truncate block" title={pedido.observacoes}>
                      {pedido.observacoes}
                    </span>
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

      {pedidosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum pedido encontrado com os filtros aplicados.
        </div>
      )}
    </div>
  );
};