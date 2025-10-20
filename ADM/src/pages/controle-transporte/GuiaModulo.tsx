import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bus, AlertTriangle, Target, FileText, Send, TrendingUp, CheckCircle, Clock, Settings } from "lucide-react";

const GuiaModulo = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Guia do Módulo: Controle de Transporte</h1>
        <p className="text-muted-foreground text-lg">
          Sistema completo para gestão de despesas de transporte de colaboradores
        </p>
      </div>

      <Separator />

      {/* Visão Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Visão Geral do Módulo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            O módulo de <strong>Controle de Transporte</strong> centraliza todo o processo de gestão dos custos 
            relacionados ao deslocamento de colaboradores, desde o registro das medições mensais até a integração 
            com o sistema Sienge, passando pelo controle de metas, alertas automáticos e relatórios gerenciais.
          </p>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Funcionalidades Principais:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Medições Mensais:</strong> Registro detalhado das despesas de transporte por colaborador e obra</li>
              <li><strong>Controle de Metas:</strong> Definição e acompanhamento de metas de custo por tipo de transporte</li>
              <li><strong>Lançamentos Sienge:</strong> Integração automática com o sistema de gestão empresarial</li>
              <li><strong>Alertas Automáticos:</strong> Notificações de desvios, pendências e vencimentos</li>
              <li><strong>Relatórios Gerenciais:</strong> Dashboards e análises de performance e custos</li>
              <li><strong>Gestão de Destinatários:</strong> Configuração de e-mails para recebimento de relatórios</li>
            </ul>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ponto de Atenção</AlertTitle>
            <AlertDescription>
              As medições devem ser registradas mensalmente e validadas antes do lançamento no Sienge. 
              Medições não validadas não podem ser integradas ao sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Fluxo de Trabalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fluxo de Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <h4 className="font-semibold">Definição de Metas</h4>
                <p className="text-sm text-muted-foreground">
                  Configure metas de custo por tipo de transporte para controle orçamentário
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <h4 className="font-semibold">Registro de Medições</h4>
                <p className="text-sm text-muted-foreground">
                  Insira as despesas mensais de transporte por colaborador, obra e tipo de transporte
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <h4 className="font-semibold">Validação Matricial</h4>
                <p className="text-sm text-muted-foreground">
                  Equipe matricial valida as informações e aprova para lançamento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <h4 className="font-semibold">Lançamento Sienge</h4>
                <p className="text-sm text-muted-foreground">
                  Após validação, os dados são lançados automaticamente no Sienge
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">5</Badge>
              <div>
                <h4 className="font-semibold">Monitoramento</h4>
                <p className="text-sm text-muted-foreground">
                  Acompanhe alertas, desvios de metas e relatórios gerenciais
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsabilidades */}
      <Card>
        <CardHeader>
          <CardTitle>Responsabilidades por Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge>Administrador da Obra</Badge>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Registrar medições mensais de transporte</li>
                <li>Acompanhar colaboradores alocados</li>
                <li>Verificar alertas da obra</li>
                <li>Consultar relatórios da obra</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Administrador Matricial</Badge>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Definir e ajustar metas de custo</li>
                <li>Validar medições registradas</li>
                <li>Autorizar lançamento no Sienge</li>
                <li>Configurar destinatários de relatórios</li>
                <li>Analisar dashboards consolidados</li>
                <li>Gerenciar alertas globais</li>
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
            Submódulos e Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Medições */}
            <AccordionItem value="medicoes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Medições de Transporte</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Central para registro e controle das despesas mensais de transporte.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Campos Obrigatórios:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Competência:</strong> Mês/ano de referência</li>
                    <li><strong>Obra:</strong> Local de trabalho do colaborador</li>
                    <li><strong>Colaborador:</strong> Funcionário beneficiado</li>
                    <li><strong>Tipo de Transporte:</strong> Categoria (ônibus, van, aplicativo, etc.)</li>
                    <li><strong>Valor:</strong> Custo mensal total</li>
                    <li><strong>Dias Trabalhados:</strong> Quantidade de dias no período</li>
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
                  <AlertTitle>Prazo</AlertTitle>
                  <AlertDescription>
                    Medições devem ser registradas até o 5º dia útil do mês seguinte à competência.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            {/* Metas */}
            <AccordionItem value="metas">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Controle de Metas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Definição e acompanhamento de metas de custo por tipo de transporte.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Parâmetros da Meta:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Tipo de Transporte:</strong> Categoria a ser controlada</li>
                    <li><strong>Valor Meta:</strong> Custo mensal esperado por colaborador</li>
                    <li><strong>Tolerância:</strong> % de variação aceitável</li>
                    <li><strong>Vigência:</strong> Período de validade da meta</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Indicadores:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Desvio percentual em relação à meta</li>
                    <li>Quantidade de medições acima da meta</li>
                    <li>Economia ou estouro acumulado</li>
                    <li>Tendência mensal</li>
                  </ul>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Alerta de Desvio</AlertTitle>
                  <AlertDescription>
                    Quando uma medição ultrapassar a meta + tolerância, um alerta automático será gerado.
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
                  <h5 className="font-semibold text-sm">Processo de Integração:</h5>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Validação dos dados pela equipe matricial</li>
                    <li>Geração automática do lote de lançamento</li>
                    <li>Envio para o Sienge via API</li>
                    <li>Confirmação de recebimento e registro do protocolo</li>
                    <li>Atualização do status da medição</li>
                  </ol>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Dados Enviados:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Centro de custo (obra)</li>
                    <li>Colaborador</li>
                    <li>Tipo de despesa (transporte)</li>
                    <li>Valor total</li>
                    <li>Competência de referência</li>
                    <li>Observações e justificativas</li>
                  </ul>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Controle de Integração</AlertTitle>
                  <AlertDescription>
                    Todos os lançamentos possuem rastreabilidade completa, permitindo auditoria e 
                    reconciliação com o Sienge.
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
                      Desvio de Meta Crítico
                    </h5>
                    <p className="text-sm mt-1">
                      Dispara quando o custo supera a meta em mais de 20% ou o valor configurado de tolerância.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-500">Média</Badge>
                      Medição Pendente de Validação
                    </h5>
                    <p className="text-sm mt-1">
                      Notifica quando há medições registradas há mais de 3 dias sem validação matricial.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-500 bg-muted p-3 rounded-md">
                    <h5 className="font-semibold text-sm flex items-center gap-2">
                      <Badge variant="outline" className="border-yellow-500">Baixa</Badge>
                      Prazo de Registro Próximo
                    </h5>
                    <p className="text-sm mt-1">
                      Avisa 2 dias antes do prazo limite para registro das medições mensais.
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
                  <h5 className="font-semibold text-sm mb-2">Destinatários dos Alertas:</h5>
                  <p className="text-sm">
                    Configurável por tipo de alerta na seção "Destinatários". Recomenda-se incluir:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Administrador da obra (alertas da própria obra)</li>
                    <li>Coordenador matricial (todos os alertas)</li>
                    <li>Departamento financeiro (desvios e lançamentos)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Relatórios */}
            <AccordionItem value="relatorios">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Relatórios e Dashboards</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  Análises gerenciais para tomada de decisão e controle de performance.
                </p>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Relatórios Disponíveis:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Fechamento Mensal:</strong> Consolidação de todas as despesas por competência</li>
                    <li><strong>Análise por Obra:</strong> Custos segregados por centro de custo</li>
                    <li><strong>Análise por Tipo:</strong> Distribuição dos gastos por categoria de transporte</li>
                    <li><strong>Performance vs Meta:</strong> Comparativo de realizados versus metas estabelecidas</li>
                    <li><strong>Histórico de Lançamentos:</strong> Rastreabilidade completa dos envios ao Sienge</li>
                    <li><strong>Ranking de Custos:</strong> Colaboradores e obras com maiores despesas</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded-md space-y-2">
                  <h5 className="font-semibold text-sm">Indicadores do Dashboard:</h5>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    <div className="bg-background p-2 rounded">
                      <p className="text-xs text-muted-foreground">Custo Total Mensal</p>
                      <p className="font-semibold">R$ XXX.XXX,XX</p>
                    </div>
                    <div className="bg-background p-2 rounded">
                      <p className="text-xs text-muted-foreground">Desvio Médio (%)</p>
                      <p className="font-semibold">+X,XX%</p>
                    </div>
                    <div className="bg-background p-2 rounded">
                      <p className="text-xs text-muted-foreground">Medições Pendentes</p>
                      <p className="font-semibold">XX unidades</p>
                    </div>
                    <div className="bg-background p-2 rounded">
                      <p className="text-xs text-muted-foreground">Obras Ativas</p>
                      <p className="font-semibold">XX obras</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Exportação</AlertTitle>
                  <AlertDescription>
                    Todos os relatórios podem ser exportados em Excel (.xlsx) ou PDF para análises externas.
                  </AlertDescription>
                </Alert>
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
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <h4 className="font-semibold">Registro Pontual</h4>
                <p className="text-sm text-muted-foreground">
                  Registre as medições assim que encerrar o mês, não espere o prazo final. Isso permite 
                  correções e validação com mais tempo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <h4 className="font-semibold">Revisão de Metas</h4>
                <p className="text-sm text-muted-foreground">
                  Revise as metas trimestralmente ou quando houver mudanças significativas nos custos 
                  ou na operação das obras.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <h4 className="font-semibold">Documentação de Desvios</h4>
                <p className="text-sm text-muted-foreground">
                  Ao registrar medições acima da meta, inclua justificativa detalhada no campo observações. 
                  Isso facilita auditorias futuras.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <h4 className="font-semibold">Monitoramento de Alertas</h4>
                <p className="text-sm text-muted-foreground">
                  Configure destinatários adequados para cada tipo de alerta e verifique a caixa de entrada 
                  regularmente para ações tempestivas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">5</Badge>
              <div>
                <h4 className="font-semibold">Reconciliação Sienge</h4>
                <p className="text-sm text-muted-foreground">
                  Mensalmente, verifique no Sienge se todos os lançamentos foram processados corretamente. 
                  Use os números de protocolo para rastreamento.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
          <CardDescription>Principais benefícios do módulo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Controle Orçamentário</h4>
              <p className="text-sm text-muted-foreground">
                Gestão ativa de metas e desvios permite identificação rápida de despesas fora do padrão 
                e tomada de ações corretivas.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Automação de Processos</h4>
              <p className="text-sm text-muted-foreground">
                Integração com Sienge elimina retrabalho e reduz erros de lançamento manual, economizando 
                tempo da equipe administrativa.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Visibilidade Gerencial</h4>
              <p className="text-sm text-muted-foreground">
                Dashboards e relatórios consolidados facilitam análises estratégicas e apresentações 
                para diretoria e stakeholders.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Rastreabilidade Total</h4>
              <p className="text-sm text-muted-foreground">
                Histórico completo de todas as operações garante compliance em auditorias internas 
                e externas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuiaModulo;
