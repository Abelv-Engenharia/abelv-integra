
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin } from "lucide-react";
import { useModelosInspecao } from "@/hooks/inspecao-sms/useModelosInspecao";

const CAMPOS_CABECALHO_LABELS: Record<string, string> = {
  cca: 'CCA',
  engenheiro_responsavel: 'Engenheiro Responsável',
  supervisor_responsavel: 'Supervisor Responsável',
  encarregado_responsavel: 'Encarregado Responsável',
  responsavel_inspecao: 'Responsável pela Inspeção',
  local: 'Local',
  data: 'Data',
  hora: 'Hora',
};

const InspecaoSMSCadastro = () => {
  const { modelos, isLoading } = useModelosInspecao();

  const handleIniciarInspecao = (modeloId: string) => {
    // TODO: Navegar para página de execução da inspeção
    console.log('Iniciar inspeção com modelo:', modeloId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Carregando modelos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cadastro de Inspeção SMS</h1>
        <p className="text-muted-foreground">
          Selecione um modelo de inspeção para iniciar
        </p>
      </div>

      {modelos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum modelo disponível</h3>
            <p className="text-muted-foreground">
              Entre em contato com o administrador para criar modelos de inspeção.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelos.map((modelo) => (
            <Card key={modelo.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{modelo.nome}</CardTitle>
                  <Badge variant="secondary">
                    {modelo.tipos_inspecao_sms?.nome}
                  </Badge>
                </div>
                {modelo.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {modelo.descricao}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Campos do Cabeçalho
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {modelo.campos_cabecalho.slice(0, 4).map((campo) => (
                      <Badge key={campo} variant="outline" className="text-xs">
                        {CAMPOS_CABECALHO_LABELS[campo] || campo}
                      </Badge>
                    ))}
                    {modelo.campos_cabecalho.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{modelo.campos_cabecalho.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Itens de Verificação
                  </h4>
                  <Badge variant="outline">
                    {modelo.itens_verificacao.length} itens para verificar
                  </Badge>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleIniciarInspecao(modelo.id)}
                >
                  Iniciar Inspeção
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspecaoSMSCadastro;
