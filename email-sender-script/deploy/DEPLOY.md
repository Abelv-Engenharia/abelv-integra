# Guia de Deploy do Email Sender

## Opções de Deploy

### 1. Railway (Recomendado)

1. Conecte seu repositório no Railway
2. Configure as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SMTP_USER`
   - `SMTP_PASS`
3. O Railway detectará automaticamente o Dockerfile
4. Deploy será feito automaticamente

### 2. Render

1. Crie um novo Web Service no Render
2. Conecte seu repositório
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Adicione as variáveis de ambiente

### 3. Servidor Linux (VPS)

#### Instalação

```bash
# Clonar repositório
git clone <seu-repositorio>
cd email-sender-script

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Testar execução
npm start
```

#### Configurar Cron Job

```bash
# Tornar script executável
chmod +x cron-setup.sh

# Executar configuração do cron
./cron-setup.sh
```

#### Configurar como Serviço Systemd

```bash
# Criar arquivo de serviço
sudo nano /etc/systemd/system/email-sender.service
```

Conteúdo do arquivo:
```ini
[Unit]
Description=Email Sender Service
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/email-sender-script
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar e iniciar serviço
sudo systemctl daemon-reload
sudo systemctl enable email-sender
sudo systemctl start email-sender

# Verificar status
sudo systemctl status email-sender
```

### 4. Docker

```bash
# Build da imagem
docker build -t email-sender .

# Executar container
docker run -d \
  --name email-sender \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e SMTP_USER=your_email \
  -e SMTP_PASS=your_password \
  email-sender
```

### 5. PM2 (Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Criar arquivo ecosystem
echo 'module.exports = {
  apps: [{
    name: "email-sender",
    script: "index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    cron_restart: "0 */5 * * *"
  }]
}' > ecosystem.config.js

# Iniciar aplicação
pm2 start ecosystem.config.js

# Configurar inicialização automática
pm2 startup
pm2 save
```

## Monitoramento

### Logs
- **Railway/Render**: Logs disponíveis no dashboard
- **VPS**: `tail -f /var/log/email-sender.log`
- **Docker**: `docker logs email-sender`
- **PM2**: `pm2 logs email-sender`

### Healthcheck
O serviço expõe um endpoint `/health` na porta 3000 para verificação de status.

### Alertas
Configure alertas para:
- Falhas de autenticação SMTP
- Erros de conexão com Supabase
- E-mails com muitas tentativas falhadas

## Troubleshooting

### Problemas Comuns

1. **Erro de autenticação SMTP**
   - Verifique credenciais
   - Habilite "Acesso de aplicativo menos seguro" ou use senha de app
   - Confirme porta e configurações SSL

2. **Erro de conexão Supabase**
   - Verifique URL e chave
   - Confirme políticas RLS
   - Teste conexão manual

3. **Anexos não funcionando**
   - Verifique URLs dos arquivos
   - Confirme permissões de bucket
   - Teste download manual

### Comandos Úteis

```bash
# Verificar logs em tempo real
tail -f /var/log/email-sender.log

# Testar conexão SMTP
telnet smtp.office365.com 587

# Verificar cron jobs
crontab -l

# Testar script manualmente
node index.js

# Verificar status do serviço
systemctl status email-sender
```

## Backup e Recuperação

### Backup da Fila
```sql
-- Exportar e-mails pendentes
COPY (SELECT * FROM emails_pendentes WHERE enviado = false) TO '/backup/emails_pendentes.csv' WITH CSV HEADER;
```

### Recuperação
```sql
-- Importar e-mails
COPY emails_pendentes FROM '/backup/emails_pendentes.csv' WITH CSV HEADER;
```

## Otimização

### Performance
- Processar e-mails em lotes
- Limitar tentativas por execução
- Usar conexões persistentes

### Segurança
- Usar variáveis de ambiente
- Criptografar credenciais
- Implementar rate limiting
- Logs sem informações sensíveis

### Escalabilidade
- Múltiplas instâncias
- Balanceamento de carga
- Filas separadas por prioridade