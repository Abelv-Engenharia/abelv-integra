import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Save, Plus, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNfeCompra } from "@/hooks/useNfeCompras";
import { useNfeCompraItens, NfeCompraItem } from "@/hooks/useNfeCompraItens";
import { useCredores } from "@/hooks/useCredores";
import { useCCAs } from "@/hooks/useCCAs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EditarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: nfe, isLoading: nfeLoading } = useNfeCompra(id);
  const { data: itensOriginais = [], isLoading: itensLoading } = useNfeCompraItens(id);
  const { data: credores = [] } = useCredores();
  const { data: ccas = [] } = useCCAs();

  // Estados do formulário
  const [formData, setFormData] = useState({
    numero: nfe?.numero || "",
    id_documento: nfe?.id_documento || "",
    emissao: nfe?.emissao ? new Date(nfe.emissao) : undefined,
    Movimenbto: nfe?.Movimenbto ? new Date(nfe.Movimenbto) : undefined,
    id_credor: nfe?.id_credor || "",
    id_empresa: nfe?.id_empresa || 1,
    PC_Abelv: nfe?.PC_Abelv || "",
    PC_Cliente: nfe?.PC_Cliente || "",
  });

  const [itens, setItens] = useState<NfeCompraItem[]>(itensOriginais);
  const [isSaving, setIsSaving] = useState(false);

  // Atualizar dados quando carregar
  useEffect(() => {
    if (nfe) {
      setFormData({
        numero: nfe.numero || "",
        id_documento: nfe.id_documento || "",
        emissao: nfe.emissao ? new Date(nfe.emissao) : undefined,
        Movimenbto: nfe.Movimenbto ? new Date(nfe.Movimenbto) : undefined,
        id_credor: nfe.id_credor || "",
        id_empresa: nfe.id_empresa || 1,
        PC_Abelv: nfe.PC_Abelv || "",
        PC_Cliente: nfe.PC_Cliente || "",
      });
    }
  }, [nfe]);

  useEffect(() => {
    if (itensOriginais.length > 0) {
      setItens(itensOriginais);
    }
  }, [itensOriginais]);

  const handleAddItem = () => {
    const novoItem: NfeCompraItem = {
      id: crypto.randomUUID(),
      id_nfe: id,
      descricao: "",
      id_unidade: 0,
      quantidade: 0,
      unitario: 0,
      id_cca_sienge: 0,
    };
    setItens([...itens, novoItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItens(itens.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, campo: keyof NfeCompraItem, valor: any) => {
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, [campo]: valor } : item
    ));
  };

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      // Atualizar NFe
      const { error: nfeError } = await supabase
        .from("nfe_compra" as any)
        .update({
          numero: formData.numero,
          id_documento: formData.id_documento,
          emissao: formData.emissao,
          Movimenbto: formData.Movimenbto,
          id_credor: formData.id_credor,
          id_empresa: formData.id_empresa,
          PC_Abelv: formData.PC_Abelv,
          PC_Cliente: formData.PC_Cliente,
        })
        .eq("id", id);

      if (nfeError) throw nfeError;

      // Deletar itens removidos
      const idsOriginais = itensOriginais.map(i => i.id);
      const idsAtuais = itens.map(i => i.id);
      const idsRemovidos = idsOriginais.filter(id => !idsAtuais.includes(id));

      if (idsRemovidos.length > 0) {
        const { error: deleteError } = await supabase
          .from("nfe_compra_itens" as any)
          .delete()
          .in("id", idsRemovidos);

        if (deleteError) throw deleteError;
      }

      // Atualizar/inserir itens
      for (const item of itens) {
        const itemData = {
          id_nfe: id,
          descricao: item.descricao,
          id_unidade: item.id_unidade,
          quantidade: item.quantidade,
          unitario: item.unitario,
          id_cca_sienge: item.id_cca_sienge,
        };

        if (idsOriginais.includes(item.id)) {
          // Atualizar
          const { error } = await supabase
            .from("nfe_compra_itens" as any)
            .update(itemData)
            .eq("id", item.id);

          if (error) throw error;
        } else {
          // Inserir
          const { error } = await supabase
            .from("nfe_compra_itens" as any)
            .insert({ ...itemData, id: item.id });

          if (error) throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Entrada atualizada com sucesso!",
      });

      navigate("/suprimentos/estoque/entradas/entrada-materiais");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar entrada",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (nfeLoading || itensLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!nfe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Entrada não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/suprimentos/estoque/entradas/entrada-materiais")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Editar Entrada de Material
            </h1>
            <p className="text-muted-foreground">
              NFe {nfe.numero}/{nfe.id_documento}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {/* Formulário da NFe */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_documento">Série/ID Documento</Label>
              <Input
                id="id_documento"
                value={formData.id_documento}
                onChange={(e) => setFormData({ ...formData, id_documento: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data emissão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.emissao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.emissao ? format(formData.emissao, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.emissao}
                    onSelect={(date) => setFormData({ ...formData, emissao: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data movimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.Movimenbto && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.Movimenbto ? format(formData.Movimenbto, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.Movimenbto}
                    onSelect={(date) => setFormData({ ...formData, Movimenbto: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credor">Credor</Label>
              <Select
                value={formData.id_credor}
                onValueChange={(value) => setFormData({ ...formData, id_credor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o credor" />
                </SelectTrigger>
                <SelectContent>
                  {credores.map((credor) => (
                    <SelectItem key={credor.id} value={credor.id_sienge}>
                      {credor.razao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pc_abelv">PC Abelv</Label>
              <Input
                id="pc_abelv"
                value={formData.PC_Abelv || ""}
                onChange={(e) => setFormData({ ...formData, PC_Abelv: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pc_cliente">PC Cliente</Label>
              <Input
                id="pc_cliente"
                value={formData.PC_Cliente || ""}
                onChange={(e) => setFormData({ ...formData, PC_Cliente: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens da NFe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Itens da Nota Fiscal</CardTitle>
          <Button onClick={handleAddItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor unitário</TableHead>
                <TableHead>Valor total</TableHead>
                <TableHead>CCA Sienge</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum item adicionado
                  </TableCell>
                </TableRow>
              ) : (
                itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.descricao}
                        onChange={(e) => handleItemChange(item.id, "descricao", e.target.value)}
                        placeholder="Descrição"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.id_unidade}
                        onChange={(e) => handleItemChange(item.id, "id_unidade", parseInt(e.target.value) || 0)}
                        placeholder="Unidade"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(item.id, "quantidade", parseFloat(e.target.value) || 0)}
                        placeholder="Qtd"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitario}
                        onChange={(e) => handleItemChange(item.id, "unitario", parseFloat(e.target.value) || 0)}
                        placeholder="R$"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      R$ {((item.quantidade || 0) * Number(item.unitario || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.id_cca_sienge}
                        onChange={(e) => handleItemChange(item.id, "id_cca_sienge", parseInt(e.target.value) || 0)}
                        placeholder="CCA"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
