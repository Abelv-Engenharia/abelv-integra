import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";
import QRCodeDialog from "@/components/prevencao-incendio/QRCodeDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { gerarCodigoExtintor } from "@/utils/extintorUtils";
import { PageLoader } from "@/components/common/PageLoader";

const CadastroExtintores = () => {
  const navigate = useNavigate();
  const { data: userCCAs, isLoading: loadingCCAs } = useUserCCAs();
  
  const [formData, setFormData] = useState({
    codigo: '',
    cca_id: '',
    tipo: '',
    capacidade: '',
    fabricante: '',
    dataFabricacao: '',
    dataVencimento: '',
    localizacao: '',
    observacoes: ''
  });
  
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [gerandoCodigo, setGerandoCodigo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gerar código automaticamente quando CCA, tipo e capacidade forem preenchidos
  useEffect(() => {
    const gerarCodigo = async () => {
      if (formData.cca_id && formData.tipo && formData.capacidade) {
        setGerandoCodigo(true);
        try {
          const ccaSelecionado = userCCAs?.find(
            (cca) => cca.id.toString() === formData.cca_id
          );
          
          if (ccaSelecionado) {
            const codigoGerado = await gerarCodigoExtintor(
              ccaSelecionado.codigo,
              formData.tipo,
              formData.capacidade
            );
            setFormData((prev) => ({ ...prev, codigo: codigoGerado }));
          }
        } catch (error) {
          console.error("Erro ao gerar código:", error);
          toast({
            title: "Erro",
            description: "Erro ao gerar código do extintor",
            variant: "destructive",
          });
        } finally {
          setGerandoCodigo(false);
        }
      }
    };

    gerarCodigo();
  }, [formData.cca_id, formData.tipo, formData.capacidade, userCCAs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.codigo || !formData.cca_id || !formData.tipo || !formData.capacidade || !formData.localizacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salvar extintor no banco de dados
      const { data, error } = await supabase
        .from('extintores')
        .insert([{
          codigo: formData.codigo,
          cca_id: parseInt(formData.cca_id),
          tipo: formData.tipo,
          capacidade: formData.capacidade,
          fabricante: formData.fabricante || null,
          data_fabricacao: formData.dataFabricacao || null,
          data_vencimento: formData.dataVencimento || null,
          localizacao: formData.localizacao,
          observacoes: formData.observacoes || null
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar extintor:', error);
        toast({
          title: "Erro ao cadastrar",
          description: "Erro ao cadastrar o extintor. Verifique se o código já não existe.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Extintor cadastrado com sucesso.",
      });
      
      // Mostrar QR Code após sucesso
      setShowQRDialog(true);
      
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao cadastrar extintor.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRecord = () => {
    // Reset form
    setFormData({
      codigo: '',
      cca_id: '',
      tipo: '',
      capacidade: '',
      fabricante: '',
      dataFabricacao: '',
      dataVencimento: '',
      localizacao: '',
      observacoes: ''
    });
    setShowQRDialog(false);
  };

  if (loadingCCAs) {
    return <PageLoader text="Carregando..." size="md" />;
  }

  return (
    <PermissionGuard 
      requiredPermissions={['prevencao_incendio_cadastro_extintores', 'prevencao_incendio']}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para cadastrar extintores." />}
    >
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Cadastro de Extintores</h1>
          <p className="text-muted-foreground">
            Registre novos extintores no sistema de prevenção contra incêndios
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Extintor</CardTitle>
            <CardDescription>
              Preencha os dados do extintor para cadastro no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cca_id">CCA *</Label>
                  <Select 
                    value={formData.cca_id} 
                    onValueChange={(value) => handleInputChange('cca_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCCAs?.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id.toString()}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo">Código do Extintor *</Label>
                  <div className="relative">
                    <Input
                      id="codigo"
                      placeholder="Será gerado automaticamente"
                      value={formData.codigo}
                      readOnly
                      required
                      className="pr-10"
                    />
                    {gerandoCodigo && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gerado automaticamente ao selecionar CCA, tipo e capacidade
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo do Extintor *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => handleInputChange('tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agua">Água</SelectItem>
                      <SelectItem value="po-quimico">Pó Químico</SelectItem>
                      <SelectItem value="co2">CO2</SelectItem>
                      <SelectItem value="espuma">Espuma</SelectItem>
                      <SelectItem value="gas-inerte">Gás Inerte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade *</Label>
                  <Input
                    id="capacidade"
                    placeholder="Ex: 6kg, 4L"
                    value={formData.capacidade}
                    onChange={(e) => handleInputChange('capacidade', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabricante">Fabricante</Label>
                  <Input
                    id="fabricante"
                    placeholder="Nome do fabricante"
                    value={formData.fabricante}
                    onChange={(e) => handleInputChange('fabricante', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                  <Input
                    id="dataFabricacao"
                    type="date"
                    value={formData.dataFabricacao}
                    onChange={(e) => handleInputChange('dataFabricacao', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                  <Input
                    id="dataVencimento"
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização *</Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Pavimento 1 - Corredor A"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o extintor..."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="default"
                  onClick={() => navigate('/prevencao-incendio/dashboard')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  size="default"
                  disabled={isSubmitting || gerandoCodigo}
                >
                  {isSubmitting ? "Salvando..." : "Cadastrar Extintor"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <QRCodeDialog
          open={showQRDialog}
          onOpenChange={setShowQRDialog}
          extintorData={{
            codigo: formData.codigo,
            tipo: formData.tipo,
            capacidade: formData.capacidade,
            localizacao: formData.localizacao
          }}
        />
      </div>
    </PermissionGuard>
  );
};

export default CadastroExtintores;
