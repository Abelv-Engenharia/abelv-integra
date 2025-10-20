import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calcularIR, type DadosIR } from "./CalculadoraIR";
import { TabelaIndicadores } from "./TabelaIndicadores";
import { UploadFotos } from "./UploadFotos";

interface SecaoCadastroProps {
  dados: {
    tipoLocador: string;
    nomeRazaoSocial: string;
    cpfCnpj: string;
    imobiliaria: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    tipoAlojamento: string;
    quartos: string;
    capacidade: string;
    distanciaObra: string;
    ccaCodigo: string;
    numeroContrato: string;
    aluguelMensal: string;
    diaVencimento: string;
    tipoPagamento: string;
    formaPagamento: string;
    caucao: string;
    contaPoupanca: string;
    mesesCaucao: string;
    prazoContratual: string;
    dataInicio: string;
    dataFim: string;
    multaRescisoria: string;
    despesasAdicionais: string;
    temTaxaLixo: boolean;
    temCondominio: boolean;
    temSeguroPredial: boolean;
    checklistReajuste: boolean;
    checklistManutencao: boolean;
    checklistVistoriaNr24: boolean;
    checklistSeguro: boolean;
    checklistForo: boolean;
    particularidades: string;
    numeroMoradores: string;
    contratoPdfUrl: string;
    fotosImovel: any[];
  };
  onChange: (campo: string, valor: any) => void;
  onBuscarFornecedor: () => void;
  onBuscarImovel: () => void;
  onSalvarRascunho: () => void;
  onDistribuir: () => void;
  loadingCep: boolean;
}

