import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Eye, FileText } from 'lucide-react';
import { GRD } from '@/types/document';
import { GRDPDFGenerator } from './GRDPDFGenerator';

interface GRDHistoryProps {
  grds: GRD[];
  onViewDetails: (grd: GRD) => void;
}

export function GRDHistory({ grds, onViewDetails }: GRDHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGRDs = grds.filter(grd =>
    grd.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grd.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grd.remetente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProvidenciasCount = (grd: GRD) => {
    const providencias = grd.providencias;
    const activeCount = Object.values(providencias).filter(value => 
      typeof value === 'boolean' ? value : false
    ).length;
    return activeCount;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de GRDs
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar GRDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredGRDs.length} GRD(s) encontrada(s)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número GRD</TableHead>
                <TableHead>Data Envio</TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead>Providências</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGRDs.map((grd) => (
                <TableRow key={grd.id}>
                  <TableCell className="font-mono font-semibold">{grd.numero}</TableCell>
                  <TableCell>{formatDate(grd.dataEnvio)}</TableCell>
                  <TableCell className="max-w-xs truncate">{grd.remetente}</TableCell>
                  <TableCell className="max-w-xs truncate">{grd.destinatario}</TableCell>
                  <TableCell className="font-mono">{grd.cca}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {grd.documentos.length} doc(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getProvidenciasCount(grd)} ativa(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(grd)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                      <GRDPDFGenerator grd={grd}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                      </GRDPDFGenerator>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredGRDs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhuma GRD encontrada para o termo pesquisado.' : 'Nenhuma GRD emitida ainda.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}