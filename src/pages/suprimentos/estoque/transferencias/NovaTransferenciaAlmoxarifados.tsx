import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ItemTransferencia {
  id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
}

const EstoqueNovaTransferenciaAlmoxarifados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados do formulário
  const [cca, setCca] = useState("");
  const [almoxarifadoOrigem, setAlmoxarifadoOrigem] = useState("");
  const [almoxarifadoDestino, setAlmoxarifadoDestino] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  // Estados dos itens
  const [itens, setItens] = useState<ItemTransferencia[]>([]);
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    unidade: "",
    quantidade: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho máximo (3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 3MB",
          variant: "destructive"
        });
        return;
      }

      // Validar tipo de arquivo
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF, PNG, JPEG e JPG são permitidos",
          variant: "destructive"
        });
        return;
      }

      setArquivo(file);
    }
  };

  const adicionarItem = () => {
    if (!novoItem.descricao || !novoItem.unidade || !novoItem.quantidade) {
      toast({
        title: "Erro",
        description: "Todos os campos do item são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const quantidade = parseFloat(novoItem.quantidade);
    if (quantidade <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    const item: ItemTransferencia = {
      id: Date.now().toString(),
      descricao: novoItem.descricao,
      unidade: novoItem.unidade,
      quantidade
    };

    setItens([...itens, item]);
    setNovoItem({ descricao: "", unidade: "", quantidade: "" });

    toast({
      title: "Sucesso",
      description: "Item adicionado à transferência"
    });
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
    toast({
      title: "Sucesso",
      description: "Item removido da transferência"
    });
  };

  const salvarTransferencia = () => {
    // Validações
    if (!cca || !almoxarifadoOrigem || !almoxarifadoDestino || !dataMovimento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (almoxarifadoOrigem === almoxarifadoDestino) {
      toast({
        title: "Erro",
        description: "Os almoxarifados de origem e destino não podem ser iguais",
        variant: "destructive"
      });
      return;
    }

    if (itens.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item à transferência",
        variant: "destructive"
      });
      return;
    }

    // Simular salvamento
    toast({
      title: "Sucesso",
      description: "Transferência salva com sucesso!"
    });

    // Navegar de volta para a lista
    navigate("/suprimentos/estoque/transferencias/transferencia-almoxarifados");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/suprimentos/estoque/transferencias/transferencia-almoxarifados")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Transferência Entre Almoxarifados</h1>
          <p className="text-muted-foreground">
            Cadastro de nova transferência de materiais
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Transferência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cca" className={!cca ? "text-destructive" : ""}>
                  Cca *
                </Label>
                <Input
                  id="cca"
                  type="number"
                  value={cca}
                  onChange={(e) => setCca(e.target.value)}
                  className={!cca ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label className={!almoxarifadoOrigem ? "text-destructive" : ""}>
                  Almoxarifado de origem *
                </Label>
                <Select value={almoxarifadoOrigem} onValueChange={setAlmoxarifadoOrigem}>
                  <SelectTrigger className={!almoxarifadoOrigem ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={!almoxarifadoDestino ? "text-destructive" : ""}>
                  Almoxarifado de destino *
                </Label>
                <Select value={almoxarifadoDestino} onValueChange={setAlmoxarifadoDestino}>
                  <SelectTrigger className={!almoxarifadoDestino ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <Textarea
                  id="observacao"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Digite suas observações..."
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataMovimento" className={!dataMovimento ? "text-destructive" : ""}>
                    Data do movimento *
                  </Label>
                  <Input
                    id="dataMovimento"
                    type="date"
                    value={dataMovimento}
                    onChange={(e) => setDataMovimento(e.target.value)}
                    className={!dataMovimento ? "border-destructive" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arquivo">Arquivo de envio</Label>
                  <Input
                    id="arquivo"
                    type="file"
                    accept=".pdf,.png,.jpeg,.jpg"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo 3MB. Formatos: PDF, PNG, JPEG, JPG
                  </p>
                  {arquivo && (
                    <p className="text-sm text-green-600">
                      Arquivo selecionado: {arquivo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adição de Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={novoItem.descricao}
                  onChange={(e) => setNovoItem({...novoItem, descricao: e.target.value})}
                  placeholder="Descrição do item"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Input
                  id="unidade"
                  value={novoItem.unidade}
                  onChange={(e) => setNovoItem({...novoItem, unidade: e.target.value})}
                  placeholder="Ex: KG, UN, MT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  step="0.01"
                  value={novoItem.quantidade}
                  onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={adicionarItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Itens da Transferência</CardTitle>
          </CardHeader>
          <CardContent>
            {itens.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">
                        {item.quantidade.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removerItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum item adicionado. Use o formulário acima para adicionar itens.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/suprimentos/estoque/transferencias/transferencia-almoxarifados")}
          >
            Cancelar
          </Button>
          <Button onClick={salvarTransferencia}>
            Salvar Transferência
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EstoqueNovaTransferenciaAlmoxarifados;