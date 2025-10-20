import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BuscaImovelAnteriorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imovel: any) => void;
}

export function BuscaImovelAnteriorModal({ open, onClose, onSelect }: BuscaImovelAnteriorModalProps) {
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      carregarImoveis();
    }
  }, [open]);

  const carregarImoveis = async () => {
    try {
      const { data, error } = await supabase
        .from('contratos_alojamento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImoveis(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar imóveis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const imoveisFiltrados = imoveis.filter(i =>
    i.logradouro.toLowerCase().includes(busca.toLowerCase()) ||
    i.bairro.toLowerCase().includes(busca.toLowerCase()) ||
    i.municipio.toLowerCase().includes(busca.toLowerCase()) ||
    i.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Imóvel Usado Anteriormente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Buscar Por Endereço Ou Código</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite o endereço ou código..."
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
                  <TableHead>Código</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quartos</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imoveisFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum imóvel encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  imoveisFiltrados.map((imovel) => (
                    <TableRow key={imovel.id}>
                      <TableCell>{imovel.codigo}</TableCell>
                      <TableCell>
                        {imovel.logradouro}, {imovel.numero} - {imovel.bairro}, {imovel.municipio}/{imovel.uf}
                      </TableCell>
                      <TableCell>{imovel.tipo_imovel}</TableCell>
                      <TableCell>{imovel.qtde_quartos}</TableCell>
                      <TableCell>{imovel.lotacao_maxima}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            onSelect(imovel);
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
