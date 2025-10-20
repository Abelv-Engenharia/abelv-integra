import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Upload, FileText, AlertCircle, CheckCircle, Clock, AlertTriangle, X, FileX, Eye, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
type DocumentStatus = "em_dia" | "pendente" | "em_atraso" | "nao_se_aplica";
interface Colaborador {
  id: string;
  nome: string;
  re: string;
  cpf: string;
  data_admissao: string; // YYYY-MM-DD
  funcao: string;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  temDependentes: boolean;
  prorrogacaoExistente: boolean;
}
interface DocumentoArquivo {
  id: string;
  nome: string;
  dataUpload: string;
  tamanho: number;
  tipo: string;
}
interface Document {
  id: string;
  tipo: string;
  nome: string;
  status: DocumentStatus;
  obrigatorio: boolean;
  condicional?: boolean;
  condicaoDescricao?: string;
  arquivos: DocumentoArquivo[];
  dataLimite?: string; // data_admissao + prazo
  prazoEmDias?: number;
  observacoes?: string;
  uploadMultiplo?: boolean;
  mensagemAlerta?: string;
  dataRegularizacao?: string;
  ilegivel?: boolean;
}
const StatusIcon = ({
  status
}: {
  status: DocumentStatus;
}) => {
  switch (status) {
    case "em_dia":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pendente":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "em_atraso":
      return <X className="h-4 w-4 text-red-600" />;
    case "nao_se_aplica":
      return <FileX className="h-4 w-4 text-gray-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};
const StatusBadge = ({
  status
}: {
  status: DocumentStatus;
}) => {
  const variants = {
    em_dia: "default",
    pendente: "secondary",
    em_atraso: "destructive",
    nao_se_aplica: "secondary"
  } as const;
  const labels = {
    em_dia: "Em dia",
    pendente: "Pendente",
    em_atraso: "Em atraso",
    nao_se_aplica: "Não se aplica"
  };
  return <Badge variant={variants[status]} className="flex items-center gap-1">
      <StatusIcon status={status} />
      {labels[status]}
    </Badge>;
};
export default function ChecklistColaborador() {
  const {
    toast
  } = useToast();
  const [selectedColaborador, setSelectedColaborador] = useState<string>("");
  const [colaboradorData, setColaboradorData] = useState<Colaborador | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<DocumentoArquivo | null>(null);

  // Função auxiliar para calcular data limite
  const calcularDataLimite = (dataAdmissao: string, diasPrazo: number): string => {
    const data = new Date(dataAdmissao);
    data.setDate(data.getDate() + diasPrazo);
    return data.toISOString().split('T')[0];
  };

  // Função para calcular status baseado na data limite
  const calcularStatus = (dataLimite: string, temArquivo: boolean): DocumentStatus => {
    if (temArquivo) return "em_dia";
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(dataLimite);
    limite.setHours(0, 0, 0, 0);
    if (hoje > limite) return "em_atraso";
    return "pendente";
  };

  // Função para gerar mensagem de alerta
  const gerarMensagemAlerta = (dataLimite: string, status: DocumentStatus): string => {
    if (status === "em_atraso") {
      return `Prazo vencido em ${new Date(dataLimite).toLocaleDateString('pt-BR')}. Regularize com urgência.`;
    }
    if (status === "pendente") {
      return `Documento não enviado/validado. Prazo: ${new Date(dataLimite).toLocaleDateString('pt-BR')}.`;
    }
    return "";
  };

  // Mock data colaboradores
  const colaboradores = [{
    id: "1",
    nome: "João Silva Santos",
    re: "123456",
    cpf: "12345678901",
    data_admissao: "2025-01-15",
    funcao: "Eletricista",
    estadoCivil: 'casado' as const,
    temDependentes: true,
    prorrogacaoExistente: false
  }, {
    id: "2",
    nome: "Maria Oliveira",
    re: "789012",
    cpf: "98765432109",
    data_admissao: "2025-02-01",
    funcao: "Auxiliar Administrativo",
    estadoCivil: 'solteiro' as const,
    temDependentes: false,
    prorrogacaoExistente: true
  }, {
    id: "3",
    nome: "Pedro Costa",
    re: "456789",
    cpf: "45678912345",
    data_admissao: "2025-01-20",
    funcao: "Servente",
    estadoCivil: 'divorciado' as const,
    temDependentes: true,
    prorrogacaoExistente: false
  }];

  // Lista de documentos conforme parametrização
  const getDocuments = (colaborador: Colaborador | null): Document[] => {
    if (!colaborador) return [];
    const docs: Document[] = [];

    // 1. Contrato de Experiência - 30 dias
    const dataLimiteContrato = calcularDataLimite(colaborador.data_admissao, 30);
    docs.push({
      id: "contrato_experiencia",
      tipo: "CONTRATO",
      nome: "Contrato de Experiência",
      status: calcularStatus(dataLimiteContrato, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteContrato,
      prazoEmDias: 30,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteContrato, calcularStatus(dataLimiteContrato, false)),
      uploadMultiplo: false
    });

    // 2. Ficha de Registro - 6 dias
    const dataLimiteFicha = calcularDataLimite(colaborador.data_admissao, 6);
    docs.push({
      id: "ficha_registro",
      tipo: "FICHA",
      nome: "Ficha de Registro",
      status: calcularStatus(dataLimiteFicha, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteFicha,
      prazoEmDias: 6,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteFicha, calcularStatus(dataLimiteFicha, false)),
      uploadMultiplo: false
    });

    // 3. Prorrogação de Experiência - 50 dias (condicional)
    if (colaborador.prorrogacaoExistente) {
      const dataLimiteProrrogacao = calcularDataLimite(colaborador.data_admissao, 50);
      docs.push({
        id: "prorrogacao_experiencia",
        tipo: "PRORROGACAO",
        nome: "Prorrogação de Experiência",
        status: calcularStatus(dataLimiteProrrogacao, false),
        obrigatorio: true,
        condicional: true,
        condicaoDescricao: "Se houver prorrogação registrada",
        arquivos: [],
        dataLimite: dataLimiteProrrogacao,
        prazoEmDias: 50,
        mensagemAlerta: gerarMensagemAlerta(dataLimiteProrrogacao, calcularStatus(dataLimiteProrrogacao, false)),
        uploadMultiplo: false
      });
    }

    // 4. Cartão SUS - 3 dias
    const dataLimiteSUS = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "cartao_sus",
      tipo: "SUS",
      nome: "Cartão SUS",
      status: calcularStatus(dataLimiteSUS, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteSUS,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteSUS, calcularStatus(dataLimiteSUS, false)),
      uploadMultiplo: false
    });

    // 5. Carteira de Vacinação - 3 dias
    const dataLimiteVacina = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "carteira_vacinacao",
      tipo: "VACINA",
      nome: "Carteira de Vacinação",
      status: calcularStatus(dataLimiteVacina, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteVacina,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteVacina, calcularStatus(dataLimiteVacina, false)),
      uploadMultiplo: false
    });

    // 6. Comprovante de Endereço - 3 dias
    const dataLimiteEndereco = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "comprovante_endereco",
      tipo: "ENDERECO",
      nome: "Comprovante de Endereço",
      status: calcularStatus(dataLimiteEndereco, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteEndereco,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteEndereco, calcularStatus(dataLimiteEndereco, false)),
      uploadMultiplo: false
    });

    // 7. CTPS Digital - 3 dias
    const dataLimiteCTPS = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "ctps_digital",
      tipo: "CTPS",
      nome: "CTPS Digital",
      status: calcularStatus(dataLimiteCTPS, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteCTPS,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteCTPS, calcularStatus(dataLimiteCTPS, false)),
      uploadMultiplo: false
    });

    // 8. Documentos de Dependentes - 3 dias (condicional)
    const dataLimiteDependentes = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "documentos_dependentes",
      tipo: "DEPENDENTES",
      nome: "Documentos de Dependentes",
      status: colaborador.temDependentes ? calcularStatus(dataLimiteDependentes, false) : "nao_se_aplica",
      obrigatorio: colaborador.temDependentes,
      condicional: true,
      condicaoDescricao: "Se tem_dependentes = true",
      arquivos: [],
      dataLimite: dataLimiteDependentes,
      prazoEmDias: 3,
      mensagemAlerta: colaborador.temDependentes ? gerarMensagemAlerta(dataLimiteDependentes, calcularStatus(dataLimiteDependentes, false)) : "",
      uploadMultiplo: true
    });

    // 9. Histórico Escolar - 3 dias
    const dataLimiteEscolar = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "historico_escolar",
      tipo: "ESCOLAR",
      nome: "Histórico Escolar",
      status: calcularStatus(dataLimiteEscolar, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteEscolar,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteEscolar, calcularStatus(dataLimiteEscolar, false)),
      uploadMultiplo: false
    });

    // 10. Documentos Pessoais (RG/CPF) - 3 dias
    const dataLimitePessoais = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "documentos_pessoais",
      tipo: "PESSOAIS",
      nome: "Documentos Pessoais (RG/CPF)",
      status: calcularStatus(dataLimitePessoais, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimitePessoais,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimitePessoais, calcularStatus(dataLimitePessoais, false)),
      uploadMultiplo: false
    });

    // 11 & 12. Certificados Eletricista e NR10 - 3 dias (condicional)
    const funcoesEletricista = ["Eletricista", "Eletricista Montador", "Eletricista Industrial"];
    if (funcoesEletricista.includes(colaborador.funcao)) {
      const dataLimiteEletricista = calcularDataLimite(colaborador.data_admissao, 3);
      docs.push({
        id: "certificado_eletricista",
        tipo: "CERT_ELETRICISTA",
        nome: "Certificado de Eletricista",
        status: calcularStatus(dataLimiteEletricista, false),
        obrigatorio: true,
        condicional: true,
        condicaoDescricao: "Se função = Eletricista ou equivalente",
        arquivos: [],
        dataLimite: dataLimiteEletricista,
        prazoEmDias: 3,
        mensagemAlerta: gerarMensagemAlerta(dataLimiteEletricista, calcularStatus(dataLimiteEletricista, false)),
        uploadMultiplo: false
      });
      docs.push({
        id: "certificado_nr10",
        tipo: "CERT_NR10",
        nome: "Certificado NR10",
        status: calcularStatus(dataLimiteEletricista, false),
        obrigatorio: true,
        condicional: true,
        condicaoDescricao: "Se função = Eletricista ou equivalente",
        arquivos: [],
        dataLimite: dataLimiteEletricista,
        prazoEmDias: 3,
        mensagemAlerta: gerarMensagemAlerta(dataLimiteEletricista, calcularStatus(dataLimiteEletricista, false)),
        uploadMultiplo: false
      });
    }

    // 13. Título de Eleitor - 3 dias
    const dataLimiteTitulo = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "titulo_eleitor",
      tipo: "TITULO",
      nome: "Título de Eleitor",
      status: calcularStatus(dataLimiteTitulo, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteTitulo,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteTitulo, calcularStatus(dataLimiteTitulo, false)),
      uploadMultiplo: false
    });

    // 14. ASO - 3 dias
    const dataLimiteASO = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "aso",
      tipo: "ASO",
      nome: "ASO",
      status: calcularStatus(dataLimiteASO, false),
      obrigatorio: true,
      arquivos: [],
      dataLimite: dataLimiteASO,
      prazoEmDias: 3,
      mensagemAlerta: gerarMensagemAlerta(dataLimiteASO, calcularStatus(dataLimiteASO, false)),
      uploadMultiplo: false,
      observacoes: "Integrar com BRMED; fallback upload manual"
    });

    // 15. Certidão de Casamento + RG/CPF do Cônjuge - 3 dias (condicional)
    const dataLimiteCasamento = calcularDataLimite(colaborador.data_admissao, 3);
    docs.push({
      id: "certidao_casamento",
      tipo: "CASAMENTO",
      nome: "Certidão de Casamento + RG/CPF do Cônjuge",
      status: colaborador.estadoCivil === 'casado' ? calcularStatus(dataLimiteCasamento, false) : "nao_se_aplica",
      obrigatorio: colaborador.estadoCivil === 'casado',
      condicional: true,
      condicaoDescricao: colaborador.estadoCivil === 'casado' ? "Exibido porque colaborador(a) declarou estado civil casado(a)" : "Não se aplica (solteiro(a))",
      arquivos: [],
      dataLimite: dataLimiteCasamento,
      prazoEmDias: 3,
      mensagemAlerta: colaborador.estadoCivil === 'casado' ? gerarMensagemAlerta(dataLimiteCasamento, calcularStatus(dataLimiteCasamento, false)) : "",
      uploadMultiplo: false
    });
    return docs;
  };
  const [documents, setDocuments] = useState<Document[]>(getDocuments(null));

  // Atualizar documentos quando colaborador for selecionado
  const handleColaboradorChange = (colaboradorId: string) => {
    setSelectedColaborador(colaboradorId);
    const colaborador = colaboradores.find(c => c.id === colaboradorId);
    setColaboradorData(colaborador || null);
    setDocuments(getDocuments(colaborador || null));
  };
  const handleFileUpload = (documentId: string, files: FileList | null) => {
    if (!files || files.length === 0 || !colaboradorData) return;
    const document = documents.find(d => d.id === documentId);
    if (!document) return;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const novosArquivos: DocumentoArquivo[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Convenção: TIPO_RE_NOME_DATA.ext
      const fileName = `${document.tipo}_${colaboradorData.re}_${colaboradorData.nome.replace(/\s+/g, '_')}_${dateStr}_${timeStr}.${file.name.split('.').pop()}`;
      novosArquivos.push({
        id: `${documentId}_${Date.now()}_${i}`,
        nome: fileName,
        dataUpload: now.toLocaleString('pt-BR'),
        tamanho: file.size,
        tipo: file.type
      });
    }
    setDocuments(prev => prev.map(doc => doc.id === documentId ? {
      ...doc,
      status: "em_dia" as DocumentStatus,
      arquivos: document.uploadMultiplo ? [...doc.arquivos, ...novosArquivos] : novosArquivos,
      observacoes: `Arquivo(s) enviado(s) em ${now.toLocaleString('pt-BR')} por Admin Sistema`,
      mensagemAlerta: ""
    } : doc));

    // Registrar auditoria (mock)
    console.log('Auditoria - Upload:', {
      usuario_id: 'admin_001',
      colaborador_id: colaboradorData.id,
      tipo_documento: document.tipo,
      data_hora: now.toISOString(),
      ip: '192.168.1.1',
      acao: 'UPLOAD',
      arquivos: novosArquivos.map(a => a.nome)
    });
    toast({
      title: "Documento(s) anexado(s)",
      description: `${files.length} arquivo(s) anexado(s) com sucesso.`
    });
  };
  const handleStatusChange = (documentId: string, newStatus: DocumentStatus) => {
    if (!colaboradorData) return;
    setDocuments(prev => prev.map(doc => doc.id === documentId ? {
      ...doc,
      status: newStatus,
      observacoes: `Status alterado para '${newStatus}' em ${new Date().toLocaleString('pt-BR')} por Admin Sistema`
    } : doc));

    // Registrar auditoria (mock)
    console.log('Auditoria - Mudança Status:', {
      usuario_id: 'admin_001',
      colaborador_id: colaboradorData.id,
      tipo_documento: documents.find(d => d.id === documentId)?.tipo,
      data_hora: new Date().toISOString(),
      ip: '192.168.1.1',
      acao: 'STATUS_CHANGE',
      status_anterior: documents.find(d => d.id === documentId)?.status,
      status_novo: newStatus
    });
    toast({
      title: "Status atualizado",
      description: `Status do documento alterado para '${newStatus}'.`
    });
  };
  const handleRegularizar = (documentId: string) => {
    if (!colaboradorData) return;
    const document = documents.find(d => d.id === documentId);
    if (!document) return;

    // Se está ilegível, não regulariza automaticamente
    if (document.ilegivel) {
      toast({
        title: "Ação necessária",
        description: "Documento marcado como ilegível. Solicite reenvio antes de regularizar.",
        variant: "destructive"
      });
      return;
    }

    // Calcular data de regularização = hoje + SLA
    const hoje = new Date();
    const dataRegularizacao = calcularDataLimite(hoje.toISOString().split('T')[0], document.prazoEmDias || 3);
    setDocuments(prev => prev.map(doc => doc.id === documentId ? {
      ...doc,
      dataRegularizacao,
      status: "em_dia" as DocumentStatus,
      observacoes: `Regularizado automaticamente em ${hoje.toLocaleString('pt-BR')}. Data de regularização: ${new Date(dataRegularizacao).toLocaleDateString('pt-BR')}`
    } : doc));
    toast({
      title: "Documento regularizado",
      description: `Data de regularização: ${new Date(dataRegularizacao).toLocaleDateString('pt-BR')}`
    });
  };
  const handleMarcarIlegivel = (documentId: string) => {
    if (!colaboradorData) return;
    const document = documents.find(d => d.id === documentId);
    if (!document) return;
    setDocuments(prev => prev.map(doc => doc.id === documentId ? {
      ...doc,
      ilegivel: !doc.ilegivel,
      observacoes: `Marcado como ${!doc.ilegivel ? 'ilegível' : 'legível'} em ${new Date().toLocaleString('pt-BR')}`
    } : doc));
    toast({
      title: document.ilegivel ? "Marcado como legível" : "Marcado como ilegível",
      description: document.ilegivel ? "Documento pode ser regularizado novamente" : "Solicite reenvio do documento"
    });
  };
  const handleVisualizarArquivo = (arquivo: DocumentoArquivo) => {
    setPreviewFile(arquivo);
    setPreviewOpen(true);
  };
  const getProgressPercentage = () => {
    const documentosObrigatorios = documents.filter(doc => doc.obrigatorio);
    const documentosOk = documentosObrigatorios.filter(doc => doc.status === "em_dia");
    return documentosObrigatorios.length > 0 ? Math.round(documentosOk.length / documentosObrigatorios.length * 100) : 0;
  };
  const getStatusGeral = (): 'apto' | 'com_pendencias' | 'em_atraso' => {
    const documentosObrigatorios = documents.filter(doc => doc.obrigatorio);
    if (documentosObrigatorios.some(doc => doc.status === "em_atraso")) {
      return 'em_atraso';
    }
    if (documentosObrigatorios.every(doc => doc.status === "em_dia")) {
      return 'apto';
    }
    return 'com_pendencias';
  };
  const documentosCriticos = documents.filter(doc => doc.obrigatorio && ["ficha_registro", "contrato_experiencia"].includes(doc.id) && doc.status !== "em_dia");
  const documentosEmAtraso = documents.filter(doc => doc.obrigatorio && doc.status === "em_atraso");
  return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checklist de documentos</h1>
          <p className="text-sm text-muted-foreground">
            Gestão de documentos obrigatórios para admissão
          </p>
        </div>
      </div>

      {/* Seletor de Colaborador */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar candidato/ colaborador</CardTitle>
          <CardDescription>
            Escolha o colaborador para gerenciar os documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="colaborador">Candidato/Colaborador</Label>
              <Select value={selectedColaborador} onValueChange={handleColaboradorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores.map(colaborador => <SelectItem key={colaborador.id} value={colaborador.id}>
                      {colaborador.nome} - RE: {colaborador.re} - CPF: {colaborador.cpf}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{getProgressPercentage()}%</div>
              <div className="text-sm text-muted-foreground">Concluído</div>
              {colaboradorData && <div className="mt-2">
                  <Badge variant={getStatusGeral() === 'apto' ? 'default' : getStatusGeral() === 'em_atraso' ? 'destructive' : 'secondary'}>
                    {getStatusGeral() === 'apto' ? 'Apto' : getStatusGeral() === 'em_atraso' ? 'Em Atraso' : 'Com Pendências'}
                  </Badge>
                </div>}
            </div>
          </div>

          {colaboradorData && <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Informações do Colaborador</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Data Admissão:</span>
                  <div className="font-medium">{new Date(colaboradorData.data_admissao).toLocaleDateString('pt-BR')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Função:</span>
                  <div className="font-medium">{colaboradorData.funcao}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado Civil:</span>
                  <div className="font-medium capitalize">{colaboradorData.estadoCivil}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tem Dependentes:</span>
                  <div className="font-medium">{colaboradorData.temDependentes ? 'Sim' : 'Não'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status Geral:</span>
                  <div className="font-medium capitalize">{getStatusGeral().replace('_', ' ')}</div>
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>

      {/* Alertas */}
      {documentosEmAtraso.length > 0 && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Documentos em atraso ({documentosEmAtraso.length}):</strong> {documentosEmAtraso.map(doc => doc.nome).join(", ")}
          </AlertDescription>
        </Alert>}
      
      {documentosCriticos.length > 0 && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Documentos críticos pendentes:</strong> {documentosCriticos.map(doc => doc.nome).join(", ")}
          </AlertDescription>
        </Alert>}

      {selectedColaborador && <Card>
          <CardHeader>
            <CardTitle>Documentos obrigatórios</CardTitle>
            <CardDescription>
              Upload e validação de documentos conforme convenção de nomes
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
                  <TableHead>Anexo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(document => <TableRow key={document.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{document.nome}</div>
                        {document.condicional && <div className="text-xs text-muted-foreground italic">
                            {document.condicaoDescricao}
                          </div>}
                        {document.mensagemAlerta && <div className={`text-xs mt-1 font-medium ${document.status === "em_atraso" ? "text-red-600" : "text-yellow-600"}`}>
                            {document.mensagemAlerta}
                          </div>}
                        {document.uploadMultiplo && <div className="text-xs text-blue-600 font-medium mt-1">
                            ✓ Upload múltiplo permitido
                          </div>}
                        {document.arquivos.length > 0 && <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            <div className="font-medium">Arquivo(s):</div>
                            {document.arquivos.map(arquivo => <div key={arquivo.id} className="ml-2">
                                • {arquivo.nome}
                                <div className="text-xs text-muted-foreground">
                                  Upload: {arquivo.dataUpload} | {(arquivo.tamanho / 1024).toFixed(1)} KB
                                </div>
                              </div>)}
                          </div>}
                        {document.observacoes && <div className="text-xs text-muted-foreground mt-1">
                            <strong>Obs:</strong> {document.observacoes}
                          </div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{document.prazoEmDias} dias</div>
                    </TableCell>
                    <TableCell>
                      {document.dataLimite && <div className={`font-medium ${document.status === "em_atraso" ? "text-red-600" : ""}`}>
                          {new Date(document.dataLimite).toLocaleDateString('pt-BR')}
                        </div>}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={document.status} />
                    </TableCell>
                    <TableCell>
                      {document.status !== "nao_se_aplica" ? <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Input type="file" id={`file-${document.id}`} accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFileUpload(document.id, e.target.files)} className="hidden" multiple={document.uploadMultiplo} disabled={!colaboradorData} />
                            <Button variant="outline" size="sm" disabled={!colaboradorData} onClick={() => {
                      const fileInput = window.document.getElementById(`file-${document.id}`) as HTMLInputElement;
                      fileInput?.click();
                    }}>
                              <Upload className="h-3 w-3 mr-1" />
                              Anexar
                            </Button>
                            {document.arquivos.length > 0 && <Button variant="outline" size="sm" onClick={() => handleVisualizarArquivo(document.arquivos[0])}>
                                <Eye className="h-3 w-3 mr-1" />
                                Visualizar
                              </Button>}
                          </div>
                        </div> : <span className="text-muted-foreground text-sm">
                          Não aplicável
                        </span>}
                    </TableCell>
                    <TableCell>
                      {document.status !== "nao_se_aplica" ? <div className="flex flex-col gap-2">
                          <Button variant="default" size="sm" onClick={() => handleRegularizar(document.id)} disabled={!colaboradorData || document.ilegivel} className="w-full">
                            <Zap className="h-3 w-3 mr-1" />
                            Regularizar
                          </Button>
                          {document.arquivos.length > 0 && <Button variant={document.ilegivel ? "destructive" : "outline"} size="sm" onClick={() => handleMarcarIlegivel(document.id)} disabled={!colaboradorData} className="w-full text-xs">
                              {document.ilegivel ? "Ilegível ✓" : "Marcar Ilegível"}
                            </Button>}
                          {document.dataRegularizacao && <div className="text-xs text-muted-foreground">
                              Regularização: {new Date(document.dataRegularizacao).toLocaleDateString('pt-BR')}
                            </div>}
                        </div> : <StatusBadge status="nao_se_aplica" />}
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>}

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Convenção de nomes:</strong> TIPO_RE_NOME_DATA.ext (ex: RG_123456_João_Silva_20231215_143022.pdf)
          <br />
          <strong>Campos condicionais:</strong> Documentos mostram "Não se aplica" quando as condições não são atendidas
          <br />
          <strong>Upload múltiplo:</strong> Permitido para Carteira de Vacinação e Documentos de Dependentes
          <br />
          <strong>Auditoria:</strong> Todos os uploads, validações e alterações de status são registrados automaticamente
          <br />
          <strong>Regularização autométrica:</strong> Clique em ⚡ Regularizar para definir automaticamente a data de regularização (hoje + SLA)
        </AlertDescription>
      </Alert>

      {/* Modal de Prévia de Arquivo */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Prévia do Documento</DialogTitle>
            <DialogDescription>
              Visualização do arquivo anexado
            </DialogDescription>
          </DialogHeader>
          {previewFile && <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <div className="font-medium">{previewFile.nome}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Upload:</span>
                    <div className="font-medium">{previewFile.dataUpload}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tamanho:</span>
                    <div className="font-medium">{(previewFile.tamanho / 1024).toFixed(1)} KB</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <div className="font-medium">{previewFile.tipo}</div>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm">Prévia do documento: {previewFile.nome}</p>
                  <p className="text-xs mt-2">Funcionalidade de visualização em desenvolvimento</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Fechar
                </Button>
                <Button variant="default">
                  <Upload className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}