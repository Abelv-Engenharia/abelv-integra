
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useTiposInspecao } from "@/hooks/inspecao-sms/useTiposInspecao";
import { ModeloInspecao, ItemVerificacao } from "@/hooks/inspecao-sms/useModelosInspecao";

interface ModeloInspecaoFormProps {
  modelo?: ModeloInspecao;
  onSubmit: (modelo: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CAMPOS_CABECALHO_OPCOES = [
  { value: 'cca', label: 'CCA' },
  { value: 'engenheiro_responsavel', label: 'Engenheiro Responsável' },
  { value: 'supervisor_responsavel', label: 'Supervisor Responsável' },
  { value: 'encarregado_responsavel', label: 'Encarregado Responsável' },
  { value: 'responsavel_inspecao', label: 'Responsável pela Inspeção' },
  { value: 'local', label: 'Local' },
  { value: 'data', label: 'Data' },
  { value: 'hora', label: 'Hora' },
];

const ModeloInspecaoForm: React.FC<ModeloInspecaoFormProps> = ({
  modelo,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { tipos } = useTiposInspecao();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo_inspecao_id: '',
    campos_cabecalho: [] as string[],
    itens_verificacao: [] as ItemVerificacao[],
  });
  const [novoItem, setNovoItem] = useState('');
  const [categoriaNovoItem, setCategoriaNovoItem] = useState('');

  useEffect(() => {
    if (modelo) {
      setFormData({
        nome: modelo.nome,
        descricao: modelo.descricao || '',
        tipo_inspecao_id: modelo.tipo_inspecao_id,
        campos_cabecalho: modelo.campos_cabecalho,
        itens_verificacao: modelo.itens_verificacao,
      });
    }
  }, [modelo]);

  const handleCamposCabecalhoChange = (campo: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      campos_cabecalho: checked
        ? [...prev.campos_cabecalho, campo]
        : prev.campos_cabecalho.filter(c => c !== campo)
    }));
  };

  const adicionarItem = () => {
    if (novoItem.trim()) {
      const item: ItemVerificacao = {
        id: Date.now().toString(),
        descricao: novoItem.trim(),
        categoria: categoriaNovoItem.trim() || undefined,
      };
      setFormData(prev => ({
        ...prev,
        itens_verificacao: [...prev.itens_verificacao, item]
      }));
      setNovoItem('');
      setCategoriaNovoItem('');
    }
  };

  const removerItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      itens_verificacao: prev.itens_verificacao.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Modelo *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="tipo">Tipo de Inspeção *</Label>
          <Select 
            value={formData.tipo_inspecao_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_inspecao_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campos do Cabeçalho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CAMPOS_CABECALHO_OPCOES.map((campo) => (
              <div key={campo.value} className="flex items-center space-x-2">
                <Checkbox
                  id={campo.value}
                  checked={formData.campos_cabecalho.includes(campo.value)}
                  onCheckedChange={(checked) => handleCamposCabecalhoChange(campo.value, checked as boolean)}
                />
                <label htmlFor={campo.value} className="text-sm">
                  {campo.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens de Verificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Descrição do item"
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarItem())}
            />
            <Input
              placeholder="Categoria (opcional)"
              value={categoriaNovoItem}
              onChange={(e) => setCategoriaNovoItem(e.target.value)}
              className="w-40"
            />
            <Button type="button" onClick={adicionarItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.itens_verificacao.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <span>{item.descricao}</span>
                  {item.categoria && (
                    <Badge variant="secondary">{item.categoria}</Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {modelo ? 'Atualizar' : 'Criar'} Modelo
        </Button>
      </div>
    </form>
  );
};

export default ModeloInspecaoForm;
