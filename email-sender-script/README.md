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

## Configuração do Cron Job

Para executar automaticamente a cada 5 minutos:

```bash
# Editar crontab
crontab -e

# Adicionar linha:
*/5 * * * * cd /caminho/para/email-sender-script && /usr/bin/node index.js >> /var/log/email-sender.log 2>&1
```

## Inserindo e-mails na fila

Exemplo de inserção via SQL:
```sql
INSERT INTO emails_pendentes (destinatario, assunto, corpo, anexos) 
VALUES (
  'destinatario@email.com',
  'Assunto do e-mail',
  '<h1>Título</h1><p>Conteúdo do e-mail em HTML</p>',
  '[
    {"nome_arquivo": "documento.pdf", "url": "https://projeto.supabase.co/storage/v1/object/public/bucket/arquivo.pdf"},
    {"nome_arquivo": "planilha.xlsx", "url": "https://projeto.supabase.co/storage/v1/object/public/bucket/planilha.xlsx"}
  ]'::jsonb
);
```

## Logs

O script gera logs detalhados incluindo:
- Início e fim do processamento
- Sucessos e falhas de envio
- Detalhes de erros
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