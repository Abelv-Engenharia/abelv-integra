import { useState, useEffect } from "react";
import { Plus, Eye, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type fornecedor_db = {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  contato_nome: string | null;
  telefone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export const FornecedoresTab = () => {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroProjeto, setFiltroProjeto] = useState("all");
  const [filtroVencimento, setFiltroVencimento] = useState("all");
  const navigate = useNavigate();

  const query_client = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["fornecedores_alojamento"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores_alojamento")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as fornecedor_db[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("fornecedores_alojamento_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fornecedores_alojamento" },
        () => {
          query_client.invalidateQueries({ queryKey: ["fornecedores_alojamento"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [query_client]);

  const fornecedores = (data ?? []).map((row) => ({
    id: row.id,
    nome: row.nome,
    cnpj: row.cnpj,
    capacidadeTotal: 0,
    valorDiarioPadrao: 0,
    valorPadraoDiario: 0,
    valorMensal: 0,
    valorCaucao: 0,
    status: row.status,
    qtdeContratosVigentes: 0,
    ultimaAtualizacao: row.updated_at ?? row.created_at,
    projeto: "Todos",
    contratoVenceEm30Dias: false,
  }));

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const matchBusca = fornecedor.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      fornecedor.cnpj.includes(busca);
    const matchStatus = filtroStatus === "all" || fornecedor.status.toLowerCase() === filtroStatus.toLowerCase();
    const matchProjeto = filtroProjeto === "all" || fornecedor.projeto === filtroProjeto;
    const matchVencimento = filtroVencimento === "all" || 
                           (filtroVencimento === "vence30dias" && fornecedor.contratoVenceEm30Dias);
    
    return matchBusca && matchStatus && matchProjeto && matchVencimento;
  });

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const handleVerDetalhes = (fornecedorId: string) => {
    navigate(`/fornecedor/${fornecedorId}`);
  };

  const handleNovoFornecedor = () => {
    navigate("/novo-fornecedor");
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
          <Button size="sm" onClick={handleNovoFornecedor}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex gap-2">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroProjeto} onValueChange={setFiltroProjeto}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Obra Norte">Obra Norte</SelectItem>
              <SelectItem value="Obra Sul">Obra Sul</SelectItem>
              <SelectItem value="Obra Leste">Obra Leste</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroVencimento} onValueChange={setFiltroVencimento}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Vencimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="vence30dias">Vence em 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="text-right">Capacidade Total</TableHead>
              <TableHead className="text-right">Valor Diário</TableHead>
              <TableHead className="text-right">Valor Padrão (Diário)</TableHead>
              <TableHead className="text-right">Valor Mensal</TableHead>
              <TableHead className="text-right">Valor de Caução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Qtde Contratos Vigentes</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fornecedoresFiltrados.map((fornecedor) => (
              <TableRow 
                key={fornecedor.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerDetalhes(fornecedor.id)}
              >
                <TableCell className="font-medium">
                  {fornecedor.nome}
                  {fornecedor.contratoVenceEm30Dias && (
                    <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
                      Vence em 30 dias
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">{fornecedor.cnpj}</TableCell>
                <TableCell className="text-right">{fornecedor.capacidadeTotal} pessoas</TableCell>
                <TableCell className="text-right">R$ {fornecedor.valorDiarioPadrao.toFixed(2)}</TableCell>
                <TableCell className="text-right">R$ {fornecedor.valorPadraoDiario.toFixed(2)}</TableCell>
                <TableCell className="text-right">R$ {fornecedor.valorMensal.toFixed(2)}</TableCell>
                <TableCell className="text-right">R$ {fornecedor.valorCaucao.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(fornecedor.status)}>
                    {fornecedor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{fornecedor.qtdeContratosVigentes}</TableCell>
                <TableCell>{new Date(fornecedor.ultimaAtualizacao).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerDetalhes(fornecedor.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
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
    </div>
  );
};