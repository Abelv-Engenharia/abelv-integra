import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCCAs } from "@/hooks/useCCAs";
import { useAlmoxarifados } from "@/hooks/useAlmoxarifados";
import { useEstoqueItensDisponiveis } from "@/hooks/useEstoqueItensDisponiveis";
import { eapService, EAPItem } from "@/services/eapService";
import { estoqueMovimentacoesSaidasService } from "@/services/estoqueMovimentacoesSaidasService";

interface ItemRequisicao {
  id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  unitario?: number;
}

export default function NovaRequisicao() {
  const navigate = useNavigate();
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
  
  // Hooks
  const { data: almoxarifados = [] } = useAlmoxarifados(cca ? Number(cca) : undefined);
  const { data: itensDisponiveis = [] } = useEstoqueItensDisponiveis(searchDescricao, almoxarifado);
  
  // Carregar EAP quando CCA for selecionado
  useEffect(() => {
    if (cca) {
      carregarEAPNivel1();
      setEapSelecionados([]);
      setEapNiveis([]);
      setEapItemFinal("");
      setApropriacao("");
    }
  }, [cca]);

  // Limpar itens quando almoxarifado for alterado
  useEffect(() => {
    if (almoxarifado) {
      setItens([]);
      setNovoItem({ descricao: "", unidade: "", quantidade: 0, unitario: 0 });
      setSearchDescricao("");
      setItemEditando(null);
    }
  }, [almoxarifado]);
  
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
      setEapItemFinal(""); // Ainda não é o último nível
      setApropriacao("");
    } else {
      // Não tem filhos, é o último nível
      const novosNiveis = [...eapNiveis];
      novosNiveis.splice(nivel);
      setEapNiveis(novosNiveis);
      setEapItemFinal(codigo);
      setApropriacao(codigo);
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
      // Salvar a requisição e seus itens
      await estoqueMovimentacoesSaidasService.create(
        {
          cca_id: Number(cca),
          requisitante,
          data_movimento: format(dataMovimento, "yyyy-MM-dd"),
          almoxarifado_id: almoxarifado,
          apropriacao_id: apropriacao,
          observacao: observacao || undefined,
        },
        itens.map(item => ({
          descricao: item.descricao,
          unidade: item.unidade,
          quantidade: item.quantidade,
          unitario: item.unitario,
        }))
      );

      toast({
        title: "Sucesso",
        description: "Requisição salva com sucesso!"
      });
      
      navigate("/suprimentos/estoque/requisicoes/requisicao-materiais");
    } catch (error) {
      console.error("Erro ao salvar requisição:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar requisição. Tente novamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Nova Requisição</h1>
            <p className="text-muted-foreground">
              Cadastro de nova requisição de materiais
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
                    <div>{item.quantidade}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editarItem(item.id)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/suprimentos/estoque/requisicoes/requisicao-materiais")}
        >
          Cancelar
        </Button>
        <Button onClick={salvarRequisicao} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Requisição"}
        </Button>
      </div>
    </div>
  );
}
