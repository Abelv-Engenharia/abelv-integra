# Script de Envio Automático de E-mails

Este script Node.js permite envio automático de e-mails via Office365 SMTP com suporte a anexos, integrado ao Supabase.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. O arquivo `.env` já está configurado com:
- `SUPABASE_URL`: https://xexgdtlctyuycohzhmuu.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: Configurado automaticamente
- `SMTP_USER`: sms@abelv.com.br
- `SMTP_PASS`: sfdtzbxvnhyrxqhk (senha de app)

## ✨ Funcionalidades Implementadas

### 📧 Envio de E-mails
- Suporte a anexos automáticos
- Tentativas de reenvio em caso de falha
- Logs detalhados de todas as operações
- Validação de conexões SMTP e Supabase

### 📊 Relatórios Automáticos
- **Relatório de Ocorrências**: Resumo e detalhes das ocorrências por período
- **Relatório de Desvios**: Estatísticas de desvios e status
- **Relatório de Treinamentos**: Horas e participantes por tipo
- **Relatório de Horas Trabalhadas**: Distribuição por CCA e período
- **Relatório de Indicadores**: Métricas SMS com médias e detalhes

### 🔧 Configuração Automática
- Processamento de configurações de emails programados
- Suporte a diferentes periodicidades (diário, semanal, quinzenal, mensal)
- Geração automática de relatórios baseada em período configurável

## Uso

### Execução manual:
```bash
npm start
```

### Execução em desenvolvimento (com nodemon):
```bash
npm run dev
```

## Como funciona

1. O script consulta a tabela `emails_pendentes` no Supabase
2. Filtra e-mails com `enviado = false` e `tentativas < 3`
3. Para cada e-mail:
   - Baixa os anexos das URLs informadas
   - Envia o e-mail via SMTP Office365
   - Atualiza o status no banco de dados
4. Em caso de falha, incrementa o contador de tentativas

## Estrutura da tabela emails_pendentes

- `id`: UUID (chave primária)
- `destinatario`: E-mail do destinatário
- `assunto`: Assunto do e-mail
- `corpo`: Corpo do e-mail em HTML
- `anexos`: Array JSON com objetos `{nome_arquivo, url}`
- `enviado`: Boolean indicando se foi enviado
- `tentativas`: Contador de tentativas de envio
- `criado_em`: Timestamp de criação

## 🔄 Configuração de Produção

### Opção 1: Cron Jobs (Recomendado)

#### Para processar configurações de emails:
```bash
# Executar a cada hora para processar configurações
0 * * * * psql "postgresql://postgres:[password]@[host]:5432/postgres" -c "SELECT public.processar_configuracoes_emails();" >> /var/log/email-config.log 2>&1

# Ou usando supabase CLI
0 * * * * supabase functions invoke processar_configuracoes_emails >> /var/log/email-config.log 2>&1
```

#### Para processar fila de emails pendentes:
```bash
# Executar a cada 15 minutos para processar emails pendentes
*/15 * * * * cd /caminho/para/email-sender-script && npm start >> /var/log/email-sender.log 2>&1

# Ou executar a cada hora
0 * * * * cd /caminho/para/email-sender-script && npm start >> /var/log/email-sender.log 2>&1
```

### Opção 2: Supabase Cron (Recomendado para configurações)

Você pode configurar cron jobs diretamente no Supabase para processar as configurações automaticamente:

```sql
-- Agendar processamento de configurações de emails para cada hora
SELECT cron.schedule('process-email-configs', '0 * * * *', 'SELECT public.processar_configuracoes_emails();');

-- Verificar jobs agendados
SELECT * FROM cron.job;
```

## 📋 Como Inserir Configurações de E-mail

### Via Interface Web
1. Acesse `/configuracao-emails` no sistema
2. Clique em "Nova Configuração"
3. Configure os detalhes do envio:
   - **Assunto**: Título do e-mail
   - **Destinatários**: Lista de e-mails
   - **Mensagem**: Corpo do e-mail
   - **Anexo**: Arquivo opcional
   - **Tipo de Relatório**: Escolha um relatório automático
   - **Período**: Dias de dados para o relatório
   - **Periodicidade**: Frequência de envio
   - **Horário**: Hora específica para envio

### Via SQL (Exemplo)
```sql
INSERT INTO configuracoes_emails (
  assunto, 
  destinatarios, 
  mensagem, 
  tipo_relatorio,
  periodo_dias,
  periodicidade, 
  hora_envio, 
  ativo
) VALUES (
  'Relatório Semanal de Ocorrências',
  ARRAY['gestor@empresa.com', 'supervisor@empresa.com'],
  '<p>Segue relatório semanal de ocorrências.</p>',
  'ocorrencias',
  7,
  'semanal',
  '09:00',
  true
);
```

## Logs

O script gera logs detalhados incluindo:
- Início e fim do processamento
- Sucessos e falhas de envio
- **Geração automática de relatórios**: O sistema gera relatórios em HTML baseados nos dados do período configurado
- Status de conexão SMTP e Supabase

## Troubleshooting

### Erro de autenticação SMTP
- Verifique se está usando a senha correta
- Para contas com 2FA, use uma senha de app
- Confirme que SMTP está habilitado na conta

### Erro de conexão Supabase
- Verifique a URL e Service Role Key
- Confirme que a tabela existe
- Verifique as políticas RLS

### Anexos não funcionando
- Confirme que as URLs estão acessíveis
- Verifique se os buckets são públicos ou têm URLs assinadas
- Teste o download manual das URLs