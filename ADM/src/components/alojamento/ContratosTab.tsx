import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Download, Paperclip } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type contrato_db = {
  id: string;
  codigo: string;
  nome: string;
  proprietario: string;
  valor_aluguel: number;
  inicio_locacao: string;
  fim_locacao: string;
  lotacao_maxima: number;
  arquivo_pdf_url: string | null;
  status: string;
  cca_codigo: string;
  tipo_alojamento: string;
  numero_sequencial: number;
  analise_contratual_id: string | null;
  created_at: string;
  updated_at: string;
};

export const ContratosTab = () => {
  const [busca, setBusca] = useState("");
  const [ccaFiltro, setCcaFiltro] = useState<string>("");
  const [contratoParaExcluir, setContratoParaExcluir] = useState<string | null>(null);
  const navigate = useNavigate();

  const query_client = useQueryClient();
  
  // Buscar CCAs disponíveis
  const { data: ccasDisponiveis } = useQuery({
    queryKey: ["nydhus_ccas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nydhus_ccas")
        .select("codigo, nome")
        .eq("ativo", true)
        .order("codigo");
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["contratos_alojamento", ccaFiltro],
    queryFn: async () => {
      let query = supabase
        .from("contratos_alojamento")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (ccaFiltro) {
        query = query.eq("cca_codigo", ccaFiltro);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as contrato_db[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("contratos_alojamento_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contratos_alojamento" },
        () => {
          query_client.invalidateQueries({ queryKey: ["contratos_alojamento"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [query_client]);

  const listaContratos = (data ?? []).map((row) => ({
    id: row.id,
    codigo: row.codigo,
    fornecedor: row.proprietario,
    obra: `${row.cca_codigo || 'Sem CCA'}`,
    tipoAlojamento: row.tipo_alojamento,
    numeroSequencial: row.numero_sequencial,
    valor: Number(row.valor_aluguel),
    dataInicio: row.inicio_locacao,
    dataFim: row.fim_locacao,
    capacidadeContratada: row.lotacao_maxima,
    documentoAnexo: row.arquivo_pdf_url ? "contrato.pdf" : null,
    status: row.status,
  }));

  const contratosFiltrados = listaContratos.filter((contrato) =>
    contrato.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    contrato.fornecedor.toLowerCase().includes(busca.toLowerCase()) ||
    contrato.obra.toLowerCase().includes(busca.toLowerCase())
  );

  const handleEditar = (contratoId: string) => {
    navigate(`/editar-contrato-alojamento/${contratoId}`);
  };

  const handleExcluir = (contratoId: string) => {
    setContratoParaExcluir(contratoId);
  };

  const confirmarExclusao = async () => {
    if (contratoParaExcluir) {
      try {
        const { error } = await supabase
          .from("contratos_alojamento")
          .delete()
          .eq("id", contratoParaExcluir);

        if (error) throw error;

        toast.success("Contrato excluído com sucesso!");
        setContratoParaExcluir(null);
      } catch (error) {
        toast.error("Erro ao excluir contrato");
      }
    }
  };

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
          <Button 
            size="sm" 
            onClick={() => navigate('/novo-contrato-alojamento')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={ccaFiltro} onValueChange={setCcaFiltro}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Selecione um CCA" />
          </SelectTrigger>
          <SelectContent>
            {ccasDisponiveis?.map((cca) => (
              <SelectItem key={cca.codigo} value={cca.codigo}>
                {cca.codigo} - {cca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Buscar por código, fornecedor..."
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
              <TableHead className="text-right">Valor Aluguel</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead className="text-right">Capacidade</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Carregando contratos...
                </TableCell>
              </TableRow>
            ) : (
              contratosFiltrados.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium font-mono">{contrato.codigo}</TableCell>
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditar(contrato.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleExcluir(contrato.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {contratosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum contrato encontrado com os filtros aplicados.
        </div>
      )}

      <AlertDialog open={!!contratoParaExcluir} onOpenChange={() => setContratoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};