import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, TrendingUp, Clock, CheckCircle, Send } from "lucide-react";

interface DashboardTabProps {
  onEditarContrato: (contrato: any) => void;
}

export function DashboardTab({ onEditarContrato }: DashboardTabProps) {
  const [obraFiltro, setObraFiltro] = useState<string>("todos");

  // Query principal de contratos
  const { data: contratos, isLoading } = useQuery({
    queryKey: ['analises-por-obra', obraFiltro],
    queryFn: async () => {
      let query = supabase
        .from('analises_contratuais')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (obraFiltro && obraFiltro !== 'todos') {
        query = query.eq('cca_codigo', obraFiltro);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Query de obras disponíveis
  const { data: obrasDisponiveis } = useQuery({
    queryKey: ['obras-disponiveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analises_contratuais')
        .select('cca_codigo')
        .not('cca_codigo', 'is', null);
      
      if (error) throw error;
      
      // Remover duplicatas baseado no código CCA
      const obrasUnicas = [...new Set(data?.map(item => item.cca_codigo))];
      
      return obrasUnicas;
    },
  });

  // Calcular estatísticas por obra
  const calcularEstatisticasPorObra = () => {
    if (!contratos) return null;

    const stats = {
      emAnalise: contratos.filter(c => 
        ['em_analise', 'pendente_ajustes'].includes(c.status_geral)
      ).length,
      aprovados: contratos.filter(c => 
        c.status_financeiro === 'aprovado' && 
        c.status_adm === 'aprovado' && 
        c.status_super === 'aprovado'
      ).length,
      pendentes: contratos.filter(c => 
        c.status_financeiro === 'pendente' || 
        c.status_adm === 'pendente' || 
        c.status_super === 'pendente'
      ).length,
      enviados: contratos.filter(c => c.data_envio_validacao).length,
      total: contratos.length,
    };

    return stats;
  };

  const stats = calcularEstatisticasPorObra();

  // Renderizar badges de status
  const getBadgeStatus = (status: string, validadoPor?: string) => {
    if (status === 'aprovado') {
      return (
        <Badge className="bg-green-500 text-white">
          ✅ {validadoPor || 'Aprovado'}
        </Badge>
      );
    }
    if (status === 'reprovado') {
      return <Badge variant="destructive">❌ Reprovado</Badge>;
    }
    if (status === 'pendente') {
      return <Badge variant="outline" className="text-gray-500">⏳ Pendente</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">🟡 Em Análise</Badge>;
  };

  const getBadgeStatusGeral = (status: string) => {
    const configs: Record<string, { color: string; icon: string; label: string }> = {
      'em_analise': { color: 'bg-yellow-100 text-yellow-700', icon: '🟡', label: 'Em Análise' },
      'pronto_para_envio': { color: 'bg-green-100 text-green-700', icon: '🟢', label: 'Pronto' },
      'pendente_ajustes': { color: 'bg-orange-100 text-orange-700', icon: '🟠', label: 'Ajustes' },
      'reprovado': { color: 'bg-red-100 text-red-700', icon: '🔴', label: 'Reprovado' },
    };
    
    const config = configs[status] || configs['em_analise'];
    
    return (
      <Badge className={config.color}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Em Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emAnalise}</div>
              <p className="text-xs text-muted-foreground">
                {obraFiltro === 'todos' ? 'Todas as obras' : obraFiltro}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
              <p className="text-xs text-muted-foreground">Todas validações OK</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando validação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.enviados}</div>
              <p className="text-xs text-muted-foreground">Para aprovação</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtro de Obra */}
      <div className="flex items-center gap-4">
        <Label>Filtrar Por Obra:</Label>
        <Select value={obraFiltro} onValueChange={setObraFiltro}>
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">📊 Todas as Obras</SelectItem>
            {obrasDisponiveis?.map(obra => (
              <SelectItem key={obra} value={obra}>
                🏗️ {obra}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : !contratos || contratos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum contrato encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Contrato</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Status Geral</TableHead>
                  <TableHead>💰 Financeiro</TableHead>
                  <TableHead>📋 Adm</TableHead>
                  <TableHead>🏢 Superintendência</TableHead>
                  <TableHead>📤 Enviado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratos.map(contrato => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-medium">
                      {contrato.numero_contrato}
                    </TableCell>
                    <TableCell>{contrato.fornecedor_nome}</TableCell>
                    <TableCell>
                      {contrato.cca_codigo || '-'}
                    </TableCell>
                    <TableCell>
                      {getBadgeStatusGeral(contrato.status_geral)}
                    </TableCell>
                    <TableCell>
                      {getBadgeStatus(
                        contrato.status_financeiro, 
                        contrato.validado_financeiro_por
                      )}
                    </TableCell>
                    <TableCell>
                      {getBadgeStatus(
                        contrato.status_adm, 
                        contrato.validado_adm_por
                      )}
                    </TableCell>
                    <TableCell>
                      {getBadgeStatus(
                        contrato.status_super, 
                        contrato.validado_super_por
                      )}
                    </TableCell>
                    <TableCell>
                      {contrato.data_envio_validacao ? (
                        <Badge className="bg-blue-500 text-white">
                          {new Date(contrato.data_envio_validacao).toLocaleDateString('pt-BR')}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onEditarContrato(contrato)}
                      >
                        Ver/Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
