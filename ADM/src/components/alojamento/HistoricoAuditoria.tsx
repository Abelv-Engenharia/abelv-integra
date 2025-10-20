import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoAuditoriaProps {
  analiseId: string;
}

export function HistoricoAuditoria({ analiseId }: HistoricoAuditoriaProps) {
  const { data: aprovacoes, isLoading } = useQuery({
    queryKey: ['aprovacoes', analiseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aprovacoes_analise')
        .select('*')
        .eq('analise_id', analiseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Carregando histórico...</div>;
  }

  if (!aprovacoes || aprovacoes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico De Aprovações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aprovacoes.map((aprovacao) => (
            <div
              key={aprovacao.id}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="mt-1">
                {aprovacao.acao === 'aprovar' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={aprovacao.acao === 'aprovar' ? 'default' : 'destructive'}
                  >
                    {aprovacao.acao === 'aprovar' ? 'Aprovado' : 'Reprovado'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {aprovacao.bloco.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm font-medium">{aprovacao.aprovador}</p>
                {aprovacao.comentario && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {aprovacao.comentario}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(aprovacao.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
