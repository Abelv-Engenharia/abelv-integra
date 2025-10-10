import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCCAs } from "@/hooks/useCCAs";

interface Item {
  id: string;
  descricao: string;
  unidade: string;
  quantidadeSaldo: number;
  quantidadeRetornada: number;
}

const EstoqueNovoRetornoBeneficiamento = () => {
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  const [cca, setCca] = useState("");
  const [fornecedorOrigem, setFornecedorOrigem] = useState("");
  const [almoxarifadoDestino, setAlmoxarifadoDestino] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [observacao, setObservacao] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  
  const [itens, setItens] = useState<Item[]>([]);

  // Mock de itens disponíveis em beneficiamento por fornecedor
  const itensPorFornecedor: Record<string, Item[]> = {
    fornecedor1: [
      { id: "1", descricao: "Tubo de Aço 50mm", unidade: "UN", quantidadeSaldo: 150.00, quantidadeRetornada: 0 },
      { id: "2", descricao: "Chapa de Alumínio 2mm", unidade: "M²", quantidadeSaldo: 85.50, quantidadeRetornada: 0 },
      { id: "3", descricao: "Parafuso M12", unidade: "UN", quantidadeSaldo: 500.00, quantidadeRetornada: 0 }
    ],
    fornecedor2: [
      { id: "4", descricao: "Cabo Elétrico 10mm", unidade: "M", quantidadeSaldo: 250.00, quantidadeRetornada: 0 },
      { id: "5", descricao: "Conectores RJ45", unidade: "UN", quantidadeSaldo: 120.00, quantidadeRetornada: 0 }
    ],
    fornecedor3: [
      { id: "6", descricao: "Tinta Automotiva Branca", unidade: "L", quantidadeSaldo: 45.75, quantidadeRetornada: 0 },
      { id: "7", descricao: "Verniz Marítimo", unidade: "L", quantidadeSaldo: 30.00, quantidadeRetornada: 0 },
      { id: "8", descricao: "Lixa Grão 100", unidade: "UN", quantidadeSaldo: 200.00, quantidadeRetornada: 0 }
    ]
  };

  // Atualizar itens quando fornecedor for selecionado
  const handleFornecedorChange = (valor: string) => {
    setFornecedorOrigem(valor);
    const itensDisponiveis = itensPorFornecedor[valor] || [];
    setItens(itensDisponiveis.map(item => ({ ...item, quantidadeRetornada: 0 })));
  };

  const handleQuantidadeRetornadaChange = (id: string, valor: number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidadeRetornada: valor } : item
    ));
  };

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Arquivo deve ter no máximo 3MB");
        return;
      }
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("Arquivo deve ser PDF, PNG, JPEG ou JPG");
        return;
      }
      setArquivo(file);
    }
  };

  const handleSubmit = () => {
    // Validação dos campos obrigatórios
    if (!fornecedorOrigem || !almoxarifadoDestino || !dataMovimento) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Validação: pelo menos um item deve ter quantidade retornada
    const temQuantidadeRetornada = itens.some(item => item.quantidadeRetornada > 0);
    if (!temQuantidadeRetornada) {
      alert("Por favor, informe a quantidade retornada para pelo menos um item");
      return;
    }

    // Validação: quantidade retornada não pode ser maior que saldo
    const quantidadeInvalida = itens.some(item => item.quantidadeRetornada > item.quantidadeSaldo);
    if (quantidadeInvalida) {
      alert("A quantidade retornada não pode ser maior que o saldo disponível");
      return;
    }
    
    // Aqui seria feita a submissão dos dados
    console.log({
      cca,
      fornecedorOrigem,
      almoxarifadoDestino,
      dataMovimento,
      observacao,
      arquivo,
      itens: itens.filter(item => item.quantidadeRetornada > 0)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/suprimentos/estoque/beneficiamento/retorno-beneficiamento">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Retorno de Beneficiamento</h1>
          <p className="text-muted-foreground">
            Cadastro de nova requisição de retorno de materiais do beneficiamento
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Requisição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="fornecedor-origem">Fornecedor de Origem *</Label>
              <Select value={fornecedorOrigem} onValueChange={handleFornecedorChange} required>
                <SelectTrigger className={!fornecedorOrigem ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                  <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                  <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifado-destino">Almoxarifado de Destino *</Label>
              <Select value={almoxarifadoDestino} onValueChange={setAlmoxarifadoDestino} required>
                <SelectTrigger className={!almoxarifadoDestino ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-movimento">Data do Movimento *</Label>
              <Input
                id="data-movimento"
                type="date"
                value={dataMovimento}
                onChange={(e) => setDataMovimento(e.target.value)}
                className={!dataMovimento ? "border-red-500" : ""}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite suas observações (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo de Envio (máx 3MB - PDF, PNG, JPEG, JPG)</Label>
            <Input
              id="arquivo"
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleArquivoChange}
            />
            {arquivo && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {arquivo.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens em Beneficiamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!fornecedorOrigem && (
            <div className="text-center py-8 text-muted-foreground">
              Selecione um fornecedor para visualizar os itens disponíveis
            </div>
          )}

          {fornecedorOrigem && itens.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item com saldo em beneficiamento para este fornecedor
            </div>
          )}

          {fornecedorOrigem && itens.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Quantidade Retornada *</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.descricao}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell className="text-right">{item.quantidadeSaldo.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max={item.quantidadeSaldo}
                          value={item.quantidadeRetornada || ""}
                          onChange={(e) => handleQuantidadeRetornadaChange(item.id, parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          className="text-right"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link to="/suprimentos/estoque/beneficiamento/retorno-beneficiamento">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button onClick={handleSubmit}>
          Salvar Requisição
        </Button>
      </div>
    </div>
  );
};

export default EstoqueNovoRetornoBeneficiamento;