import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Document, GRD, GRDDocument } from '@/types/document';

interface GRDFormProps {
  selectedDocuments: Document[];
  onSubmit: (grdData: Omit<GRD, 'id' | 'numero' | 'createdAt'>) => GRD;
  onCancel: () => void;
  onGeneratePDF: (grd: GRD) => void;
}

export function GRDForm({ selectedDocuments, onSubmit, onCancel, onGeneratePDF }: GRDFormProps) {
  const [formData, setFormData] = useState({
    cca: '',
    folha: '01/01',
    dataEnvio: new Date().toISOString().split('T')[0],
    remetente: '',
    destinatario: '',
    observacoes: '',
    providencias: {
      aprovar: false,
      arquivar: false,
      assinatura: false,
      comentar: false,
      devolver: false,
      informacao: false,
      revisar: false,
      liberadoConstrucao: false,
      liberadoDetalhamento: false,
      liberadoComentarios: false,
      liberadoRevisao: false,
      emitirParecer: false,
      outros: ''
    }
  });

  const [grdDocuments, setGRDDocuments] = useState<GRDDocument[]>(
    selectedDocuments.map(doc => ({
      documentId: doc.id,
      discriminacao: doc.titulo,
      revisao: doc.versaoAtual,
      numeroFolhas: 1,
      numeroCopias: 1,
      tipoVia: 'O' as const
    }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const grdData: Omit<GRD, 'id' | 'numero' | 'createdAt'> = {
      ...formData,
      documentos: grdDocuments
    };

    const newGRD = onSubmit(grdData);
    onGeneratePDF(newGRD);
  };

  const updateGRDDocument = (index: number, field: keyof GRDDocument, value: any) => {
    setGRDDocuments(prev => 
      prev.map((doc, i) => 
        i === index ? { ...doc, [field]: value } : doc
      )
    );
  };

  const updateProvidencia = (field: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      providencias: {
        ...prev.providencias,
        [field]: value
      }
    }));
  };

  const getTipoViaLabel = (tipo: string) => {
    const labels = {
      'O': 'Original',
      'C': 'Cópia',
      'M': 'Meio Magnético',
      'W': 'Outros'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nova GRD - Guia de Remessa de Documentos
          </h1>
          <p className="text-muted-foreground">
            {selectedDocuments.length} documento(s) selecionado(s)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados da GRD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados da GRD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cca">CCA *</Label>
                <Input
                  id="cca"
                  value={formData.cca}
                  onChange={(e) => setFormData(prev => ({ ...prev, cca: e.target.value }))}
                  placeholder="00.000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="folha">Folha</Label>
                <Input
                  id="folha"
                  value={formData.folha}
                  onChange={(e) => setFormData(prev => ({ ...prev, folha: e.target.value }))}
                  placeholder="01/01"
                />
              </div>
              <div>
                <Label htmlFor="dataEnvio">Data de Envio *</Label>
                <Input
                  id="dataEnvio"
                  type="date"
                  value={formData.dataEnvio}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataEnvio: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="remetente">DE (Remetente) *</Label>
                <Input
                  id="remetente"
                  value={formData.remetente}
                  onChange={(e) => setFormData(prev => ({ ...prev, remetente: e.target.value }))}
                  placeholder="Nome do remetente"
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinatario">PARA (Destinatário) *</Label>
                <Input
                  id="destinatario"
                  value={formData.destinatario}
                  onChange={(e) => setFormData(prev => ({ ...prev, destinatario: e.target.value }))}
                  placeholder="Nome do destinatário"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Discriminação dos Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Discriminação dos Documentos</TableHead>
                  <TableHead>Revisão</TableHead>
                  <TableHead>Nº Folhas</TableHead>
                  <TableHead>Nº Cópias</TableHead>
                  <TableHead>TV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grdDocuments.map((doc, index) => (
                  <TableRow key={doc.documentId}>
                    <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                    <TableCell className="max-w-md">{doc.discriminacao}</TableCell>
                    <TableCell>
                      <Input
                        value={doc.revisao}
                        onChange={(e) => updateGRDDocument(index, 'revisao', e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={doc.numeroFolhas}
                        onChange={(e) => updateGRDDocument(index, 'numeroFolhas', parseInt(e.target.value) || 1)}
                        className="w-20"
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={doc.numeroCopias}
                        onChange={(e) => updateGRDDocument(index, 'numeroCopias', parseInt(e.target.value) || 1)}
                        className="w-20"
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={doc.tipoVia}
                        onValueChange={(value) => updateGRDDocument(index, 'tipoVia', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="O">O</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="W">W</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>TV = TIPO DE VIA:</strong></p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <span>O - Original</span>
                <span>C - Cópia</span>
                <span>M - Meio Magnético</span>
                <span>W - Outros</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Providências */}
        <Card>
          <CardHeader>
            <CardTitle>Providências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aprovar"
                    checked={formData.providencias.aprovar}
                    onCheckedChange={(checked) => updateProvidencia('aprovar', checked as boolean)}
                  />
                  <Label htmlFor="aprovar">Aprovar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="arquivar"
                    checked={formData.providencias.arquivar}
                    onCheckedChange={(checked) => updateProvidencia('arquivar', checked as boolean)}
                  />
                  <Label htmlFor="arquivar">Arquivar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assinatura"
                    checked={formData.providencias.assinatura}
                    onCheckedChange={(checked) => updateProvidencia('assinatura', checked as boolean)}
                  />
                  <Label htmlFor="assinatura">Assinatura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comentar"
                    checked={formData.providencias.comentar}
                    onCheckedChange={(checked) => updateProvidencia('comentar', checked as boolean)}
                  />
                  <Label htmlFor="comentar">Comentar</Label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="devolver"
                    checked={formData.providencias.devolver}
                    onCheckedChange={(checked) => updateProvidencia('devolver', checked as boolean)}
                  />
                  <Label htmlFor="devolver">Devolver</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="informacao"
                    checked={formData.providencias.informacao}
                    onCheckedChange={(checked) => updateProvidencia('informacao', checked as boolean)}
                  />
                  <Label htmlFor="informacao">Informação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="revisar"
                    checked={formData.providencias.revisar}
                    onCheckedChange={(checked) => updateProvidencia('revisar', checked as boolean)}
                  />
                  <Label htmlFor="revisar">Revisar</Label>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-sm">PROJETOS:</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liberadoConstrucao"
                    checked={formData.providencias.liberadoConstrucao}
                    onCheckedChange={(checked) => updateProvidencia('liberadoConstrucao', checked as boolean)}
                  />
                  <Label htmlFor="liberadoConstrucao" className="text-xs">Liberado para Construção</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liberadoDetalhamento"
                    checked={formData.providencias.liberadoDetalhamento}
                    onCheckedChange={(checked) => updateProvidencia('liberadoDetalhamento', checked as boolean)}
                  />
                  <Label htmlFor="liberadoDetalhamento" className="text-xs">Liberado para Detalhamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liberadoComentarios"
                    checked={formData.providencias.liberadoComentarios}
                    onCheckedChange={(checked) => updateProvidencia('liberadoComentarios', checked as boolean)}
                  />
                  <Label htmlFor="liberadoComentarios" className="text-xs">Liberado para Comentários</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liberadoRevisao"
                    checked={formData.providencias.liberadoRevisao}
                    onCheckedChange={(checked) => updateProvidencia('liberadoRevisao', checked as boolean)}
                  />
                  <Label htmlFor="liberadoRevisao" className="text-xs">Liberado para Revisão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emitirParecer"
                    checked={formData.providencias.emitirParecer}
                    onCheckedChange={(checked) => updateProvidencia('emitirParecer', checked as boolean)}
                  />
                  <Label htmlFor="emitirParecer" className="text-xs">Emitir Parecer Técnico</Label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="outrosProvidencias">Outros</Label>
              <Input
                id="outrosProvidencias"
                value={formData.providencias.outros}
                onChange={(e) => updateProvidencia('outros', e.target.value)}
                placeholder="Outras providências..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Gerar GRD
          </Button>
        </div>
      </form>
    </div>
  );
}