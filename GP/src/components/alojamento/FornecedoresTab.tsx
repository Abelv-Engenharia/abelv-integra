import { useState } from "react";
import { Plus, Edit, Trash2, Download } from "lucide-react";
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
import { NovoFornecedorModal } from "./NovoFornecedorModal";

// Dados mockados
const fornecedores = [
  {
    id: 1,
    nome: "Pousada Boa Vista Ltda",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - Centro",
    contato: "(11) 99999-9999",
    capacidade: 50,
    valorDiario: 45.00,
    vigenciaContrato: "2024-12-31",
    status: "ativo"
  },
  {
    id: 2,
    nome: "Hotel Executivo S.A.",
    cnpj: "98.765.432/0001-10",
    endereco: "Av. Principal, 456 - Centro",
    contato: "(11) 88888-8888",
    capacidade: 80,
    valorDiario: 65.00,
    vigenciaContrato: "2025-06-30",
    status: "ativo"
  },
  {
    id: 3,
    nome: "Alojamento Industrial",
    cnpj: "11.222.333/0001-44",
    endereco: "Distrito Industrial, s/n",
    contato: "(11) 77777-7777",
    capacidade: 120,
    valorDiario: 35.00,
    vigenciaContrato: "2024-01-15",
    status: "inativo"
  }
];

export const FornecedoresTab = () => {
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fornecedoresFiltrados = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(busca.toLowerCase()) ||
    fornecedor.cnpj.includes(busca)
  );

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-4">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Fornecedores de Alojamento</h3>
          <p className="text-sm text-muted-foreground">Cadastro e gestão de fornecedores</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nome ou CNPJ..."
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
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Capacidade</TableHead>
              <TableHead className="text-right">Valor Diário</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedoresFiltrados.map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                <TableCell className="font-mono text-sm">{fornecedor.cnpj}</TableCell>
                <TableCell>{fornecedor.endereco}</TableCell>
                <TableCell>{fornecedor.contato}</TableCell>
                <TableCell className="text-right">{fornecedor.capacidade} pessoas</TableCell>
                <TableCell className="text-right">R$ {fornecedor.valorDiario.toFixed(2)}</TableCell>
                <TableCell>{new Date(fornecedor.vigenciaContrato).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(fornecedor.status)}>
                    {fornecedor.status.charAt(0).toUpperCase() + fornecedor.status.slice(1)}
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

      {fornecedoresFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum fornecedor encontrado com os filtros aplicados.
        </div>
      )}

      <NovoFornecedorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};