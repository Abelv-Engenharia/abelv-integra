import { ArrowLeft, Shield, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";

const InspecaoExtintores = () => {
  const navigate = useNavigate();
  const [extintorSelecionado, setExtintorSelecionado] = useState('');
  const [inspecaoData, setInspecaoData] = useState({
    dataInspecao: '',
    responsavel: '',
    situacao: '',
    observacoes: '',
    itensVerificacao: {
      sinalizacao: false,
      acesso: false,
      lacre: false,
      manometro: false,
      mangueira: false,
      gatilho: false,
      cilindro: false,
      valvula: false
    }
  });

  // Mock de extintores para demonstração
  const extintores = [
    { id: 'EXT-001', tipo: 'Pó Químico', localizacao: 'Pavimento 1 - Corredor A' },
    { id: 'EXT-002', tipo: 'CO2', localizacao: 'Pavimento 1 - Sala de Máquinas' },
    { id: 'EXT-003', tipo: 'Água', localizacao: 'Pavimento 2 - Recepção' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setInspecaoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (item: string, checked: boolean) => {
    setInspecaoData(prev => ({
      ...prev,
      itensVerificacao: {
        ...prev.itensVerificacao,
        [item]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extintorSelecionado) {
      alert('Selecione um extintor para inspecionar');
      return;
    }
    
    // Aqui seria implementada a lógica de salvamento
    console.log('Dados da inspeção:', {
      extintor: extintorSelecionado,
      ...inspecaoData
    });
    
    alert('Inspeção registrada com sucesso!');
    
    // Reset form
    setExtintorSelecionado('');
    setInspecaoData({
      dataInspecao: '',
      responsavel: '',
      situacao: '',
      observacoes: '',
      itensVerificacao: {
        sinalizacao: false,
        acesso: false,
        lacre: false,
        manometro: false,
        mangueira: false,
        gatilho: false,
        cilindro: false,
        valvula: false
      }
    });
  };

  const itensVerificacao = [
    { id: 'sinalizacao', label: 'Sinalização visível e adequada' },
    { id: 'acesso', label: 'Acesso livre e desobstruído' },
    { id: 'lacre', label: 'Lacre íntegro' },
    { id: 'manometro', label: 'Manômetro na pressão correta' },
    { id: 'mangueira', label: 'Mangueira em bom estado' },
    { id: 'gatilho', label: 'Gatilho funcionando corretamente' },
    { id: 'cilindro', label: 'Cilindro sem danos aparentes' },
    { id: 'valvula', label: 'Válvula sem vazamentos' }
  ];

  return (
    <PermissionGuard 
      requiredPermissions={['prevencao_incendio_inspecao_extintores', 'prevencao_incendio']}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para realizar inspeções de extintores." />}
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
        <h1 className="text-2xl font-bold tracking-tight">Inspeção de Extintores</h1>
        <p className="text-muted-foreground">
          Realize inspeções periódicas nos extintores de incêndio
        </p>
      </div>

      {/* Seleção do Extintor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Selecionar Extintor
          </CardTitle>
          <CardDescription>
            Escolha o extintor que será inspecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="extintor">Extintor</Label>
            <Select onValueChange={setExtintorSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um extintor" />
              </SelectTrigger>
              <SelectContent>
                {extintores.map((extintor) => (
                  <SelectItem key={extintor.id} value={extintor.id}>
                    {extintor.id} - {extintor.tipo} ({extintor.localizacao})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Inspeção */}
      {extintorSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Dados da Inspeção
            </CardTitle>
            <CardDescription>
              Registre as informações da inspeção realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataInspecao">Data da Inspeção *</Label>
                  <Input
                    id="dataInspecao"
                    type="date"
                    value={inspecaoData.dataInspecao}
                    onChange={(e) => handleInputChange('dataInspecao', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável pela Inspeção *</Label>
                  <Input
                    id="responsavel"
                    placeholder="Nome do responsável"
                    value={inspecaoData.responsavel}
                    onChange={(e) => handleInputChange('responsavel', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacao">Situação Geral *</Label>
                <Select onValueChange={(value) => handleInputChange('situacao', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Conforme
                      </div>
                    </SelectItem>
                    <SelectItem value="nao-conforme">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Não Conforme
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Itens de Verificação</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {itensVerificacao.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={inspecaoData.itensVerificacao[item.id as keyof typeof inspecaoData.itensVerificacao]}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(item.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Descreva detalhes da inspeção, não conformidades encontradas, ações necessárias..."
                  value={inspecaoData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Shield className="mr-2 h-4 w-4" />
                  Registrar Inspeção
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/prevencao-incendio/dashboard')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}
      </div>
    </PermissionGuard>
  );
};

export default InspecaoExtintores;