import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  Mail, 
  MessageSquare, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface DocumentoItem {
  id: string;
  nome: string;
  categoria: 'identificacao' | 'endereco' | 'bancario' | 'saude' | 'certificacoes' | 'foto';
  obrigatorio: boolean;
  criticidade: 'critico' | 'nao_critico';
  prazo: 'D0' | 'D+1' | 'D+3' | 'D+7';
  prazo_dias: number;
  data_limite: string;
  visivel_ao_candidato: boolean;
  formato_aceito: string;
  instrucao_foto: string;
}

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  funcao: string;
  obra_cca: string;
  tipo_contratacao: 'CLT' | 'Terceiro' | 'Estagiário' | 'Jovem Aprendiz';
  data_solicitacao: string;
  email: string;
  whatsapp: string;
}

export default function RelacaoDocumentosPrazos() {
  const { colaboradorId } = useParams();
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEnviarGuiaAberto, setModalEnviarGuiaAberto] = useState(false);
  const [modalPreviaAberto, setModalPreviaAberto] = useState(false);

  // Catálogo de documentos com visibilidade
  const catalogoDocumentos = [
    { id: 'rg_cnh', nome: 'RG ou CNH (frente e verso)', categoria: 'identificacao', criticidade: 'critico', prazo: 'D0', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Fotografe o documento em local bem iluminado, sem reflexos' },
    { id: 'cpf', nome: 'CPF (se não constar no RG)', categoria: 'identificacao', criticidade: 'critico', prazo: 'D0', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Escaneie ou fotografe o documento completo' },
    { id: 'ctps', nome: 'CTPS (páginas qualificação e contratos)', categoria: 'identificacao', criticidade: 'critico', prazo: 'D0', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Fotografe a página com foto e a última página de contrato' },
    { id: 'pis_nis', nome: 'PIS/NIS', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D+3', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Número pode estar na CTPS' },
    { id: 'comprovante_residencia', nome: 'Comprovante de Residência (≤ 90 dias)', categoria: 'endereco', criticidade: 'nao_critico', prazo: 'D+1', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Conta de luz, água ou telefone recente' },
    { id: 'titulo_eleitor', nome: 'Título de Eleitor + Quitação', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D+3', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Frente e verso do título' },
    { id: 'certificado_reservista', nome: 'Certificado de Reservista', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D+3', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Se aplicável (masculino)' },
    { id: 'certidao_nasc_casamento', nome: 'Certidão de Nascimento/Casamento', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D+7', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Se aplicável' },
    { id: 'dados_bancarios', nome: 'Dados Bancários (CLT)', categoria: 'bancario', criticidade: 'nao_critico', prazo: 'D+3', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Comprovante de conta ou app bancário' },
    { id: 'carteira_vacinacao', nome: 'Carteira de Vacinação', categoria: 'saude', criticidade: 'nao_critico', prazo: 'D+7', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Todas as páginas com vacinas aplicadas' },
    { id: 'certificacoes', nome: 'Certificações obrigatórias (NR-10, NR-35)', categoria: 'certificacoes', criticidade: 'critico', prazo: 'D+7', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Se exigidas para a função' },
    { id: 'diplomas', nome: 'Diplomas/Histórico escolar', categoria: 'certificacoes', criticidade: 'nao_critico', prazo: 'D+7', visivel: true, formato: 'PDF/JPG/PNG', instrucao: 'Se exigido para a função' },
    { id: 'foto_3x4', nome: 'Foto 3x4 ou selfie (fundo claro)', categoria: 'foto', criticidade: 'nao_critico', prazo: 'D+1', visivel: true, formato: 'JPG/PNG', instrucao: 'Fundo branco ou claro, sem óculos escuros' },
    // Documentos internos (não visíveis ao candidato)
    { id: 'ficha_registro', nome: 'Ficha de Registro', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D0', visivel: false, formato: 'PDF', instrucao: '' },
    { id: 'contrato_trabalho', nome: 'Contrato de Trabalho', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D0', visivel: false, formato: 'PDF', instrucao: '' },
    { id: 'termos_internos', nome: 'Termos Internos', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D0', visivel: false, formato: 'PDF', instrucao: '' },
    { id: 'esocial', nome: 'eSocial', categoria: 'identificacao', criticidade: 'nao_critico', prazo: 'D0', visivel: false, formato: 'PDF', instrucao: '' },
    { id: 'aso_admissional', nome: 'ASO Admissional', categoria: 'saude', criticidade: 'nao_critico', prazo: 'D+3', visivel: false, formato: 'PDF', instrucao: '' },
  ];

  useEffect(() => {
    carregarDados();
  }, [colaboradorId]);

  const carregarDados = async () => {
    setLoading(true);
    // Mock data - substituir por API real
    setTimeout(() => {
      const mockColaborador: Colaborador = {
        id: colaboradorId || '1',
        nome: 'João Silva Santos',
        cpf: '123.456.789-00',
        funcao: 'Eletricista',
        obra_cca: 'CCA 023101',
        tipo_contratacao: 'CLT',
        data_solicitacao: '2025-02-01',
        email: 'joao.silva@example.com',
        whatsapp: '11999999999'
      };
      setColaborador(mockColaborador);

      const mockDocumentos = catalogoDocumentos.map((cat) => {
        const prazo_dias = cat.prazo === 'D0' ? 0 : cat.prazo === 'D+1' ? 1 : cat.prazo === 'D+3' ? 3 : 7;
        const data_limite = calcularDataLimite(mockColaborador.data_solicitacao, prazo_dias);
        
        return {
          id: cat.id,
          nome: cat.nome,
          categoria: cat.categoria as any,
          obrigatorio: cat.criticidade === 'critico',
          criticidade: cat.criticidade as any,
          prazo: cat.prazo as any,
          prazo_dias,
          data_limite,
          visivel_ao_candidato: cat.visivel,
          formato_aceito: cat.formato,
          instrucao_foto: cat.instrucao
        } as DocumentoItem;
      });
      
      setDocumentos(mockDocumentos);
      setLoading(false);
    }, 500);
  };

  const calcularDataLimite = (dataBase: string, dias: number): string => {
    const data = new Date(dataBase);
    data.setDate(data.getDate() + dias);
    return data.toISOString().split('T')[0];
  };

  const handleVisualizarPDF = () => {
    setModalPreviaAberto(true);
  };

  const handleGerarGuiaPDF = () => {
    // Filtrar apenas documentos visíveis ao candidato
    const docsVisiveis = documentos.filter(d => d.visivel_ao_candidato);
    
    toast({
      title: "Gerando PDF",
      description: `Gerando guia com ${docsVisiveis.length} documentos...`
    });

    // Simula geração de PDF
    setTimeout(() => {
      toast({
        title: "PDF Gerado com Sucesso",
        description: `Guia_Documentos_${colaborador?.nome.replace(/\s+/g, '_')}_${colaborador?.obra_cca}.pdf`
      });
    }, 1500);

    // Log de auditoria
    console.log('Auditoria - Geração PDF:', {
      usuario: 'admin',
      colaborador: colaborador?.id,
      documentos_incluidos: docsVisiveis.length,
      documentos_excluidos: documentos.filter(d => !d.visivel_ao_candidato).map(d => d.nome),
      timestamp: new Date().toISOString()
    });
  };

  const handleEnviarGuia = (canal: 'email' | 'whatsapp') => {
    if (!colaborador) return;

    const mensagem = `Olá, ${colaborador.nome}. Segue sua lista de documentos para admissão na obra ${colaborador.obra_cca}. 
Envie até as datas indicadas. Portal: [LINK/QR]. Formatos: PDF/JPG/PNG.
Em caso de arquivo ilegível, solicitaremos reenvio. Dúvidas? Entre em contato com o administrativo.`;

    toast({
      title: `Enviando guia via ${canal}`,
      description: canal === 'email' ? colaborador.email : colaborador.whatsapp
    });

    setTimeout(() => {
      toast({
        title: "Guia enviada com sucesso",
        description: `Enviada para ${canal === 'email' ? colaborador.email : colaborador.whatsapp}`
      });
    }, 1500);

    // Log de auditoria
    console.log('Auditoria - Envio Guia:', {
      usuario: 'admin',
      colaborador: colaborador.id,
      canal,
      destinatario: canal === 'email' ? colaborador.email : colaborador.whatsapp,
      timestamp: new Date().toISOString()
    });

    setModalEnviarGuiaAberto(false);
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      identificacao: 'Identificação',
      endereco: 'Endereço',
      bancario: 'Bancário',
      saude: 'Saúde',
      certificacoes: 'Certificações',
      foto: 'Foto'
    };
    return labels[categoria] || categoria;
  };

  if (loading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  if (!colaborador) {
    return <div className="container mx-auto p-6">Colaborador não encontrado</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Topbar */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Documentos Necessários do Candidato</h1>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span><strong>Colaborador:</strong> {colaborador.nome}</span>
              <span><strong>CPF:</strong> {colaborador.cpf}</span>
              <span><strong>Função/CBO:</strong> {colaborador.funcao}</span>
              <span><strong>Obra/CCA:</strong> {colaborador.obra_cca}</span>
              <span><strong>D0:</strong> {new Date(colaborador.data_solicitacao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleVisualizarPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Visualizar Prévia
            </Button>
            <Button onClick={handleGerarGuiaPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
            <Button onClick={() => setModalEnviarGuiaAberto(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Guia
            </Button>
          </div>
        </div>

      </div>

      {/* Lista de documentos agrupada por categoria */}
      <div className="space-y-6">
        {['identificacao', 'endereco', 'bancario', 'saude', 'certificacoes', 'foto'].map(categoria => {
          const docsCategoria = documentos.filter(d => d.categoria === categoria && d.visivel_ao_candidato);
          if (docsCategoria.length === 0) return null;

          return (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="text-lg">{getCategoriaLabel(categoria)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {docsCategoria.map(doc => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.nome}</span>
                        {doc.criticidade === 'critico' && (
                          <Badge variant="destructive" className="text-xs ml-auto">
                            CRÍTICO
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 ml-6 text-xs text-muted-foreground">
                        {doc.formato_aceito}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo de documentos excluídos */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Documentos Internos (não incluídos no PDF do candidato)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {documentos.filter(d => !d.visivel_ao_candidato).map(doc => (
              <Badge key={doc.id} variant="secondary">
                {doc.nome}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Prévia PDF */}
      <Dialog open={modalPreviaAberto} onOpenChange={setModalPreviaAberto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prévia da Guia de Documentos</DialogTitle>
            <DialogDescription>
              Visualização do PDF que será enviado ao candidato
            </DialogDescription>
          </DialogHeader>
          
          {/* Simulação do PDF */}
          <div className="bg-white border rounded-lg p-8 space-y-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Cabeçalho */}
            <div className="text-center border-b pb-4">
              <div className="text-2xl font-bold text-blue-900 mb-2">ABELV</div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">GUIA DE DOCUMENTOS PARA ADMISSÃO</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Candidato:</strong> {colaborador.nome}</p>
                <p><strong>Obra/CCA:</strong> {colaborador.obra_cca}</p>
                <p><strong>Função:</strong> {colaborador.funcao}</p>
                <p><strong>Data de Solicitação:</strong> {new Date(colaborador.data_solicitacao).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">📋 Instruções Importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Envie todos os documentos nos formatos indicados (PDF, JPG ou PNG)</li>
                <li>Certifique-se de que as imagens estejam legíveis e sem cortes</li>
                <li>Fotografe os documentos em local bem iluminado, sem reflexos</li>
                <li>Envie os documentos através do portal: [LINK/QR CODE]</li>
              </ul>
            </div>

            {/* Lista de documentos por categoria */}
            {['identificacao', 'endereco', 'bancario', 'saude', 'certificacoes', 'foto'].map(categoria => {
              const docsCategoria = documentos.filter(d => d.categoria === categoria && d.visivel_ao_candidato);
              if (docsCategoria.length === 0) return null;

              return (
                <div key={categoria} className="space-y-2">
                  <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                    {getCategoriaLabel(categoria)}
                  </h2>
                  <div className="space-y-2">
                    {docsCategoria.map((doc, idx) => (
                      <div key={doc.id} className="flex items-start gap-2 text-sm">
                        <span className="font-semibold text-gray-700 min-w-[20px]">{idx + 1}.</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{doc.nome}</span>
                            {doc.criticidade === 'critico' && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                OBRIGATÓRIO
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <p><strong>Formatos:</strong> {doc.formato_aceito}</p>
                            {doc.instrucao_foto && (
                              <p className="mt-0.5"><strong>Como enviar:</strong> {doc.instrucao_foto}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Rodapé */}
            <div className="border-t pt-4 text-center text-sm text-gray-600 space-y-2">
              <div className="bg-gray-100 rounded p-4 space-y-2">
                <p className="font-semibold text-gray-800">📱 Portal de Upload de Documentos</p>
                <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">[QR CODE]</span>
                </div>
                <p className="text-xs">ou acesse: [LINK DO PORTAL]</p>
              </div>
              <div className="pt-2">
                <p className="font-semibold text-gray-800">Dúvidas?</p>
                <p>Entre em contato com o administrativo da obra</p>
                <p>E-mail: {colaborador.email}</p>
                <p>WhatsApp: {colaborador.whatsapp}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalPreviaAberto(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setModalPreviaAberto(false);
              handleGerarGuiaPDF();
            }}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Enviar Guia */}
      <Dialog open={modalEnviarGuiaAberto} onOpenChange={setModalEnviarGuiaAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Guia de Documentos</DialogTitle>
            <DialogDescription>
              Escolha o canal de envio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleEnviarGuia('email')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-8 w-8" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm text-muted-foreground">{colaborador.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleEnviarGuia('whatsapp')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-8 w-8" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">{colaborador.whatsapp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