export function SecaoCadastro({
  dados,
  onChange,
  onBuscarFornecedor,
  onBuscarImovel,
  onSalvarRascunho,
  onDistribuir,
  loadingCep,
}: SecaoCadastroProps) {
  const [dadosIR, setDadosIR] = useState<DadosIR | null>(null);

  // Recalcular IR quando necessário
  useState(() => {
    if (dados.tipoLocador === 'pf' && dados.aluguelMensal) {
      const resultado = calcularIR(parseFloat(dados.aluguelMensal) || 0);
      setDadosIR(resultado);
    } else {
      setDadosIR(null);
    }
  });

  const calcularDespesas = () => {
    return (
      (dados.temTaxaLixo ? 50 : 0) +
      (dados.temCondominio ? 200 : 0) +
      (dados.temSeguroPredial ? 100 : 0)
    );
  };

  const calcularValorMensalLiquido = () => {
    const despesas = calcularDespesas();
    const ir = dados.tipoLocador === 'pf' ? (dadosIR?.valorIR || 0) : 0;
    return parseFloat(dados.aluguelMensal || '0') + despesas - ir;
  };

  const calcularValorTotalContrato = () => {
    return calcularValorMensalLiquido() * parseInt(dados.prazoContratual || '0');
  };

  const calcularValorPorMorador = () => {
    const moradores = parseInt(dados.numeroMoradores || '0');
    return moradores > 0 ? calcularValorMensalLiquido() / moradores : 0;
  };

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const indicadores = [
    { icone: '💰', label: 'Total Do Contrato', valor: formatarMoeda(calcularValorTotalContrato()), status: 'neutro' as const },
    { icone: '📅', label: 'Mensal Líquido', valor: formatarMoeda(calcularValorMensalLiquido()), status: 'neutro' as const },
    { icone: '🧮', label: 'Ir Mensal', valor: formatarMoeda(dadosIR?.valorIR || 0), status: 'neutro' as const },
    { icone: '🏘️', label: 'Custo Por Morador', valor: formatarMoeda(calcularValorPorMorador()), status: 'positivo' as const },
  ];

  const validarCamposObrigatorios = () => {
    return (
      dados.tipoLocador &&
      dados.nomeRazaoSocial &&
      dados.cpfCnpj &&
      dados.cep &&
      dados.logradouro &&
      dados.numero &&
      dados.bairro &&
      dados.cidade &&
      dados.uf &&
      dados.ccaCodigo &&
      dados.aluguelMensal &&
      dados.contratoPdfUrl
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Cadastro Do Contrato
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha todos os dados do contrato antes de distribuir para aprovação
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["locador", "imovel", "financeiro"]} className="space-y-4">
          {/* 1.1 Dados do Locador */}
          <AccordionItem value="locador">
            <AccordionTrigger className="text-lg font-semibold">
              1. Dados Do Locador
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={onBuscarFornecedor}>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Fornecedor Cadastrado
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-red-500">Tipo De Locador *</Label>
                  <Select value={dados.tipoLocador} onValueChange={(v) => onChange('tipoLocador', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pf">Pessoa Física</SelectItem>
                      <SelectItem value="pj">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-red-500">Nome/Razão Social *</Label>
                  <Input value={dados.nomeRazaoSocial} onChange={(e) => onChange('nomeRazaoSocial', e.target.value)} />
                </div>
                <div>
                  <Label className="text-red-500">Cpf/Cnpj *</Label>
                  <Input value={dados.cpfCnpj} onChange={(e) => onChange('cpfCnpj', e.target.value)} />
                </div>
                <div>
                  <Label>Imobiliária (Opcional)</Label>
                  <Input value={dados.imobiliaria} onChange={(e) => onChange('imobiliaria', e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 1.2 Dados do Imóvel */}
          <AccordionItem value="imovel">
            <AccordionTrigger className="text-lg font-semibold">
              2. Dados Do Imóvel
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={onBuscarImovel}>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Imóvel Usado Anteriormente
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-red-500">Cep *</Label>
                  <Input 
                    value={dados.cep} 
                    onChange={(e) => onChange('cep', e.target.value)} 
                    placeholder="00000-000"
                    disabled={loadingCep}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-red-500">Logradouro *</Label>
                  <Input value={dados.logradouro} onChange={(e) => onChange('logradouro', e.target.value)} />
                </div>
                <div>
                  <Label className="text-red-500">Número *</Label>
                  <Input value={dados.numero} onChange={(e) => onChange('numero', e.target.value)} />
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input value={dados.complemento} onChange={(e) => onChange('complemento', e.target.value)} />
                </div>
                <div>
                  <Label className="text-red-500">Bairro *</Label>
                  <Input value={dados.bairro} onChange={(e) => onChange('bairro', e.target.value)} />
                </div>
                <div>
                  <Label className="text-red-500">Cidade *</Label>
                  <Input value={dados.cidade} onChange={(e) => onChange('cidade', e.target.value)} />
                </div>
                <div>
                  <Label className="text-red-500">Uf *</Label>
                  <Select value={dados.uf} onValueChange={(v) => onChange('uf', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AL">AL</SelectItem>
                      <SelectItem value="AP">AP</SelectItem>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="BA">BA</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="DF">DF</SelectItem>
                      <SelectItem value="ES">ES</SelectItem>
                      <SelectItem value="GO">GO</SelectItem>
                      <SelectItem value="MA">MA</SelectItem>
                      <SelectItem value="MT">MT</SelectItem>
                      <SelectItem value="MS">MS</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                      <SelectItem value="PB">PB</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="PE">PE</SelectItem>
                      <SelectItem value="PI">PI</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="RN">RN</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                      <SelectItem value="RO">RO</SelectItem>
                      <SelectItem value="RR">RR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="SE">SE</SelectItem>
                      <SelectItem value="TO">TO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo De Alojamento</Label>
                  <Select value={dados.tipoAlojamento} onValueChange={(v) => onChange('tipoAlojamento', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOD">Mod</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nº De Quartos</Label>
                  <Input type="number" value={dados.quartos} onChange={(e) => onChange('quartos', e.target.value)} />
                </div>
                <div>
                  <Label>Capacidade Total</Label>
                  <Input type="number" value={dados.capacidade} onChange={(e) => onChange('capacidade', e.target.value)} />
                </div>
                <div>
                  <Label>Distância Da Obra (Km)</Label>
                  <Input type="number" step="0.1" value={dados.distanciaObra} onChange={(e) => onChange('distanciaObra', e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 1.3 Dados Financeiros */}
          <AccordionItem value="financeiro">
            <AccordionTrigger className="text-lg font-semibold">
              3. Dados Financeiros
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-red-500">Código Cca *</Label>
                  <Input value={dados.ccaCodigo} onChange={(e) => onChange('ccaCodigo', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Nº Do Contrato</Label>
                  <Input 
                    value={dados.numeroContrato} 
                    onChange={(e) => onChange('numeroContrato', e.target.value)}
                    placeholder={`${dados.tipoAlojamento} ALOJAMENTO 01`}
                  />
                </div>
                <div>
                  <Label className="text-red-500">Valor Do Aluguel (R$) *</Label>
                  <Input type="number" step="0.01" value={dados.aluguelMensal} onChange={(e) => onChange('aluguelMensal', e.target.value)} />
                </div>
                <div>
                  <Label>Dia De Vencimento</Label>
                  <Input type="number" value={dados.diaVencimento} onChange={(e) => onChange('diaVencimento', e.target.value)} />
                </div>
                <div>
                  <Label>Tipo De Pagamento</Label>
                  <Select value={dados.tipoPagamento} onValueChange={(v) => onChange('tipoPagamento', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-fixado">Pré-Fixado</SelectItem>
                      <SelectItem value="pos-fixado">Pós-Fixado</SelectItem>
                      <SelectItem value="parcelado">Parcelado</SelectItem>
                      <SelectItem value="sob-demanda">Sob Demanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Forma De Pagamento</Label>
                  <Select value={dados.formaPagamento} onValueChange={(v) => onChange('formaPagamento', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">Pix</SelectItem>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Caução (R$)</Label>
                  <Input type="number" step="0.01" value={dados.caucao} onChange={(e) => onChange('caucao', e.target.value)} />
                </div>
                <div>
                  <Label>Tipo Da Conta</Label>
                  <Select value={dados.contaPoupanca} onValueChange={(v) => onChange('contaPoupanca', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poupança">Poupança</SelectItem>
                      <SelectItem value="Corrente">Corrente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Meses De Caução</Label>
                  <Input type="number" value={dados.mesesCaucao} onChange={(e) => onChange('mesesCaucao', e.target.value)} />
                </div>
                <div>
                  <Label>Prazo Contratual (Meses)</Label>
                  <Input type="number" value={dados.prazoContratual} onChange={(e) => onChange('prazoContratual', e.target.value)} />
                </div>
                <div>
                  <Label>Data Início Contrato</Label>
                  <Input type="date" value={dados.dataInicio} onChange={(e) => onChange('dataInicio', e.target.value)} />
                </div>
                <div>
                  <Label>Data Fim Contrato</Label>
                  <Input type="date" value={dados.dataFim} onChange={(e) => onChange('dataFim', e.target.value)} />
                </div>
                <div>
                  <Label>Multa Rescisória (%)</Label>
                  <Input type="number" step="0.01" value={dados.multaRescisoria} onChange={(e) => onChange('multaRescisoria', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Despesas Adicionais</Label>
                  <Textarea 
                    value={dados.despesasAdicionais} 
                    onChange={(e) => onChange('despesasAdicionais', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Cálculo IR para PF */}
              {dados.tipoLocador === 'pf' && dadosIR && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">Ir Obrigatório (Pf)</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Base De Cálculo: {formatarMoeda(dadosIR.baseCalculo)}</div>
                    <div>Faixa Ir: {dadosIR.faixaDescricao}</div>
                    <div>Alíquota: {dadosIR.aliquota}%</div>
                    <div>Parcela A Deduzir: {formatarMoeda(dadosIR.parcelaADeduzir)}</div>
                    <div className="font-semibold">Valor Do Ir: {formatarMoeda(dadosIR.valorIR)}</div>
                    <div className="font-semibold">Valor Líquido: {formatarMoeda(dadosIR.valorLiquido)}</div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 1.4 Cláusulas e Despesas */}
          <AccordionItem value="clausulas">
            <AccordionTrigger className="text-lg font-semibold">
              4. Cláusulas E Despesas
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="taxa-lixo" 
                    checked={dados.temTaxaLixo}
                    onCheckedChange={(v) => onChange('temTaxaLixo', v)}
                  />
                  <label htmlFor="taxa-lixo" className="text-sm">
                    Taxa De Lixo (R$ 50 Estimado)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="condominio" 
                    checked={dados.temCondominio}
                    onCheckedChange={(v) => onChange('temCondominio', v)}
                  />
                  <label htmlFor="condominio" className="text-sm">
                    Condomínio (R$ 200 Estimado)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="seguro" 
                    checked={dados.temSeguroPredial}
                    onCheckedChange={(v) => onChange('temSeguroPredial', v)}
                  />
                  <label htmlFor="seguro" className="text-sm">
                    Seguro Predial (R$ 100 Estimado)
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Checklist De Cláusulas</Label>
                <TooltipProvider>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reajuste" 
                        checked={dados.checklistReajuste}
                        onCheckedChange={(v) => onChange('checklistReajuste', v)}
                      />
                      <label htmlFor="reajuste" className="text-sm flex items-center gap-1">
                        Reajuste Anual (Igpm/Ipca)
                        <Tooltip>
                          <TooltipTrigger>💡</TooltipTrigger>
                          <TooltipContent>
                            <p>Cláusula de reajuste anual baseada em índices oficiais</p>
                          </TooltipContent>
                        </Tooltip>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manutencao" 
                        checked={dados.checklistManutencao}
                        onCheckedChange={(v) => onChange('checklistManutencao', v)}
                      />
                      <label htmlFor="manutencao" className="text-sm">
                        Responsabilidade De Manutenção
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vistoria" 
                        checked={dados.checklistVistoriaNr24}
                        onCheckedChange={(v) => onChange('checklistVistoriaNr24', v)}
                      />
                      <label htmlFor="vistoria" className="text-sm">
                        Vistoria Conforme Nr-24
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="seguro-clause" 
                        checked={dados.checklistSeguro}
                        onCheckedChange={(v) => onChange('checklistSeguro', v)}
                      />
                      <label htmlFor="seguro-clause" className="text-sm">
                        Seguro Predial Obrigatório
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="foro" 
                        checked={dados.checklistForo}
                        onCheckedChange={(v) => onChange('checklistForo', v)}
                      />
                      <label htmlFor="foro" className="text-sm">
                        Foro De Resolução De Conflitos
                      </label>
                    </div>
                  </div>
                </TooltipProvider>
              </div>

              <div>
                <Label>Particularidades / Observações</Label>
                <Textarea 
                  value={dados.particularidades}
                  onChange={(e) => onChange('particularidades', e.target.value)}
                  rows={4}
                  placeholder="Descreva particularidades ou observações sobre o contrato..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 1.5 Custos e Rateio */}
          <AccordionItem value="custos">
            <AccordionTrigger className="text-lg font-semibold">
              5. Custos E Rateio
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nº De Moradores</Label>
                  <Input 
                    type="number" 
                    value={dados.numeroMoradores}
                    onChange={(e) => onChange('numeroMoradores', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <TabelaIndicadores indicadores={indicadores} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 1.6 Upload de Documentos */}
          <AccordionItem value="documentos">
            <AccordionTrigger className="text-lg font-semibold">
              6. Upload De Documentos
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label className="text-red-500 mb-2 block">Contrato (Pdf) *</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Simular upload - na prática, fazer upload real para supabase storage
                      onChange('contratoPdfUrl', URL.createObjectURL(file));
                    }
                  }}
                />
                {dados.contratoPdfUrl && (
                  <p className="text-sm text-green-600 mt-1">✓ Arquivo anexado</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block">Fotos Do Imóvel (Até 5)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Fachada, quartos, cozinha, banheiro, sala
                </p>
                <UploadFotos
                  analiseId="temp"
                  fotosAtuais={dados.fotosImovel}
                  onUpdate={(fotos) => onChange('fotosImovel', fotos)}
                  maxFotos={5}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Ações */}
        <div className="mt-6 pt-6 border-t space-y-4">
          {!validarCamposObrigatorios() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Preencha todos os campos obrigatórios (*) e anexe o contrato PDF antes de distribuir para aprovação.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onSalvarRascunho} className="flex-1">
              Salvar Rascunho
            </Button>
            <Button 
              onClick={onDistribuir} 
              className="flex-1"
              disabled={!validarCamposObrigatorios()}
            >
              Distribuir Para Aprovação
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
