import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Download, Building2, FileText, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { NovoContratoModal } from "@/components/alojamento/NovoContratoModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
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

// Dados mockados dos contratos
const contratos = [
  {
    id: 1,
    projeto: "Obra Norte",
    numeroContrato: "CT-2024-001",
    dataInicio: "2024-01-01",
    dataTermino: "2024-12-31",
    valorDiario: 45.00,
    statusVigencia: "Vigente",
    versao: "1.0",
    ultimaAtualizacao: "2024-01-15"
  },
  {
    id: 2,
    projeto: "Obra Sul",
    numeroContrato: "CT-2024-002",
    dataInicio: "2024-02-01",
    dataTermino: "2024-11-30",
    valorDiario: 50.00,
    statusVigencia: "Vigente",
    versao: "1.1",
    ultimaAtualizacao: "2024-02-01"
  }
];

// Dados mockados do histórico
const historico = [
  {
    id: 1,
    data: "2024-01-15",
    usuario: "admin@empresa.com",
    acao: "Atualização de dados",
    detalhes: "Alterado valor diário padrão de R$ 40,00 para R$ 45,00"
  },
  {
    id: 2,
    data: "2024-01-01",
    usuario: "compras@empresa.com",
    acao: "Novo contrato",
    detalhes: "Criado contrato CT-2024-002 para Obra Sul"
  },
  {
    id: 3,
    data: "2023-06-10",
    usuario: "admin@empresa.com",
    acao: "Cadastro",
    detalhes: "Fornecedor cadastrado no sistema"
  }
];

export default function DetalheFornecedor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novoContratoModalOpen, setNovoContratoModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: fornecedor, isLoading } = useQuery({
    queryKey: ["fornecedor", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");
      const { data, error } = await supabase
        .from("fornecedores_alojamento")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Fornecedor não encontrado");
      return data;
    },
    enabled: !!id,
  });

  const handleExcluir = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("fornecedores_alojamento")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Fornecedor excluído com sucesso!");
      navigate("/fornecedores-alojamento");
    } catch (error) {
      toast.error("Erro ao excluir fornecedor");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/fornecedores-alojamento")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center py-8">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!fornecedor) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/fornecedores-alojamento")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold">Fornecedor não encontrado</h2>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const getVigenciaColor = (status: string) => {
    switch (status) {
      case "Vigente": return "bg-green-100 text-green-700";
      case "A vencer": return "bg-yellow-100 text-yellow-700";
      case "Vencido": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
              <p className="text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate(`/editar-fornecedor/${id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <Badge className={getStatusColor(fornecedor.status)}>
            {fornecedor.status}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="contratos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos
            </TabsTrigger>
          </TabsList>

          {/* Aba Dados */}
          <TabsContent value="dados" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dados Gerais</CardTitle>
                    <CardDescription>Informações completas do fornecedor</CardDescription>
                  </div>
                  <Badge className={getStatusColor(fornecedor.status)}>{fornecedor.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-base font-semibold">{fornecedor.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                    <p className="text-base font-mono">{fornecedor.cnpj}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="text-base whitespace-pre-line">{fornecedor.endereco}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contato</label>
                    <p className="text-base">{fornecedor.contato_nome || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-base font-mono">{fornecedor.telefone}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                    <p className="text-base">
                      {new Date(fornecedor.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                    <p className="text-base">
                      {new Date(fornecedor.updated_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Contratos */}
          <TabsContent value="contratos" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Lista de Contratos</h3>
                <Button onClick={() => setNovoContratoModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Contrato
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Funcionalidade de contratos será implementada em breve.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o fornecedor <strong>{fornecedor.nome}</strong>?
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleExcluir} 
                disabled={isDeleting} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}