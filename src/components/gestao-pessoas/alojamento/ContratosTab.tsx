import { useState } from "react";
import { Plus, Edit, Trash2, Download, Paperclip } from "lucide-react";
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
const contratos = [
  {
    id: "CT001",
    fornecedor: "Pousada Boa Vista Ltda",
    obra: "CCA001 - Obra Principal", 
    valor: 67500.00,
    dataInicio: "2024-01-01",
    dataFim: "2024-12-31",
    capacidadeContratada: 50,
    documentoAnexo: "contrato_001.pdf",
    status: "ativo"
  },
  {
    id: "CT002",
    fornecedor: "Hotel Executivo S.A.",
    obra: "CCA002 - Expansão Norte",
    valor: 156000.00,
    dataInicio: "2024-02-01", 
    dataFim: "2025-01-31",
    capacidadeContratada: 80,
    documentoAnexo: "contrato_002.pdf",
    status: "ativo"
  },
  {
    id: "CT003",
    fornecedor: "Alojamento Industrial",
    obra: "CCA001 - Obra Principal",
    valor: 126000.00,
    dataInicio: "2023-06-01",
    dataFim: "2024-05-31",
    capacidadeContratada: 120,
    documentoAnexo: null,
    status: "vencido"
  }
];

export const ContratosTab = () => {
  const [busca, setBusca] = useState("");

  const contratosFiltrados = contratos.filter(contrato =>
    contrato.id.toLowerCase().includes(busca.toLowerCase()) ||
    contrato.fornecedor.toLowerCase().includes(busca.toLowerCase()) ||
    contrato.obra.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-700";
      case "vencido": return "bg-red-100 text-red-700";
      case "pendente": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isVencendoEm30Dias = (dataFim: string) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="space-y-4">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Contratos de Alojamento</h3>
          <p className="text-sm text-muted-foreground">Gestão de contratos ativos e histórico</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por ID, fornecedor ou obra..."
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
              <TableHead>ID Contrato</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Obra (CCA)</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead className="text-right">Capacidade</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contratosFiltrados.map((contrato) => (
              <TableRow key={contrato.id}>
                <TableCell className="font-medium font-mono">{contrato.id}</TableCell>
                <TableCell>{contrato.fornecedor}</TableCell>
                <TableCell>{contrato.obra}</TableCell>
                <TableCell className="text-right">R$ {contrato.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                    {isVencendoEm30Dias(contrato.dataFim) && (
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                        Vencendo
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{contrato.capacidadeContratada} pessoas</TableCell>
                <TableCell>
                  {contrato.documentoAnexo ? (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Paperclip className="h-3 w-3" />
                      {contrato.documentoAnexo}
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">
                      Sem documento
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contrato.status)}>
                    {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
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
            ))}
          </TableBody>
        </Table>
      </div>

      {contratosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum contrato encontrado com os filtros aplicados.
        </div>
      )}
    </div>
  );
};