import { ImportSummary as ImportSummaryType } from '@/types/githubImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, FileText, Route as RouteIcon, Menu, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ImportSummaryProps {
  summary: ImportSummaryType;
}

export function ImportSummary({ summary }: ImportSummaryProps) {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMenuDestinationLabel = () => {
    if (!summary.menuDestination) return 'Não configurado';
    
    if (summary.menuDestination.type === 'existing') {
      const labels: Record<string, string> = {
        'admin': 'Administração',
        'gestao-sms': 'Gestão SMS',
        'tarefas': 'Tarefas',
        'seguranca': 'Segurança',
        'apoio-geral': 'Apoio Geral',
        'suprimentos': 'Suprimentos',
        'engenharia-matricial': 'Engenharia Matricial',
        'comercial': 'Comercial',
      };
      return labels[summary.menuDestination.existingSection || ''] || 'Menu existente';
    }
    
    return summary.menuDestination.newSectionName || 'Novo menu';
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            Importação concluída!
          </h1>
          <p className="text-muted-foreground mt-2">
            Resumo da importação realizada em {formatDate(summary.timestamp)}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/importador-github')} variant="outline">
          Nova importação
        </Button>
      </div>

      {/* Resumo geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Arquivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.filesImported}</div>
            <p className="text-xs text-muted-foreground">
              arquivos importados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RouteIcon className="h-4 w-4" />
              Rotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.routesCreated.length}</div>
            <p className="text-xs text-muted-foreground">
              rotas criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.routesCreated.filter(r => r.addToMenu).length}</div>
            <p className="text-xs text-muted-foreground">
              itens de menu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes das rotas criadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Rotas criadas
          </CardTitle>
          <CardDescription>
            Páginas importadas e suas configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.routesCreated.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{route.title}</div>
                  <div className="text-sm text-muted-foreground">{route.path}</div>
                  {route.permission && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Permissão: {route.permission}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {route.addToMenu && (
                    <Badge variant="secondary">Menu</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(route.path)}
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Destino do menu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Destino do menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base py-2 px-4">
              {getMenuDestinationLabel()}
            </Badge>
            {summary.menuDestination?.type === 'new' && (
              <span className="text-sm text-muted-foreground">
                (novo menu criado)
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Arquivos salvos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Arquivos importados
          </CardTitle>
          <CardDescription>
            {summary.savedFiles.length} arquivos salvos no projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-auto space-y-2">
            {summary.savedFiles.map((file, index) => (
              <div key={index} className="text-sm p-2 bg-muted/50 rounded font-mono">
                {file.destination}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avisos */}
      {summary.warnings.length > 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Pendências
            </CardTitle>
            <CardDescription>
              Itens que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.warnings.map((warning, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="font-medium capitalize">{warning.category}</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {warning.items.filter(item => !item.checked).map((item, i) => (
                      <li key={i}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
