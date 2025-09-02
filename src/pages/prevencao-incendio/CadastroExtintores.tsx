import { ArrowLeft, Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CadastroExtintores = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: '',
    capacidade: '',
    fabricante: '',
    dataFabricacao: '',
    dataVencimento: '',
    localizacao: '',
    observacoes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de salvamento
    console.log('Dados do extintor:', formData);
    // Simular sucesso
    alert('Extintor cadastrado com sucesso!');
    // Reset form
    setFormData({
      codigo: '',
      tipo: '',
      capacidade: '',
      fabricante: '',
      dataFabricacao: '',
      dataVencimento: '',
      localizacao: '',
      observacoes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Cadastro de Extintores</h1>
        <p className="text-muted-foreground">
          Registre novos extintores no sistema de prevenção contra incêndios
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Informações do Extintor
          </CardTitle>
          <CardDescription>
            Preencha os dados do extintor para cadastro no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código do Extintor *</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: EXT-001"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo do Extintor *</Label>
                <Select onValueChange={(value) => handleInputChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agua">Água</SelectItem>
                    <SelectItem value="po-quimico">Pó Químico</SelectItem>
                    <SelectItem value="co2">CO2</SelectItem>
                    <SelectItem value="espuma">Espuma</SelectItem>
                    <SelectItem value="gas-inerte">Gás Inerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidade">Capacidade *</Label>
                <Input
                  id="capacidade"
                  placeholder="Ex: 6kg, 4L"
                  value={formData.capacidade}
                  onChange={(e) => handleInputChange('capacidade', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabricante">Fabricante</Label>
                <Input
                  id="fabricante"
                  placeholder="Nome do fabricante"
                  value={formData.fabricante}
                  onChange={(e) => handleInputChange('fabricante', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                <Input
                  id="dataFabricacao"
                  type="date"
                  value={formData.dataFabricacao}
                  onChange={(e) => handleInputChange('dataFabricacao', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização *</Label>
              <Input
                id="localizacao"
                placeholder="Ex: Pavimento 1 - Corredor A"
                value={formData.localizacao}
                onChange={(e) => handleInputChange('localizacao', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o extintor..."
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Extintor
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/prevencao-incendio/dashboard')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroExtintores;