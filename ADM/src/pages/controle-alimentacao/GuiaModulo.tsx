import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Utensils, AlertTriangle, Target, FileText, Send, TrendingUp, CheckCircle, Clock, Settings } from "lucide-react";

const GuiaModulo = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Guia Do Módulo: Controle De Alimentação</h1>
        <p className="text-muted-foreground text-lg">
          Sistema completo para gestão de despesas de alimentação de colaboradores
        </p>
      </div>

      <Separator />

      {/* Visão Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Visão Geral Do Módulo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            O módulo de <strong>Controle de Alimentação</strong> centraliza todo o processo de gestão dos custos 
            relacionados à alimentação de colaboradores em obra, desde o registro das medições mensais ou quinzenais 
            até a integração com o sistema Sienge, passando pelo controle de metas, alertas automáticos e relatórios gerenciais.
          </p>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Funcionalidades Principais:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Medições Periódicas:</strong> Registro detalhado das despesas de alimentação por colaborador e obra (mensal ou quinzenal)</li>
              <li><strong>Controle de Metas:</strong> Definição e acompanhamento de metas de refeições por CCA baseado no efetivo</li>
              <li><strong>Lançamentos Sienge:</strong> Integração automática com o sistema de gestão empresarial</li>
              <li><strong>Alertas Automáticos:</strong> Notificações no dia 1º de cada mês para lançamento até o dia 3</li>
              <li><strong>Relatórios Gerenciais:</strong> Dashboards e análises de performance e custos</li>
              <li><strong>Gestão de Destinatários:</strong> Configuração de e-mails para recebimento de relatórios</li>
            </ul>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ponto De Atenção</AlertTitle>
            <AlertDescription>
              As medições devem ser registradas mensalmente ou quinzenalmente e validadas antes do lançamento no Sienge. 
              Todo o efetivo Nydhus alocado em cada CCA deve receber almoço na obra. Medições não validadas não podem ser integradas ao sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Fluxo de Trabalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fluxo De Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <h4 className="font-semibold">Definição De Metas</h4>
                <p className="text-sm text-muted-foreground">
                  Configure metas mensais por CCA baseadas no efetivo Nydhus, valor unitário e dias úteis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <h4 className="font-semibold">Registro De Medições</h4>
                <p className="text-sm text-muted-foreground">
                  Insira as despesas de alimentação (café da manhã, almoço, janta, ceia) por obra e período
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <h4 className="font-semibold">Validação Matricial</h4>
                <p className="text-sm text-muted-foreground">
                  Equipe matricial valida as informações e aprova para lançamento até o dia 3 de cada mês
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <h4 className="font-semibold">Lançamento Sienge</h4>
                <p className="text-sm text-muted-foreground">
                  Após validação, os dados são lançados automaticamente no Sienge com vínculo à nota fiscal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">5</Badge>
              <div>
                <h4 className="font-semibold">Monitoramento</h4>
                <p className="text-sm text-muted-foreground">
                  Acompanhe alertas, desvios de metas e relatórios gerenciais consolidados
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsabilidades */}
      <Card>
        <CardHeader>
          <CardTitle>Responsabilidades Por Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge>Administrativo Da Obra</Badge>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Registrar medições mensais ou quinzenais de alimentação</li>
                <li>Anexar notas fiscais até o dia 3 de cada mês</li>
                <li>Acompanhar efetivo alocado na obra</li>
                <li>Verificar alertas da obra</li>
                <li>Consultar relatórios da obra</li>
                <li>Garantir que todo efetivo Nydhus receba almoço</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Administrativo Matricial</Badge>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Definir e ajustar metas mensais por CCA</li>
                <li>Validar medições registradas até o dia 3</li>
                <li>Autorizar lançamento no Sienge</li>
                <li>Configurar destinatários de relatórios</li>
                <li>Analisar dashboards consolidados</li>
                <li>Gerenciar alertas globais enviados no dia 1º</li>
                <li>Monitorar aderência às metas por obra</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Submódulos E Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Medições */}
            <AccordionItem value="medicoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Medições De Alimentação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Central para registro e controle das despesas periódicas de alimentação.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Campos Obrigatórios:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Competência:</strong> Mês/ano de referência</li>
                    <li><strong>Cca:</strong> Centro de custo da obra</li>
                    <li><strong>Fornecedor:</strong> Empresa fornecedora da alimentação</li>
                    <li><strong>Período:</strong> Mensal ou quinzenal</li>
                    <li><strong>Tipos De Refeição:</strong> Café da manhã, almoço, janta, ceia</li>
                    <li><strong>Quantidade:</strong> Total de refeições por tipo</li>
                    <li><strong>Valor Unitário:</strong> Custo por refeição</li>
                    <li><strong>Nota Fiscal:</strong> Documento fiscal vinculado</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Status Possíveis:</h5>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Pendente</Badge>
                    <Badge variant="secondary">Em Validação</Badge>
                    <Badge>Validada</Badge>
                    <Badge variant="default">Lançada Sienge</Badge>
                  </div>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Prazo Crítico</AlertTitle>
                  <AlertDescription>
                    Medições devem ser registradas e as notas fiscais anexadas até o dia 3 de cada mês. 
                    No dia 1º, alertas automáticos são enviados aos responsáveis.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Metas */}
            <AccordionItem value="metas">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Controle De Metas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Definição e acompanhamento de metas mensais de alimentação baseadas no efetivo por CCA.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Parâmetros Da Meta:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Cca:</strong> Centro de custo da obra</li>
                    <li><strong>Fornecedor:</strong> Empresa fornecedora</li>
                    <li><strong>Período:</strong> Mês de referência</li>
                    <li><strong>Meta Mensal De Refeições:</strong> Quantidade esperada baseada no efetivo</li>
                    <li><strong>Valor Unitário:</strong> Custo por refeição</li>
                    <li><strong>Dias Úteis:</strong> Quantidade de dias trabalhados no mês</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Cálculo Automático:</h5>
                  <p className="text-sm">
                    Meta Mensal = Efetivo Nydhus × Dias Úteis × Valor Unitário
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    O sistema considera que todo colaborador Nydhus deve almoçar na obra todos os dias úteis.
                  </p>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Indicadores:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Percentual de atingimento da meta</li>
                    <li>Quantidade realizada vs. esperada</li>
                    <li>Valor total gasto vs. orçado</li>
                    <li>Média de refeições por colaborador</li>
                  </ul>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Monitoramento Contínuo</AlertTitle>
                  <AlertDescription>
                    Metas abaixo de 80% de atingimento geram alertas automáticos para investigação e justificativa.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Lançamentos Sienge */}
            <AccordionItem value="sienge">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Lançamentos Sienge</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Integração automática com o sistema Sienge para registro contábil e financeiro.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Processo De Integração:</h5>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Validação dos dados pela equipe matricial</li>
                    <li>Verificação do vínculo com nota fiscal</li>
                    <li>Geração automática do lote de lançamento</li>
                    <li>Envio para o Sienge via API</li>
                    <li>Confirmação de recebimento e registro do protocolo</li>
                    <li>Atualização do status da medição</li>
                  </ol>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Dados Enviados:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Centro de custo (CCA)</li>
                    <li>Fornecedor de alimentação</li>
                    <li>Tipo de despesa (alimentação)</li>
                    <li>Detalhamento por tipo de refeição</li>
                    <li>Quantidade e valor unitário</li>
                    <li>Valor total da medição</li>
                    <li>Competência de referência</li>
                    <li>Número da nota fiscal</li>
                  </ul>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Rastreabilidade Completa</AlertTitle>
                  <AlertDescription>
                    Todos os lançamentos possuem vínculo com a nota fiscal e rastreabilidade completa, 
                    permitindo auditoria e reconciliação com o Sienge.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Alertas */}
            <AccordionItem value="alertas">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Alertas Automáticos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Sistema de notificações automáticas para gestão proativa de desvios e pendências.
                </p>

                <div className="space-y-3">
                  <div className="border-l-4 border-destructive bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="destructive">Alta</Badge>
                      Lançamento Pendente (dia 1º)
                    </h5>
                    <p className="text-sm mt-1">
                      Enviado no dia 1º de cada mês lembrando que a medição e nota fiscal devem ser lançadas até o dia 3.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-500">Média</Badge>
                      Meta Não Atingida
                    </h5>
                    <p className="text-sm mt-1">
                      Notifica quando o atingimento da meta mensal está abaixo de 80%, indicando que nem todo o efetivo está sendo alimentado.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-500 bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="outline" className="border-yellow-500">Baixa</Badge>
                      Medição Sem Nota Fiscal
                    </h5>
                    <p className="text-sm mt-1">
                      Avisa quando há medição validada mas sem nota fiscal anexada há mais de 2 dias.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-500">Info</Badge>
                      Lançamento Sienge Concluído
                    </h5>
                    <p className="text-sm mt-1">
                      Confirma a integração bem-sucedida com o Sienge e número do protocolo.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <h5 className="font-semibold text-sm mb-2">Destinatários Dos Alertas:</h5>
                  <p className="text-sm">
                    Configurável por tipo de alerta na seção "Destinatários". Recomenda-se incluir:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Administrativo da obra (alertas da própria obra)</li>
                    <li>Coordenador matricial (todos os alertas)</li>
                    <li>Departamento financeiro (lançamentos e notas fiscais)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Relatórios */}
            <AccordionItem value="relatorios">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Relatórios E Dashboards</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Análises gerenciais para tomada de decisão e controle de performance.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Relatórios Disponíveis:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Consolidado Por Obra:</strong> Total de refeições e custos por CCA</li>
                    <li><strong>Atingimento De Metas:</strong> Percentual realizado vs. esperado por obra</li>
                    <li><strong>Análise Por Tipo De Refeição:</strong> Distribuição entre café, almoço, janta e ceia</li>
                    <li><strong>Custo Por Colaborador:</strong> Gasto médio mensal por funcionário</li>
                    <li><strong>Histórico De Fornecedores:</strong> Performance e valores praticados</li>
                    <li><strong>Acompanhamento De Notas Fiscais:</strong> Status de lançamento e pendências</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Indicadores Chave (kpis):</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Total de refeições servidas no mês</li>
                    <li>Custo total e médio por obra</li>
                    <li>Percentual de atingimento global das metas</li>
                    <li>Quantidade de CCAs com metas não atingidas</li>
                    <li>Média de dias para lançamento de notas</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Boas Práticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Boas Práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-primary bg-muted p-3 rounded-md">
              <h5 className="font-semibold text-sm">Registro Disciplinado</h5>
              <p className="text-sm mt-1">
                Estabeleça uma rotina de registro no mesmo dia ou semana de recebimento da nota fiscal do fornecedor.
              </p>
            </div>

            <div className="border-l-4 border-primary bg-muted p-3 rounded-md">
              <h5 className="font-semibold text-sm">Validação Ágil</h5>
              <p className="text-sm mt-1">
                A equipe matricial deve revisar e validar medições em até 24 horas para cumprir o prazo do dia 3.
              </p>
            </div>

            <div className="border-l-4 border-primary bg-muted p-3 rounded-md">
              <h5 className="font-semibold text-sm">Conferência De Efetivo</h5>
              <p className="text-sm mt-1">
                Sempre confronte a quantidade de refeições com o efetivo Nydhus alocado para garantir que todos estão sendo contemplados.
              </p>
            </div>

            <div className="border-l-4 border-primary bg-muted p-3 rounded-md">
              <h5 className="font-semibold text-sm">Documentação Completa</h5>
              <p className="text-sm mt-1">
                Mantenha todas as notas fiscais devidamente anexadas e organizadas para facilitar auditorias e reconciliações.
              </p>
            </div>

            <div className="border-l-4 border-primary bg-muted p-3 rounded-md">
              <h5 className="font-semibold text-sm">Análise Periódica</h5>
              <p className="text-sm mt-1">
                Revise mensalmente os relatórios consolidados para identificar oportunidades de economia e otimização.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processo Pós-Fato */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Importante: Processo Pós-Fato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-orange-500">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-500">Atenção Ao Fluxo</AlertTitle>
            <AlertDescription>
              O processo de alimentação é sempre <strong>pós-fato</strong>: o colaborador se alimenta primeiro 
              e depois a nota é emitida pelo fornecedor. Por isso:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>As medições ocorrem <strong>após</strong> o consumo (quinzenal ou mensal)</li>
                <li>As notas são recebidas <strong>após</strong> o período de consumo</li>
                <li>O lançamento deve ser feito até o <strong>dia 3 do mês subsequente</strong></li>
                <li>Os alertas no dia 1º servem para lembrar do prazo crítico</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuiaModulo;
