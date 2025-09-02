import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Shield, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

const AtualizarPerfisPage = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const { toast } = useToast();

  const atualizarPerfis = async () => {
    setLoading(true);
    setResultado(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('atualizar-perfis-sistema');
      
      if (error) {
        throw error;
      }
      
      setResultado(data);
      
      if (data.success) {
        toast({
          title: "Perfis atualizados com sucesso",
          description: `${data.total} perfis foram atualizados com as novas permissões.`,
        });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfis:', error);
      toast({
        title: "Erro ao atualizar perfis",
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Atualização do Sistema de Perfis</h1>
        <p className="text-muted-foreground">
          Atualize todos os perfis existentes com as novas funcionalidades e permissões
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Atualizar Sistema de Permissões
          </CardTitle>
          <CardDescription>
            Esta ação irá atualizar todos os perfis existentes para incluir:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Módulo de Prevenção de Incêndio</li>
              <li>Novos menus do IDSMS</li>
              <li>Funcionalidades adicionais do GRO</li>
              <li>Relatórios expandidos</li>
              <li>Outras funcionalidades do sistema</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={atualizarPerfis} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Atualizando Perfis...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Atualizar Todos os Perfis
              </>
            )}
          </Button>

          {resultado && (
            <Card className={resultado.success ? "border-green-200" : "border-red-200"}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${resultado.success ? "text-green-700" : "text-red-700"}`}>
                  {resultado.success ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Atualização Concluída
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5" />
                      Erro na Atualização
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultado.success ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">
                      {resultado.message}
                    </p>
                    <p className="text-sm">
                      Total de perfis atualizados: <strong>{resultado.total}</strong>
                    </p>
                    {resultado.perfisAtualizados && resultado.perfisAtualizados.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Perfis atualizados:</p>
                        <ul className="text-sm text-muted-foreground ml-4 mt-1">
                          {resultado.perfisAtualizados.map((nome: string, index: number) => (
                            <li key={index}>• {nome}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    {resultado.error}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Backup:</strong> Recomenda-se fazer um backup dos dados antes de executar esta atualização.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Segurança:</strong> Apenas perfis que já possuem acesso ao SMS receberão as novas permissões.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Reversível:</strong> As permissões podem ser ajustadas individualmente após a atualização.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtualizarPerfisPage;