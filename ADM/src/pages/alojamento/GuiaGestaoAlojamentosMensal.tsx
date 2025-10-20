import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, FileText, Hotel, Bell, Users, AlertTriangle, CheckCircle2, Home, DollarSign, FileCheck } from "lucide-react";

const GuiaGestaoAlojamentosMensal = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Guia do Módulo: Gestão de Alojamentos - Mensal</h1>
        <p className="text-muted-foreground">
          Compreenda todos os processos, responsabilidades e funcionalidades do módulo de controle mensal de alojamentos
        </p>
      </div>

      {/* Visão Geral */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            O que é o Módulo Gestão de Alojamentos - Mensal?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            O módulo <strong>Gestão de Alojamentos - Mensal</strong> é responsável por gerenciar todos os aspectos relacionados à acomodação de colaboradores em obras, incluindo:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm ml-4">
            <li><strong>Controle de Caução:</strong> Gestão de valores depositados como garantia pelos colaboradores</li>
            <li><strong>Controle de Aluguel:</strong> Acompanhamento mensal dos valores de locação de imóveis</li>
            <li><strong>Hospedagem (Nota Fiscal):</strong> Registro de hospedagens pontuais com emissão de NF</li>
            <li><strong>Alertas Automáticos:</strong> Lembretes mensais para lançamentos e validações</li>
            <li><strong>Integração com Sienge:</strong> Validação matricial e lançamento no sistema</li>
          </ul>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Regra Importante:</strong> Colaboradores com função <Badge variant="destructive">AJUDANTE</Badge> NÃO podem ser alojados, 
              EXCETO se fizerem parte do projeto social CAPACITA+, quando estarão identificados como <Badge variant="outline">AJUDANTE PRJ</Badge>. 
              Lançamentos com AJUDANTE comum gerarão alertas automáticos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Fluxo de Trabalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Fluxo de Trabalho e Responsabilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h3 className="font-semibold text-lg">1. Administrativo da Obra</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Responsabilidades:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong className="text-primary">Cadastrar contrato de alojamento UMA ÚNICA VEZ</strong> após assinatura de ambas as partes (fornecedores)</li>
                <li>O cadastro do contrato gera automaticamente o gatilho para alertas mensais de medição</li>
                <li>Lançar medições mensais com dados dos colaboradores alojados</li>
                <li>Buscar informações automaticamente de sistemas integrados (RH ou relação de PJ)</li>
                <li>Fazer lançamentos manuais quando necessário (sistema registrará para auditoria)</li>
                <li>Responder aos alertas mensais de lançamento</li>
              </ul>
            </div>

            <div className="border-l-4 border-secondary pl-4 space-y-2">
              <h3 className="font-semibold text-lg">2. Administrativo Matricial</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Responsabilidades:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Validar os lançamentos feitos pelo administrativo da obra</li>
                <li>Conferir conformidade com contratos cadastrados</li>
                <li>Verificar se há colaboradores na função AJUDANTE (exceto AJUDANTE PRJ)</li>
                <li>Lançar as medições validadas no sistema Sienge</li>
                <li>Acompanhar alertas de contratos próximos ao vencimento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos e Submenus */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos e Submenus Detalhados</CardTitle>
          <CardDescription>Entenda o que cada submenu faz e os alertas que gera</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* CAUÇÃO */}
            <AccordionItem value="caucao">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Caução
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm">
                  A <strong>Caução</strong> é um valor depositado pelo colaborador como garantia contra danos ao imóvel ou mobília. 
                  É retido durante o período de alojamento e devolvido após a vistoria de saída.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Parâmetros Utilizados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li><strong>Valor da Caução:</strong> Montante depositado pelo colaborador</li>
                    <li><strong>Data de Depósito:</strong> Quando o valor foi recebido</li>
                    <li><strong>Forma de Pagamento:</strong> Dinheiro, transferência, desconto em folha, etc.</li>
                    <li><strong>Status:</strong> Depositada, Em Análise, Restituída, Retida (parcial ou total)</li>
                    <li><strong>Colaborador Vinculado:</strong> CPF e nome do responsável</li>
                    <li><strong>Imóvel Vinculado:</strong> Endereço do alojamento</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Submenus:</h4>
                  <div className="grid gap-3">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Cadastro de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Registra o recebimento de valores de caução. Vincula colaborador ao imóvel e gera comprovante.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Aprovação de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Validação matricial dos valores recebidos. Confirma recebimento e regularidade documental.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se houver caução pendente de aprovação por mais de 5 dias.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Restituição de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Processo de devolução após vistoria de saída. Calcula descontos por danos identificados.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se houver caução aguardando restituição por mais de 15 dias após desligamento.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Liquidação de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Controle financeiro da devolução. Registra comprovantes de transferência/pagamento.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se aprovada para restituição mas não liquidada em 10 dias.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Logs de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Auditoria completa de todas as movimentações. Rastreabilidade total do processo.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Destinatários de Caução</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Configuração de e-mails que receberão alertas sobre caução (por obra/CCA).
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ALUGUEL */}
            <AccordionItem value="aluguel">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Aluguel
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm">
                  O módulo <strong>Aluguel</strong> controla mensalmente os valores de locação de imóveis para alojamento de colaboradores. 
                  Inclui medições periódicas e integração com Sienge.
                </p>
                
                <div className="space-y-3">
                  <Alert className="bg-blue-50 border-blue-200 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Fluxo do Contrato:</strong> O contrato é cadastrado <strong>uma única vez</strong> após a assinatura de ambas as partes. 
                      Este cadastro ativa automaticamente os <strong>alertas mensais de medição</strong> para aquele imóvel.
                    </AlertDescription>
                  </Alert>

                  <h4 className="font-semibold">Parâmetros Utilizados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li><strong>Contrato de Locação:</strong> Número e dados do contrato com proprietário (cadastrado após assinatura)</li>
                    <li><strong>Valor Mensal:</strong> Valor do aluguel + condomínio + IPTU (se aplicável)</li>
                    <li><strong>Data de Vencimento:</strong> Dia do mês para pagamento</li>
                    <li><strong>Competência:</strong> Mês/ano de referência da medição</li>
                    <li><strong>Colaboradores Alojados:</strong> Lista de CPFs dos ocupantes do imóvel</li>
                    <li><strong>Rateio:</strong> Divisão proporcional do custo entre colaboradores</li>
                    <li><strong>CCA/Obra:</strong> Centro de custo para apropriação</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Submenus:</h4>
                  <div className="grid gap-3">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Visão Geral</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Dashboard com contratos ativos, medições pendentes, valores totais e competências em aberto.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Medições</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Lançamento mensal pelo administrativo da obra. Busca automática de colaboradores alojados dos sistemas integrados (RH/PJ).
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> todo dia 5 do mês se não houver medição lançada para a competência.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Lançamentos</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Validação matricial das medições. Conferência de dados antes de lançar no Sienge.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se houver medição aguardando validação por mais de 3 dias.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Alertas de Medição</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Painel consolidado de todos os alertas: medições atrasadas, contratos vencendo, colaboradores não identificados.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> quando detectado AJUDANTE (não PRJ) em medição.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Relatórios e Alertas</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Relatórios gerenciais: histórico de medições, inadimplências, ocupação por obra, custos por colaborador.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Destinatários</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Configuração de e-mails para receber alertas mensais de aluguel (CCA geral e por obra).
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* HOSPEDAGEM */}
            <AccordionItem value="hospedagem">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  Hospedagem (Nota Fiscal)
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-sm">
                  O módulo <strong>Hospedagem</strong> deve ser utilizado para casos <strong>pontuais e temporários</strong>, 
                  onde há emissão de nota fiscal pelo estabelecimento (hotéis, pousadas, apart-hotéis).
                </p>
                
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Quando Utilizar Hospedagem:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Mobilizações temporárias (menos de 30 dias)</li>
                      <li>Colaboradores em treinamento ou trânsito</li>
                      <li>Situações emergenciais antes da locação de imóvel</li>
                      <li>Visitas técnicas ou auditorias externas</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Parâmetros Utilizados:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li><strong>Nota Fiscal:</strong> Número, série e data de emissão da NF</li>
                    <li><strong>Estabelecimento:</strong> Nome, CNPJ e endereço do hotel/pousada</li>
                    <li><strong>Período de Hospedagem:</strong> Data de check-in e check-out</li>
                    <li><strong>Valor Total:</strong> Valor da NF (diárias + extras)</li>
                    <li><strong>Colaborador(es):</strong> CPF e nome dos hóspedes</li>
                    <li><strong>Motivo:</strong> Justificativa da hospedagem</li>
                    <li><strong>CCA/Obra:</strong> Centro de custo</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Submenus:</h4>
                  <div className="grid gap-3">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Medições</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Registro das notas fiscais de hospedagem. Upload de NF anexa. Vinculação de colaboradores.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se houver hospedagem &gt; 30 dias consecutivos para mesmo colaborador.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Lançamentos</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Validação matricial das NFs. Conferência de valores e justificativas. Lançamento no Sienge.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> se NF pendente de validação por mais de 5 dias.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Relatórios e Alertas</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Relatórios de custos com hospedagem por obra, colaborador e período. Análise de recorrências.
                        <Badge variant="outline" className="mt-2">Gera Alerta</Badge> quando detectado AJUDANTE em lançamento de hospedagem.
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Destinatários</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        Configuração de e-mails para alertas de hospedagem (CCA e por obra).
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Sistema de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Sistema de Alertas Automáticos
          </CardTitle>
          <CardDescription>Todos os alertas gerados pelo módulo e suas condições</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta Mensal de Lançamento (Aluguel):</strong> Enviado todo dia 5 do mês para o administrativo da obra se não houver medição lançada para a competência atual.
              </AlertDescription>
            </Alert>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Contrato Vencendo:</strong> Enviado 30 dias antes do vencimento do contrato de locação.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de AJUDANTE Alojado:</strong> Disparado imediatamente quando detectado colaborador com função AJUDANTE (que não seja AJUDANTE PRJ) em qualquer lançamento.
              </AlertDescription>
            </Alert>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Medição Pendente de Validação:</strong> Enviado ao administrativo matricial se houver medição aguardando validação por mais de 3 dias.
              </AlertDescription>
            </Alert>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Caução Pendente:</strong> Enviado se caução aguardando aprovação por mais de 5 dias.
              </AlertDescription>
            </Alert>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Restituição Pendente:</strong> Enviado se caução aprovada para restituição mas não liquidada em 15 dias após desligamento.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Hospedagem Prolongada:</strong> Enviado quando detectado hospedagem superior a 30 dias consecutivos para mesmo colaborador.
              </AlertDescription>
            </Alert>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Alerta de Lançamento Manual:</strong> Notifica quando administrativo faz lançamento manual (não buscou do RH/PJ) para auditoria.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Processo de Medição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Processo de Lançamento de Medição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">Busca Automática de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    O administrativo da obra inicia a medição. O sistema busca automaticamente os colaboradores alojados de:
                  </p>
                  <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                    <li><strong>Sistema RH (rhneyhduys):</strong> Para colaboradores CLT</li>
                    <li><strong>Relação de PJ:</strong> Para colaboradores pessoa jurídica</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">Lançamento Manual (quando necessário)</h4>
                  <p className="text-sm text-muted-foreground">
                    Se o colaborador não for encontrado nos sistemas, o administrativo pode fazer lançamento manual.
                  </p>
                  <Alert className="mt-2 bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Importante:</strong> O sistema registrará que foi lançamento manual e enviará alerta para auditoria, garantindo rastreabilidade.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">Validação de Função</h4>
                  <p className="text-sm text-muted-foreground">
                    O sistema valida automaticamente se há colaboradores com função AJUDANTE:
                  </p>
                  <ul className="list-disc list-inside text-sm ml-4 space-y-1 mt-2">
                    <li><Badge variant="outline">AJUDANTE PRJ</Badge> → <CheckCircle2 className="h-3 w-3 inline text-green-600" /> Permitido (projeto CAPACITA+)</li>
                    <li><Badge variant="destructive">AJUDANTE</Badge> → <AlertTriangle className="h-3 w-3 inline text-red-600" /> Bloqueado e gera alerta</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">Validação Matricial</h4>
                  <p className="text-sm text-muted-foreground">
                    O administrativo matricial recebe a medição e realiza:
                  </p>
                  <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                    <li>Conferência de valores com contratos</li>
                    <li>Validação de colaboradores alojados</li>
                    <li>Verificação de alertas e inconsistências</li>
                    <li>Aprovação ou devolução para correção</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  5
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold">Lançamento no Sienge</h4>
                  <p className="text-sm text-muted-foreground">
                    Após validação, o administrativo matricial realiza o lançamento oficial no sistema Sienge para apropriação contábil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusão */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-green-900">
          <p>
            O módulo <strong>Gestão de Alojamentos - Mensal</strong> centraliza e automatiza todos os processos relacionados ao controle de acomodações de colaboradores, desde o recebimento de caução até o lançamento contábil no Sienge.
          </p>
          <p>
            Com integração automática aos sistemas de RH e PJ, sistema robusto de alertas e controle rigoroso de funções permitidas (AJUDANTE PRJ vs AJUDANTE), 
            o módulo garante conformidade, rastreabilidade e eficiência operacional.
          </p>
          <p>
            A divisão clara de responsabilidades entre administrativo da obra (lançamento) e administrativo matricial (validação) assegura dupla checagem 
            e minimiza erros antes da apropriação financeira.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuiaGestaoAlojamentosMensal;
