import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockFornecedores = [
  {
    id: "1",
    fornecedor: "Transportadora São Paulo Ltda",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    contato: "(11) 99999-9999 / contato@transporte.com",
    tipos_transporte: ["Ônibus", "Van"],
    capacidade: 40,
    valor_base: 150.00,
    contrato: "CT-2024-001",
    vigencia_inicio: "2024-01-01",
    vigencia_fim: "2024-12-31",
    ccas: ["24043", "24044"],
    status: "ativo"
  },
  {
    id: "2", 
    fornecedor: "Van Express Transportes",
    cnpj: "98.765.432/0001-10",
    endereco: "Av. Central, 456 - Guarulhos/SP",
    contato: "(11) 88888-8888 / admin@vanexpress.com",
    tipos_transporte: ["Van", "Carro"],
    capacidade: 15,
    valor_base: 80.00,
    contrato: "CT-2024-002",
    vigencia_inicio: "2024-02-01",
    vigencia_fim: "2024-12-31",
    ccas: ["24045"],
    status: "ativo"
  }
];

export default function CadastroFornecedores() {
  const [fornecedores] = useState(mockFornecedores);
  const [novoFornecedor, setNovoFornecedor] = useState({
    fornecedor: "",
    cnpj: "",
    endereco: "",
    contato: "",
    tipos_transporte: [] as string[],
    capacidade: "",
    valor_base: "",
    contrato: "",
    vigencia_inicio: "",
    vigencia_fim: "",
    ccas: [] as string[],
    observacoes: ""
  });
  const { toast } = useToast();

  const handleSalvar = () => {
    if (!novoFornecedor.fornecedor || !novoFornecedor.cnpj) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Fornecedor cadastrado com sucesso"
    });
    
    // Reset form
    setNovoFornecedor({
      fornecedor: "",
      cnpj: "",
      endereco: "",
      contato: "",
      tipos_transporte: [],
      capacidade: "",
      valor_base: "",
      contrato: "",
      vigencia_inicio: "",
      vigencia_fim: "",
      ccas: [],
      observacoes: ""
    });
  };

  const getStatusBadge = (status: string) => {
    return status === "ativo" 
      ? <Badge variant="default">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Fornecedores</h1>
          <p className="text-muted-foreground">Cadastrar e manter a base de fornecedores de transporte por obra/projeto</p>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Fornecedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input 
                id="fornecedor"
                value={novoFornecedor.fornecedor}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, fornecedor: e.target.value})}
                placeholder="Nome do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input 
                id="cnpj"
                value={novoFornecedor.cnpj}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo *</Label>
              <Input 
                id="endereco"
                value={novoFornecedor.endereco}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, endereco: e.target.value})}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Contato *</Label>
              <Input 
                id="contato"
                value={novoFornecedor.contato}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, contato: e.target.value})}
                placeholder="Telefone/WhatsApp/E-mail"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipos">Tipos de Transporte *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onibus">Ônibus</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="carro">Carro</SelectItem>
                  <SelectItem value="translado">Translado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade por Viagem</Label>
              <Input 
                id="capacidade"
                type="number"
                value={novoFornecedor.capacidade}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, capacidade: e.target.value})}
                placeholder="Número de passageiros"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor Base por Viagem</Label>
              <Input 
                id="valor"
                type="number"
                step="0.01"
                value={novoFornecedor.valor_base}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, valor_base: e.target.value})}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato Vinculado *</Label>
              <Input 
                id="contrato"
                value={novoFornecedor.contrato}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, contrato: e.target.value})}
                placeholder="Número do contrato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inicio">Vigência Início *</Label>
              <Input 
                id="inicio"
                type="date"
                value={novoFornecedor.vigencia_inicio}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, vigencia_inicio: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fim">Vigência Fim *</Label>
              <Input 
                id="fim"
                type="date"
                value={novoFornecedor.vigencia_fim}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, vigencia_fim: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ccas">Obras/CCAs Atendidos *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione as obras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes"
                value={novoFornecedor.observacoes}
                onChange={(e) => setNovoFornecedor({...novoFornecedor, observacoes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSalvar}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Fornecedor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Fornecedores Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Tipos de Transporte</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Valor Base</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell className="font-medium">{fornecedor.fornecedor}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {fornecedor.tipos_transporte.map((tipo, index) => (
                        <Badge key={index} variant="outline">{tipo}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{fornecedor.capacidade}</TableCell>
                  <TableCell>R$ {fornecedor.valor_base.toFixed(2)}</TableCell>
                  <TableCell>{fornecedor.vigencia_inicio} - {fornecedor.vigencia_fim}</TableCell>
                  <TableCell>{getStatusBadge(fornecedor.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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