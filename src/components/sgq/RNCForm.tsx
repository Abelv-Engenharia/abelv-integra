import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRNCData } from "@/hooks/sgq/useRNCData";
import { DISCIPLINAS, DISPOSICOES, RNC, FileAttachment } from "@/types/sgq";
import { Save, ArrowLeft } from "lucide-react";
import { EvidenceUpload } from "@/components/sgq/EvidenceUpload";
import { useUsuarioAtivo } from "@/hooks/useUsuarioAtivo";
import { fetchCCAs, CCAOption } from "@/services/treinamentos/ccaService";

interface RNCFormProps {
  initialData?: RNC;
  isEditMode?: boolean;
}

export const RNCForm = ({ initialData, isEditMode = false }: RNCFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createRNC, updateRNC } = useRNCData();
  const usuarioAtivo = useUsuarioAtivo();
  const [loading, setLoading] = useState(false);
  const [ccas, setCcas] = useState<CCAOption[]>([]);
  
  const [formData, setFormData] = useState({
    numero: '',
    data: new Date().toISOString().split('T')[0],
    cca: '',
    emitente: usuarioAtivo.nome,
    setor_projeto: '',
    detectado_por: '',
    periodo_melhoria: '',
    data_emissao: new Date().toISOString().split('T')[0],
    previsao_fechamento: '',
    origem: undefined as 'interna' | 'cliente' | 'fornecedor' | 'terceiro' | undefined,
    prioridade: undefined as 'critica' | 'moderada' | 'leve' | undefined,
    disciplina: [] as string[],
    disciplina_outros: '',
    descricao_nc: '',
    evidencias_nc: '',
    disposicao: [] as string[],
    empresa_disposicao: '',
    responsavel_disposicao: '',
    data_disposicao: '',
    prazo_disposicao: '',
    analise_disposicao: '',
    status: 'aberta' as 'aberta' | 'fechada',
    anexos_evidencias_nc: [] as FileAttachment[],
    anexos_evidencia_disposicao: [] as FileAttachment[]
  });

  useEffect(() => {
    const loadCCAs = async () => {
      const ccasList = await fetchCCAs();
      setCcas(ccasList);
    };
    loadCCAs();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        numero: initialData.numero,
        data: initialData.data,
        cca: initialData.cca,
        emitente: initialData.emitente,
        setor_projeto: initialData.setor_projeto || '',
        detectado_por: initialData.detectado_por || '',
        periodo_melhoria: initialData.periodo_melhoria || '',
        data_emissao: initialData.data_emissao,
        previsao_fechamento: initialData.previsao_fechamento || '',
        origem: initialData.origem,
        prioridade: initialData.prioridade,
        disciplina: initialData.disciplina,
        disciplina_outros: initialData.disciplina_outros || '',
        descricao_nc: initialData.descricao_nc,
        evidencias_nc: initialData.evidencias_nc,
        disposicao: initialData.disposicao,
        empresa_disposicao: initialData.empresa_disposicao || '',
        responsavel_disposicao: initialData.responsavel_disposicao || '',
        data_disposicao: initialData.data_disposicao || '',
        prazo_disposicao: initialData.prazo_disposicao || '',
        analise_disposicao: initialData.analise_disposicao || '',
        status: initialData.status,
        anexos_evidencias_nc: initialData.anexos_evidencias_nc || [],
        anexos_evidencia_disposicao: initialData.anexos_evidencia_disposicao || []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.cca || !formData.emitente || !formData.origem || !formData.prioridade) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validate "Outros" field
    if (formData.disciplina.includes('Outros') && !formData.disciplina_outros.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, especifique a disciplina/setor quando 'Outros' estiver selecionado.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isEditMode && initialData?.id) {
        await updateRNC(initialData.id, {
          ...formData,
          origem: formData.origem,
          prioridade: formData.prioridade,
          anexos_evidencias_nc: formData.anexos_evidencias_nc,
          anexos_evidencia_disposicao: formData.anexos_evidencia_disposicao
        } as Omit<RNC, 'id' | 'created_at' | 'updated_at'>);
        
        toast({
          title: "Sucesso",
          description: "RNC atualizada com sucesso!",
          variant: "default"
        });
        
        navigate(`/sgq/rnc/${initialData.id}`);
      } else {
        const newRNC = await createRNC({
          ...formData,
          origem: formData.origem,
          prioridade: formData.prioridade,
          anexos_evidencias_nc: formData.anexos_evidencias_nc,
          anexos_evidencia_disposicao: formData.anexos_evidencia_disposicao
        } as Omit<RNC, 'id' | 'created_at' | 'updated_at'>);
        
        toast({
          title: "Sucesso",
          description: "RNC criada com sucesso!",
          variant: "default"
        });
        
        navigate(`/sgq/rnc/${newRNC.id}`);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: isEditMode ? "Erro ao atualizar RNC. Tente novamente." : "Erro ao criar RNC. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisciplinaChange = (disciplina: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, disciplina: [...prev.disciplina, disciplina] }));
    } else {
      setFormData(prev => ({ ...prev, disciplina: prev.disciplina.filter(d => d !== disciplina) }));
    }
  };

  const handleDisposicaoChange = (disposicao: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, disposicao: [...prev.disposicao, disposicao] }));
    } else {
      setFormData(prev => ({ ...prev, disposicao: prev.disposicao.filter(d => d !== disposicao) }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/sgq/rnc')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{isEditMode ? 'Editar RNC' : 'Nova RNC'}</h1>
          <p className="text-muted-foreground">{isEditMode ? 'Atualize as informações da não conformidade' : 'Preencha as informações da não conformidade'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="numero">Número da RNC *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  placeholder="Ex: 001"
                  required
                  readOnly={isEditMode}
                  className={isEditMode ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cca">CCA *</Label>
                <Select 
                  value={formData.cca} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cca: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas.map((cca) => (
                      <SelectItem key={cca.id} value={cca.codigo}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="setor_projeto">Setor / Projeto</Label>
                <Input
                  id="setor_projeto"
                  value={formData.setor_projeto}
                  onChange={(e) => setFormData(prev => ({ ...prev, setor_projeto: e.target.value }))}
                  placeholder="Ex: Engenharia"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data">Data da NC</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detectado_por">Detectado por</Label>
                <Input
                  id="detectado_por"
                  value={formData.detectado_por}
                  onChange={(e) => setFormData(prev => ({ ...prev, detectado_por: e.target.value }))}
                  placeholder="Quem detectou a não conformidade"
                />
              </div>              

              <div className="space-y-2">
                <Label htmlFor="previsao_fechamento">Previsão de Fechamento</Label>
                <Input
                  id="previsao_fechamento"
                  type="date"
                  value={formData.previsao_fechamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, previsao_fechamento: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emitente">Emitente *</Label>
                <Input
                  id="emitente"
                  value={formData.emitente}
                  placeholder="Nome do emitente"
                  readOnly
                  className="bg-muted"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_emissao">Data de Emissão</Label>
                <Input
                  id="data_emissao"
                  type="date"
                  value={formData.data_emissao}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classificação */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Classificação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Origem da RNC *</Label>
                <Select value={formData.origem || ''} onValueChange={(value: any) => setFormData(prev => ({ ...prev, origem: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interna">Interna</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="terceiro">Terceiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Prioridade *</Label>
                <Select value={formData.prioridade || ''} onValueChange={(value: any) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Disciplinas */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Disciplina / Setor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                {DISCIPLINAS.map((disciplina) => (
                  <div key={disciplina} className="flex items-center space-x-2">
                    <Checkbox
                      id={disciplina}
                      checked={formData.disciplina.includes(disciplina)}
                      onCheckedChange={(checked) => handleDisciplinaChange(disciplina, !!checked)}
                    />
                    <Label htmlFor={disciplina} className="text-sm cursor-pointer">
                      {disciplina}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Conditional text input for "Outros" */}
              {formData.disciplina.includes('Outros') && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="disciplina_outros">Especifique a Disciplina/Setor *</Label>
                  <Input
                    id="disciplina_outros"
                    value={formData.disciplina_outros}
                    onChange={(e) => setFormData(prev => ({ ...prev, disciplina_outros: e.target.value }))}
                    placeholder="Descreva a disciplina/setor específico..."
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Descrições */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Descrição da Não Conformidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao_nc">Descrição da NC</Label>
                <Textarea
                  id="descricao_nc"
                  value={formData.descricao_nc}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao_nc: e.target.value }))}
                  placeholder="Descreva detalhadamente a não conformidade..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidencias_nc">Evidências da NC</Label>
                <Textarea
                  id="evidencias_nc"
                  value={formData.evidencias_nc}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidencias_nc: e.target.value }))}
                  placeholder="Liste as evidências que comprovam a não conformidade..."
                  rows={3}
                />
              </div>

              <EvidenceUpload
                rncId={`temp-${Date.now()}`}
                attachmentType="evidencia_nc"
                title="Evidências Fotográficas da NC"
                evidences={formData.anexos_evidencias_nc}
                onEvidencesChange={(evidences) => 
                  setFormData(prev => ({ ...prev, anexos_evidencias_nc: evidences }))
                }
              />
            </CardContent>
          </Card>

          {/* Disposição */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Disposição da NC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Ações de Disposição</Label>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {DISPOSICOES.map((disposicao) => (
                    <div key={disposicao} className="flex items-center space-x-2">
                      <Checkbox
                        id={disposicao}
                        checked={formData.disposicao.includes(disposicao)}
                        onCheckedChange={(checked) => handleDisposicaoChange(disposicao, !!checked)}
                      />
                      <Label htmlFor={disposicao} className="text-sm cursor-pointer">
                        {disposicao}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="responsavel_disposicao">Responsável pela Disposição</Label>
                  <Input
                    id="responsavel_disposicao"
                    value={formData.responsavel_disposicao}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsavel_disposicao: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prazo_disposicao">Prazo da Disposição</Label>
                  <Input
                    id="prazo_disposicao"
                    type="date"
                    value={formData.prazo_disposicao}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazo_disposicao: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analise_disposicao">Análise da Disposição</Label>
                <Textarea
                  id="analise_disposicao"
                  value={formData.analise_disposicao}
                  onChange={(e) => setFormData(prev => ({ ...prev, analise_disposicao: e.target.value }))}
                  placeholder="Descreva a análise e justificativa da disposição..."
                  rows={3}
                />
              </div>

              <EvidenceUpload
                rncId={`temp-${Date.now()}`}
                attachmentType="evidencia_disposicao"
                title="Evidências Fotográficas da Disposição"
                evidences={formData.anexos_evidencia_disposicao}
                onEvidencesChange={(evidences) => 
                  setFormData(prev => ({ ...prev, anexos_evidencia_disposicao: evidences }))
                }
              />
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/sgq/rnc')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-info">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : (isEditMode ? 'Atualizar RNC' : 'Salvar RNC')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
