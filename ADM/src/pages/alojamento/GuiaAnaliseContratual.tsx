import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function GuiaAnaliseContratual() {
  const kpis = [
    { nome: "Tempo médio de aprovação", meta: "≤ 3 dias" },
    { nome: "Taxa de retrabalho", meta: "≤ 5%" },
    { nome: "Aderência a prazos de obra", meta: ">= 95%" },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Guia do Painel de Análise Contratual</h1>
        <p className="text-muted-foreground">Visão geral, passos, campos obrigatórios, cálculos e fluxo de aprovação.</p>
      </header>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Visão geral do módulo</span>
              <Badge variant="secondary">Administrativo • Aprovadores</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Este painel centraliza o cadastro e a aprovação de contratos de locação de imóveis para alojamentos. Ele organiza o processo em cartões de aprovação, garante a validação
              fiscal/financeira (incluindo IR quando aplicável) e consolida indicadores para tomada de decisão.
            </p>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Cadastro completo do locador e do imóvel</li>
              <li>Detalhamento financeiro com cálculo automático de tributos e indicadores</li>
              <li>Fluxo de aprovação por papéis (Adm Matricial, Financeiro, Gestor/Superintendência)</li>
              <li>Planilha de mobília integrada ao contrato</li>
              <li>Histórico de auditoria e possibilidade de envio para assinatura</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Indicadores e metas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {kpis.map((k) => (
                <div key={k.nome} className="rounded-md border p-3">
                  <div className="font-medium">{k.nome}</div>
                  <div className="text-muted-foreground">Meta: {k.meta}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Passo a passo</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="card1">
                <AccordionTrigger>Card 1 — Dados do Locador e Imóvel</AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p>
                    Preencha os dados cadastrais do locador (PF/PJ), endereço completo com CEP (busca automática), características do imóvel e dados de obra.
                  </p>
                  <div>
                    <div className="font-medium">Campos obrigatórios</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Tipo de locador, Nome/Razão Social, CPF/CNPJ</li>
                      <li>Endereço: CEP, Logradouro, Número, Bairro, Cidade, UF</li>
                      <li>Quartos, Capacidade, Distância da obra</li>
                      <li>Período da obra (datas ou período fixo)</li>
                    </ul>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Campos obrigatórios ficarão destacados em vermelho quando vazios. Utilize a busca por CEP para evitar inconsistências.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="card2">
                <AccordionTrigger>Card 2 — Financeiro, IR e Auditoria</AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p>
                    Informe CCA/código, tipo de alojamento, valores mensais, caução, reajuste, encargos e demais despesas. O sistema calcula automaticamente IR conforme faixas
                    vigentes e apresenta valores líquidos/métricas.
                  </p>
                  <div>
                    <div className="font-medium">Principais cálculos</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>IR com faixas progressivas e parcela a deduzir</li>
                      <li>Valor mensal líquido do contrato</li>
                      <li>Valor unitário por colaborador e por quarto (quando aplicável)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Validações</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Alertas automáticos de inconsistências e de extrapolação de indicadores</li>
                      <li>Checklist de anexos e evidências</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="card3">
                <AccordionTrigger>Card 3 — Custos, Cláusulas e Documentos</AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p>
                    Defina custos adicionais (limpeza, internet, energia, etc.), prazos, condições de reajuste e inclua as cláusulas contratuais padronizadas. Anexe
                    a documentação exigida.
                  </p>
                  <div>
                    <div className="font-medium">Regras de aprovação</div>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Aprovação unificada por Gestor ou Superintendência conforme alçada</li>
                      <li>Comentários obrigatórios quando houver reprovação</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mobilia">
                <AccordionTrigger>Planilha de Mobília</AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p>
                    Selecione itens, quantidades e valores para composição do custo total de mobília do imóvel. Os totais impactam os indicadores consolidados do painel.
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Itens com quantidade zero não compõem o total</li>
                    <li>Salve a planilha para manter os dados no rascunho</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assinatura">
                <AccordionTrigger>Envio para Assinatura</AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p>
                    Após aprovação de todos os cartões, o contrato pode ser enviado para assinatura. Certifique-se de que os dados fiscais e anexos estejam corretos.
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Todos os cartões devem estar aprovados</li>
                    <li>Histórico de auditoria permanece disponível para consulta</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de aprovação</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ol className="list-decimal pl-5">
              <li>Administrativo preenche dados e submete análise</li>
              <li>Financeiro valida valores, cálculos e anexos</li>
              <li>Gestor/Superintendência faz aprovação unificada do Card 3</li>
              <li>Com todos os status aprovados, liberar envio para assinatura</li>
            </ol>
            <Separator className="my-2" />
            <Alert>
              <AlertDescription>
                Dicas: use os tooltips dos campos para ajuda contextual e acompanhe os avisos na área de Alertas Automáticos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
