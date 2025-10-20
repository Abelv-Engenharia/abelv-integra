import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Camera, Send, FileSpreadsheet, FileText, Settings } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import ChecklistDataService, { ChecklistRecord } from "@/services/ChecklistDataService";
import { PhotoViewerModal } from "@/components/veiculos/PhotoViewerModal";
import { EmailConfigModal } from "@/components/veiculos/EmailConfigModal";

export function ConsultaChecklistTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [checklists, setChecklists] = useState<ChecklistRecord[]>([]);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [checklistSelecionado, setChecklistSelecionado] = useState<ChecklistRecord | null>(null);

  useEffect(() => {
    carregarChecklists();
  }, []);

  const carregarChecklists = () => {
    const dados = ChecklistDataService.obterTodos();
    setChecklists(dados);
  };

  const checklistsFiltrados = checklists.filter(checklist => {
    const matchBusca = busca === "" || 
      checklist.placa.toLowerCase().includes(busca.toLowerCase()) ||
      checklist.condutor.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === "todos" || checklist.status.toLowerCase() === filtroStatus.toLowerCase();
    const matchTipo = filtroTipo === "todos" || checklist.tipo.toLowerCase() === filtroTipo.toLowerCase();

    return matchBusca && matchStatus && matchTipo;
  });

  const enviarCobranca = (id: string) => {
    ChecklistDataService.incrementarTentativaCobranca(id);
    carregarChecklists();
    toast({
      title: "Cobrança enviada",
      description: "E-mail de cobrança enviado para o condutor",
    });
  };

  const visualizarFotos = (checklist: ChecklistRecord) => {
    setChecklistSelecionado(checklist);
    setPhotoViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros de Busca</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEmailModalOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Configurar E-mails
              </Button>
              <Button onClick={() => navigate("/checklist-veiculos")}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Checklist
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa ou condutor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="Retirada">Retirada</SelectItem>
                <SelectItem value="Devolução">Devolução</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Checklists Registrados ({checklistsFiltrados.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {checklistsFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todos" || filtroTipo !== "todos"
                  ? "Nenhum checklist encontrado com os filtros aplicados."
                  : "Nenhum checklist cadastrado ainda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Limite</TableHead>
                    <TableHead>Fotos</TableHead>
                    <TableHead>Tentativas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklistsFiltrados.map((checklist) => {
                    const dataChecklist = checklist.data ? new Date(checklist.data) : null;
                    const dataLimite = checklist.datalimite ? new Date(checklist.datalimite) : null;
                    const isDataChecklistValid = dataChecklist && !isNaN(dataChecklist.getTime());
                    const isDataLimiteValid = dataLimite && !isNaN(dataLimite.getTime());

                    return (
                      <TableRow key={checklist.id}>
                        <TableCell>
                          {isDataChecklistValid ? format(dataChecklist, "dd/MM/yyyy") : "-"}
                        </TableCell>
                        <TableCell className="font-mono">{checklist.placa}</TableCell>
                        <TableCell>{checklist.condutor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{checklist.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={checklist.status === "Concluído" ? "default" : "secondary"}>
                            {checklist.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isDataLimiteValid ? format(dataLimite, "dd/MM/yyyy") : "-"}
                        </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {checklist.fotos ? Object.keys(checklist.fotos).length : 0} fotos
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={checklist.tentativascobranca > 2 ? "destructive" : "secondary"}>
                          {checklist.tentativascobranca}x
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => visualizarFotos(checklist)}
                            title="Visualizar Fotos"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => enviarCobranca(checklist.id)}
                            title="Enviar Cobrança"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {checklistSelecionado && (
        <PhotoViewerModal
          isOpen={photoViewerOpen}
          onClose={() => setPhotoViewerOpen(false)}
          fotos={checklistSelecionado.fotos || {}}
          nomeVeiculo={checklistSelecionado.placa}
        />
      )}

      <EmailConfigModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
      />
    </div>
  );
}