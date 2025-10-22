import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Document } from '@/types/document';
import { Edit, Search, Filter, Plus, FileText, Download, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface DocumentTableProps {
  documents: Document[];
  onEditDocument: (document: Document) => void;
  onNewDocument: () => void;
  onEmitGRD: () => void;
  selectedDocuments: string[];
  onSelectDocument: (documentId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function DocumentTable({ 
  documents, 
  onEditDocument, 
  onNewDocument, 
  onEmitGRD, 
  selectedDocuments, 
  onSelectDocument, 
  onSelectAll 
}: DocumentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [disciplinaFilter, setDisciplinaFilter] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.projeto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesDisciplina = disciplinaFilter === 'all' || doc.disciplina === disciplinaFilter;
    
    return matchesSearch && matchesStatus && matchesDisciplina;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'elaboracao': return 'elaboracao';
      case 'revisao': return 'revisao';
      case 'aprovado': return 'aprovado';
      case 'obsoleto': return 'obsoleto';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'elaboracao': return 'Elaboração';
      case 'revisao': return 'Revisão';
      case 'aprovado': return 'Aprovado';
      case 'obsoleto': return 'Obsoleto';
      default: return status;
    }
  };

  const uniqueDisciplinas = [...new Set(documents.map(doc => doc.disciplina))];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Lista Mestra de Documentos
            </CardTitle>
            <CardDescription>
              Controle e rastreabilidade de documentos de projeto
              {selectedDocuments.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedDocuments.length} selecionados)
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={onEmitGRD}
              disabled={selectedDocuments.length === 0}
              variant={selectedDocuments.length > 0 ? "default" : "outline"}
              className={selectedDocuments.length > 0 ? "bg-gradient-primary shadow-primary" : ""}
            >
              <Send className="h-4 w-4 mr-2" />
              Gerar GRD
              {selectedDocuments.length > 0 && (
                <span className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                  {selectedDocuments.length}
                </span>
              )}
            </Button>
            <Button onClick={onNewDocument} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por código, título, cliente ou projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="elaboracao">Elaboração</SelectItem>
              <SelectItem value="revisao">Revisão</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="obsoleto">Obsoleto</SelectItem>
            </SelectContent>
          </Select>

          <Select value={disciplinaFilter} onValueChange={setDisciplinaFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Disciplinas</SelectItem>
              {uniqueDisciplinas.map((disciplina) => (
                <SelectItem key={disciplina} value={disciplina}>
                  {disciplina}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredDocuments.length > 0 && filteredDocuments.every(doc => selectedDocuments.includes(doc.id))}
                    onCheckedChange={onSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead className="font-semibold">Nº doc cliente</TableHead>
                <TableHead className="font-semibold">Nº doc ABELV</TableHead>
                <TableHead className="font-semibold">Título</TableHead>
                <TableHead className="font-semibold">Disciplina</TableHead>
                <TableHead className="font-semibold">Revisão</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Última Atualização</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={(checked) => onSelectDocument(document.id, checked as boolean)}
                      aria-label={`Selecionar ${document.numero}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{document.numero}</TableCell>
                  <TableCell className="font-mono text-sm">{document.numeroAbelv || '-'}</TableCell>
                  <TableCell className="max-w-md truncate" title={document.titulo}>
                    {document.titulo}
                  </TableCell>
                  <TableCell>{document.disciplina}</TableCell>
                  <TableCell className="font-mono">{document.versaoAtual}</TableCell>
                  <TableCell>
                    <StatusBadge variant={getStatusVariant(document.status)} />
                  </TableCell>
                  <TableCell>{document.cliente}</TableCell>
                  <TableCell>{formatDate(document.dataRevisao)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditDocument(document)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhum documento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo */}
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div>
            Exibindo {filteredDocuments.length} de {documents.length} documentos
          </div>
          <div className="flex gap-4">
            <span>
              Aprovados: {documents.filter(d => d.status === 'aprovado').length}
            </span>
            <span>
              Em revisão: {documents.filter(d => d.status === 'revisao').length}
            </span>
            <span>
              Em elaboração: {documents.filter(d => d.status === 'elaboracao').length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}