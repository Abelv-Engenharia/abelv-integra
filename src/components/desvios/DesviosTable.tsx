
import { useState } from "react";
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

// Mock data for deviations
const desviosData = [
  {
    id: "DEV-2025-0143",
    date: "07/04/2025",
    title: "Falta de uso de EPI em trabalho em altura",
    cca: "CCA-001",
    company: "Abelv",
    responsavel: "João Silva",
    risk: "Substancial",
    status: "Pendente",
    description: "Colaborador encontrado realizando trabalho em altura sem utilizar o cinto de segurança adequado."
  },
  {
    id: "DEV-2025-0142",
    date: "06/04/2025",
    title: "Equipamento sem inspeção de segurança",
    cca: "CCA-002",
    company: "Fornecedor A",
    responsavel: "Maria Santos",
    risk: "Moderado",
    status: "Em andamento",
    description: "Empilhadeira sendo utilizada sem o selo de inspeção periódica atualizado."
  },
  {
    id: "DEV-2025-0141",
    date: "05/04/2025",
    title: "Acesso não autorizado a área restrita",
    cca: "CCA-001",
    company: "Abelv",
    responsavel: "Carlos Oliveira",
    risk: "Tolerável",
    status: "Concluído",
    description: "Colaborador acessou área restrita sem autorização e sem os EPIs necessários."
  },
  {
    id: "DEV-2025-0140",
    date: "04/04/2025",
    title: "Procedimento incorreto em operação de equipamento",
    cca: "CCA-003",
    company: "Fornecedor B",
    responsavel: "Ana Souza",
    risk: "Moderado",
    status: "Pendente",
    description: "Operador não seguiu o procedimento padrão para operação do equipamento, criando risco de acidente."
  },
  {
    id: "DEV-2025-0139",
    date: "03/04/2025",
    title: "Falha na sinalização de área de risco",
    cca: "CCA-002",
    company: "Abelv",
    responsavel: "Ricardo Ferreira",
    risk: "Tolerável",
    status: "Concluído",
    description: "Área com risco de queda não estava devidamente sinalizada com fita zebrada e placas de advertência."
  },
  {
    id: "DEV-2025-0138",
    date: "02/04/2025",
    title: "Obstrução de equipamento de emergência",
    cca: "CCA-001",
    company: "Fornecedor A",
    responsavel: "Fernanda Lima",
    risk: "Moderado",
    status: "Em andamento",
    description: "Extintor de incêndio encontrado obstruído por materiais, dificultando o acesso em caso de emergência."
  },
  {
    id: "DEV-2025-0137",
    date: "01/04/2025",
    title: "Falta de travamento em manutenção",
    cca: "CCA-003",
    company: "Abelv",
    responsavel: "Pedro Costa",
    risk: "Intolerável",
    status: "Concluído",
    description: "Manutenção em equipamento energizado sem o devido procedimento de travamento e etiquetagem (LOTO)."
  },
  {
    id: "DEV-2025-0136",
    date: "31/03/2025",
    title: "Armazenamento incorreto de produtos químicos",
    cca: "CCA-002",
    company: "Fornecedor B",
    responsavel: "Marcelo Dias",
    risk: "Substancial",
    status: "Pendente",
    description: "Produtos químicos incompatíveis armazenados juntos e sem a devida contenção secundária."
  },
  {
    id: "DEV-2025-0135",
    date: "30/03/2025",
    title: "Uso de ferramentas improvisadas",
    cca: "CCA-001",
    company: "Abelv",
    responsavel: "Luciana Martins",
    risk: "Moderado",
    status: "Em andamento",
    description: "Colaborador utilizando ferramenta improvisada para realizar atividade, aumentando o risco de acidentes."
  },
  {
    id: "DEV-2025-0134",
    date: "29/03/2025",
    title: "Excesso de velocidade com veículo interno",
    cca: "CCA-003",
    company: "Fornecedor A",
    responsavel: "Roberto Alves",
    risk: "Tolerável",
    status: "Concluído",
    description: "Motorista de empilhadeira trafegando acima da velocidade permitida dentro das instalações."
  },
];

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
  const [selectedDesvio, setSelectedDesvio] = useState<any>(null);
  const [actionStatus, setActionStatus] = useState<string>("");

  const handleStatusChange = (status: string) => {
    setActionStatus(status);
  };

  const updateDesvioStatus = () => {
    toast({
      title: "Status atualizado",
      description: `O status do desvio ${selectedDesvio?.id} foi alterado para ${actionStatus}.`,
    });
  };

  return (
    <div className="bg-white rounded-md border shadow-sm">
      <div className="relative w-full overflow-auto">
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
            {desviosData.map((desvio) => (
              <TableRow key={desvio.id}>
                <TableCell className="font-medium">{desvio.id}</TableCell>
                <TableCell>{desvio.date}</TableCell>
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
                            <span className="text-muted-foreground">Data: {desvio.date}</span>
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
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {desviosData.length} de {desviosData.length} desvios
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
