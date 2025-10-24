import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft, Edit } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCCAs } from "@/hooks/useCCAs";
import { useAlmoxarifados } from "@/hooks/useAlmoxarifados";
import { useEstoqueItensDisponiveis } from "@/hooks/useEstoqueItensDisponiveis";
import { eapService, EAPItem } from "@/services/eapService";
import { estoqueMovimentacoesSaidasService } from "@/services/estoqueMovimentacoesSaidasService";
import { supabase } from "@/integrations/supabase/client";

interface ItemRequisicao {
  id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  unitario?: number;
}

export default function EditarRequisicao() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  
  const [cca, setCca] = useState("");
  const [requisitante, setRequisitante] = useState("");
  const [dataMovimento, setDataMovimento] = useState<Date>();
  const [almoxarifado, setAlmoxarifado] = useState("");
  const [apropriacao, setApropriacao] = useState("");
  const [observacao, setObservacao] = useState("");
  
  // Estados para EAP em cascata
  const [eapNiveis, setEapNiveis] = useState<EAPItem[][]>([]);
  const [eapSelecionados, setEapSelecionados] = useState<string[]>([]);
  const [eapItemFinal, setEapItemFinal] = useState<string>("");
  
  // Estados para itens
  const [itens, setItens] = useState<ItemRequisicao[]>([]);
  const [searchDescricao, setSearchDescricao] = useState("");
  const [novoItem, setNovoItem] = useState<Partial<ItemRequisicao>>({
    descricao: "",
    unidade: "",
    quantidade: 0,
    unitario: 0
  });
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Hooks
  const { data: almoxarifados = [] } = useAlmoxarifados(cca ? Number(cca) : undefined);
  const { data: itensDisponiveis = [] } = useEstoqueItensDisponiveis(searchDescricao, almoxarifado);
  
  // Carregar dados da requisição
  useEffect(() => {
    if (id) {
      carregarRequisicao();
    }
  }, [id]);

  const carregarRequisicao = async () => {
    try {
      setIsLoading(true);
      
      // Buscar requisição
      const requisicao = await estoqueMovimentacoesSaidasService.getById(id!);
      if (!requisicao) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Requisição não encontrada"
        });
        navigate("/suprimentos/estoque/requisicoes/requisicao-materiais");
        return;
      }

      // Buscar itens da requisição
      const itensRequisicao = await estoqueMovimentacoesSaidasService.getItensByMovimentacaoId(id!);

      // Preencher campos
      setCca(requisicao.cca_id.toString());
      setRequisitante(requisicao.requisitante);
      setDataMovimento(parse(requisicao.data_movimento, "yyyy-MM-dd", new Date()));
      setAlmoxarifado(requisicao.almoxarifado_id);
      setApropriacao(requisicao.apropriacao_id);
      setObservacao(requisicao.observacao || "");

      // Converter itens
      setItens(itensRequisicao.map(item => ({
        id: item.id,
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: item.quantidade,
        unitario: item.unitario
      })));

      // Carregar EAP para reconstruir a árvore de seleção
      await reconstruirSelecaoEAP(requisicao.cca_id, requisicao.apropriacao_id);
      
    } catch (error) {
      console.error("Erro ao carregar requisição:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar dados da requisição"
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const reconstruirSelecaoEAP = async (ccaId: number, apropriacaoId: string) => {
    try {
      // Buscar o item EAP selecionado
      const { data: itemEAP, error } = await supabase
        .from("eap_itens")
        .select("*")
        .eq("id", apropriacaoId)
        .single();

      if (error || !itemEAP) return;

      // Construir array de códigos até o item selecionado
      const codigos = itemEAP.codigo.split(".");
      const codigosCompletos: string[] = [];
      
      for (let i = 0; i < codigos.length; i++) {
        codigosCompletos.push(codigos.slice(0, i + 1).join("."));
      }

      // Carregar níveis
      const niveis: EAPItem[][] = [];
      for (let i = 0; i < codigosCompletos.length; i++) {
        if (i === 0) {
          const nivel1 = await eapService.getItemsByLevel(ccaId, 1);
          niveis.push(nivel1);
        } else {
          const filhos = await eapService.getChildItems(ccaId, codigosCompletos[i - 1]);
          if (filhos.length > 0) {
            niveis.push(filhos);
          }
        }
      }

      setEapNiveis(niveis);
      setEapSelecionados(codigosCompletos);
      setEapItemFinal(itemEAP.codigo);
      
    } catch (error) {
      console.error("Erro ao reconstruir EAP:", error);
    }
  };
  
  // Carregar EAP quando CCA for selecionado
  useEffect(() => {
    if (cca && !isLoading) {
      carregarEAPNivel1();
      setEapSelecionados([]);
      setEapNiveis([]);
      setEapItemFinal("");
      setApropriacao("");
    }
  }, [cca, isLoading]);

  // Limpar itens quando almoxarifado for alterado (mas não durante carregamento inicial)
  useEffect(() => {
    if (almoxarifado && !isLoading && !isInitialLoad) {
      setItens([]);
      setNovoItem({ descricao: "", unidade: "", quantidade: 0, unitario: 0 });
      setSearchDescricao("");
      setItemEditando(null);
    }
  }, [almoxarifado, isLoading, isInitialLoad]);
  
  const carregarEAPNivel1 = async () => {
    try {
      const itens = await eapService.getItemsByLevel(Number(cca), 1);
      setEapNiveis([itens]);
    } catch (error) {
      console.error("Erro ao carregar EAP:", error);
    }
  };
  
  const selecionarEAPNivel = async (codigo: string, nivel: number) => {
    const novosEapSelecionados = [...eapSelecionados];
    novosEapSelecionados[nivel - 1] = codigo;
    
    // Remover seleções de níveis posteriores
    novosEapSelecionados.splice(nivel);
    setEapSelecionados(novosEapSelecionados);
    
    // Buscar filhos
    const filhos = await eapService.getChildItems(Number(cca), codigo);
    
    if (filhos.length > 0) {
      // Tem filhos, adicionar próximo nível
      const novosNiveis = [...eapNiveis];
      novosNiveis.splice(nivel);
      novosNiveis.push(filhos);
      setEapNiveis(novosNiveis);
      setEapItemFinal("");
      setApropriacao("");
    } else {
      // Não tem filhos, é o último nível - buscar o item pelo código para pegar o id
      const itemEAP = await eapService.getItemByCodigo(Number(cca), codigo);
      const novosNiveis = [...eapNiveis];
      novosNiveis.splice(nivel);
      setEapNiveis(novosNiveis);
      setEapItemFinal(codigo);
      setApropriacao(itemEAP?.id || "");
    }
  };

  const selecionarItemEstoque = (itemEstoque: typeof itensDisponiveis[0]) => {
    setNovoItem({
      ...novoItem,
      descricao: itemEstoque.descricao,
      unidade: itemEstoque.unidade || "",
      unitario: itemEstoque.unitario || 0
    });
    setSearchDescricao(itemEstoque.descricao);
  };

  const adicionarItem = () => {
    if (!novoItem.descricao || !novoItem.unidade || !novoItem.quantidade) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios do item."
      });
      return;
    }

    if (itemEditando) {
      // Atualizar item existente
      setItens(itens.map(item => 
        item.id === itemEditando 
          ? { 
              ...item, 
              descricao: novoItem.descricao!, 
              unidade: novoItem.unidade!, 
              quantidade: novoItem.quantidade!,
              unitario: novoItem.unitario
            }
          : item
      ));
      setItemEditando(null);
    } else {
      // Adicionar novo item
      const item: ItemRequisicao = {
        id: Date.now().toString(),
        descricao: novoItem.descricao!,
        unidade: novoItem.unidade!,
        quantidade: novoItem.quantidade!,
        unitario: novoItem.unitario
      };
      setItens([...itens, item]);
    }

    setNovoItem({ descricao: "", unidade: "", quantidade: 0, unitario: 0 });
    setSearchDescricao("");
  };

  const editarItem = (id: string) => {
    const item = itens.find(item => item.id === id);
    if (item) {
      setNovoItem({
        descricao: item.descricao,
        unidade: item.unidade,
        quantidade: item.quantidade,
        unitario: item.unitario
      });
      setSearchDescricao(item.descricao);
      setItemEditando(id);
    }
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const salvarRequisicao = async () => {
    // Validações básicas
    if (!cca || !requisitante || !dataMovimento || !almoxarifado || !apropriacao) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios."
      });
      return;
    }

    if (itens.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos um item à requisição."
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Atualizar requisição
      const { error: updateError } = await supabase
        .from("estoque_movimentacoes_saidas")
        .update({
          cca_id: Number(cca),
          requisitante,
          data_movimento: format(dataMovimento, "yyyy-MM-dd"),
          almoxarifado_id: almoxarifado,
          apropriacao_id: apropriacao,
          observacao: observacao || null,
        })
        .eq("id", id!);

      if (updateError) throw updateError;

      // Deletar itens antigos
      const { error: deleteError } = await supabase
        .from("estoque_movimentacoes_saidas_itens")
        .delete()
        .eq("movimentacao_saida_id", id!);

      if (deleteError) throw deleteError;

      // Inserir novos itens
      const { error: insertError } = await supabase
        .from("estoque_movimentacoes_saidas_itens")
        .insert(
          itens.map(item => ({
            movimentacao_saida_id: id!,
            descricao: item.descricao,
            unidade: item.unidade,
            quantidade: item.quantidade,
            unitario: item.unitario,
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Sucesso",
        description: "Requisição atualizada com sucesso!"
      });
      
      navigate("/suprimentos/estoque/requisicoes/requisicao-materiais");
    } catch (error) {
      console.error("Erro ao atualizar requisição:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar requisição. Tente novamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/suprimentos/estoque/requisicoes/requisicao-materiais")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Requisição</h1>
            <p className="text-muted-foreground">
              Edição de requisição de materiais
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Requisição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca">
                CCA <span className="text-destructive">*</span>
              </Label>
              <Select value={cca} onValueChange={setCca} disabled={isLoadingCcas}>
                <SelectTrigger className={cn(!cca && "border-destructive")}>
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
              <Label htmlFor="requisitante">
                Requisitante <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requisitante"
                placeholder="Nome do requisitante"
                value={requisitante}
                onChange={(e) => setRequisitante(e.target.value)}
                className={cn(!requisitante && "border-destructive")}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Data do Movimento <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataMovimento && "text-muted-foreground border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataMovimento ? format(dataMovimento, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <Label htmlFor="almoxarifado">
                Almoxarifado <span className="text-destructive">*</span>
              </Label>
              <Select value={almoxarifado} onValueChange={setAlmoxarifado} disabled={!cca}>
                <SelectTrigger className={cn(!almoxarifado && "border-destructive")}>
                  <SelectValue placeholder={cca ? "Selecione o almoxarifado" : "Selecione um CCA primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {almoxarifados.map((alm) => (
                    <SelectItem key={alm.id} value={alm.id}>
                      {alm.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="apropriacao">
                Apropriação <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {eapNiveis.map((nivel, index) => (
                  <Select
                    key={index}
                    value={eapSelecionados[index] || ""}
                    onValueChange={(value) => selecionarEAPNivel(value, index + 1)}
                    disabled={!cca}
                  >
                    <SelectTrigger className={cn(!eapSelecionados[index] && index === 0 && "border-destructive")}>
                      <SelectValue placeholder={`Nível ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {nivel.map((item) => (
                        <SelectItem key={item.codigo} value={item.codigo}>
                          {item.codigo} - {item.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
              {eapItemFinal && (
                <p className="text-sm text-muted-foreground mt-1">
                  EAP selecionado: {eapItemFinal}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              placeholder="Observações sobre a requisição..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens da Requisição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="item-descricao">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="item-descricao"
                  placeholder="Digite para buscar..."
                  value={searchDescricao}
                  onChange={(e) => setSearchDescricao(e.target.value)}
                />
                {searchDescricao.length >= 2 && itensDisponiveis.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                    {itensDisponiveis.map((item, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-muted cursor-pointer"
                        onClick={() => selecionarItemEstoque(item)}
                      >
                        <div className="font-medium">{item.descricao}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.unidade} - Qtd Total: {item.quantidade_total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-unidade">
                Unidade <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-unidade"
                placeholder="Unidade"
                value={novoItem.unidade || ""}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-quantidade">
                Quantidade <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-quantidade"
                type="number"
                step="0.01"
                placeholder="0"
                value={novoItem.quantidade || ""}
                onChange={(e) => setNovoItem({ ...novoItem, quantidade: Number(e.target.value) })}
              />
            </div>
            
            {/* Campo oculto unitário */}
            <input type="hidden" value={novoItem.unitario || 0} />

            <div className="flex items-end gap-2">
              {itemEditando && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setItemEditando(null);
                    setNovoItem({ descricao: "", unidade: "", quantidade: 0, unitario: 0 });
                    setSearchDescricao("");
                  }}
                  className="w-full"
                >
                  Cancelar
                </Button>
              )}
              <Button onClick={adicionarItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {itemEditando ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </div>

          {itens.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Itens Adicionados</h4>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-3 bg-muted font-medium">
                  <div>Descrição</div>
                  <div>Unidade</div>
                  <div>Quantidade</div>
                  <div>Ações</div>
                </div>
                {itens.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-4 p-3 border-t">
                    <div>{item.descricao}</div>
                    <div>{item.unidade}</div>
                    <div>{item.quantidade.toFixed(2)}</div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editarItem(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/suprimentos/estoque/requisicoes/requisicao-materiais")}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={salvarRequisicao} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
