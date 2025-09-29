import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, QrCode, Flame, Search } from "lucide-react";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";
import { PageLoader } from "@/components/common/PageLoader";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { fetchExtintores } from "@/services/extintores/extintoresService";
import { formatarTipoExtintor, getStatusExtintorTexto, getStatusExtintorBadgeClass } from "@/utils/extintorUtils";
import { ExtintorViewDialog } from "@/components/prevencao-incendio/ExtintorViewDialog";
import { ExtintorEditDialog } from "@/components/prevencao-incendio/ExtintorEditDialog";
import { ExtintorDeleteDialog } from "@/components/prevencao-incendio/ExtintorDeleteDialog";
import { ExtintorQRCodeDialog } from "@/components/prevencao-incendio/ExtintorQRCodeDialog";

const ConsultaExtintores = () => {
  const { data: userCCAs, isLoading: loadingCCAs } = useUserCCAs();
  
  const [filtros, setFiltros] = useState({
    busca: "",
    ccaId: "todos",
    tipo: "todos",
    status: "todos",
  });

  const [selectedExtintor, setSelectedExtintor] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const {
    data: extintores,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["extintores", userCCAs],
    queryFn: () => fetchExtintores(userCCAs?.map((cca) => cca.id)),
    enabled: !!userCCAs && userCCAs.length > 0,
  });

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  // Filtrar extintores
  const extintoresFiltrados = extintores?.filter((extintor) => {
    // Filtro de busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      const matchCodigo = extintor.codigo?.toLowerCase().includes(busca);
      const matchLocalizacao = extintor.localizacao?.toLowerCase().includes(busca);
      if (!matchCodigo && !matchLocalizacao) return false;
    }

    // Filtro de CCA
    if (filtros.ccaId !== "todos" && extintor.cca_id?.toString() !== filtros.ccaId) {
      return false;
    }

    // Filtro de tipo
    if (filtros.tipo !== "todos" && extintor.tipo !== filtros.tipo) {
      return false;
    }

    // Filtro de status
    if (filtros.status !== "todos") {
      const status = getStatusExtintorTexto(extintor.data_vencimento);
      if (filtros.status === "ativo" && status !== "Ativo") return false;
      if (filtros.status === "proximo" && status !== "Próximo ao Vencimento") return false;
      if (filtros.status === "vencido" && status !== "Vencido") return false;
    }

    return extintor.ativo !== false; // Não mostrar inativos
  });

  const handleView = (extintor: any) => {
    setSelectedExtintor(extintor);
    setViewDialogOpen(true);
  };

  const handleEdit = (extintor: any) => {
    setSelectedExtintor(extintor);
    setEditDialogOpen(true);
  };

  const handleDelete = (extintor: any) => {
    setSelectedExtintor(extintor);
    setDeleteDialogOpen(true);
  };

  const handleQRCode = (extintor: any) => {
    setSelectedExtintor(extintor);
    setQrDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (loadingCCAs) {
    return <PageLoader text="Carregando..." size="md" />;
  }

  return (
    <PermissionGuard
      requiredPermissions={["prevencao_incendio", "prevencao_incendio_consulta_extintores"]}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para consultar extintores." />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Flame className="h-6 w-6" />
              Consulta de Extintores
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie os extintores cadastrados no sistema
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou localização..."
              value={filtros.busca}
              onChange={(e) => handleFiltroChange("busca", e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filtros.ccaId} onValueChange={(value) => handleFiltroChange("ccaId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os CCAs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os CCAs</SelectItem>
              {userCCAs?.map((cca) => (
                <SelectItem key={cca.id} value={cca.id.toString()}>
                  {cca.codigo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtros.tipo} onValueChange={(value) => handleFiltroChange("tipo", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="agua">Água</SelectItem>
              <SelectItem value="po-quimico">Pó Químico</SelectItem>
              <SelectItem value="co2">CO2</SelectItem>
              <SelectItem value="espuma">Espuma</SelectItem>
              <SelectItem value="gas-inerte">Gás Inerte</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtros.status} onValueChange={(value) => handleFiltroChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="proximo">Próximo ao Vencimento</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <PageLoader text="Carregando extintores..." size="sm" />
                  </TableCell>
                </TableRow>
              ) : extintoresFiltrados && extintoresFiltrados.length > 0 ? (
                extintoresFiltrados.map((extintor) => (
                  <TableRow key={extintor.id}>
                    <TableCell className="font-medium">{extintor.codigo}</TableCell>
                    <TableCell>{extintor.ccas?.codigo}</TableCell>
                    <TableCell>{formatarTipoExtintor(extintor.tipo)}</TableCell>
                    <TableCell>{extintor.capacidade}</TableCell>
                    <TableCell>{extintor.localizacao}</TableCell>
                    <TableCell>
                      <Badge className={getStatusExtintorBadgeClass(extintor.data_vencimento)}>
                        {getStatusExtintorTexto(extintor.data_vencimento)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(extintor)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(extintor)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleQRCode(extintor)}
                          title="QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(extintor)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum extintor encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total de registros */}
        {extintoresFiltrados && extintoresFiltrados.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Total: {extintoresFiltrados.length} extintor(es) encontrado(s)
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ExtintorViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        extintor={selectedExtintor}
      />

      <ExtintorEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        extintor={selectedExtintor}
        onSuccess={handleSuccess}
      />

      <ExtintorDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        extintor={selectedExtintor}
        onSuccess={handleSuccess}
      />

      <ExtintorQRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        extintor={selectedExtintor}
      />
    </PermissionGuard>
  );
};

export default ConsultaExtintores;
