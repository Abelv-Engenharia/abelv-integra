
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DesvioCompleto {
  id: string;
  data_desvio: string;
  responsavel_inspecao: string;
  descricao_desvio: string;
  status: string;
  classificacao_risco: string;
  ccas?: { codigo: string; nome: string };
  empresas?: { nome: string };
}

const LatestDesvios = () => {
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDesvios = async () => {
      try {
        const { data, error } = await supabase
          .from('desvios_completos')
          .select(`
            id,
            data_desvio,
            responsavel_inspecao,
            descricao_desvio,
            status,
            classificacao_risco,
            ccas:cca_id(codigo, nome),
            empresas:empresa_id(nome)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Erro ao buscar últimos desvios:', error);
          return;
        }

        setDesvios(data || []);
      } catch (error) {
        console.error('Erro ao buscar últimos desvios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDesvios();
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'TRIVIAL':
        return 'bg-green-100 text-green-800';
      case 'TOLERÁVEL':
        return 'bg-blue-100 text-blue-800';
      case 'MODERADO':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBSTANCIAL':
        return 'bg-orange-100 text-orange-800';
      case 'INTOLERÁVEL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aberto':
        return 'bg-red-100 text-red-800';
      case 'em andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'fechado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Últimos Desvios Registrados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {desvios.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum desvio encontrado
              </p>
            ) : (
              desvios.map((desvio) => (
                <div key={desvio.id} className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(desvio.data_desvio).toLocaleDateString('pt-BR')}
                        <MapPin className="h-4 w-4 ml-2" />
                        {desvio.responsavel_inspecao}
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {desvio.descricao_desvio}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {desvio.ccas && (
                          <span>{desvio.ccas.codigo} - {desvio.ccas.nome}</span>
                        )}
                        {desvio.empresas && (
                          <span>• {desvio.empresas.nome}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 ml-4">
                      <Badge className={`text-xs ${getStatusColor(desvio.status)}`}>
                        {desvio.status}
                      </Badge>
                      {desvio.classificacao_risco && (
                        <Badge className={`text-xs ${getRiskColor(desvio.classificacao_risco)}`}>
                          {desvio.classificacao_risco}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestDesvios;
