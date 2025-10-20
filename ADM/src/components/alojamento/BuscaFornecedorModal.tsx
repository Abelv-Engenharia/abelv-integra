import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BuscaFornecedorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fornecedor: any) => void;
}

export function BuscaFornecedorModal({ open, onClose, onSelect }: BuscaFornecedorModalProps) {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      carregarFornecedores();
    }
  }, [open]);

  const carregarFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from('fornecedores_alojamento')
        .select('*')
        .eq('status', 'Ativo')
        .order('nome');

      if (error) throw error;
      setFornecedores(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.cnpj.includes(busca)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Fornecedor Cadastrado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Buscar Por Nome Ou Cnpj</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o nome ou CNPJ..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cnpj</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum fornecedor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  fornecedoresFiltrados.map((fornecedor) => (
                    <TableRow key={fornecedor.id}>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.telefone}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            onSelect(fornecedor);
                            onClose();
                          }}
                        >
                          Selecionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
