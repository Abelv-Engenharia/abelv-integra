import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building2, Upload, Save, ArrowLeft, DollarSign, ClipboardList, AlertTriangle } from "lucide-react";
import { ResumoCustos } from "@/components/alojamento/ResumoCustos";
import { GaleriaFotos } from "@/components/alojamento/GaleriaFotos";
import { BotaoValidacao } from "@/components/alojamento/BotaoValidacao";
import { PreviewEmailAnaliseContrato } from "@/components/alojamento/PreviewEmailAnaliseContrato";

interface FormularioAnaliseTabProps {
  form: UseFormReturn<any>;
  onVoltar?: () => void;
  contratoPdfUrl: string;
  setContratoPdfUrl: (url: string) => void;
  vistoriaPdfUrl: string;
  setVistoriaPdfUrl: (url: string) => void;
  contratoInicial?: any;
}

const ESTADOS_BR = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export function FormularioAnaliseTab({ 
  form, 
  onVoltar, 
  contratoPdfUrl, 
  setContratoPdfUrl, 
  vistoriaPdfUrl, 
  setVistoriaPdfUrl,
  contratoInicial 
}: FormularioAnaliseTabProps) {

  // Carregar contrato inicial se fornecido
  useEffect(() => {
    if (contratoInicial) {
      form.reset({
        ...contratoInicial,
        // Converter datas de string para formato do formulário
        data_inicio_contrato: contratoInicial.data_inicio_contrato ? new Date(contratoInicial.data_inicio_contrato).toISOString().split('T')[0] : '',
        data_fim_contrato: contratoInicial.data_fim_contrato ? new Date(contratoInicial.data_fim_contrato).toISOString().split('T')[0] : '',
      });
      
      // Carregar URLs de PDFs se existirem
      if (contratoInicial.contrato_pdf_url) {
        setContratoPdfUrl(contratoInicial.contrato_pdf_url);
      }
      if (contratoInicial.vistoria_pdf_url) {
        setVistoriaPdfUrl(contratoInicial.vistoria_pdf_url);
      }
      
      toast.info("Contrato carregado para edição");
    }
  }, [contratoInicial]);

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      form.setValue('logradouro', data.logradouro);
      form.setValue('bairro', data.bairro);
      form.setValue('cidade', data.localidade);
      form.setValue('uf', data.uf);
      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    }
  };

  // Destinatários do email de validação
  const destinatariosEmail = [
    "financeiro@abelv.com.br",
    "administracao@abelv.com.br", 
    "superintendencia@abelv.com.br"
  ];

  // Cálculo automático de IR para Pessoa Física (Tabela 2025)
  useEffect(() => {
    const tipoLocador = form.watch("tipo_locador");
    const temIR = form.watch("tem_ir");
    const valorMensal = form.watch("valor_mensal");

    if (tipoLocador === "pf" && temIR && valorMensal > 0) {
      const base = valorMensal;
      let aliquota = 0;
      let parcela = 0;

      // Tabela IR 2025
      if (base <= 2428.80) {
        aliquota = 0;
        parcela = 0;
      } else if (base <= 2826.65) {
        aliquota = 7.5;
        parcela = 182.16;
      } else if (base <= 3751.05) {
        aliquota = 15;
        parcela = 394.16;
      } else if (base <= 4664.68) {
        aliquota = 22.5;
        parcela = 675.49;
      } else {
        aliquota = 27.5;
        parcela = 908.73;
      }

      const valorRetido = Math.max(0, (base * aliquota / 100) - parcela);
      const valorLiquido = valorMensal - valorRetido;

      form.setValue("ir_base_calculo", base);
      form.setValue("ir_aliquota", aliquota);
      form.setValue("ir_parcela_deduzir", parcela);
      form.setValue("ir_valor_retido", valorRetido);
      form.setValue("valor_liquido_pagar", valorLiquido);
    } else if (!temIR) {
      form.setValue("ir_base_calculo", undefined);
      form.setValue("ir_aliquota", undefined);
      form.setValue("ir_parcela_deduzir", undefined);
      form.setValue("ir_valor_retido", undefined);
      form.setValue("valor_liquido_pagar", valorMensal || 0);
    }
  }, [
    form.watch("tipo_locador"),
    form.watch("tem_ir"),
    form.watch("valor_mensal")
  ]);

  const handleUploadContrato = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máx 10MB)");
      return;
    }

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('analises-contratuais')
      .upload(`contratos/${fileName}`, file);

    if (error) {
      toast.error("Erro no upload: " + error.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('analises-contratuais')
      .getPublicUrl(`contratos/${fileName}`);

    setContratoPdfUrl(publicUrl);
    toast.success("Contrato enviado com sucesso");
  };

  const handleUploadVistoria = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('analises-contratuais')
      .upload(`vistorias/${fileName}`, file);

    if (error) {
      toast.error("Erro no upload: " + error.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('analises-contratuais')
      .getPublicUrl(`vistorias/${fileName}`);

    setVistoriaPdfUrl(publicUrl);
    toast.success("Vistoria enviada com sucesso");
  };

  const tipoLocador = form.watch("tipo_locador");
  const temIR = form.watch("tem_ir");
  const usarFotos = form.watch("usar_fotos_validacao");
  const fotosImovel = form.watch("fotos_imovel") || [];
  const valorMensal = form.watch("valor_mensal") || 0;
  const prazoMeses = form.watch("prazo_contratual") || 0;
  const capacidadeTotal = form.watch("capacidade_total") || 0;
  
  const valorTotalContrato = valorMensal * prazoMeses;
  const valorUnitario = (capacidadeTotal > 0 && prazoMeses > 0) 
    ? valorTotalContrato / (prazoMeses * capacidadeTotal) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Botão Voltar */}
      {onVoltar && (
        <div className="flex justify-between items-center pb-4 border-b">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onVoltar}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar Ao Dashboard
          </Button>
          <Badge variant="outline" className="text-lg py-2 px-4">
            📋 Análise Contratual De Alojamento
          </Badge>
        </div>
      )}

      {/* ==================== ETAPA 1: CADASTRO DO CONTRATO ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-500">
          <Badge className="bg-blue-500 text-lg py-2 px-4">Etapa 1</Badge>
          <div>
            <h2 className="text-2xl font-bold">Cadastro Do Contrato</h2>
            <p className="text-sm text-muted-foreground">Preencha todas as informações do contrato de locação</p>
          </div>
        </div>

        {/* 1.1: Identificação do Contrato e Locador */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg">1.1 Identificação Do Contrato E Locador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Nome Do Fornecedor
                </Label>
                <Input {...form.register("fornecedor_nome")} required className={!form.watch("fornecedor_nome") ? "border-red-500 border-2" : ""} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Cnpj Do Fornecedor
                </Label>
                <Input {...form.register("fornecedor_cnpj")} required className={!form.watch("fornecedor_cnpj") ? "border-red-500 border-2" : ""} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Número Do Contrato
                </Label>
                <Input {...form.register("numero_contrato")} required className={!form.watch("numero_contrato") ? "border-red-500 border-2" : ""} placeholder="Ex: MOD ALOJAMENTO 001" />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Dados do Proprietário */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dados Do Proprietário/Locador</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Tipo De Locador
                  </Label>
                  <RadioGroup
                    value={tipoLocador}
                    onValueChange={(value) => form.setValue("tipo_locador", value as "pf" | "pj")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pf" id="pf" />
                      <Label htmlFor="pf" className="font-normal cursor-pointer">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pj" id="pj" />
                      <Label htmlFor="pj" className="font-normal cursor-pointer">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Nome Do Proprietário
                  </Label>
                  <Input {...form.register("nome_proprietario")} required className={!form.watch("nome_proprietario") ? "border-red-500 border-2" : ""} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> {tipoLocador === "pf" ? "Cpf" : "Cnpj"}
                  </Label>
                  <Input {...form.register("cpf_proprietario")} required className={!form.watch("cpf_proprietario") ? "border-red-500 border-2" : ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Imobiliária (se Houver)</Label>
                <Input {...form.register("imobiliaria")} placeholder="Nome da imobiliária intermediadora" />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Endereço do Imóvel */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Endereço Do Imóvel</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Cep
                  </Label>
                  <Input 
                    {...form.register("cep")} 
                    required 
                    maxLength={9}
                    placeholder="00000-000"
                    onBlur={(e) => buscarCEP(e.target.value)}
                    className={!form.watch("cep") ? "border-red-500 border-2" : ""}
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Logradouro
                  </Label>
                  <Input {...form.register("logradouro")} required className={!form.watch("logradouro") ? "border-red-500 border-2" : ""} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Número
                  </Label>
                  <Input {...form.register("numero")} required className={!form.watch("numero") ? "border-red-500 border-2" : ""} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium">Complemento</Label>
                  <Input {...form.register("complemento")} placeholder="Apto, Bloco..." />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Bairro
                  </Label>
                  <Input {...form.register("bairro")} required className={!form.watch("bairro") ? "border-red-500 border-2" : ""} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Cidade
                  </Label>
                  <Input {...form.register("cidade")} required className={!form.watch("cidade") ? "border-red-500 border-2" : ""} />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Uf
                  </Label>
                  <Select value={form.watch("uf")} onValueChange={(value) => form.setValue("uf", value)}>
                    <SelectTrigger className={!form.watch("uf") ? "border-red-500 border-2" : ""}>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1.2: Documentos do Contrato */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              1.2 Documentos Do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <span className="text-red-500">*</span> 
                Contrato Pdf
                <Badge variant="outline" className="text-xs">Obrigatório</Badge>
              </Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf" onChange={handleUploadContrato} className="flex-1" />
                {contratoPdfUrl && (
                  <a href={contratoPdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline" size="sm">📄 Ver Pdf</Button>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={form.watch("tem_vistoria")}
                  onChange={(e) => form.setValue("tem_vistoria", e.target.checked)}
                  className="w-4 h-4"
                />
                <Label className="font-medium cursor-pointer">Tem Vistoria De Entrada/saída?</Label>
              </div>
              
              {form.watch("tem_vistoria") && (
                <div className="flex items-center gap-2 ml-6">
                  <Input type="file" accept=".pdf" onChange={handleUploadVistoria} className="flex-1" />
                  {vistoriaPdfUrl && (
                    <a href={vistoriaPdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button type="button" variant="outline" size="sm">📄 Ver Vistoria</Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 1.3: Valores e Condições Contratuais */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              1.3 Valores E Condições Contratuais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Valores e Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Tipo De Alojamento
                </Label>
                <Select value={form.watch("tipo_alojamento")} onValueChange={(value) => form.setValue("tipo_alojamento", value as "MOD" | "MOI")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOD">Mod - Mão De Obra Direta</SelectItem>
                    <SelectItem value="MOI">Moi - Mão De Obra Indireta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Valor Mensal (r$)
                </Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...form.register("valor_mensal", { valueAsNumber: true })} 
                  required 
                  placeholder="0,00"
                  className={!form.watch("valor_mensal") ? "border-red-500 border-2" : ""} 
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Dia De Vencimento
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="31"
                  {...form.register("dia_vencimento", { valueAsNumber: true })} 
                  required 
                  placeholder="Ex: 10"
                  className={!form.watch("dia_vencimento") ? "border-red-500 border-2" : ""} 
                />
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 font-medium">
                  <span className="text-red-500">*</span> Forma De Pagamento
                </Label>
                <Input {...form.register("forma_pagamento")} required placeholder="Ex: Transferência bancária" className={!form.watch("forma_pagamento") ? "border-red-500 border-2" : ""} />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Tipo De Pagamento</Label>
                <Input {...form.register("tipo_pagamento")} placeholder="Ex: PIX, TED, Boleto" />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Prazos */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Prazo Contratual</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Data Início
                  </Label>
                  <Input 
                    type="date" 
                    {...form.register("data_inicio_contrato")} 
                    required 
                    className={!form.watch("data_inicio_contrato") ? "border-red-500 border-2" : ""} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Data Fim
                  </Label>
                  <Input 
                    type="date" 
                    {...form.register("data_fim_contrato")} 
                    required 
                    className={!form.watch("data_fim_contrato") ? "border-red-500 border-2" : ""} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1 font-medium">
                    <span className="text-red-500">*</span> Prazo (meses)
                  </Label>
                  <Input 
                    type="number" 
                    min="1"
                    {...form.register("prazo_contratual", { valueAsNumber: true })} 
                    required 
                    placeholder="Ex: 12"
                    className={!form.watch("prazo_contratual") ? "border-red-500 border-2" : ""} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.4: Informações do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle>🏠 Informações Do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Quantidade De Quartos <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1"
                  {...form.register("quantidade_quartos", { valueAsNumber: true })} 
                  className={!form.watch("quantidade_quartos") ? "border-red-500" : ""} 
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Capacidade Total (pessoas) <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="number" 
                  min="1"
                  {...form.register("capacidade_total", { valueAsNumber: true })} 
                  className={!form.watch("capacidade_total") ? "border-red-500" : ""} 
                />
              </div>

              <div className="space-y-2">
                <Label>Valor Unitário Mensal Por Pessoa</Label>
                <div className="relative">
                  <Input 
                    value={valorUnitario > 0 ? `R$ ${valorUnitario.toFixed(2)}` : 'R$ 0,00'} 
                    disabled 
                    className="bg-muted"
                  />
                  {valorUnitario > 0 && (
                    <Badge 
                      className={`absolute right-2 top-2 ${
                        valorUnitario > 1800 ? 'bg-red-500' : 
                        valorUnitario > 1200 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                    >
                      {valorUnitario > 1800 ? 'Acima do padrão' : 
                       valorUnitario > 1200 ? 'Dentro do limite' : 
                       'Abaixo do custo médio'}
                    </Badge>
                  )}
                </div>
                {valorUnitario > 1800 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Acima do padrão ABELV (R$ 1.800,00)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações Do Imóvel</Label>
              <Textarea 
                {...form.register("observacoes_imovel")} 
                placeholder="Ex: 2 banheiros, garagem, área de lazer..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.5: Caução e Garantias */}
        <Card>
          <CardHeader>
            <CardTitle>🔒 Caução E Garantias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Valor Da Caução (r$)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...form.register("caucao", { valueAsNumber: true })} 
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Meses De Caução</Label>
                <Input 
                  type="number" 
                  min="0"
                  {...form.register("meses_caucao", { valueAsNumber: true })} 
                  placeholder="Ex: 3"
                />
              </div>

              <div className="space-y-2">
                <Label>Conta Poupança (se Aplicável)</Label>
                <Input {...form.register("conta_poupanca")} placeholder="Número da conta" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.6: Multa Rescisória */}
        <Card>
          <CardHeader>
            <CardTitle>⚖️ Multa Rescisória</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Percentual De Multa (%)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...form.register("multa_rescisoria_percentual", { valueAsNumber: true })} 
                  placeholder="Ex: 20"
                />
              </div>

              <div className="space-y-2">
                <Label>Despesas Adicionais</Label>
                <Input {...form.register("despesas_adicionais")} placeholder="Ex: IPTU, condomínio..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cláusula De Multa</Label>
              <Textarea 
                {...form.register("clausula_multa")} 
                rows={4}
                placeholder="Descreva as condições de multa rescisória..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.7: Imposto de Renda */}
        <Card>
          <CardHeader>
            <CardTitle>💵 Imposto De Renda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={temIR}
                onChange={(e) => form.setValue("tem_ir", e.target.checked)}
              />
              <Label>Há Retenção De Ir?</Label>
            </div>

            {temIR && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                {/* Alerta de Cálculo Automático para PF */}
                {tipoLocador === "pf" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                      <p className="text-blue-700 font-medium">
                        Cálculo Automático - Tabela Ir 2025 Para Pessoa Física
                      </p>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      Os campos abaixo são calculados automaticamente com base no valor mensal.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base De Cálculo (r$)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...form.register("ir_base_calculo", { valueAsNumber: true })} 
                      readOnly={tipoLocador === "pf"}
                      className={tipoLocador === "pf" ? "bg-gray-100 cursor-not-allowed" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alíquota (%)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...form.register("ir_aliquota", { valueAsNumber: true })} 
                      readOnly={tipoLocador === "pf"}
                      className={tipoLocador === "pf" ? "bg-gray-100 cursor-not-allowed" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Parcela A Deduzir (r$)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...form.register("ir_parcela_deduzir", { valueAsNumber: true })} 
                      readOnly={tipoLocador === "pf"}
                      className={tipoLocador === "pf" ? "bg-gray-100 cursor-not-allowed" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Valor Retido (r$)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...form.register("ir_valor_retido", { valueAsNumber: true })} 
                      readOnly
                      className="bg-amber-50 border-amber-200 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Valor Líquido A Pagar (r$)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...form.register("valor_liquido_pagar", { valueAsNumber: true })} 
                      readOnly
                      className="bg-green-50 border-green-200 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Tabela de Referência IR 2025 */}
                {tipoLocador === "pf" && (
                  <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-3">📊 Tabela Ir 2025 - Pessoa Física</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Base De Cálculo</th>
                            <th className="p-2 text-center">Alíquota</th>
                            <th className="p-2 text-right">Parcela A Deduzir</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-2">Até R$ 2.428,80</td>
                            <td className="p-2 text-center">Isento</td>
                            <td className="p-2 text-right">R$ 0,00</td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-2">De R$ 2.428,81 A R$ 2.826,65</td>
                            <td className="p-2 text-center">7,5%</td>
                            <td className="p-2 text-right">R$ 182,16</td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-2">De R$ 2.826,66 A R$ 3.751,05</td>
                            <td className="p-2 text-center">15%</td>
                            <td className="p-2 text-right">R$ 394,16</td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-2">De R$ 3.751,06 A R$ 4.664,68</td>
                            <td className="p-2 text-center">22,5%</td>
                            <td className="p-2 text-right">R$ 675,49</td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-2">Acima De R$ 4.664,68</td>
                            <td className="p-2 text-center">27,5%</td>
                            <td className="p-2 text-right">R$ 908,73</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seção 1.8: Fotos do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle>📸 Fotos Do Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <GaleriaFotos
              fotos={fotosImovel}
              onChange={(novasFotos) => form.setValue("fotos_imovel", novasFotos)}
              maxFotos={10}
            />
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox"
                checked={usarFotos}
                onChange={(e) => form.setValue("usar_fotos_validacao", e.target.checked)}
              />
              <Label>Usar essas fotos na validação?</Label>
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.9: Responsável e Conclusão */}
        <Card>
          <CardHeader>
            <CardTitle>✍️ Análise E Conclusão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Responsável Pela Análise <span className="text-red-500">*</span>
                </Label>
                <Input 
                  {...form.register("responsavel_analise")} 
                  required 
                  className={!form.watch("responsavel_analise") ? "border-red-500" : ""} 
                />
              </div>

              <div className="space-y-2">
                <Label>Gestor Responsável</Label>
                <Input {...form.register("gestor_responsavel")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Texto De Conclusão <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                {...form.register("texto_conclusao")} 
                rows={3}
                required
                className={!form.watch("texto_conclusao") ? "border-red-500" : ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Destinatário Principal - Nome</Label>
                <Input {...form.register("destinatario_principal_nome")} />
              </div>

              <div className="space-y-2">
                <Label>Destinatário Principal - Email</Label>
                <Input type="email" {...form.register("destinatario_principal_email")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Emails Adicionais (separados Por Vírgula)</Label>
              <Textarea 
                {...form.register("emails_adicionais")} 
                rows={2}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção 1.10: Resumo de Custos */}
        <ResumoCustos
          valorMensal={valorMensal || 0}
          prazoMeses={prazoMeses || 0}
          dataInicio={form.watch("data_inicio_contrato") || ""}
          dataFim={form.watch("data_fim_contrato") || ""}
          caucao={form.watch("caucao") || 0}
          mesesCaucao={form.watch("meses_caucao") || 0}
          irRetido={form.watch("ir_valor_retido") || 0}
          valorLiquido={form.watch("valor_liquido_pagar") || 0}
        />
      </div>

      {/* ==================== PREVIEW DO EMAIL ==================== */}
      <Separator className="my-8" />
      <div className="space-y-6">
        <PreviewEmailAnaliseContrato 
          dadosContrato={form.getValues()}
          destinatarios={destinatariosEmail}
        />
      </div>

      {/* ==================== VALIDAÇÕES ==================== */}
      <Separator className="my-8" />
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500">Etapa Final</Badge>
          <h2 className="text-2xl font-bold">Validações Por Departamento</h2>
        </div>

        {/* Validação Financeiro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold">💰 Validação Financeiro</h3>
          </div>
          <BotaoValidacao
            titulo="Análise Financeira"
            status={form.watch("status_financeiro") || "pendente"}
            observacao={form.watch("observacao_financeiro") || ""}
            onValidar={(status, obs) => {
              form.setValue("status_financeiro", status);
              form.setValue("observacao_financeiro", obs);
            }}
            area="financeiro"
          />
        </div>

        <Separator />

        {/* Validação ADM */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">📋 Validação Administrativa</h3>
          </div>
          <BotaoValidacao
            titulo="Análise Administrativa"
            status={form.watch("status_adm") || "pendente"}
            observacao={form.watch("observacao_adm") || ""}
            onValidar={(status, obs) => {
              form.setValue("status_adm", status);
              form.setValue("observacao_adm", obs);
            }}
            area="adm"
          />
        </div>

        <Separator />

        {/* Validação Superintendência */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold">🏢 Validação Superintendência</h3>
          </div>
          <BotaoValidacao
            titulo="Análise Superintendência"
            status={form.watch("status_super") || "pendente"}
            observacao={form.watch("observacao_super") || ""}
            onValidar={(status, obs) => {
              form.setValue("status_super", status);
              form.setValue("observacao_super", obs);
            }}
            area="super"
          />
        </div>
      </div>


      {/* Botão de Salvar */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <Button type="submit" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Salvar Análise
        </Button>
      </div>
    </div>
  );
}
