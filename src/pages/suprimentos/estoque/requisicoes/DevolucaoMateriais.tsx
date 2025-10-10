import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCCAs } from "@/hooks/useCCAs";

export default function DevolucaoMateriais() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  const [cca, setCca] = useState("");
  const [requisitante, setRequisitante] = useState("");
  const [dataMovimento, setDataMovimento] = useState<Date>();
  const [almoxarifado, setAlmoxarifado] = useState("");
  const [apropriacao, setApropriacao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [requisicoes, setRequisicoes] = useState([
    {
      id: 1,
      cca: 101,
      requisitante: "João",
      data: "2024-01-15",
      almoxarifado: "Interno",
      apropriacao: "Projeto A",
      observacao: "Material não utilizado",
      items: ["Material A", "Material B"]
    },
    {
      id: 2,
      cca: 102,
      requisitante: "Carlos",
      data: "2024-01-14",
      almoxarifado: "Externo",
      apropriacao: "Projeto B",
      observacao: "Excesso de material",
      items: ["Material C"]
    }
  ]);

  const filtrarRequisicoes = () => {
    toast({
      title: "Filtros aplicados",
      description: "Requisições filtradas com sucesso."
    });
  };

  const fazerDevolucao = (id: number) => {
    navigate(`/suprimentos/estoque/requisicoes/processar-devolucao/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Devolução de Materiais</h1>
          <p className="text-muted-foreground">
            Registro de devolução de materiais ao estoque
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca">CCA</Label>
              <Select value={cca} onValueChange={setCca} disabled={isLoadingCcas}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas?.map((ccaItem) => (
                    <SelectItem key={ccaItem.id} value={ccaItem.id.toString()}>
                      {ccaItem.codigo} - {ccaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requisitante">Requisitante</Label>
              <Select value={requisitante} onValueChange={setRequisitante}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o requisitante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="João">João</SelectItem>
                  <SelectItem value="Carlos">Carlos</SelectItem>
                  <SelectItem value="Marcos">Marcos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data do movimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataMovimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataMovimento ? (
                      format(dataMovimento, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataMovimento}
                    onSelect={setDataMovimento}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifado">Almoxarifado</Label>
              <Select value={almoxarifado} onValueChange={setAlmoxarifado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interno">Interno</SelectItem>
                  <SelectItem value="Externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apropriacao">Apropriação</Label>
              <Select value={apropriacao} onValueChange={setApropriacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a apropriação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Projeto A">Projeto A</SelectItem>
                  <SelectItem value="Projeto B">Projeto B</SelectItem>
                  <SelectItem value="Projeto C">Projeto C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                placeholder="Digite a observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={filtrarRequisicoes}>
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Requisições */}
      <Card>
        <CardHeader>
          <CardTitle>Requisições Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Requisitante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Almoxarifado</TableHead>
                <TableHead>Apropriação</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisicoes.map((requisicao) => (
                <TableRow key={requisicao.id}>
                  <TableCell>{requisicao.cca}</TableCell>
                  <TableCell>{requisicao.requisitante}</TableCell>
                  <TableCell>{format(new Date(requisicao.data), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{requisicao.almoxarifado}</TableCell>
                  <TableCell>{requisicao.apropriacao}</TableCell>
                  <TableCell>{requisicao.observacao}</TableCell>
                  <TableCell>{requisicao.items.join(", ")}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fazerDevolucao(requisicao.id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Devolver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
