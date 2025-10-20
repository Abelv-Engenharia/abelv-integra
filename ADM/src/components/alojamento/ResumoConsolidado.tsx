import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FileText, Home, DollarSign, FileCheck, Calculator, Image as ImageIcon } from "lucide-react";

interface ResumoConsolidadoProps {
  dados: any;
}

export function ResumoConsolidado({ dados }: ResumoConsolidadoProps) {
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  const formatarData = (data: string): string => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Resumo Consolidado Do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["locador", "imovel", "financeiro", "clausulas", "custos"]} className="space-y-2">
          {/* Locador e Imóvel */}
          <AccordionItem value="locador">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dados Do Locador E Imóvel
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Tipo:</strong> {dados.tipo_locador === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                <div><strong>Nome:</strong> {dados.fornecedor_nome || dados.nome_proprietario}</div>
                <div><strong>Cpf/Cnpj:</strong> {dados.fornecedor_cnpj || dados.cpf_proprietario}</div>
                {dados.imobiliaria && <div><strong>Imobiliária:</strong> {dados.imobiliaria}</div>}
                <div className="col-span-2">
                  <strong>Endereço:</strong> {dados.logradouro}, {dados.numero}
                  {dados.complemento && ` - ${dados.complemento}`} - {dados.bairro}, {dados.cidade}/{dados.uf}
                </div>
                <div><strong>Cep:</strong> {dados.cep}</div>
                <div><strong>Tipo Alojamento:</strong> {dados.tipo_alojamento}</div>
                <div><strong>Quartos:</strong> {dados.quantidade_quartos}</div>
                <div><strong>Capacidade:</strong> {dados.capacidade_total}</div>
                <div><strong>Distância Obra:</strong> {dados.distancia_obra} km</div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Financeiro */}
          <AccordionItem value="financeiro">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Dados Financeiros E Ir
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Cca:</strong> {dados.cca_codigo}</div>
                <div><strong>Nº Contrato:</strong> {dados.numero_contrato}</div>
                <div><strong>Aluguel Mensal:</strong> {formatarMoeda(dados.valor_mensal)}</div>
                <div><strong>Vencimento:</strong> Dia {dados.dia_vencimento}</div>
                <div><strong>Tipo Pagamento:</strong> {dados.tipo_pagamento_detalhado || dados.tipo_pagamento}</div>
                <div><strong>Forma Pagamento:</strong> {dados.forma_pagamento}</div>
                <div><strong>Caução:</strong> {formatarMoeda(dados.caucao)}</div>
                <div><strong>Tipo Conta:</strong> {dados.conta_poupanca}</div>
                <div><strong>Meses Caução:</strong> {dados.meses_caucao}</div>
                <div><strong>Prazo:</strong> {dados.prazo_contratual} meses</div>
                <div><strong>Início:</strong> {formatarData(dados.data_inicio_contrato)}</div>
                <div><strong>Fim:</strong> {formatarData(dados.data_fim_contrato)}</div>
              </div>
              
              {dados.tipo_locador === 'pf' && dados.ir_valor_retido > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Badge variant="destructive" className="mb-2">Ir Obrigatório (Pf)</Badge>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><strong>Base Cálculo:</strong> {formatarMoeda(dados.ir_base_calculo)}</div>
                    <div><strong>Alíquota:</strong> {dados.ir_aliquota}%</div>
                    <div><strong>Parcela Deduzir:</strong> {formatarMoeda(dados.ir_parcela_deduzir)}</div>
                    <div><strong>Valor Ir:</strong> {formatarMoeda(dados.ir_valor_retido)}</div>
                    <div className="col-span-2"><strong>Valor Líquido:</strong> {formatarMoeda(dados.valor_liquido_pagar)}</div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Cláusulas */}
          <AccordionItem value="clausulas">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Cláusulas E Despesas
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <div>
                <strong className="block mb-2">Despesas Adicionais:</strong>
                <div className="flex flex-wrap gap-2">
                  {dados.tem_taxa_lixo && <Badge variant="outline">Taxa Lixo</Badge>}
                  {dados.tem_condominio && <Badge variant="outline">Condomínio</Badge>}
                  {dados.tem_seguro_predial && <Badge variant="outline">Seguro Predial</Badge>}
                  {!dados.tem_taxa_lixo && !dados.tem_condominio && !dados.tem_seguro_predial && (
                    <span className="text-muted-foreground">Nenhuma despesa adicional</span>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
                <strong className="block mb-2">Checklist:</strong>
                <div className="space-y-1">
                  <div>{dados.checklist_reajuste ? '✅' : '❌'} Reajuste Anual (Igpm/Ipca)</div>
                  <div>{dados.checklist_manutencao ? '✅' : '❌'} Responsabilidade Manutenção</div>
                  <div>{dados.checklist_vistoria_nr24 ? '✅' : '❌'} Vistoria Nr-24</div>
                  <div>{dados.checklist_seguro ? '✅' : '❌'} Seguro Predial</div>
                  <div>{dados.checklist_foro ? '✅' : '❌'} Foro Resolução</div>
                </div>
              </div>
              
              {dados.particularidades && (
                <div className="mt-3">
                  <strong>Particularidades:</strong>
                  <p className="text-muted-foreground mt-1">{dados.particularidades}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Custos */}
          <AccordionItem value="custos">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Custos E Indicadores
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Nº Moradores:</strong> {dados.numero_moradores || '-'}</div>
                <div><strong>Mensal Líquido:</strong> {formatarMoeda(dados.valor_mensal_liquido)}</div>
                <div><strong>Total Contrato:</strong> {formatarMoeda(dados.valor_total_contrato)}</div>
                <div><strong>Por Morador:</strong> {formatarMoeda(dados.valor_por_morador)}</div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Fotos */}
          {dados.fotos_imovel && dados.fotos_imovel.length > 0 && (
            <AccordionItem value="fotos">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Fotos Do Imóvel ({dados.fotos_imovel.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {dados.fotos_imovel.map((foto: any, index: number) => (
                    <div key={index} className="aspect-square rounded-lg border overflow-hidden bg-muted">
                      <img
                        src={foto.url}
                        alt={foto.nome || `Foto ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => window.open(foto.url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
