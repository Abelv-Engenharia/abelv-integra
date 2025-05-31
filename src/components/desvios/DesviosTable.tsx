
import { useState, useEffect } from "react";
import { Eye, Pencil, AlertTriangle } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "TRIVIAL":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "TOLERÁVEL":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "MODERADO":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "SUBSTANCIAL":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "INTOLERÁVEL":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONCLUÍDO":
    case "Fechado":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "EM ANDAMENTO":
    case "Em andamento":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "PENDENTE":
    case "Aberto":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const DesviosTable = () => {
  const { toast } = useToast();
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [selectedDesvio, setSelectedDesvio] = useState<DesvioCompleto | null>(null);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesvios = async () => {
      setIsLoading(true);
      try {
        const data = await desviosCompletosService.getAll();
        setDesvios(data);
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
      const updatedDesvio = await desviosCompletosService.update(selectedDesvio.id!, {
        status: actionStatus
      });
      
      if (updatedDesvio) {
        setDesvios(desvios.map(d => 
          d.id === selectedDesvio.id 
            ? { ...d, status: actionStatus } 
            : d
        ));
        
        toast({
          title: "Status atualizado",
          description: `O status do desvio ${selectedDesvio.id} foi alterado para ${actionStatus}.`,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do desvio.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR");
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
                <TableHead className="max-w-[250px]">Descrição</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {desvios.length > 0 ? (
                desvios.map((desvio) => (
                  <TableRow key={desvio.id}>
                    <TableCell className="font-medium">{desvio.id?.slice(0, 8)}...</TableCell>
                    <TableCell>{formatDate(desvio.data_desvio)}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {desvio.descricao_desvio?.substring(0, 60)}
                      {desvio.descricao_desvio && desvio.descricao_desvio.length > 60 ? '...' : ''}
                    </TableCell>
                    <TableCell>{desvio.local}</TableCell>
                    <TableCell>{(desvio as any).ccas?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRiskColor(desvio.classificacao_risco || '')}>
                        {desvio.classificacao_risco || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(desvio.status || '')}>
                        {desvio.status || 'PENDENTE'}
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
                              <DialogTitle>Detalhes do Desvio</DialogTitle>
                              <DialogDescription className="pt-4 flex items-center gap-2">
                                <span className="text-muted-foreground">ID: {desvio.id?.slice(0, 8)}...</span>
                                <span>•</span>
                                <span className="text-muted-foreground">Data: {formatDate(desvio.data_desvio)}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Informações do Desvio</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Local</p>
                                    <p className="text-sm text-muted-foreground">{desvio.local}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">CCA</p>
                                    <p className="text-sm text-muted-foreground">{(desvio as any).ccas?.nome || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Nível de Risco</p>
                                    <Badge variant="secondary" className={getRiskColor(desvio.classificacao_risco || '')}>
                                      {desvio.classificacao_risco || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge variant="secondary" className={getStatusColor(desvio.status || '')}>
                                      {desvio.status || 'PENDENTE'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Descrição</h3>
                                <p className="text-sm text-muted-foreground">{desvio.descricao_desvio}</p>
                              </div>
                              {desvio.acao_imediata && (
                                <div className="grid gap-2">
                                  <h3 className="font-semibold">Ação Imediata</h3>
                                  <p className="text-sm text-muted-foreground">{desvio.acao_imediata}</p>
                                </div>
                              )}
                              <div className="grid gap-2">
                                <h3 className="font-semibold">Atualizar Status</h3>
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
                                        <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                                        <SelectItem value="EM ANDAMENTO">EM ANDAMENTO</SelectItem>
                                        <SelectItem value="CONCLUÍDO">CONCLUÍDO</SelectItem>
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
