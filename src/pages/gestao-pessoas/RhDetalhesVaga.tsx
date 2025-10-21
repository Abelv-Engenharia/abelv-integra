import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Copy, 
  Edit, 
  MapPin, 
  Calendar, 
  Building, 
  User,
  Phone,
  Mail,
  FileText,
  Clock
} from "lucide-react";
import { StatusBadge } from "@/components/gestao-pessoas/recrutamento/StatusBadge";
import { TimelineComponent } from "@/components/gestao-pessoas/recrutamento/TimelineComponent";
import { useVagaById } from "@/hooks/gestao-pessoas/useVagas";
import { MotivoAbertura, TipoContrato } from "@/types/gestao-pessoas/vaga";
import { toast } from "sonner";

export default function RhDetalhesVaga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'detalhes' | 'candidatos'>('detalhes');
  const { data: vaga, isLoading } = useVagaById(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Vaga não encontrada</h1>
          <p className="text-muted-foreground mb-4">
            A vaga solicitada não existe ou foi removida.
          </p>
          <Button onClick={() => navigate('/rh-dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleDuplicateVaga = () => {
    // Aqui você implementaria a lógica para duplicar a vaga
    toast.success("Vaga duplicada com sucesso! Redirecionando para edição...");
    navigate('/rh-abertura-vaga');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getMotivoAberturaLabel = (motivo: MotivoAbertura) => {
    switch (motivo) {
      case MotivoAbertura.SUBSTITUICAO:
        return 'Substituição';
      case MotivoAbertura.NOVA_OBRA:
        return 'Nova Obra';
      case MotivoAbertura.AUMENTO_EQUIPE:
        return 'Aumento de Equipe';
      default:
        return motivo;
    }
  };

  const getTipoContratoLabel = (tipo: TipoContrato) => {
    switch (tipo) {
      case TipoContrato.CLT:
        return 'CLT';
      case TipoContrato.PJ:
        return 'PJ';
      case TipoContrato.APRENDIZ:
        return 'Aprendiz';
      case TipoContrato.ESTAGIO:
        return 'Estágio';
      default:
        return tipo;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/rh-dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{vaga.cargo}</h1>
            <p className="text-muted-foreground">
              {vaga.numeroVaga} • {vaga.area}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDuplicateVaga} className="gap-2">
            <Copy className="h-4 w-4" />
            Duplicar Vaga
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Informações Principais */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{vaga.localTrabalho}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Mobilização: {formatDate(vaga.prazoMobilizacao)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{vaga.setor}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <StatusBadge status={vaga.status} type="vaga" />
              <StatusBadge status={vaga.prioridade} type="prioridade" />
              <StatusBadge status={vaga.statusAprovacao} type="aprovacao" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Abas */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('detalhes')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'detalhes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Detalhes da Vaga
        </button>
        <button
          onClick={() => setActiveTab('candidatos')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'candidatos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Candidatos ({vaga.candidatos.length})
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'detalhes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Status da Vaga</CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineComponent currentStatus={vaga.status} />
            </CardContent>
          </Card>

          {/* Informações Detalhadas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identificação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identificação da Vaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Cargo</h4>
                    <p className="text-foreground">{vaga.cargo}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Área/Setor</h4>
                    <p className="text-foreground">{vaga.area} - {vaga.setor}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Local de Trabalho</h4>
                    <p className="text-foreground">{vaga.localTrabalho}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gestor Responsável</h4>
                    <p className="text-foreground">{vaga.gestor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Justificativa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Justificativa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Motivo da Abertura</h4>
                    <p className="text-foreground">{getMotivoAberturaLabel(vaga.motivoAbertura)}</p>
                  </div>
                  {vaga.nomeColaboradorSubstituido && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Colaborador Substituído</h4>
                      <p className="text-foreground">{vaga.nomeColaboradorSubstituido}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Prazo de Mobilização</h4>
                    <p className="text-foreground">{formatDate(vaga.prazoMobilizacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes da Contratação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Contratação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tipo de Contrato</h4>
                    <p className="text-foreground">{getTipoContratoLabel(vaga.tipoContrato)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Jornada de Trabalho</h4>
                    <p className="text-foreground">{vaga.jornadaTrabalho}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Faixa Salarial</h4>
                    <p className="text-foreground">{vaga.faixaSalarial}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Benefícios</h4>
                  <p className="text-foreground">{vaga.beneficios}</p>
                </div>
              </CardContent>
            </Card>

            {/* Perfil do Candidato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perfil do Candidato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Formação Mínima</h4>
                  <p className="text-foreground">{vaga.formacaoMinima}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Experiência Desejada</h4>
                  <p className="text-foreground">{vaga.experienciaDesejada}</p>
                </div>
                
                {vaga.hardSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Hard Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {vaga.hardSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {vaga.softSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {vaga.softSkills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aprovação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aprovação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Aprovador</h4>
                    <p className="text-foreground">{vaga.aprovador}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status da Aprovação</h4>
                    <StatusBadge status={vaga.statusAprovacao} type="aprovacao" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Aba Candidatos */}
      {activeTab === 'candidatos' && (
        <div className="space-y-4">
          {vaga.candidatos.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhum candidato aplicou para esta vaga ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {vaga.candidatos.map((candidato) => (
                <Card key={candidato.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {candidato.nome}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{candidato.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{candidato.telefone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        <StatusBadge status={candidato.status} type="candidato" />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(candidato.dataAplicacao)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {candidato.observacoes && (
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Observações</h4>
                          <p className="text-foreground text-sm">{candidato.observacoes}</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}