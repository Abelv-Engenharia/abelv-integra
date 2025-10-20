import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Download, Paperclip, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type VistoriaDB = {
  id: string;
  contrato_id: string;
  data: string;
  tipo: string;
  responsavel: string;
  documento_anexo: string | null;
  contratos_alojamento: {
    codigo: string;
    nome: string;
  } | null;
};


export const VistoriasTab = () => {
  const [busca, setBusca] = useState("");
  const [vistoriaParaExcluir, setVistoriaParaExcluir] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Carregar vistorias do banco
  const { data: vistoriasDB = [], isLoading } = useQuery({
    queryKey: ['vistorias-alojamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vistorias_alojamento')
        .select(`
          id,
          contrato_id,
          data,
          tipo,
          responsavel,
          documento_anexo,
          contratos_alojamento (
            codigo,
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VistoriaDB[];
    },
  });

  // Atualização em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('vistorias_alojamento_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vistorias_alojamento',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vistorias-alojamento'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleExcluir = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vistorias_alojamento')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Vistoria excluída com sucesso!');
      setVistoriaParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir vistoria:', error);
      toast.error('Erro ao excluir vistoria');
    }
  };

  // Mapear vistorias para exibição
  const vistorias = vistoriasDB.map((v) => ({
    id: v.id,
    contrato: v.contratos_alojamento?.codigo || 'N/A',
    contratoNome: v.contratos_alojamento?.nome || '',
    data: v.data,
    tipo: v.tipo,
    responsavel: v.responsavel,
    documentoAnexo: v.documento_anexo || null,
  }));

  const vistoriasFiltradas = vistorias.filter(vistoria =>
    vistoria.contrato.toLowerCase().includes(busca.toLowerCase()) ||
    vistoria.contratoNome.toLowerCase().includes(busca.toLowerCase()) ||
    vistoria.responsavel.toLowerCase().includes(busca.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "inicial": return "bg-blue-100 text-blue-700";
      case "periodica": return "bg-green-100 text-green-700";
      case "final": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">

      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Vistorias</h3>
          <p className="text-sm text-muted-foreground">Registro de vistorias realizadas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório de Vistorias
          </Button>
          <Button size="sm" onClick={() => navigate('/nova-vistoria')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Vistoria
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por ID, contrato ou responsável..."
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
              <TableHead>ID Vistoria</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Documento Anexo</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Carregando vistorias...
                </TableCell>
              </TableRow>
            ) : vistoriasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {busca ? 'Nenhuma vistoria encontrada com os filtros aplicados.' : 'Nenhuma vistoria cadastrada.'}
                </TableCell>
              </TableRow>
            ) : (
              vistoriasFiltradas.map((vistoria) => (
                <TableRow key={vistoria.id}>
                  <TableCell className="font-medium font-mono">{vistoria.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    {vistoria.contrato}
                    {vistoria.contratoNome && (
                      <div className="text-xs text-muted-foreground">{vistoria.contratoNome}</div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(vistoria.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge className={getTipoColor(vistoria.tipo)}>
                    {vistoria.tipo.charAt(0).toUpperCase() + vistoria.tipo.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{vistoria.responsavel}</TableCell>
                <TableCell>
                  {vistoria.documentoAnexo ? (
                    <div className="flex items-center gap-1 text-sm text-primary cursor-pointer hover:underline">
                      <Paperclip className="h-3 w-3" />
                      {vistoria.documentoAnexo}
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/editar-vistoria/${vistoria.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setVistoriaParaExcluir(vistoria.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {!vistoria.documentoAnexo && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/anexar-vistoria/${vistoria.id}`)}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!vistoriaParaExcluir} onOpenChange={() => setVistoriaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a vistoria {vistoriaParaExcluir}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => vistoriaParaExcluir && handleExcluir(vistoriaParaExcluir)}>
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};