import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, Target, Workflow, FileCheck, AlertTriangle, 
  BarChart3, Clock, Mail, Zap, Users, GraduationCap, HelpCircle,
  CheckCircle2, Calendar, FileText, ClipboardList, TrendingUp
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function GuiaModulo() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Guia do módulo</h1>
          <p className="text-muted-foreground">
            Gestão de documentação de mobilização
          </p>
        </div>
      </div>

      {/* Seção 1: Visão Geral */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Visão geral do módulo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-blue-500">🎯</span> Objetivo
              </h4>
              <p className="text-sm text-muted-foreground">
                Padronizar e controlar admissões garantindo conformidade legal
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-green-500">⚙️</span> O que faz
              </h4>
              <p className="text-sm text-muted-foreground">
                Centraliza documentação, cadastros Nydhus, ASO e relatórios
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-purple-500">🔄</span> Fluxo completo
              </h4>
              <p className="text-sm text-muted-foreground">
                Do primeiro contato até admissão efetiva
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-orange-500">📊</span> KPIs monitorados
              </h4>
              <p className="text-sm text-muted-foreground">
                Lead time, documentos pendentes, taxa de conformidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Passo a Passo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-purple-500" />
            Passo a passo - Como usar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* PASSO 1 */}
            <AccordionItem value="passo-1">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">1</Badge>
                  <span className="font-semibold">Nova admissão</span>
                  <Badge className="ml-auto bg-blue-500">D0 - Primeiro contato</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Logo após identificar novo colaborador para obra</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Como funciona:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                      <li>Clicar em <NavLink to="/nova-admissao" className="text-primary hover:underline">"Nova admissão"</NavLink></li>
                      <li>Preencher nome, CPF, obra, função</li>
                      <li>Fazer upload do RG/CNH</li>
                      <li>Sistema cria registro em validacao_admissao automaticamente</li>
                      <li>Redireciona para próxima etapa</li>
                    </ol>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="text-red-500">*</span> Campos obrigatórios:
                    </h4>
                    <p className="text-sm text-muted-foreground">Nome*, CPF*, RG*, Função*, CCA*</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm"><strong>💡 Dica:</strong> Dados preenchidos aqui são auto-carregados nas próximas etapas</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status gerado:</span>
                    <Badge variant="secondary">Em cadastro</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 2 */}
            <AccordionItem value="passo-2">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">2</Badge>
                  <span className="font-semibold">Validação de admissão (Nydhus)</span>
                  <Badge className="ml-auto bg-green-500">D0 a D3</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Após pré-cadastro, para completar dados e enviar ao DP. Dividido em 5 abas:
                </p>

                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">Aba 2.1: Dados do colaborador</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Complementar dados pessoais (endereço, contatos, dependentes)</li>
                      <li>CEP com busca automática de endereço</li>
                      <li>Estado civil, raça (opcional), escolaridade</li>
                      <li>Dados bancários para pagamento</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">Aba 2.2: Admissão</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Definir CCA, função, salário, data admissão prevista</li>
                      <li>Sistema sugere última função utilizada pelo CPF</li>
                      <li>Calcular salário projetado automaticamente</li>
                      <li>Escolher supervisor e período experiência</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-purple-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">Aba 2.3: Ajuda de custo</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Informar valores de vale transporte e vale alimentação</li>
                      <li>Descontos aplicáveis</li>
                      <li>Integração com planilha de ajuda de custo</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-orange-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">Aba 2.4: Checklist ASO</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Marcar documentos enviados ao médico do trabalho</li>
                      <li>Acompanhar status de exames</li>
                      <li>Aguardar liberação do ASO</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm mb-2">Aba 2.5: Envio ao DP</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Revisar todos os dados preenchidos</li>
                      <li>Clicar em "Enviar ao DP"</li>
                      <li>Sistema envia e-mail automático para Fabrícia e Lucas</li>
                      <li>Marca campo data_envio e atualiza status</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Prazo esperado:</span>
                    <span className="text-sm text-muted-foreground">D0 a D3 (3 dias úteis)</span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm"><strong>✅ Output:</strong> E-mail automático + cadastro Nydhus sincronizado</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 3 */}
            <AccordionItem value="passo-3">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">3</Badge>
                  <span className="font-semibold">Checklist de documentação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Paralelamente ao cadastro, para monitorar documentos</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Documentos monitorados (checklist dinâmico):</h4>
                    <div className="space-y-2">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Obrigatórios:</p>
                        <p className="text-xs text-muted-foreground">RG/CNH, CPF, CTPS Digital, Comprovante endereço, Cartão SUS, ASO</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Condicionais:</p>
                        <p className="text-xs text-muted-foreground">Certidão casamento (se casado), Cert. nascimento filhos (se tem dependentes)</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Por função:</p>
                        <p className="text-xs text-muted-foreground">NR10, NR35, CNH especial (conforme cargo)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Status possíveis:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-500">✅ OK</Badge>
                      <Badge className="bg-yellow-500">⏳ Pendente</Badge>
                      <Badge className="bg-red-500">❌ Vencido</Badge>
                      <Badge className="bg-blue-500">🔍 Em validação</Badge>
                      <Badge variant="secondary">➖ Não se aplica</Badge>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm"><strong>⚙️ Como funciona:</strong> Sistema busca em checklist_documentos_template e aplica lógica condicional</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 4 */}
            <AccordionItem value="passo-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">4</Badge>
                  <span className="font-semibold">Relação de documentos e prazos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Para verificar lista completa de documentos exigidos para um colaborador</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Visualização:</h4>
                    <p className="text-sm text-muted-foreground">Tabela com documento, prazo, status, dias restantes</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Funcionalidade:</h4>
                    <p className="text-sm text-muted-foreground">Gerar PDF da relação para enviar ao candidato</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Alertas visuais:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-red-500">🔴 Atrasado</Badge>
                      <Badge className="bg-yellow-500">🟡 Próximo do prazo</Badge>
                      <Badge className="bg-green-500">🟢 No prazo</Badge>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 5 */}
            <AccordionItem value="passo-5">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">5</Badge>
                  <span className="font-semibold">Relatórios por colaborador</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Para ter visão consolidada de todos os colaboradores em mobilização</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Filtros disponíveis:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Obra/CCA</li>
                      <li>Status geral (Apto | Pendente | Vencido)</li>
                      <li>Busca por nome ou RE</li>
                      <li>Período de cadastro</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Ações por linha:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">👁️ Ver detalhes</Badge>
                      <Badge variant="outline">📄 Baixar ZIP de documentos</Badge>
                      <Badge variant="outline">📧 Enviar lembrete</Badge>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm"><strong>📊 Export:</strong> CSV ou Excel com todos os dados</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 6 */}
            <AccordionItem value="passo-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">6</Badge>
                  <span className="font-semibold">Alertas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Diariamente para priorizar ações</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tipos de alerta:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge className="bg-red-600 shrink-0">🔴 Crítico</Badge>
                        <span className="text-sm text-muted-foreground">Documento obrigatório vencido há mais de 3 dias</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-orange-500 shrink-0">🟠 Alto</Badge>
                        <span className="text-sm text-muted-foreground">Documento vence em até 2 dias</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-yellow-500 shrink-0">🟡 Médio</Badge>
                        <span className="text-sm text-muted-foreground">Documento vence em 3-5 dias</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-blue-500 shrink-0">🔵 Baixo</Badge>
                        <span className="text-sm text-muted-foreground">Documento vence em 6-10 dias</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Ações disponíveis:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">🔔 Enviar notificação</Badge>
                      <Badge variant="outline">👁️ Ver detalhes</Badge>
                      <Badge variant="outline">✅ Marcar como resolvido</Badge>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 7 */}
            <AccordionItem value="passo-7">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">7</Badge>
                  <span className="font-semibold">Dashboard</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Para visão gerencial e reuniões de status</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">KPIs principais:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <p className="font-medium">% Entregas no Prazo</p>
                        <p className="text-muted-foreground">Meta: &gt;85%</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <p className="font-medium">Aptos Finais</p>
                        <p className="text-muted-foreground">Qtd e %</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <p className="font-medium">Cobertura Docs Críticos</p>
                        <p className="text-muted-foreground">%</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <p className="font-medium">Tempo D0→Apto</p>
                        <p className="text-muted-foreground">Dias</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Gráficos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>📊 Funil de Entrega (Exigidos → Recebidos → Validados → Apto)</li>
                      <li>🥧 Pizza de Status (Apto, Condicional, Reprovado)</li>
                      <li>📈 Evolução Diária de Entregas no Prazo</li>
                      <li>📊 Comparativo por CCA (barras)</li>
                      <li>🔥 Heatmap de Pendências Críticas</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 8 */}
            <AccordionItem value="passo-8">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">8</Badge>
                  <span className="font-semibold">LeadTime - Contratação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Para análise de eficiência do processo</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Métricas monitoradas:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Lead time médio geral (em dias)</li>
                      <li>Obra com menor lead time</li>
                      <li>Obra com maior lead time</li>
                      <li>Contratações finalizadas no período</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Timeline detalhada por colaborador:</h4>
                    <p className="text-sm text-muted-foreground">1º Contato → Envio Docs → Cadastro Nydhus → ASO Liberado → Admissão Realizada</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Semáforo de Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-500">🟢 Rápido: até 5 dias</Badge>
                      <Badge className="bg-yellow-500">🟡 Moderado: 6 a 10 dias</Badge>
                      <Badge className="bg-red-500">🔴 Lento: acima de 10 dias</Badge>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PASSO 9 */}
            <AccordionItem value="passo-9">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0">9</Badge>
                  <span className="font-semibold">Destinatários</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Quando usar:</h4>
                    <p className="text-sm text-muted-foreground">Para configurar quem recebe relatórios semanais</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Funcionalidade:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Adicionar múltiplos e-mails por CCA</li>
                      <li>Ativar/desativar destinatários</li>
                      <li>Enviar teste manual</li>
                      <li>Visualizar log de envios</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm"><strong>⏰ Envio automático:</strong> Toda segunda-feira às 09h (apenas se houver pendências)</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Conteúdo do e-mail:</h4>
                    <p className="text-sm text-muted-foreground">Resumo de documentos pendentes, vencidos e a vencer por CCA</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Seção 3: Integrações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            🔄 Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Badge className="bg-blue-500 shrink-0">Nydhus</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Sistema de gestão de RH</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                  <li>Cadastro automático após envio ao DP</li>
                  <li>Sincronização bidirecional de dados</li>
                  <li>Campo nydhus_sync_at registra quando sincronizou</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Badge className="bg-green-500 shrink-0">Ajuda de Custo</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Planilha automática</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                  <li>Gerada automaticamente após admissão</li>
                  <li>Contém valores de VT, VA e descontos</li>
                  <li>Enviada junto com e-mail ao DP</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Badge className="bg-purple-500 shrink-0">E-mail</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Notificações automáticas</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                  <li>Destinatários: Fabrícia e Lucas (DP)</li>
                  <li>Trigger: Ao clicar "Enviar ao DP" na aba 5</li>
                  <li>Conteúdo: Dados completos do colaborador + anexos</li>
                  <li>Relatórios semanais: Configurável por CCA</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Badge className="bg-orange-500 shrink-0">Controle Mão de Obra</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Sincronização automática</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                  <li>Trigger sync_colaborador_efetivo cria registro automático</li>
                  <li>Badge "Mobilização" aparece no módulo de efetivo</li>
                  <li>Sincronização reversa: Mudanças no efetivo atualizam validação</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 4: Responsabilidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            🧍 Responsabilidades por etapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Etapa</th>
                  <th className="text-center p-2 font-semibold">Admin Obra</th>
                  <th className="text-center p-2 font-semibold">Coordenação</th>
                  <th className="text-center p-2 font-semibold">DP</th>
                  <th className="text-center p-2 font-semibold">Seg. Trabalho</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="p-2">Pré-cadastro</td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Completar dados</td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-blue-500 text-xs">C</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Enviar documentos</td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-purple-500 text-xs">A</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Cadastro Nydhus</td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Liberação ASO</td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                </tr>
                <tr>
                  <td className="p-2">Admissão final</td>
                  <td className="text-center p-2"><Badge variant="secondary" className="text-xs">I</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-blue-500 text-xs">C</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-green-500 text-xs">✅ R</Badge></td>
                  <td className="text-center p-2"><Badge className="bg-purple-500 text-xs">A</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-xs">R</Badge>
              <span className="text-muted-foreground">Responsável</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500 text-xs">A</Badge>
              <span className="text-muted-foreground">Aprovador</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-xs">C</Badge>
              <span className="text-muted-foreground">Consultado</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">I</Badge>
              <span className="text-muted-foreground">Informado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 5: Indicadores e Metas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-500" />
            📊 Indicadores e metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Lead Time D0→Apto</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Máx 7 dias</Badge>
                <Badge className="bg-red-500">⚠️ Crítico &gt;10 dias</Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Taxa de Entregas no Prazo</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Mín 85%</Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Cobertura Documentos Críticos</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Mín 95%</Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Taxa de Ilegíveis</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Máx 10%</Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Backlog Crítico</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Máx 15 documentos</Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Aging Backlog</p>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-green-500">🎯 Máx 5 dias</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 6: FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-orange-500" />
            ❓ Perguntas frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-sm">
                O que fazer se o campo "Raça" é obrigatório mas o candidato não quer informar?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Campo agora é opcional. Pode ser deixado em branco.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-sm">
                Preciso preencher tudo de uma vez?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Não. O sistema salva automaticamente. Você pode voltar depois.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-sm">
                E se o candidato não tiver todos os documentos?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Envie mesmo assim. O sistema vai gerar alertas para os documentos pendentes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-sm">
                Como sei que o e-mail foi enviado ao DP?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Aparece confirmação na tela + campo data_envio é preenchido + você recebe cópia do e-mail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger className="text-sm">
                Posso editar dados depois de enviar ao DP?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Sim, mas as mudanças precisam ser comunicadas manualmente ao DP.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <AccordionTrigger className="text-sm">
                O que é CoAdmissão Interna?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                ✅ Quando um colaborador já da Abelv muda de obra/função. O processo é similar mas mais rápido.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Seção 7: Glossário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            📖 Glossário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">D0</p>
              <p className="text-xs text-muted-foreground">Dia zero - primeiro contato com o candidato</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">CCA</p>
              <p className="text-xs text-muted-foreground">Centro de Custo Administrativo (código da obra)</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">ASO</p>
              <p className="text-xs text-muted-foreground">Atestado de Saúde Ocupacional</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">MOD</p>
              <p className="text-xs text-muted-foreground">Mão de Obra Direta</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">MOI</p>
              <p className="text-xs text-muted-foreground">Mão de Obra Indireta</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">Lead Time</p>
              <p className="text-xs text-muted-foreground">Tempo total entre etapas</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">Backlog</p>
              <p className="text-xs text-muted-foreground">Documentos pendentes acumulados</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold">Aging</p>
              <p className="text-xs text-muted-foreground">Tempo médio de espera</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 8: Mensagem Final */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">✨</div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-lg">Mensagem final</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Este módulo é parte essencial da <strong>profissionalização dos processos administrativos da Abelv</strong>, 
                garantindo rastreabilidade, padronização e agilidade em cada nova admissão.
              </p>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Dúvidas ou sugestões? Entre em contato com a equipe de desenvolvimento.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
