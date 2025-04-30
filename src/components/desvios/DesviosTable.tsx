
import { useState, useEffect } from "react";
import { Eye, Pencil, Filter, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Interface para os desvios
interface Desvio {
  id: string;
  data: string;
  title: string;
  cca: string;
  company: string;
  responsavel: string;
  risk: string;
  status: string;
  description: string;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Trivial":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Tolerável":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Moderado":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Substancial":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "Intolerável":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Em andamento":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Pendente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const DesviosTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [desvios, setDesvios] = useState<Desvio[]>([]);
  const [selectedDesvio, setSelectedDesvio] = useState<Desvio | null>(null);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados dos desvios do Supabase
  useEffect(() => {
    const fetchDesvios = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('desvios')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Erro ao buscar desvios:', error);
          setDesvios([]);
        } else if (data && data.length > 0) {
          // Mapear os dados do Supabase para o formato esperado pelo componente
          const formattedDesvios = data.map(item => ({
            id: item.id,
            data: new Date(item.data).toLocaleDateString('pt-BR'),
            title: item.descricao.substring(0, 60) + (item.descricao.length > 60 ? '...' : ''),
            cca: item.cca || 'Não informado',
            company: item.empresa || 'Não informado',
            responsavel: item.responsavel || 'Não atribuído',
            risk: item.classificacao || 'Não classificado',
            status: item.status || 'Pendente',
            description: item.descricao
          }));
          setDesvios(formattedDesvios);
        } else {
          setDesvios([]);
        }
      } catch (error) {
        console.error('Erro ao buscar desvios:', error);
        setDesvios([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesvios();
  }, []);

  const handleStatusChange = (status: string) => {
    setActionStatus(status);
  };

  const updateDesvioStatus = async () => {
    if (!selectedDesvio || !actionStatus) return;
    
    try {
      // Atualizar o status no Supabase
      const { error } = await supabase
        .from('desvios')
        .update({ status: actionStatus })
        .eq('id', selectedDesvio.id);
        
      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status do desvio.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualizar a lista local
      setDesvios(desvios.map(d => 
        d.id === selectedDesvio.id 
          ? { ...d, status: actionStatus } 
          : d
      ));
      
      toast({
        title: "Status atualizado",
        description: `O status do desvio ${selectedDesvio.id} foi alterado para ${actionStatus}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do desvio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-md border shadow-sm">
      <div className="relative w-full overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p>Carregando desvios...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="max-w-[250px]">Título</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {desvios.length > 0 ? (
                desvios.map((desvio) => (
                  <TableRow key={desvio.id}>
                    <TableCell className="font-medium">{desvio.id}</TableCell>
                    <TableCell>{desvio.data}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{desvio.title}</TableCell>
                    <TableCell>{desvio.cca}</TableCell>
                    <TableCell>{desvio.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRiskColor(desvio.risk)}>
                        {desvio.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(desvio.status)}>
                        {desvio.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedDesvio(desvio)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{desvio.title}</DialogTitle>
                              <DialogDescription className="pt-4 flex items-center gap-2">
                                <span className="text-muted-foreground">ID: {desvio.id}</span>
                                <span>•</span>
                                <span className="text-muted-foreground">Data: {desvio.data}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Informações do Desvio</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">CCA</p>
                                    <p className="text-sm text-muted-foreground">{desvio.cca}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Empresa</p>
                                    <p className="text-sm text-muted-foreground">{desvio.company}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Nível de Risco</p>
                                    <Badge variant="secondary" className={getRiskColor(desvio.risk)}>
                                      {desvio.risk}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status da Ação</p>
                                    <Badge variant="secondary" className={getStatusColor(desvio.status)}>
                                      {desvio.status}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm font-medium">Responsável</p>
                                    <p className="text-sm text-muted-foreground">{desvio.responsavel}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Descrição</h3>
                                <p className="text-sm text-muted-foreground">{desvio.description}</p>
                              </div>
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Atualizar Status da Ação</h3>
                                <div className="flex gap-4 items-end">
                                  <div className="grid gap-1.5 flex-1">
                                    <label htmlFor="status" className="text-sm font-medium">
                                      Novo Status
                                    </label>
                                    <Select
                                      value={actionStatus}
                                      onValueChange={handleStatusChange}
                                    >
                                      <SelectTrigger id="status">
                                        <SelectValue placeholder="Selecione o status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                                        <SelectItem value="Concluído">Concluído</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button onClick={updateDesvioStatus} disabled={!actionStatus}>
                                    Atualizar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            toast({
                              title: "Função não implementada",
                              description: "A funcionalidade de edição será implementada em uma versão futura.",
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhum desvio encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {desvios.length} de {desvios.length} desvios
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            Anterior
          </Button>
          <Button variant="outline" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesviosTable;
