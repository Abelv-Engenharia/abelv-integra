import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ItemRequisicao {
  id: number;
  descricao: string;
  unidade: string;
  quantidade: number;
  quantidadeDevolvida: number;
}

interface DadosRequisicao {
  id: number;
  cca: number;
  requisitante: string;
  data: string;
  almoxarifado: string;
  apropriacao: string;
  observacao: string;
  itens: ItemRequisicao[];
}

export default function ProcessarDevolucao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [requisicao, setRequisicao] = useState<DadosRequisicao | null>(null);

  useEffect(() => {
    // Simular carregamento dos dados da requisição
    const dadosRequisicao: DadosRequisicao = {
      id: parseInt(id || "1"),
      cca: 101,
      requisitante: "João",
      data: "2024-01-15",
      almoxarifado: "Interno",
      apropriacao: "Projeto A",
      observacao: "Material não utilizado",
      itens: [
        {
          id: 1,
          descricao: "Parafuso M6 x 20mm",
          unidade: "PC",
          quantidade: 100,
          quantidadeDevolvida: 0
        },
        {
          id: 2,
          descricao: "Porca M6",
          unidade: "PC",
          quantidade: 50,
          quantidadeDevolvida: 0
        },
        {
          id: 3,
          descricao: "Arruela Lisa M6",
          unidade: "PC",
          quantidade: 75,
          quantidadeDevolvida: 0
        }
      ]
    };
    setRequisicao(dadosRequisicao);
  }, [id]);

  const atualizarQuantidadeDevolvida = (itemId: number, quantidade: number) => {
    if (!requisicao) return;
    
    const novosItens = requisicao.itens.map(item => 
      item.id === itemId 
        ? { ...item, quantidadeDevolvida: Math.max(0, Math.min(quantidade, item.quantidade)) }
        : item
    );
    
    setRequisicao({ ...requisicao, itens: novosItens });
  };

  const salvarDevolucao = () => {
    const itensComDevolucao = requisicao?.itens.filter(item => item.quantidadeDevolvida > 0) || [];
    
    if (itensComDevolucao.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Informe pelo menos um item para devolução."
      });
      return;
    }

    toast({
      title: "Devolução processada",
      description: `Devolução da requisição ${requisicao?.id} processada com sucesso.`
    });
    
    navigate("/suprimentos/estoque/requisicoes/devolucao-materiais");
  };

  if (!requisicao) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/suprimentos/estoque/requisicoes/devolucao-materiais")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Processar Devolução</h1>
            <p className="text-muted-foreground">
              Requisição #{requisicao.id}
            </p>
          </div>
        </div>
        <Button onClick={salvarDevolucao}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Devolução
        </Button>
      </div>

      {/* Dados do Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Requisição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>CCA</Label>
              <Input value={requisicao.cca} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Requisitante</Label>
              <Input value={requisicao.requisitante} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input value={new Date(requisicao.data).toLocaleDateString("pt-BR")} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Almoxarifado</Label>
              <Input value={requisicao.almoxarifado} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Apropriação</Label>
              <Input value={requisicao.apropriacao} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Input value={requisicao.observacao} readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens da Requisição */}
      <Card>
        <CardHeader>
          <CardTitle>Itens da Requisição</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Qtd. Devolvida</TableHead>
                <TableHead>Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisicao.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.unidade}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max={item.quantidade}
                      value={item.quantidadeDevolvida}
                      onChange={(e) => atualizarQuantidadeDevolvida(item.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <span className={item.quantidade - item.quantidadeDevolvida < 0 ? "text-destructive" : ""}>
                      {item.quantidade - item.quantidadeDevolvida}
                    </span>
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
