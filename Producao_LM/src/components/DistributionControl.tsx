import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Send, Eye, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type DistributionStatus = 'enviado' | 'recebido' | 'confirmado';

interface Distribution {
  id: string;
  document_id: string;
  grd_id?: string;
  destinatario: string;
  email_destinatario?: string;
  data_envio: string;
  data_recebimento?: string;
  status: DistributionStatus;
  observacoes?: string;
  token_confirmacao: string;
  documents?: {
    numero: string;
    titulo: string;
  };
}

interface DistributionControlProps {
  documentId?: string;
}

export function DistributionControl({ documentId }: DistributionControlProps) {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewDistribution, setShowNewDistribution] = useState(false);
  const [newDistribution, setNewDistribution] = useState({
    destinatario: '',
    email_destinatario: '',
    observacoes: ''
  });
  const { toast } = useToast();

  const fetchDistributions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('distributions')
        .select(`
          *,
          documents (
            numero,
            titulo
          )
        `)
        .order('data_envio', { ascending: false });

      if (documentId) {
        query = query.eq('document_id', documentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDistributions((data || []) as Distribution[]);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar distribuições",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDistribution = async () => {
    if (!documentId || !newDistribution.destinatario) {
      toast({
        title: "Dados incompletos",
        description: "Document ID e destinatário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('distributions')
        .insert([{
          document_id: documentId,
          destinatario: newDistribution.destinatario,
          email_destinatario: newDistribution.email_destinatario || null,
          observacoes: newDistribution.observacoes || null
        }]);

      if (error) throw error;

      await fetchDistributions();
      setShowNewDistribution(false);
      setNewDistribution({
        destinatario: '',
        email_destinatario: '',
        observacoes: ''
      });

      toast({
        title: "Distribuição criada",
        description: "A distribuição foi registrada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar distribuição",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateDistributionStatus = async (id: string, newStatus: 'recebido' | 'confirmado') => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'recebido' || newStatus === 'confirmado') {
        updates.data_recebimento = new Date().toISOString();
      }

      const { error } = await supabase
        .from('distributions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchDistributions();
      toast({
        title: "Status atualizado",
        description: `Distribuição marcada como ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviado':
        return <Clock className="h-4 w-4" />;
      case 'recebido':
        return <Eye className="h-4 w-4" />;
      case 'confirmado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'secondary';
      case 'recebido':
        return 'default';
      case 'confirmado':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'text-warning';
      case 'recebido':
        return 'text-info';
      case 'confirmado':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredDistributions = distributions.filter(dist => {
    const matchesSearch = !searchTerm || 
      dist.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.documents?.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.documents?.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || dist.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchDistributions();
  }, [documentId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Controle de Distribuição
            </CardTitle>
            <CardDescription>
              Gerencie e acompanhe as distribuições de documentos para destinatários
            </CardDescription>
          </div>
          {documentId && (
            <Dialog open={showNewDistribution} onOpenChange={setShowNewDistribution}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Distribuição
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Distribuição</DialogTitle>
                  <DialogDescription>
                    Registre uma nova distribuição deste documento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="destinatario">Destinatário *</Label>
                    <Input
                      id="destinatario"
                      value={newDistribution.destinatario}
                      onChange={(e) => setNewDistribution(prev => ({ ...prev, destinatario: e.target.value }))}
                      placeholder="Nome do destinatário"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDistribution.email_destinatario}
                      onChange={(e) => setNewDistribution(prev => ({ ...prev, email_destinatario: e.target.value }))}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={newDistribution.observacoes}
                      onChange={(e) => setNewDistribution(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Observações sobre a distribuição"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewDistribution(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={createDistribution}>
                      Criar Distribuição
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por destinatário ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="recebido">Recebido</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-xl font-bold">{distributions.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <p className="text-xl font-bold text-warning">
              {distributions.filter(d => d.status === 'enviado').length}
            </p>
            <p className="text-sm text-muted-foreground">Enviados</p>
          </div>
          <div className="text-center p-3 bg-info/10 rounded-lg">
            <p className="text-xl font-bold text-info">
              {distributions.filter(d => d.status === 'recebido').length}
            </p>
            <p className="text-sm text-muted-foreground">Recebidos</p>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <p className="text-xl font-bold text-success">
              {distributions.filter(d => d.status === 'confirmado').length}
            </p>
            <p className="text-sm text-muted-foreground">Confirmados</p>
          </div>
        </div>

        {/* Distributions Table */}
        <div className="border rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Carregando distribuições...</p>
            </div>
          ) : filteredDistributions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                {distributions.length === 0 
                  ? "Nenhuma distribuição encontrada" 
                  : "Nenhuma distribuição corresponde aos filtros"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {!documentId && <TableHead>Documento</TableHead>}
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Data Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Recebimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributions.map((distribution) => (
                  <TableRow key={distribution.id}>
                    {!documentId && (
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{distribution.documents?.numero}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-32">
                            {distribution.documents?.titulo}
                          </p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div>
                        <p className="font-medium">{distribution.destinatario}</p>
                        {distribution.email_destinatario && (
                          <p className="text-xs text-muted-foreground">
                            {distribution.email_destinatario}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(distribution.data_envio)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(distribution.status)} className="gap-1">
                        <span className={getStatusColor(distribution.status)}>
                          {getStatusIcon(distribution.status)}
                        </span>
                        {distribution.status.charAt(0).toUpperCase() + distribution.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {distribution.data_recebimento 
                        ? formatDate(distribution.data_recebimento)
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {distribution.status === 'enviado' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateDistributionStatus(distribution.id, 'recebido')}
                          >
                            Marcar Recebido
                          </Button>
                        )}
                        {distribution.status === 'recebido' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateDistributionStatus(distribution.id, 'confirmado')}
                          >
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Show results count */}
        {!loading && distributions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredDistributions.length} de {distributions.length} distribuições
          </div>
        )}
      </CardContent>
    </Card>
  );
}