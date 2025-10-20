import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, ArrowLeft, Upload, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TemplateDocumento {
  id: string;
  tipo_documento: string;
  nome_exibicao: string;
  categoria: string;
  obrigatorio_padrao: boolean;
  prazo_dias: number;
  condicional: boolean;
  condicao_tipo: string | null;
  condicao_valores: any;
  upload_multiplo: boolean;
  instrucoes: string | null;
  visivel_candidato: boolean;
  formato_aceito: string;
}

interface DocumentoStatus {
  tipo_documento: string;
  nome: string;
  categoria: string;
  obrigatorio: boolean;
  prazo_dias: number;
  data_limite: string;
  status: 'em_dia' | 'pendente' | 'em_atraso' | 'nao_se_aplica';
  arquivos: number;
  instrucoes: string;
  formato_aceito: string;
}

export default function ChecklistColaboradorDinamico() {
  const { validacaoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [documentos, setDocumentos] = useState<DocumentoStatus[]>([]);
  const [colaborador, setColaborador] = useState<any>(null);

  useEffect(() => {
    carregarDados();
  }, [validacaoId]);

  const carregarDados = async () => {
    if (!validacaoId) return;

    try {
      setLoading(true);

      // Carregar dados do colaborador
      const { data: validacao, error: errorValidacao } = await supabase
        .from('validacao_admissao')
        .select('*')
        .eq('id', validacaoId)
        .single();

      if (errorValidacao) throw errorValidacao;
      setColaborador(validacao);

      // Carregar templates de documentos
      const { data: templates, error: errorTemplates } = await supabase
        .from('checklist_documentos_template')
        .select('*')
        .order('categoria', { ascending: true })
        .order('prazo_dias', { ascending: true });

      if (errorTemplates) throw errorTemplates;

      // Carregar documentos já enviados
      const { data: enviados, error: errorEnviados } = await supabase
        .from('documentos_enviados')
        .select('*')
        .eq('validacao_admissao_id', validacaoId);

      if (errorEnviados) throw errorEnviados;

      // Processar documentos aplicando lógica condicional
      const docsProcessados = templates
        .filter(template => aplicarCondicao(template, validacao))
        .map(template => {
          const dataLimite = calcularDataLimite(validacao.data_admissao || validacao.created_at, template.prazo_dias);
          const arquivosDoc = enviados?.filter(e => e.tipo_documento === template.tipo_documento) || [];
          const status = calcularStatus(dataLimite, arquivosDoc.length > 0);

          return {
            tipo_documento: template.tipo_documento,
            nome: template.nome_exibicao,
            categoria: template.categoria,
            obrigatorio: template.obrigatorio_padrao,
            prazo_dias: template.prazo_dias,
            data_limite: dataLimite,
            status,
            arquivos: arquivosDoc.length,
            instrucoes: template.instrucoes || '',
            formato_aceito: template.formato_aceito
          };
        });

      setDocumentos(docsProcessados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar checklist",
        description: "Não foi possível carregar os documentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const aplicarCondicao = (template: TemplateDocumento, validacao: any): boolean => {
    if (!template.condicional) return true;

    const valores = template.condicao_valores;
    
    switch (template.condicao_tipo) {
      case 'estado_civil':
        return valores.includes(validacao.estado_civil);
      case 'tem_dependentes':
        return valores.includes(true);  // Ajustar conforme campo real
      case 'funcao':
        return valores.includes(validacao.funcao);
      case 'prorrogacao_existente':
        return valores.includes(true);  // Ajustar conforme campo real
      default:
        return true;
    }
  };

  const calcularDataLimite = (dataBase: string, diasPrazo: number): string => {
    const data = new Date(dataBase);
    data.setDate(data.getDate() + diasPrazo);
    return data.toISOString().split('T')[0];
  };

  const calcularStatus = (dataLimite: string, temArquivo: boolean): 'em_dia' | 'pendente' | 'em_atraso' | 'nao_se_aplica' => {
    if (temArquivo) return 'em_dia';
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(dataLimite);
    limite.setHours(0, 0, 0, 0);
    
    if (hoje > limite) return 'em_atraso';
    return 'pendente';
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      em_dia: { label: 'Em dia', variant: 'default' as const, icon: CheckCircle },
      pendente: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      em_atraso: { label: 'Em atraso', variant: 'destructive' as const, icon: AlertTriangle },
      nao_se_aplica: { label: 'N/A', variant: 'outline' as const, icon: Clock }
    };
    const config = configs[status as keyof typeof configs] || configs.pendente;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      identificacao: 'Identificação',
      endereco: 'Endereço',
      bancario: 'Bancário',
      saude: 'Saúde',
      certificacoes: 'Certificações',
      foto: 'Foto',
      contrato: 'Contrato'
    };
    return labels[categoria] || categoria;
  };

  if (loading) {
    return <div className="container mx-auto p-6">Carregando checklist...</div>;
  }

  if (!colaborador) {
    return <div className="container mx-auto p-6">Colaborador não encontrado</div>;
  }

  // Agrupar por categoria
  const categorias = [...new Set(documentos.map(d => d.categoria))];
  const resumo = {
    total: documentos.length,
    em_dia: documentos.filter(d => d.status === 'em_dia').length,
    pendente: documentos.filter(d => d.status === 'pendente').length,
    em_atraso: documentos.filter(d => d.status === 'em_atraso').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="h-8 w-8" />
              Checklist de Documentos
            </h1>
            <p className="text-muted-foreground">
              {colaborador.nome_completo} • CPF: {colaborador.cpf}
            </p>
          </div>
        </div>

        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total:</span>
              <strong>{resumo.total}</strong>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Em dia:</span>
              <strong>{resumo.em_dia}</strong>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>Pendente:</span>
              <strong>{resumo.pendente}</strong>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Em atraso:</span>
              <strong>{resumo.em_atraso}</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentos agrupados por categoria */}
      {categorias.map(categoria => {
        const docsCategoria = documentos.filter(d => d.categoria === categoria);
        
        return (
          <Card key={categoria}>
            <CardHeader>
              <CardTitle className="text-lg">{getCategoriaLabel(categoria)}</CardTitle>
              <CardDescription>
                {docsCategoria.length} documento(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Data Limite</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Arquivos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docsCategoria.map(doc => (
                    <TableRow key={doc.tipo_documento}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.nome}</div>
                          {doc.obrigatorio && (
                            <Badge variant="outline" className="text-xs mt-1">Obrigatório</Badge>
                          )}
                          {doc.instrucoes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {doc.instrucoes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>D+{doc.prazo_dias}</TableCell>
                      <TableCell>{new Date(doc.data_limite).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>{doc.arquivos} arquivo(s)</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
