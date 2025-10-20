import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, CheckCircle, Lock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { HistoricoAuditoria } from "@/components/alojamento/HistoricoAuditoria";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CardAprovacao } from "@/components/alojamento/CardAprovacao";
import { AlertasAutomaticos } from "@/components/alojamento/AlertasAutomaticos";
import { TabelaIndicadores } from "@/components/alojamento/TabelaIndicadores";
import { calcularIR, type DadosIR } from "@/components/alojamento/CalculadoraIR";
import { UploadFotos } from "@/components/alojamento/UploadFotos";
import { useViaCep } from "@/hooks/useViaCep";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuiaAnaliseContratual from "@/pages/alojamento/GuiaAnaliseContratual";

export default function PainelAnaliseContratual() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { buscarEndereco, loading: loadingCep } = useViaCep();
  const [analiseId, setAnaliseId] = useState<string | null>(null);
  
  // Status dos cards
  const [statusAdm, setStatusAdm] = useState<'pendente' | 'aguardando' | 'aprovado' | 'reprovado'>('pendente');
  const [statusFinanceiro, setStatusFinanceiro] = useState<'pendente' | 'aguardando' | 'aprovado' | 'reprovado'>('pendente');
  const [statusGestor, setStatusGestor] = useState<'pendente' | 'aguardando' | 'aprovado' | 'reprovado'>('pendente');
  const [statusSuper, setStatusSuper] = useState<'pendente' | 'aguardando' | 'aprovado' | 'reprovado'>('pendente');
  
  // Card 1 - Dados do Locador e Imóvel
  const [tipoLocador, setTipoLocador] = useState('');
  const [nomeRazaoSocial, setNomeRazaoSocial] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [imobiliaria, setImobiliaria] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [quartos, setQuartos] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [distanciaObra, setDistanciaObra] = useState('');
  const [valorSao, setValorSao] = useState('');
  const [dataInicioObra, setDataInicioObra] = useState('');
  const [dataFimObra, setDataFimObra] = useState('');
  const [periodoObraFixo, setPeriodoObraFixo] = useState(false);
  
  // Card 2 - Dados Financeiros
  const [ccaCodigo, setCcaCodigo] = useState('');
  const [tipoAlojamento, setTipoAlojamento] = useState('MOD');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [aluguelMensal, setAluguelMensal] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('25');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [caucao, setCaucao] = useState('');
  const [contaPoupanca, setContaPoupanca] = useState('Poupança');
  const [mesesCaucao, setMesesCaucao] = useState('');
  const [prazoContratual, setPrazoContratual] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  
  // Card 3 - IR (calculados automaticamente)
  const [dadosIR, setDadosIR] = useState<DadosIR | null>(null);
  
  // Card 3 - Custos e Rateios (numeroMoradores removido - usa capacidade do Card 1)
  
  // Card 6 - Cláusulas e Documentação
  const [temTaxaLixo, setTemTaxaLixo] = useState(false);
  const [temCondominio, setTemCondominio] = useState(false);
  const [temSeguroPredial, setTemSeguroPredial] = useState(false);
  const [particularidades, setParticularidades] = useState('');
  const [checklistReajuste, setChecklistReajuste] = useState(false);
  const [checklistManutencao, setChecklistManutencao] = useState(false);
  const [checklistVistoriaNr24, setChecklistVistoriaNr24] = useState(false);
  const [checklistSeguro, setChecklistSeguro] = useState(false);
  const [checklistForo, setChecklistForo] = useState(false);
  const [contratoPdfUrl, setContratoPdfUrl] = useState('');
  const [fotosImovel, setFotosImovel] = useState<any[]>([]);
  const [emailValidacaoSuper, setEmailValidacaoSuper] = useState('');
  const [temVistoria, setTemVistoria] = useState(false);
  const [aprovadoCustoEngenheiro, setAprovadoCustoEngenheiro] = useState(false);
  
  // Interface e state para itens de mobília
  interface ItemMobilia {
    item: string;
    qtde: number;
    valorUnitario: number;
    valorTotal: number;
    editavel?: boolean;
  }

  const [itensMobilia, setItensMobilia] = useState<ItemMobilia[]>([
    { item: 'Limpeza', qtde: 0, valorUnitario: 150.00, valorTotal: 0 },
    { item: 'Produto de Limpeza', qtde: 0, valorUnitario: 150.00, valorTotal: 0 },
    { item: 'Geladeira', qtde: 1, valorUnitario: 2220.00, valorTotal: 2220.00 },
    { item: 'Microondas', qtde: 0, valorUnitario: 0, valorTotal: 0 },
    { item: 'Rack', qtde: 0, valorUnitario: 200.00, valorTotal: 0 },
    { item: 'Televisor 32"', qtde: 0, valorUnitario: 1070.00, valorTotal: 0 },
    { item: 'Guarda Roupa', qtde: 6, valorUnitario: 220.00, valorTotal: 1320.00 },
    { item: 'Mesa para Jantar', qtde: 0, valorUnitario: 450.00, valorTotal: 0 },
    { item: 'Armario de Cozinha', qtde: 0, valorUnitario: 450.00, valorTotal: 0 },
    { item: 'Tanquinho', qtde: 1, valorUnitario: 340.00, valorTotal: 340.00 },
    { item: 'Sofá', qtde: 0, valorUnitario: 600.00, valorTotal: 0 },
    { item: 'Ferro p/ passar roupa', qtde: 1, valorUnitario: 120.00, valorTotal: 120.00 },
    { item: 'Tabua p/ passar', qtde: 1, valorUnitario: 200.00, valorTotal: 200.00 },
    { item: 'Fogão', qtde: 0, valorUnitario: 655.00, valorTotal: 0 },
    { item: 'Jogo de Panela', qtde: 1, valorUnitario: 150.00, valorTotal: 150.00 },
    { item: 'Cama', qtde: 6, valorUnitario: 560.00, valorTotal: 3360.00 },
    { item: 'Colchões Solteiro', qtde: 6, valorUnitario: 200.00, valorTotal: 1200.00 },
    { item: 'Lençol 2 unid. por pessoa', qtde: 0, valorUnitario: 45.00, valorTotal: 0 },
    { item: 'Cobertor', qtde: 0, valorUnitario: 35.00, valorTotal: 0 },
    { item: 'Jogo de Talheres - 18 peças', qtde: 1, valorUnitario: 80.00, valorTotal: 80.00 },
    { item: 'Jogo de Copos - 6 peças', qtde: 2, valorUnitario: 80.00, valorTotal: 160.00 },
    { item: 'Prato', qtde: 1, valorUnitario: 120.00, valorTotal: 120.00 },
    { item: 'Torneira para agua potavel', qtde: 1, valorUnitario: 240.00, valorTotal: 240.00 },
    { item: 'Chuveiro', qtde: 1, valorUnitario: 80.00, valorTotal: 80.00 },
    { item: 'Travesseiro unid.', qtde: 0, valorUnitario: 45.00, valorTotal: 0 },
    { item: 'Conta de Energia Mensal por pessoa', qtde: 0, valorUnitario: 65.00, valorTotal: 0 },
    { item: 'Conta de Agua/ Esgoto Mensal por pessoa', qtde: 0, valorUnitario: 20.00, valorTotal: 0 },
    { item: 'Cortinas', qtde: 3, valorUnitario: 100.00, valorTotal: 300.00 },
    { item: 'Lâmpadas', qtde: 12, valorUnitario: 13.00, valorTotal: 156.00 },
    { item: 'Ventilador', qtde: 6, valorUnitario: 190.00, valorTotal: 1140.00 },
    { item: 'Lixeira/ Extintor', qtde: 1, valorUnitario: 150.00, valorTotal: 150.00 },
    { item: 'Reparo (Lata de tinta entre outros)', qtde: 1, valorUnitario: 0, valorTotal: 0 },
    // Linhas editáveis adicionais
    { item: '', qtde: 0, valorUnitario: 0, valorTotal: 0, editavel: true },
    { item: '', qtde: 0, valorUnitario: 0, valorTotal: 0, editavel: true },
    { item: '', qtde: 0, valorUnitario: 0, valorTotal: 0, editavel: true },
    { item: '', qtde: 0, valorUnitario: 0, valorTotal: 0, editavel: true },
  ]);
  
  // Funções para cálculo de mobília
  const calcularTotalMobilia = (): number => {
    return itensMobilia.reduce((acc, item) => acc + item.valorTotal, 0);
  };

  const handleQtdeMobiliaChange = (index: number, novaQtde: number) => {
    const novosItens = [...itensMobilia];
    novosItens[index].qtde = novaQtde;
    novosItens[index].valorTotal = novaQtde * novosItens[index].valorUnitario;
    setItensMobilia(novosItens);
  };

  const handleValorUnitarioMobiliaChange = (index: number, novoValor: number) => {
    const novosItens = [...itensMobilia];
    novosItens[index].valorUnitario = novoValor;
    novosItens[index].valorTotal = novosItens[index].qtde * novoValor;
    setItensMobilia(novosItens);
  };

  const handleItemMobiliaChange = (index: number, novoItem: string) => {
    const novosItens = [...itensMobilia];
    novosItens[index].item = novoItem;
    setItensMobilia(novosItens);
  };
  
  // Verificação se todos os cards foram aprovados
  // Card 3 unificado: considera aprovado se GESTOR OU SUPERINTENDÊNCIA aprovar
  const card3Aprovado = statusGestor === 'aprovado' || statusSuper === 'aprovado';
  const todosAprovados = statusAdm === 'aprovado' && 
                         statusFinanceiro === 'aprovado' && 
                         card3Aprovado;
  
  // Status unificado do Card 3 (Gestor OU Superintendência)
  const statusCard3Unificado = card3Aprovado ? 'aprovado' : 
                               (statusGestor === 'reprovado' && statusSuper === 'reprovado') ? 'reprovado' :
                               (statusGestor === 'aguardando' || statusSuper === 'aguardando') ? 'aguardando' : 'pendente';
  
  const [emailValidacaoGestor, setEmailValidacaoGestor] = useState('');
  // emailValidacaoSuper já existe na linha 88
  
  // Validações e Alertas
  const validarCPFCNPJ = (valor: string): boolean => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 11 || numeros.length === 14) {
      return numeros.length > 0;
    }
    return false;
  };

  const calcularMesesEntreDatas = (inicio: string, fim: string): number => {
    if (!inicio || !fim) return 0;
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    return (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 +
           (dataFim.getMonth() - dataInicio.getMonth());
  };

  const gerarAlertas = (): Array<{ tipo: 'erro' | 'atencao' | 'info', mensagem: string }> => {
    const alertas: Array<{ tipo: 'erro' | 'atencao' | 'info', mensagem: string }> = [];
    
    // Card 1
    if (!cep || cep.replace(/\D/g, '').length < 8) {
      alertas.push({ tipo: 'atencao', mensagem: '⚠️ Endereço incompleto' });
    }
    if (cpfCnpj && !validarCPFCNPJ(cpfCnpj)) {
      alertas.push({ tipo: 'erro', mensagem: '⚠️ CPF/CNPJ inválido' });
    }
    if (!capacidade || !quartos) {
      alertas.push({ tipo: 'atencao', mensagem: '⚠️ Informar quartos e capacidade' });
    }
    
    // Card 2
    if (contaPoupanca !== 'Poupança') {
      alertas.push({ tipo: 'atencao', mensagem: '⚠️ Caução deve ser em conta poupança' });
    }
    if (parseInt(mesesCaucao) > 3) {
      alertas.push({ tipo: 'atencao', mensagem: '📆 Caução acima do padrão (3 meses)' });
    }
    // Validação usando período da obra
    if (dataInicioObra && dataFimObra && dataInicio && dataFim) {
      const inicioContratoDate = new Date(dataInicio);
      const fimContratoDate = new Date(dataFim);
      const inicioObraDate = new Date(dataInicioObra);
      const fimObraDate = new Date(dataFimObra);
      
      if (inicioContratoDate < inicioObraDate) {
        alertas.push({ tipo: 'atencao', mensagem: '📅 Contrato inicia antes do período da obra' });
      }
      if (fimContratoDate > fimObraDate) {
        alertas.push({ tipo: 'atencao', mensagem: '📅 Contrato termina após o período da obra' });
      }
    }
    
    if (parseInt(prazoContratual) > calcularMesesEntreDatas(dataInicioObra || dataInicio, dataFimObra || dataFim)) {
      alertas.push({ tipo: 'atencao', mensagem: '🕒 Prazo contratual excede período da obra' });
    }
    if (parseInt(diaVencimento) !== 25) {
      alertas.push({ tipo: 'atencao', mensagem: '💰 Vencimento fora do padrão' });
    }
    
    return alertas;
  };

  // Buscar CEP automaticamente
  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarEndereco(cepLimpo).then((endereco) => {
        if (endereco) {
          setLogradouro(endereco.logradouro || '');
          setBairro(endereco.bairro || '');
          setCidade(endereco.cidade || '');
          setUf(endereco.uf || '');
        }
      });
    }
  }, [cep]);

  // Buscar próximo número de contrato automaticamente
  useEffect(() => {
    const buscarProximoNumero = async () => {
      if (ccaCodigo && tipoAlojamento) {
        try {
          const { data, error } = await supabase.rpc('obter_proximo_numero_alojamento', {
            p_cca_codigo: ccaCodigo,
            p_tipo_alojamento: tipoAlojamento
          });
          
          if (error) {
            console.error('Erro ao buscar próximo número:', error);
            return;
          }
          
          // Formatar número com zeros à esquerda (01, 02, ..., 99)
          const numeroFormatado = String(data).padStart(2, '0');
          setNumeroContrato(`${tipoAlojamento} ALOJAMENTO ${numeroFormatado}`);
        } catch (error) {
          console.error('Erro ao buscar próximo número:', error);
        }
      }
    };
    
    buscarProximoNumero();
  }, [ccaCodigo, tipoAlojamento]);

  // Buscar período da obra existente quando CCA for preenchido
  useEffect(() => {
    const buscarPeriodoObra = async () => {
      if (!ccaCodigo) return;
      
      const { data, error } = await supabase
        .from('analises_contratuais')
        .select('data_inicio_obra, data_fim_obra')
        .eq('cca_codigo', ccaCodigo)
        .not('data_inicio_obra', 'is', null)
        .not('data_fim_obra', 'is', null)
        .limit(1)
        .maybeSingle();
      
      if (data && !error && data.data_inicio_obra && data.data_fim_obra) {
        setDataInicioObra(data.data_inicio_obra);
        setDataFimObra(data.data_fim_obra);
        setPeriodoObraFixo(true);
        toast({
          title: "Período da obra carregado",
          description: "Os dados foram recuperados automaticamente para esta obra",
        });
      }
    };
    
    buscarPeriodoObra();
  }, [ccaCodigo]);

  // Calcular IR automaticamente para PF
  useEffect(() => {
    if (tipoLocador === 'pf' && aluguelMensal) {
      const resultado = calcularIR(parseFloat(aluguelMensal) || 0);
      setDadosIR(resultado);
    } else {
      setDadosIR(null);
    }
  }, [tipoLocador, aluguelMensal]);

  // Cálculos de custos
  const calcularDespesas = () => {
    return (
      (temTaxaLixo ? 50 : 0) +
      (temCondominio ? 200 : 0) +
      (temSeguroPredial ? 100 : 0)
    );
  };

  const calcularValorMensalLiquido = () => {
    const despesas = calcularDespesas();
    const ir = tipoLocador === 'pf' ? (dadosIR?.valorIR || 0) : 0;
    return parseFloat(aluguelMensal || '0') + despesas - ir;
  };

  const calcularValorTotalContrato = () => {
    return calcularValorMensalLiquido() * parseInt(prazoContratual || '0');
  };

  const calcularValorPorMorador = () => {
    const moradores = parseInt(capacidade || '0');
    return moradores > 0 ? calcularValorMensalLiquido() / moradores : 0;
  };

  // Novo cálculo: Valor Unitário considerando mobília, multa e distribuição por dias
  const calcularValorUnitarioCompleto = () => {
    const moradores = parseInt(capacidade || '0');
    const meses = parseInt(prazoContratual || '0');
    
    if (moradores === 0 || meses === 0) return 0;
    
    // Verificar se o contrato não cobre todo o período da obra
    let incluirMulta = false;
    if (dataInicioObra && dataFimObra && dataInicio && dataFim) {
      const inicioContratoDate = new Date(dataInicio);
      const fimContratoDate = new Date(dataFim);
      const inicioObraDate = new Date(dataInicioObra);
      const fimObraDate = new Date(dataFimObra);
      
      // Se o contrato não cobre todo o período da obra, incluir multa
      if (inicioContratoDate > inicioObraDate || fimContratoDate < fimObraDate) {
        incluirMulta = true;
      }
    }
    
    // Componentes do cálculo
    const valorMensalTotal = calcularValorMensalLiquido() * meses;
    const valorMobilia = calcularTotalMobilia();
    const valorMulta = incluirMulta ? (parseFloat(aluguelMensal || '0') * 3) : 0;
    
    // Cálculo: (valor mensal total + mobília + multa) / moradores / meses / 30
    const total = valorMensalTotal + valorMobilia + valorMulta;
    const valorDiario = total / moradores / meses / 30;
    
    return valorDiario;
  };

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const indicadores = [
    { icone: '💰', label: 'Total do Contrato', valor: formatarMoeda(calcularValorTotalContrato()), status: 'neutro' as const },
    { icone: '📅', label: 'Mensal Líquido', valor: formatarMoeda(calcularValorMensalLiquido()), status: 'neutro' as const },
    { icone: '🧮', label: 'IR Mensal', valor: formatarMoeda(dadosIR?.valorIR || 0), status: 'neutro' as const },
    { icone: '🏘️', label: 'Custo por Morador', valor: formatarMoeda(calcularValorPorMorador()), status: 'positivo' as const },
  ];

  // Salvar rascunho
  const handleSalvarRascunho = async () => {
    try {
      const dadosCompletos = {
        tipo_locador: tipoLocador,
        fornecedor_nome: nomeRazaoSocial,
        fornecedor_cnpj: cpfCnpj,
        nome_proprietario: nomeRazaoSocial,
        imobiliaria,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        quantidade_quartos: parseInt(quartos) || 0,
        capacidade_total: parseInt(capacidade) || 0,
        distancia_obra: parseFloat(distanciaObra) || 0,
        cca_codigo: ccaCodigo,
        tipo_alojamento: tipoAlojamento,
        numero_contrato: numeroContrato || `${tipoAlojamento} ALOJAMENTO 01`,
        valor_mensal: parseFloat(aluguelMensal) || 0,
        dia_vencimento: parseInt(diaVencimento) || 25,
        tipo_pagamento_detalhado: tipoPagamento,
        caucao: parseFloat(caucao) || 0,
        conta_poupanca: contaPoupanca,
        meses_caucao: parseInt(mesesCaucao) || 0,
        prazo_contratual: parseInt(prazoContratual) || 0,
        data_inicio_contrato: dataInicio,
        data_fim_contrato: dataFim,
        ir_base_calculo: dadosIR?.baseCalculo || 0,
        ir_aliquota: dadosIR?.aliquota || 0,
        ir_parcela_deduzir: dadosIR?.parcelaADeduzir || 0,
        ir_valor_retido: dadosIR?.valorIR || 0,
        valor_liquido_pagar: dadosIR?.valorLiquido || parseFloat(aluguelMensal) || 0,
        numero_moradores: parseInt(capacidade) || 0,
        valor_sao: parseFloat(valorSao) || 0,
        data_inicio_obra: dataInicioObra,
        data_fim_obra: dataFimObra,
        valor_total_contrato: calcularValorTotalContrato(),
        valor_mensal_liquido: calcularValorMensalLiquido(),
        valor_por_morador: calcularValorPorMorador(),
        tem_taxa_lixo: temTaxaLixo,
        tem_condominio: temCondominio,
        tem_seguro_predial: temSeguroPredial,
        particularidades,
        checklist_reajuste: checklistReajuste,
        checklist_manutencao: checklistManutencao,
        checklist_vistoria_nr24: checklistVistoriaNr24,
        checklist_seguro: checklistSeguro,
        checklist_foro: checklistForo,
        contrato_pdf_url: contratoPdfUrl,
        fotos_imovel: fotosImovel,
        email_validacao_super: emailValidacaoSuper,
        tem_vistoria: temVistoria,
        aprovado_custo_engenheiro: aprovadoCustoEngenheiro,
        multa_rescisoria_percentual: parseFloat(aluguelMensal) * 3,
        itens_mobilia: itensMobilia,
        responsavel_analise: 'ADM Obra',
        forma_pagamento: 'PIX',
        status_adm: statusAdm,
        status_financeiro: statusFinanceiro,
        status_gestor: statusGestor,
        status_super: statusSuper,
      };
      
      if (!analiseId) {
        const { data, error } = await supabase
          .from('analises_contratuais')
          .insert(dadosCompletos)
          .select()
          .single();
        
        if (error) throw error;
        setAnaliseId(data.id);
        toast({ title: "Rascunho salvo com sucesso" });
      } else {
        const { error } = await supabase
          .from('analises_contratuais')
          .update(dadosCompletos)
          .eq('id', analiseId);
        
        if (error) throw error;
        toast({ title: "Alterações salvas" });
      }
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
  };
  
  // Enviar alerta por email
  const handleEnviarAlerta = async (email: string, cardTitulo: string) => {
    try {
      const { error } = await supabase.functions.invoke('enviar-alerta-validacao', {
        body: {
          email,
          cardTitulo,
          analiseId,
          nomeAlojamento: `${tipoAlojamento} ALOJAMENTO - ${logradouro}, ${numero}`,
          endereco: `${logradouro}, ${numero} - ${bairro} - ${cidade}/${uf}`,
          mensagem: `Você recebeu um alerta de validação para o ${cardTitulo}. Por favor, verifique os dados e aprove ou reprove conforme necessário.`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao enviar alerta');
    }
  };

  // Handlers de aprovação
  const handleAprovarCard = async (
    card: string,
    statusField: string,
    comentario: string,
    emailProximo: string
  ) => {
    await handleSalvarRascunho();
    
    try {
      await supabase
        .from('analises_contratuais')
        .update({ [statusField]: 'aprovado' })
        .eq('id', analiseId);
      
      await supabase
        .from('aprovacoes_analise')
        .insert({
          analise_id: analiseId,
          bloco: card,
          aprovador: 'Usuário',
          acao: 'aprovado',
          comentario,
        });
      
      // Atualizar status local
      if (statusField === 'status_adm') setStatusAdm('aprovado');
      if (statusField === 'status_financeiro') setStatusFinanceiro('aprovado');
      if (statusField === 'status_gestor') setStatusGestor('aprovado');
      if (statusField === 'status_super') setStatusSuper('aprovado');
      
      toast({ title: "Aprovado com sucesso" });
    } catch (error: any) {
      toast({ title: "Erro ao aprovar", description: error.message, variant: "destructive" });
    }
  };

  const handleReprovarCard = async (
    card: string,
    statusField: string,
    comentario: string
  ) => {
    await handleSalvarRascunho();
    
    try {
      await supabase
        .from('analises_contratuais')
        .update({ [statusField]: 'reprovado' })
        .eq('id', analiseId);
      
      await supabase
        .from('aprovacoes_analise')
        .insert({
          analise_id: analiseId,
          bloco: card,
          aprovador: 'Usuário',
          acao: 'reprovado',
          comentario,
        });
      
      // Atualizar status local
      if (statusField === 'status_adm') setStatusAdm('reprovado');
      if (statusField === 'status_financeiro') setStatusFinanceiro('reprovado');
      if (statusField === 'status_gestor') setStatusGestor('reprovado');
      if (statusField === 'status_super') setStatusSuper('reprovado');
      
      toast({ title: "Reprovado", variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Erro ao reprovar", description: error.message, variant: "destructive" });
    }
  };

  const statusGeral = 
    statusAdm === 'aprovado' && statusFinanceiro === 'aprovado' && 
    statusGestor === 'aprovado' && statusSuper === 'aprovado' 
      ? 'aprovado'
      : (statusAdm === 'reprovado' || statusFinanceiro === 'reprovado' || 
         statusGestor === 'reprovado' || statusSuper === 'reprovado')
      ? 'reprovado'
      : 'em_analise';

  const alertas = gerarAlertas();


  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Painel de Análise Contratual</h1>
            <p className="text-muted-foreground">Aprovação simultânea por cards</p>
          </div>
        </div>
        <Button onClick={handleSalvarRascunho} variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Salvar Rascunho
        </Button>
      </div>

      {/* Status Geral */}
      <div className="flex items-center gap-2">
        <span className="font-semibold">Status Geral:</span>
        <Badge variant={statusGeral === 'aprovado' ? 'default' : statusGeral === 'reprovado' ? 'destructive' : 'secondary'}>
          {statusGeral === 'aprovado' ? '✅ Aprovado' : statusGeral === 'reprovado' ? '❌ Reprovado' : '⏳ Em Análise'}
        </Badge>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="analise" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="analise" className="text-base">
            📋 Painel de Análise Contratual
          </TabsTrigger>
          <TabsTrigger value="mobilia" className="text-base">
            🛋️ Planilha de Mobília
          </TabsTrigger>
          <TabsTrigger value="guia" className="text-base">
            📖 Guia
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analise" className="space-y-6 mt-6">
      {/* Card 1 - Dados do Locador e Imóvel */}
      <CardAprovacao
        titulo="Card 1 - Dados do Locador e Imóvel"
        cor="bg-blue-50 border-blue-300"
        responsavel="ADM Matricial"
        status={statusAdm}
        onAprovar={(c, e) => handleAprovarCard('card1', 'status_adm', c, e)}
        onReprovar={(c) => handleReprovarCard('card1', 'status_adm', c)}
        onEnviarAlerta={handleEnviarAlerta}
      >
        <AlertasAutomaticos alertas={alertas.filter(a => 
          a.mensagem.includes('Endereço') || a.mensagem.includes('CPF') || a.mensagem.includes('quartos')
        )} />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Tipo de Locador</Label>
            <Select value={tipoLocador} onValueChange={setTipoLocador}>
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
            <Label>Nome/Razão Social</Label>
            <Input value={nomeRazaoSocial} onChange={(e) => setNomeRazaoSocial(e.target.value)} />
          </div>
          <div>
            <Label>CPF/CNPJ</Label>
            <Input value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
          </div>
          <div>
            <Label>Imobiliária (Opcional)</Label>
            <Input value={imobiliaria} onChange={(e) => setImobiliaria(e.target.value)} />
          </div>
          <div>
            <Label>CEP</Label>
            <Input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" />
          </div>
          <div>
            <Label>Logradouro</Label>
            <Input value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
          </div>
          <div>
            <Label>Número</Label>
            <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div>
            <Label>Complemento</Label>
            <Input value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </div>
          <div>
            <Label>Bairro</Label>
            <Input value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div>
            <Label>UF</Label>
            <Select value={uf} onValueChange={setUf}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">SP</SelectItem>
                <SelectItem value="RJ">RJ</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
                <SelectItem value="ES">ES</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantidade de Quartos</Label>
            <Input type="number" value={quartos} onChange={(e) => setQuartos(e.target.value)} />
          </div>
          <div>
            <Label>Capacidade Total</Label>
            <Input type="number" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
          </div>
          <div>
            <Label>Distância da Obra (km)</Label>
            <Input type="number" value={distanciaObra} onChange={(e) => setDistanciaObra(e.target.value)} />
          </div>
          <div>
            <Label>Valor SAO (R$/Morador/Mês)</Label>
            <Input 
              type="number" 
              value={valorSao} 
              onChange={(e) => setValorSao(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              🛋️ Valor Mobília
              <Badge className={cn(
                "text-white",
                calcularTotalMobilia() === 0 && "bg-gray-500",
                calcularTotalMobilia() > 0 && calcularTotalMobilia() <= 5000 && "bg-green-600",
                calcularTotalMobilia() > 5000 && calcularTotalMobilia() <= 10000 && "bg-yellow-600",
                calcularTotalMobilia() > 10000 && "bg-red-600"
              )}>
                {calcularTotalMobilia() === 0 ? 'Sem mobília' : 'Calculado'}
              </Badge>
            </Label>
            <Input 
              type="text" 
              value={formatarMoeda(calcularTotalMobilia())}
              readOnly
              className="bg-purple-50 font-semibold text-purple-900 cursor-default"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Acesse a aba "Planilha de Mobília" para preencher
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-700">📅 Período da Obra</h3>
          {periodoObraFixo && (
            <Alert className="mb-3 bg-blue-100 border-blue-300">
              <AlertDescription className="text-xs">
                🔒 Período já cadastrado para esta obra (CCA: {ccaCodigo})
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início da Obra</Label>
              <Input 
                type="date" 
                value={dataInicioObra} 
                onChange={(e) => setDataInicioObra(e.target.value)}
                disabled={periodoObraFixo}
                className={periodoObraFixo ? 'bg-gray-100 cursor-not-allowed' : ''}
              />
            </div>
            <div>
              <Label>Data Fim da Obra</Label>
              <Input 
                type="date" 
                value={dataFimObra} 
                onChange={(e) => setDataFimObra(e.target.value)}
                disabled={periodoObraFixo}
                className={periodoObraFixo ? 'bg-gray-100 cursor-not-allowed' : ''}
              />
            </div>
          </div>
          <Alert className="mt-3">
            <AlertDescription className="text-xs">
              ℹ️ Este período será usado para validar se o contrato está dentro do prazo da obra
            </AlertDescription>
          </Alert>
        </div>
      </CardAprovacao>

      {/* Card 2 - Dados Financeiros, IR e Auditoria */}
      <CardAprovacao
        titulo="Card 2 - Dados Financeiros, IR e Auditoria"
        cor="bg-green-50 border-green-300"
        responsavel="Financeiro"
        status={statusFinanceiro}
        onAprovar={(c, e) => handleAprovarCard('card2', 'status_financeiro', c, e)}
        onReprovar={(c) => handleReprovarCard('card2', 'status_financeiro', c)}
        onEnviarAlerta={handleEnviarAlerta}
      >
        <AlertasAutomaticos alertas={alertas.filter(a => 
          a.mensagem.includes('Caução') || a.mensagem.includes('Prazo') || a.mensagem.includes('Vencimento')
        )} />
        
        {/* Seção 1: Dados Financeiros */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-green-700">📊 Dados Financeiros</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código CCA</Label>
              <Input value={ccaCodigo} onChange={(e) => setCcaCodigo(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Alojamento</Label>
              <Select value={tipoAlojamento} onValueChange={setTipoAlojamento}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOD">MOD</SelectItem>
                  <SelectItem value="MOI">MOI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nº do Contrato (Gerado Automaticamente)</Label>
              <Input 
                value={numeroContrato} 
                readOnly 
                disabled
                className="bg-muted cursor-not-allowed"
                placeholder="Selecione CCA e Tipo para gerar" 
              />
            </div>
            <div>
              <Label>Aluguel Mensal (R$)</Label>
              <Input type="number" value={aluguelMensal} onChange={(e) => setAluguelMensal(e.target.value)} />
            </div>
            <div>
              <Label>Vencimento</Label>
              <Input type="number" min="1" max="31" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Pagamento</Label>
              <Select value={tipoPagamento} onValueChange={setTipoPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pré-fixado">Pré-fixado (antecipado)</SelectItem>
                  <SelectItem value="Pós-fixado">Pós-fixado (postecipado)</SelectItem>
                  <SelectItem value="Parcelado">Parcelado</SelectItem>
                  <SelectItem value="Sob demanda">Sob demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Caução (R$)</Label>
              <Input type="number" value={caucao} onChange={(e) => setCaucao(e.target.value)} />
            </div>
            <div>
              <Label>Tipo da Conta do Caução</Label>
              <Select value={contaPoupanca} onValueChange={setContaPoupanca}>
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
              <Label>Meses de Caução</Label>
              <Input type="number" value={mesesCaucao} onChange={(e) => setMesesCaucao(e.target.value)} />
            </div>
            <div>
              <Label>Prazo Contratual (meses)</Label>
              <Input type="number" value={prazoContratual} onChange={(e) => setPrazoContratual(e.target.value)} />
            </div>
            <div>
              <Label>Data Início</Label>
              <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Seção 2: IR (apenas se PF) */}
        {tipoLocador === 'pf' && dadosIR && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-700 flex items-center gap-2">
              💰 Imposto de Renda (PF)
              <Badge className="bg-red-500 text-white">Obrigatório</Badge>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base de Cálculo</Label>
                <Input value={formatarMoeda(dadosIR.baseCalculo)} readOnly className="bg-white" />
              </div>
              <div>
                <Label>Faixa IR</Label>
                <Input value={dadosIR.faixaDescricao} readOnly className="bg-white" />
              </div>
              <div>
                <Label>Alíquota (%)</Label>
                <Input value={`${dadosIR.aliquota}%`} readOnly className="bg-white" />
              </div>
              <div>
                <Label>Parcela a Deduzir</Label>
                <Input value={formatarMoeda(dadosIR.parcelaADeduzir)} readOnly className="bg-white" />
              </div>
              <div>
                <Label>Valor do IR</Label>
                <Input value={formatarMoeda(dadosIR.valorIR)} readOnly className="bg-white" />
              </div>
              <div>
                <Label>Valor Líquido</Label>
                <Input value={formatarMoeda(dadosIR.valorLiquido)} readOnly className="bg-white font-bold" />
              </div>
            </div>
          </div>
        )}

        {tipoLocador === 'pj' && (
          <Alert className="mb-6">
            <AlertDescription>
              <Badge className="bg-blue-500 text-white">Isento de IR (PJ)</Badge>
            </AlertDescription>
          </Alert>
        )}

        {/* Seção 3: Auditoria e Ciência */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">📋 Painel de Auditoria e Ciência</h3>
          <div className="space-y-3">
            {tipoLocador === 'pf' && <p className="text-sm">ℹ️ Aplica-se IR (ver seção acima)</p>}
            {parseInt(diaVencimento) !== 25 && <p className="text-sm">⚠️ Vencimento fora do padrão (dia 25)</p>}
            {aluguelMensal && <p className="text-sm">💰 Valor do Aluguel: {formatarMoeda(parseFloat(aluguelMensal))}</p>}
            {aluguelMensal && <p className="text-sm">⚠️ Multa Contratual: {formatarMoeda(parseFloat(aluguelMensal) * 3)}</p>}
            {prazoContratual && <p className="text-sm">📅 Prazo Contratual: {prazoContratual} meses</p>}
            {tipoPagamento && <p className="text-sm">💳 Forma de Pagamento: {tipoPagamento}</p>}
            
            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="vistoria" checked={temVistoria} onCheckedChange={(c) => setTemVistoria(!!c)} />
              <Label htmlFor="vistoria">Tem Vistoria</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="engenheiro" checked={aprovadoCustoEngenheiro} onCheckedChange={(c) => setAprovadoCustoEngenheiro(!!c)} />
              <Label htmlFor="engenheiro">Aprovado Custo Engenheiro</Label>
            </div>
          </div>
          
          <Alert className="mt-4">
            <AlertDescription className="text-xs">
              💡 Este painel é informativo e faz parte da validação financeira completa.
            </AlertDescription>
          </Alert>
        </div>
      </CardAprovacao>

      {/* Card 3 - Custos, Rateios, Cláusulas e Documentação (Unificado) */}
      <Card className={cn(
        "transition-all duration-300",
        "bg-orange-50 border-orange-300",
        statusCard3Unificado === 'aprovado' && "border-green-500 bg-green-50",
        statusCard3Unificado === 'reprovado' && "border-red-500 bg-red-50"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Card 3 - Custos, Rateios, Cláusulas E Documentação</span>
            <Badge className={cn(
              "text-white",
              statusCard3Unificado === 'aprovado' && "bg-green-600",
              statusCard3Unificado === 'reprovado' && "bg-red-600",
              statusCard3Unificado === 'aguardando' && "bg-blue-600",
              statusCard3Unificado === 'pendente' && "bg-gray-600"
            )}>
              {statusCard3Unificado === 'aprovado' ? '✅ Aprovado' : 
               statusCard3Unificado === 'reprovado' ? '❌ Reprovado' :
               statusCard3Unificado === 'aguardando' ? '⏳ Aguardando' : '⚪ Pendente'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Responsável: <strong>Gestor OU Superintendência</strong> (aprovação de qualquer um valida)
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Seção: Custos e Rateios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">📊 Custos E Rateios</h3>
            
            <Alert className="bg-blue-50 border-blue-300">
              <AlertDescription>
                ℹ️ <strong>Capacidade Total:</strong> {capacidade || '0'} moradores
                <br />
                <span className="text-xs text-muted-foreground">
                  (Informação preenchida no Card 1 - Dados do Locador e Imóvel)
                </span>
              </AlertDescription>
            </Alert>

            <TabelaIndicadores indicadores={indicadores} />
            
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                📊 Comparativo: SAO vs Valor Calculado
              </h4>
              
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-semibold mb-2">📋 Composição do Cálculo:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Valor Mensal Líquido × {prazoContratual || '0'} meses = {formatarMoeda(calcularValorMensalLiquido() * parseInt(prazoContratual || '0'))}</li>
                  <li>• Valor Mobília Total = {formatarMoeda(calcularTotalMobilia())}</li>
                  <li>• Multa Rescisória {(() => {
                    if (!dataInicioObra || !dataFimObra || !dataInicio || !dataFim) return '(não aplicável)';
                    const inicioContratoDate = new Date(dataInicio);
                    const fimContratoDate = new Date(dataFim);
                    const inicioObraDate = new Date(dataInicioObra);
                    const fimObraDate = new Date(dataFimObra);
                    const incluirMulta = inicioContratoDate > inicioObraDate || fimContratoDate < fimObraDate;
                    return incluirMulta ? `= ${formatarMoeda(parseFloat(aluguelMensal || '0') * 3)}` : '= R$ 0,00 (contrato cobre período completo)';
                  })()}</li>
                  <li className="font-semibold pt-1 border-t border-blue-300">
                    💡 Fórmula: (Total) ÷ {capacidade || '0'} moradores ÷ {prazoContratual || '0'} meses ÷ 30 dias
                  </li>
                </ul>
              </div>
              
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="p-2 text-left border">Indicador</th>
                    <th className="p-2 text-right border">Valor</th>
                    <th className="p-2 text-center border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="p-2 border">💰 Valor SAO (Orçado)</td>
                    <td className="p-2 text-right font-semibold border">
                      {formatarMoeda(parseFloat(valorSao || '0'))}
                    </td>
                    <td className="p-2 text-center border">-</td>
                  </tr>
                  <tr className="border bg-purple-50">
                    <td className="p-2 border">
                      🧮 Valor Unitário (Calculado)
                      <div className="text-xs text-muted-foreground">
                        Inclui: Aluguel + Mobília + Multa
                      </div>
                    </td>
                    <td className="p-2 text-right font-semibold border">
                      {formatarMoeda(calcularValorUnitarioCompleto())}
                    </td>
                    <td className="p-2 text-center border">-</td>
                  </tr>
                  <tr className="bg-amber-100 font-bold border">
                    <td className="p-2 border">📈 Diferença</td>
                    <td className="p-2 text-right border">
                      {formatarMoeda(Math.abs(calcularValorUnitarioCompleto() - parseFloat(valorSao || '0')))}
                    </td>
                    <td className="p-2 text-center border">
                      {calcularValorUnitarioCompleto() > parseFloat(valorSao || '0') ? (
                        <Badge className="bg-red-500 text-white">❌ Acima do Orçado</Badge>
                      ) : calcularValorUnitarioCompleto() < parseFloat(valorSao || '0') ? (
                        <Badge className="bg-green-500 text-white">✅ Dentro do Orçado</Badge>
                      ) : (
                        <Badge className="bg-blue-500 text-white">⚖️ Igual ao Orçado</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {parseFloat(valorSao || '0') > 0 && calcularValorUnitarioCompleto() > parseFloat(valorSao || '0') && (
                <Alert className="mt-3 bg-red-100 border-red-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    ⚠️ <strong>ATENÇÃO:</strong> O valor unitário calculado está 
                    <strong className="text-red-700">
                      {' '}{((calcularValorUnitarioCompleto() / parseFloat(valorSao || '1') - 1) * 100).toFixed(1)}% acima
                    </strong> 
                    {' '}do valor orçado na SAO!
                  </AlertDescription>
                </Alert>
              )}
              
              {parseFloat(valorSao || '0') > 0 && calcularValorUnitarioCompleto() <= parseFloat(valorSao || '0') && (
                <Alert className="mt-3 bg-green-100 border-green-300">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    ✅ <strong>APROVADO:</strong> O valor unitário está dentro do orçamento da SAO
                    {calcularValorUnitarioCompleto() < parseFloat(valorSao || '0') && (
                      <>
                        {' '}com economia de{' '}
                        <strong className="text-green-700">
                          {((1 - calcularValorUnitarioCompleto() / parseFloat(valorSao || '1')) * 100).toFixed(1)}%
                        </strong>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Seção: Cláusulas e Documentação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">📋 Cláusulas E Documentação</h3>
            
            <Alert className="bg-purple-100 border-purple-300">
              <AlertDescription>
                ⚠️ Em caso de rescisão, multa equivalente a 3 aluguéis
              </AlertDescription>
            </Alert>
            
            <div>
              <Label className="mb-2 block">Despesas Adicionais</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="taxa-lixo" checked={temTaxaLixo} onCheckedChange={(c) => setTemTaxaLixo(!!c)} />
                  <Label htmlFor="taxa-lixo">Taxa De Lixo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="condominio" checked={temCondominio} onCheckedChange={(c) => setTemCondominio(!!c)} />
                  <Label htmlFor="condominio">Condomínio</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="seguro" checked={temSeguroPredial} onCheckedChange={(c) => setTemSeguroPredial(!!c)} />
                  <Label htmlFor="seguro">Seguro Predial</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Particularidades / Observações</Label>
              <Textarea value={particularidades} onChange={(e) => setParticularidades(e.target.value)} rows={3} />
            </div>

            <div>
              <Label className="mb-2 block">Checklist Contratual</Label>
              <TooltipProvider>
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Checkbox id="reajuste" checked={checklistReajuste} onCheckedChange={(c) => setChecklistReajuste(!!c)} />
                        <Label htmlFor="reajuste">Reajuste Anual</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Reajuste anual por IGPM/IPCA</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Checkbox id="manutencao" checked={checklistManutencao} onCheckedChange={(c) => setChecklistManutencao(!!c)} />
                        <Label htmlFor="manutencao">Responsabilidade De Manutenção</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Definir responsável pela manutenção</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Checkbox id="nr24" checked={checklistVistoriaNr24} onCheckedChange={(c) => setChecklistVistoriaNr24(!!c)} />
                        <Label htmlFor="nr24">Vistoria (NR-24)</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Vistoria conforme NR-24</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Checkbox id="seguro-check" checked={checklistSeguro} onCheckedChange={(c) => setChecklistSeguro(!!c)} />
                        <Label htmlFor="seguro-check">Seguro Predial</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Seguro predial obrigatório</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Checkbox id="foro" checked={checklistForo} onCheckedChange={(c) => setChecklistForo(!!c)} />
                        <Label htmlFor="foro">Foro Contratual</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Foro de resolução de conflitos</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            <div>
              <Label>Upload De Contrato (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setContratoPdfUrl(URL.createObjectURL(file));
                }
              }} />
            </div>

            <div>
              <Label>Upload De Fotos (Até 5)</Label>
              {analiseId ? (
                <UploadFotos 
                  analiseId={analiseId} 
                  fotosAtuais={fotosImovel} 
                  onUpdate={setFotosImovel} 
                  maxFotos={5} 
                />
              ) : (
                <p className="text-sm text-muted-foreground">Salve o rascunho primeiro para enviar fotos</p>
              )}
            </div>
          </div>

          {/* Seção de Aprovação */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">✅ Aprovação</h3>
            
            <Alert className="bg-blue-50 border-blue-300">
              <AlertDescription>
                ℹ️ Este card pode ser aprovado por <strong>Gestor OU Superintendência</strong>. A aprovação de qualquer um dos dois valida este card.
              </AlertDescription>
            </Alert>

            {/* Status das Aprovações */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-semibold mb-2">👨‍💼 Gestor</p>
                <Badge className={cn(
                  "text-white",
                  statusGestor === 'aprovado' && "bg-green-600",
                  statusGestor === 'reprovado' && "bg-red-600",
                  statusGestor === 'aguardando' && "bg-blue-600",
                  statusGestor === 'pendente' && "bg-gray-600"
                )}>
                  {statusGestor === 'aprovado' ? '✅ Aprovado' : 
                   statusGestor === 'reprovado' ? '❌ Reprovado' :
                   statusGestor === 'aguardando' ? '⏳ Aguardando' : '⚪ Pendente'}
                </Badge>
                <div className="mt-2">
                  <Label className="text-xs">Email Para Alerta</Label>
                  <Input 
                    type="email" 
                    value={emailValidacaoGestor} 
                    onChange={(e) => setEmailValidacaoGestor(e.target.value)}
                    placeholder="email.gestor@exemplo.com"
                    className="text-sm"
                  />
                </div>
                {statusGestor === 'pendente' && (
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={async () => {
                      if (!emailValidacaoGestor) {
                        toast({ title: "Email obrigatório", variant: "destructive" });
                        return;
                      }
                      await handleSalvarRascunho();
                      await supabase
                        .from('analises_contratuais')
                        .update({ status_gestor: 'aguardando' })
                        .eq('id', analiseId);
                      setStatusGestor('aguardando');
                      await handleEnviarAlerta(emailValidacaoGestor, 'Card 3 - Gestor');
                      toast({ title: "Alerta enviado para Gestor" });
                    }}
                  >
                    📧 Enviar Para Gestor
                  </Button>
                )}
                {statusGestor === 'aguardando' && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label className="text-sm font-semibold mb-2">💬 Observações</Label>
                      <Textarea placeholder="Adicione observações ou comentários..." id="comentario-gestor" rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          const comentario = (document.getElementById('comentario-gestor') as HTMLTextAreaElement).value;
                          await handleAprovarCard('card3-gestor', 'status_gestor', comentario, '');
                        }}
                      >
                        ✅ Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="flex-1"
                        onClick={async () => {
                          const comentario = (document.getElementById('comentario-gestor') as HTMLTextAreaElement).value;
                          await handleReprovarCard('card3-gestor', 'status_gestor', comentario);
                        }}
                      >
                        ❌ Reprovar
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        const comentario = (document.getElementById('comentario-gestor') as HTMLTextAreaElement).value;
                        if (!comentario) {
                          toast({ title: "Comentário obrigatório", variant: "destructive" });
                          return;
                        }
                        // Lógica para adicionar comentário sem aprovar/reprovar
                        toast({ title: "Comentário adicionado" });
                      }}
                    >
                      💬 Comentar
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm font-semibold mb-2">👔 Superintendência</p>
                <Badge className={cn(
                  "text-white",
                  statusSuper === 'aprovado' && "bg-green-600",
                  statusSuper === 'reprovado' && "bg-red-600",
                  statusSuper === 'aguardando' && "bg-blue-600",
                  statusSuper === 'pendente' && "bg-gray-600"
                )}>
                  {statusSuper === 'aprovado' ? '✅ Aprovado' : 
                   statusSuper === 'reprovado' ? '❌ Reprovado' :
                   statusSuper === 'aguardando' ? '⏳ Aguardando' : '⚪ Pendente'}
                </Badge>
                <div className="mt-2">
                  <Label className="text-xs">Email Para Alerta</Label>
                  <Input 
                    type="email" 
                    value={emailValidacaoSuper} 
                    onChange={(e) => setEmailValidacaoSuper(e.target.value)}
                    placeholder="email.super@exemplo.com"
                    className="text-sm"
                  />
                </div>
                {statusSuper === 'pendente' && (
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={async () => {
                      if (!emailValidacaoSuper) {
                        toast({ title: "Email obrigatório", variant: "destructive" });
                        return;
                      }
                      await handleSalvarRascunho();
                      await supabase
                        .from('analises_contratuais')
                        .update({ status_super: 'aguardando' })
                        .eq('id', analiseId);
                      setStatusSuper('aguardando');
                      await handleEnviarAlerta(emailValidacaoSuper, 'Card 3 - Superintendência');
                      toast({ title: "Alerta enviado para Superintendência" });
                    }}
                  >
                    📧 Enviar Para Superintendência
                  </Button>
                )}
                {statusSuper === 'aguardando' && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label className="text-sm font-semibold mb-2">💬 Observações</Label>
                      <Textarea placeholder="Adicione observações ou comentários..." id="comentario-super" rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          const comentario = (document.getElementById('comentario-super') as HTMLTextAreaElement).value;
                          await handleAprovarCard('card3-super', 'status_super', comentario, '');
                        }}
                      >
                        ✅ Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="flex-1"
                        onClick={async () => {
                          const comentario = (document.getElementById('comentario-super') as HTMLTextAreaElement).value;
                          await handleReprovarCard('card3-super', 'status_super', comentario);
                        }}
                      >
                        ❌ Reprovar
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        const comentario = (document.getElementById('comentario-super') as HTMLTextAreaElement).value;
                        if (!comentario) {
                          toast({ title: "Comentário obrigatório", variant: "destructive" });
                          return;
                        }
                        // Lógica para adicionar comentário sem aprovar/reprovar
                        toast({ title: "Comentário adicionado" });
                      }}
                    >
                      💬 Comentar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Envio para Assinatura - Sempre Visível */}
      <Card 
        className={cn(
          "mt-6 transition-all duration-300",
          todosAprovados 
            ? "border-green-500 bg-green-50 shadow-lg" 
            : "border-amber-400 bg-gray-50 opacity-90"
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              {todosAprovados ? (
                <>
                  <CheckCircle className="text-green-600" />
                  ✍️ Enviar Para Assinatura
                </>
              ) : (
                <>
                  <Lock className="text-amber-600" />
                  ✍️ Enviar Para Assinatura
                </>
              )}
            </CardTitle>
            
            <Badge 
              className={cn(
                "text-white",
                todosAprovados ? "bg-green-600" : "bg-amber-500"
              )}
            >
              {todosAprovados ? "✅ Pronto Para Assinatura" : "🔒 Aguardando Aprovações"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mensagem de Status */}
          {todosAprovados ? (
            <Alert className="bg-green-100 border-green-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                ✅ <strong>Todas as aprovações concluídas!</strong> Você pode enviar o contrato para assinatura.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-400">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                🔒 Esta seção será habilitada após aprovação de <strong>todos os cards acima</strong>.
              </AlertDescription>
            </Alert>
          )}

          {/* Lista de Status das Aprovações */}
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-3">
              {todosAprovados ? "📋 Aprovações Concluídas" : "⏳ Aprovações Pendentes"}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {statusAdm === 'aprovado' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">
                      Card 1 - ADM Matricial: <strong>Aprovado</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700">
                      Card 1 - ADM Matricial: <strong>Aguardando</strong>
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {statusFinanceiro === 'aprovado' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">
                      Card 2 - Financeiro: <strong>Aprovado</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700">
                      Card 2 - Financeiro: <strong>Aguardando</strong>
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {card3Aprovado ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">
                      Card 3 - Custos, Rateios, Cláusulas E Documentação: <strong>Aprovado</strong>
                    </span>
                  </>
                ) : (statusGestor === 'reprovado' && statusSuper === 'reprovado') ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700">
                      Card 3 - Custos, Rateios, Cláusulas E Documentação: <strong>Reprovado</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700">
                      Card 3 - Custos, Rateios, Cláusulas E Documentação: <strong>Aguardando (Gestor OU Superintendência)</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Campos de Email */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="email-assinatura" className={!todosAprovados ? "text-muted-foreground" : ""}>
                📧 Email Principal Para Assinatura
              </Label>
              <Input
                id="email-assinatura"
                type="email"
                placeholder="isabela.grecco@abelv.com.br"
                defaultValue="isabela.grecco@abelv.com.br"
                disabled={!todosAprovados}
                className={cn(
                  "text-lg",
                  !todosAprovados && "bg-gray-100 cursor-not-allowed text-muted-foreground"
                )}
              />
            </div>

            <div>
              <Label htmlFor="emails-copia" className={!todosAprovados ? "text-muted-foreground" : ""}>
                📧 Emails Em Cópia (Separados Por Vírgula)
              </Label>
              <Textarea
                id="emails-copia"
                placeholder="email1@exemplo.com, email2@exemplo.com"
                disabled={!todosAprovados}
                className={cn(
                  !todosAprovados && "bg-gray-100 cursor-not-allowed text-muted-foreground"
                )}
                rows={2}
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      size="lg"
                      disabled={!todosAprovados}
                      className={cn(
                        "gap-2 text-white text-lg py-6",
                        todosAprovados 
                          ? "bg-green-600 hover:bg-green-700 animate-pulse" 
                          : "bg-gray-400 cursor-not-allowed"
                      )}
                      onClick={async () => {
                        if (!todosAprovados) return;
                        
                        const emailAssinatura = (document.getElementById('email-assinatura') as HTMLInputElement).value;
                        const emailsCopia = (document.getElementById('emails-copia') as HTMLTextAreaElement).value;
                        
                        if (!emailAssinatura) {
                          toast({
                            title: "Email obrigatório",
                            description: "Informe o email para assinatura",
                            variant: "destructive",
                          });
                          return;
                        }

                        if (!contratoPdfUrl) {
                          toast({
                            title: "Contrato não anexado",
                            description: "É necessário anexar o PDF do contrato antes de enviar",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          // Salvar email no banco
                          await supabase
                            .from('analises_contratuais')
                            .update({
                              email_assinatura: emailAssinatura,
                              emails_adicionais: emailsCopia,
                              data_envio_validacao: new Date().toISOString(),
                              bloco_atual: 'aguardando_assinatura',
                            })
                            .eq('id', analiseId);

                          // Chamar edge function para enviar email
                          const { error: functionError } = await supabase.functions.invoke('enviar-contrato-assinatura', {
                            body: {
                              analiseId,
                              emailAssinatura,
                              emailsCopia: emailsCopia ? emailsCopia.split(',').map(e => e.trim()) : [],
                              nomeAlojamento: `${tipoAlojamento} ALOJAMENTO - ${logradouro}, ${numero}`,
                              contratoPdfUrl,
                            },
                          });

                          if (functionError) throw functionError;

                          toast({
                            title: "Email enviado com sucesso! ✅",
                            description: `Contrato enviado para ${emailAssinatura}`,
                          });
                        } catch (error: any) {
                          toast({
                            title: "Erro ao enviar email",
                            description: error.message,
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      📤 Enviar Para Assinatura
                    </Button>
                  </div>
                </TooltipTrigger>
                {!todosAprovados && (
                  <TooltipContent>
                    <p>Aguardando aprovação de todos os cards</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Auditoria */}
      {analiseId && <HistoricoAuditoria analiseId={analiseId} />}
        </TabsContent>
        
        <TabsContent value="mobilia" className="mt-6">
          <Card className="bg-purple-50 border-purple-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🛋️ Planilha de Mobília</span>
                <Badge className={cn(
                  "text-white text-lg px-4 py-2",
                  calcularTotalMobilia() === 0 && "bg-gray-500",
                  calcularTotalMobilia() > 0 && calcularTotalMobilia() <= 5000 && "bg-green-600",
                  calcularTotalMobilia() > 5000 && calcularTotalMobilia() <= 10000 && "bg-yellow-600",
                  calcularTotalMobilia() > 10000 && "bg-red-600"
                )}>
                  Total: {formatarMoeda(calcularTotalMobilia())}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Calcule os gastos com mobília para este imóvel
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {calcularTotalMobilia() > 10000 && (
                <Alert className="bg-red-100 border-red-300">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    ⚠️ <strong>ATENÇÃO:</strong> Custo de mobília acima de R$ 10.000,00. Verificar necessidade com gestão.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-purple-200 rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-yellow-400">
                      <th className="p-3 text-left border border-gray-300 font-semibold">Custos</th>
                      <th className="p-3 text-center border border-gray-300 font-semibold">Qtde</th>
                      <th className="p-3 text-right border border-gray-300 font-semibold bg-green-400">Valor Unitário</th>
                      <th className="p-3 text-right border border-gray-300 font-semibold">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensMobilia.map((item, index) => (
                      <tr key={index} className={cn(
                        index % 2 === 0 ? 'bg-pink-100' : 'bg-white',
                        item.editavel && 'bg-yellow-50'
                      )}>
                        <td className="p-3 border border-gray-300">
                          {item.editavel ? (
                            <Input
                              type="text"
                              value={item.item}
                              onChange={(e) => handleItemMobiliaChange(index, e.target.value)}
                              placeholder="Digite o nome do item"
                              className="w-full p-2 h-10 bg-yellow-100 border-yellow-300"
                            />
                          ) : (
                            item.item
                          )}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          <Input
                            type="number"
                            min="0"
                            value={item.qtde}
                            onChange={(e) => handleQtdeMobiliaChange(index, parseFloat(e.target.value) || 0)}
                            className="w-24 text-center p-2 h-10 bg-pink-50 border-pink-300"
                          />
                        </td>
                        <td className="p-3 border border-gray-300 text-right bg-green-200">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.valorUnitario}
                            onChange={(e) => handleValorUnitarioMobiliaChange(index, parseFloat(e.target.value) || 0)}
                            className="w-32 text-right p-2 h-10 bg-green-100 border-green-300 font-medium"
                          />
                        </td>
                        <td className="p-3 border border-gray-300 text-right font-semibold">
                          {formatarMoeda(item.valorTotal)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-800 text-white font-bold sticky bottom-0">
                      <td colSpan={3} className="p-3 border border-gray-300 text-left text-lg">TOTAL GERAL</td>
                      <td className="p-3 border border-gray-300 text-right text-xl">
                        {formatarMoeda(calcularTotalMobilia())}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
                <div className="text-sm">
                  ℹ️ <strong>Itens selecionados:</strong> {itensMobilia.filter(i => i.qtde > 0).length} de {itensMobilia.length}
                </div>
                <Button onClick={handleSalvarRascunho} variant="outline" className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Mobília
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guia" className="mt-6">
          <GuiaAnaliseContratual />
        </TabsContent>
      </Tabs>
    </div>
  );
}
