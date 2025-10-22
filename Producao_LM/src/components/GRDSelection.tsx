import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import { Document } from '@/types/document';

interface GRDSelectionProps {
  documents: Document[];
  onProceed: (selectedDocuments: Document[]) => void;
  onCancel: () => void;
}

export function GRDSelection({ documents, onProceed, onCancel }: GRDSelectionProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleProceed = () => {
    const selected = documents.filter(doc => selectedDocuments.includes(doc.id));
    onProceed(selected);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isAllSelected = filteredDocuments.length > 0 && 
    filteredDocuments.every(doc => selectedDocuments.includes(doc.id));
  const isSomeSelected = selectedDocuments.length > 0 && 
    filteredDocuments.some(doc => selectedDocuments.includes(doc.id));

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
            Seleção de Documentos para GRD
          </h1>
          <p className="text-muted-foreground">
            Selecione os documentos que serão incluídos na Guia de Remessa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Disponíveis
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedDocuments.length} de {filteredDocuments.length} selecionados
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Revisão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={(checked) => handleSelectDocument(document.id, checked as boolean)}
                      aria-label={`Selecionar ${document.numero}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{document.numero}</TableCell>
                  <TableCell className="max-w-md truncate">{document.titulo}</TableCell>
                  <TableCell>{document.disciplina}</TableCell>
                  <TableCell className="font-mono">{document.versaoAtual}</TableCell>
                  <TableCell>
                    <StatusBadge variant={document.status as 'elaboracao' | 'revisao' | 'aprovado' | 'obsoleto'} />
                  </TableCell>
                  <TableCell>{document.cliente}</TableCell>
                  <TableCell>{formatDate(document.dataRevisao)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum documento encontrado para o termo pesquisado.' : 'Nenhum documento disponível.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo e Ações */}
      {selectedDocuments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Documentos Selecionados</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDocuments.length} documento(s) será(ão) incluído(s) na GRD
                </p>
              </div>
              <Button onClick={handleProceed} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Prosseguir com GRD
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}