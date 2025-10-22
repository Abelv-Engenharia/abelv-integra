import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Document, DISCIPLINAS, TIPOS_DOCUMENTO, FORMATOS } from '@/types/document';

interface DocumentFormProps {
  document?: Document;
  onSubmit: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function DocumentForm({ document, onSubmit, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    numero: document?.numero || '',
    numeroAbelv: document?.numeroAbelv || '',
    titulo: document?.titulo || '',
    disciplina: document?.disciplina || '',
    tipo: document?.tipo || '',
    formato: document?.formato || '',
    versaoAtual: document?.versaoAtual || 'R00',
    dataRevisao: document?.dataRevisao || new Date().toISOString().split('T')[0],
    status: document?.status || 'elaboracao' as const,
    responsavelEmissao: document?.responsavelEmissao || '',
    responsavelRevisao: document?.responsavelRevisao || '',
    cliente: document?.cliente || '',
    projeto: document?.projeto || '',
    observacoes: document?.observacoes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {document ? 'Editar Documento' : 'Novo Documento'}
        </CardTitle>
        <CardDescription>
          Preencha as informações do documento para controle na Lista Mestra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Nº doc cliente *</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => updateField('numero', e.target.value)}
                placeholder="Ex: ENG-001-R00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroAbelv">Nº doc ABELV</Label>
              <Input
                id="numeroAbelv"
                value={formData.numeroAbelv}
                onChange={(e) => updateField('numeroAbelv', e.target.value)}
                placeholder="Ex: ABELV-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="versaoAtual">Versão Atual</Label>
              <Input
                id="versaoAtual"
                value={formData.versaoAtual}
                onChange={(e) => updateField('versaoAtual', e.target.value)}
                placeholder="Ex: R00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => updateField('titulo', e.target.value)}
              placeholder="Título do documento"
              required
            />
          </div>

          {/* Classificação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina *</Label>
              <Select value={formData.disciplina} onValueChange={(value) => updateField('disciplina', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {DISCIPLINAS.map((disciplina) => (
                    <SelectItem key={disciplina} value={disciplina}>
                      {disciplina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => updateField('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formato">Formato *</Label>
              <Select value={formData.formato} onValueChange={(value) => updateField('formato', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATOS.map((formato) => (
                    <SelectItem key={formato} value={formato}>
                      {formato}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elaboracao">Elaboração</SelectItem>
                  <SelectItem value="revisao">Revisão</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="obsoleto">Obsoleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRevisao">Data da Revisão</Label>
              <Input
                id="dataRevisao"
                type="date"
                value={formData.dataRevisao}
                onChange={(e) => updateField('dataRevisao', e.target.value)}
              />
            </div>
          </div>

          {/* Responsáveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavelEmissao">Responsável pela Emissão *</Label>
              <Input
                id="responsavelEmissao"
                value={formData.responsavelEmissao}
                onChange={(e) => updateField('responsavelEmissao', e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavelRevisao">Responsável pela Revisão</Label>
              <Input
                id="responsavelRevisao"
                value={formData.responsavelRevisao}
                onChange={(e) => updateField('responsavelRevisao', e.target.value)}
                placeholder="Nome do revisor"
              />
            </div>
          </div>

          {/* Projeto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => updateField('cliente', e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projeto">Projeto *</Label>
              <Input
                id="projeto"
                value={formData.projeto}
                onChange={(e) => updateField('projeto', e.target.value)}
                placeholder="Nome do projeto"
                required
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => updateField('observacoes', e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-gradient-primary">
              {document ? 'Atualizar' : 'Criar'} Documento
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}