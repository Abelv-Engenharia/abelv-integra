import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Dados disponíveis no sistema - futuramente virão do banco de dados
const OBRAS_CCA = [
  "CCA 023101 - Nexa PDSR",
  "CCA 023102 - Nexa Aripuanã",
  "CCA 023103 - Nexa Vazante",
  "CCA 024201 - Vale Carajás",
  "CCA 024202 - Vale Itabira",
  "CCA 025301 - Anglo American Minas-Rio"
];

const FUNCOES_DISPONIVEIS = [
  "Ajudante Geral",
  "Almoxarife",
  "Armador",
  "Bombeiro Civil",
  "Carpinteiro",
  "Eletricista",
  "Encanador",
  "Engenheiro Civil",
  "Engenheiro de Segurança",
  "Mecânico",
  "Motorista",
  "Operador de Equipamentos",
  "Pedreiro",
  "Pintor",
  "Servente",
  "Soldador",
  "Técnico de Segurança",
  "Topógrafo"
];

export default function NovaAdmissao() {
  const { toast } = useToast();
  const [rgUploadFiles, setRgUploadFiles] = useState<File[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    datanascimento: "",
    rg: "",
    orgaoemissor: "",
    uf: "",
    dataemissao: "",
    tipocontratacao: "CLT",
    funcao: "",
    obracca: "",
    email: "",
    whatsapp: ""
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/');
      return isValidType;
    });

    if (validFiles.length > 0) {
      setRgUploadFiles(validFiles);
      setShowForm(true);
      toast({
        title: "Arquivos carregados",
        description: `${validFiles.length} arquivo(s) de RG carregado(s). Preencha os dados manualmente.`
      });
    }
  };

  const validateCpf = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    
    // Algoritmo de validação do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cleanCpf.charAt(10));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleConfirmarPreCadastro = async () => {
    const newErrors: Record<string, boolean> = {};
    
    // Validar campos obrigatórios
    if (!formData.nome.trim()) newErrors.nome = true;
    if (!formData.cpf.trim()) newErrors.cpf = true;
    if (!formData.datanascimento) newErrors.datanascimento = true;
    if (!formData.rg.trim()) newErrors.rg = true;
    if (!formData.orgaoemissor.trim()) newErrors.orgaoemissor = true;
    if (!formData.uf.trim()) newErrors.uf = true;
    if (!formData.dataemissao) newErrors.dataemissao = true;
    if (!formData.funcao.trim()) newErrors.funcao = true;
    if (!formData.obracca.trim()) newErrors.obracca = true;
    if (!formData.email.trim()) newErrors.email = true;

    // Validar CPF
    if (formData.cpf && !validateCpf(formData.cpf)) {
      newErrors.cpf = true;
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique o dígito verificador do CPF.",
        variant: "destructive"
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // FASE 2: Criar registro em validacao_admissao e redirecionar
      try {
        const { data: validacao, error } = await supabase
          .from('validacao_admissao')
          .insert({
            cpf: formData.cpf.replace(/\D/g, ''),
            nome_completo: formData.nome,
            data_nascimento: formData.datanascimento,
            rg: formData.rg,
            rg_orgao_emissor: formData.orgaoemissor,
            rg_data_emissao: formData.dataemissao,
            funcao: formData.funcao,
            cca_codigo: formData.obracca.split(' - ')[0],
            cca_nome: formData.obracca.split(' - ')[1] || formData.obracca,
            email_principal: formData.email,
            celular: formData.whatsapp,
            dados_ok: false
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Pré-cadastro realizado com sucesso! 🎉",
          description: `${formData.nome} foi registrado(a). Redirecionando para validação completa...`
        });

        // Redirecionar para ValidacaoAdmissao com o ID
        setTimeout(() => {
          window.location.href = `/validacao-admissao?id=${validacao.id}`;
        }, 1500);

      } catch (error) {
        console.error('Erro ao criar validação:', error);
        toast({
          title: "Erro ao criar pré-cadastro",
          description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova admissão</h1>
          <p className="text-sm text-muted-foreground">
            Upload de RG e preenchimento manual dos dados do colaborador
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> O upload do RG (frente e verso) é obrigatório. 
          Não utilizamos OCR - todos os dados devem ser preenchidos manualmente no formulário.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload do RG
          </CardTitle>
          <CardDescription>
            Faça o upload do RG (frente e verso) em formato PDF, JPG ou PNG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Clique para selecionar ou arraste os arquivos aqui
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG até 20MB cada
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          {rgUploadFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Arquivos carregados:</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setRgUploadFiles([]);
                    setShowForm(false);
                  }}
                >
                  Alterar arquivos
                </Button>
              </div>
              {rgUploadFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do colaborador</CardTitle>
            <CardDescription>
              Preencha manualmente os dados conforme o RG enviado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome" className={errors.nome ? "text-destructive" : ""}>
                  Nome completo *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className={errors.nome ? "border-destructive" : ""}
                  placeholder="Nome completo conforme RG"
                />
              </div>

              <div>
                <Label htmlFor="cpf" className={errors.cpf ? "text-destructive" : ""}>
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  className={errors.cpf ? "border-destructive" : ""}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <Label htmlFor="tipocontratacao">
                  Tipo de contratação *
                </Label>
                <select
                  id="tipocontratacao"
                  value={formData.tipocontratacao}
                  onChange={(e) => handleInputChange("tipocontratacao", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="CLT">CLT</option>
                  <option value="Terceiro">Terceiro</option>
                  <option value="Estagiário">Estagiário</option>
                  <option value="Jovem Aprendiz">Jovem Aprendiz</option>
                </select>
              </div>

              <div>
                <Label htmlFor="funcao" className={errors.funcao ? "text-destructive" : ""}>
                  Função/CBO *
                </Label>
                <Select
                  value={formData.funcao}
                  onValueChange={(value) => handleInputChange("funcao", value)}
                >
                  <SelectTrigger className={errors.funcao ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50 max-h-[300px]">
                    {FUNCOES_DISPONIVEIS.map((funcao) => (
                      <SelectItem key={funcao} value={funcao}>
                        {funcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="obracca" className={errors.obracca ? "text-destructive" : ""}>
                  Obra/CCA *
                </Label>
                <Select
                  value={formData.obracca}
                  onValueChange={(value) => handleInputChange("obracca", value)}
                >
                  <SelectTrigger className={errors.obracca ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione a obra/CCA" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {OBRAS_CCA.map((obra) => (
                      <SelectItem key={obra} value={obra}>
                        {obra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label htmlFor="datanascimento" className={errors.datanascimento ? "text-destructive" : ""}>
                  Data de nascimento *
                </Label>
                <Input
                  id="datanascimento"
                  type="date"
                  value={formData.datanascimento}
                  onChange={(e) => handleInputChange("datanascimento", e.target.value)}
                  className={errors.datanascimento ? "border-destructive" : ""}
                />
              </div>

              <div>
                <Label htmlFor="rg" className={errors.rg ? "text-destructive" : ""}>
                  Rg *
                </Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) => handleInputChange("rg", e.target.value)}
                  className={errors.rg ? "border-destructive" : ""}
                  placeholder="Ex: 12.345.678-9"
                />
              </div>

              <div>
                <Label htmlFor="orgaoemissor" className={errors.orgaoemissor ? "text-destructive" : ""}>
                  Órgão emissor *
                </Label>
                <Input
                  id="orgaoemissor"
                  value={formData.orgaoemissor}
                  onChange={(e) => handleInputChange("orgaoemissor", e.target.value)}
                  className={errors.orgaoemissor ? "border-destructive" : ""}
                  placeholder="Ex: SSP, DETRAN"
                />
              </div>

              <div>
                <Label htmlFor="uf" className={errors.uf ? "text-destructive" : ""}>
                  Uf *
                </Label>
                <Input
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => handleInputChange("uf", e.target.value.toUpperCase())}
                  className={errors.uf ? "border-destructive" : ""}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="dataemissao" className={errors.dataemissao ? "text-destructive" : ""}>
                  Data de emissão *
                </Label>
                <Input
                  id="dataemissao"
                  type="date"
                  value={formData.dataemissao}
                  onChange={(e) => handleInputChange("dataemissao", e.target.value)}
                  className={errors.dataemissao ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleConfirmarPreCadastro} size="lg">
                Confirmar pré-cadastro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}