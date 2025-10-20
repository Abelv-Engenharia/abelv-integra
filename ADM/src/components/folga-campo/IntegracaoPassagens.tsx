import React, { useState, useEffect } from 'react';
import { Plane, ExternalLink, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Mock data mantendo formato das integrações BIZZTRIP/ONFLY
const mockIntegracoes = [
  {
    id: 1,
    colaborador: "João Silva Santos",
    folga_id: 1,
    fornecedor: "BIZZTRIP",
    status_solicitacao: "Solicitado",
    status_compra: "Aguardando",
    data_solicitacao: "2024-12-21T10:00:00Z",
    itinerario: {
      ida: { origem: "FOR", destino: "GRU", data: "2025-01-15", horario: "08:30" },
      volta: { origem: "GRU", destino: "FOR", data: "2025-01-17", horario: "20:45" }
    },
    // Dados que virão após compra via integração
    localizador: null,
    cia_aerea: null,
    custo_final: null,
    voucher_url: null,
    comprovante_url: null
  },
  {
    id: 2,
    colaborador: "Maria Costa Silva", 
    folga_id: 2,
    fornecedor: "ONFLY",
    status_solicitacao: "Confirmado",
    status_compra: "Emitido", 
    data_solicitacao: "2024-12-15T14:30:00Z",
    data_compra: "2024-12-16T09:15:00Z",
    itinerario: {
      ida: { origem: "REC", destino: "SDU", data: "2025-02-01", horario: "18:30" },
      volta: { origem: "SDU", destino: "REC", data: "2025-02-08", horario: "06:00" }
    },
    // Dados vindos da integração após compra
    localizador: "ABC123DEF",
    cia_aerea: "TAM",
    custo_final: "R$ 850,00",
    voucher_url: "/vouchers/maria-costa-abc123def.pdf",
    comprovante_url: "/comprovantes/maria-costa-abc123def.pdf"
  }
];

const IntegracaoPassagens = () => {
  const { toast } = useToast();
  const [integracoes, setIntegracoes] = useState(mockIntegracoes);
  const [sincronizando, setSincronizando] = useState(false);

  // Simular sincronização com BIZZTRIP/ONFLY (manter endpoints já mapeados)
  const sincronizarIntegracoes = async () => {
    setSincronizando(true);
    
    try {
      // Simular chamada para endpoints já configurados
      // Consumir dados conforme mapeamentos existentes (não sobrescrever)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sincronização concluída",
        description: "Dados atualizados das integrações BIZZTRIP/ONFLY"
      });
      
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Falha ao conectar com fornecedores de passagem",
        variant: "destructive"
      });
    } finally {
      setSincronizando(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      "Solicitado": { variant: "secondary", icon: Clock },
      "Aguardando": { variant: "secondary", icon: Clock },
      "Confirmado": { variant: "default", icon: CheckCircle },
      "Emitido": { variant: "default", icon: CheckCircle },
      "Cancelado": { variant: "destructive", icon: AlertCircle },
      "Alterado": { variant: "secondary", icon: RefreshCw }
    };
    
    const { variant, icon: Icon } = config[status] || { variant: "secondary", icon: Clock };
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const vincularAutomaticamente = (integracao) => {
    // Vincular dados da compra à folga automaticamente
    toast({
      title: "Dados vinculados",
      description: `Passagem de ${integracao.colaborador} vinculada automaticamente à folga`
    });
  };

  return (
    <div className="space-y-6">
      {/* Status das Integrações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BIZZTRIP</CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-green-600">Ativo</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Solicitações em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ONFLY</CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-green-600">Ativo</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Passagens emitidas hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Integração de Passagens
              </CardTitle>
              <CardDescription>
                Sincronização bidirecional com BIZZTRIP e ONFLY • Endpoints já mapeados
              </CardDescription>
            </div>
            <Button 
              onClick={sincronizarIntegracoes} 
              disabled={sincronizando}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
              {sincronizando ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          
          {/* Alerta de Configuração */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuração Preservada</AlertTitle>
            <AlertDescription>
              Mantendo mapeamentos e endpoints já configurados. Não sobrescrever parametrizações existentes 
              das integrações BIZZTRIP/ONFLY.
            </AlertDescription>
          </Alert>

          {/* Tabela de Integrações */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Itinerário</TableHead>
                <TableHead>Status Solicitação</TableHead>
                <TableHead>Status Compra</TableHead>
                <TableHead>Localizador</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integracoes.map((integracao) => (
                <TableRow key={integracao.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{integracao.colaborador}</p>
                      <p className="text-sm text-muted-foreground">
                        Folga #{integracao.folga_id}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <ExternalLink className="h-3 w-3" />
                      {integracao.fornecedor}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-mono text-xs">
                          {integracao.itinerario.ida.origem} → {integracao.itinerario.ida.destino}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(integracao.itinerario.ida.data).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-xs">
                          {integracao.itinerario.volta.origem} → {integracao.itinerario.volta.destino}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(integracao.itinerario.volta.data).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(integracao.status_solicitacao)}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(integracao.status_compra)}
                  </TableCell>
                  
                  <TableCell>
                    {integracao.localizador ? (
                      <div>
                        <p className="font-mono text-sm">{integracao.localizador}</p>
                        <p className="text-xs text-muted-foreground">{integracao.cia_aerea}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {integracao.custo_final ? (
                      <span className="font-medium">{integracao.custo_final}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      {integracao.status_compra === "Emitido" && (
                        <>
                          {integracao.voucher_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={integracao.voucher_url} target="_blank" rel="noopener noreferrer">
                                Voucher
                              </a>
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => vincularAutomaticamente(integracao)}
                          >
                            Vincular
                          </Button>
                        </>
                      )}
                      
                      {integracao.status_compra === "Aguardando" && (
                        <Button variant="outline" size="sm" disabled>
                          Aguardando
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log de Integrações */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Integrações</CardTitle>
          <CardDescription>
            Histórico de payloads e transações com fornecedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">ONFLY - Passagem emitida</p>
                <p className="text-xs text-muted-foreground">
                  ID Transação: TXN789ABC • Maria Costa Silva • R$ 850,00
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                há 2 horas
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">BIZZTRIP - Solicitação enviada</p>
                <p className="text-xs text-muted-foreground">
                  ID Transação: REQ456XYZ • João Silva Santos
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                há 4 horas
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegracaoPassagens;