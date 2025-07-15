FROM node:18-alpine

# Instalar cron
RUN apk add --no-cache dcron

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar arquivo de log
RUN touch /var/log/email-sender.log

# Configurar cron job
RUN echo "*/5 * * * * cd /app && node index.js >> /var/log/email-sender.log 2>&1" > /var/spool/cron/crontabs/root

# Dar permissões
RUN chmod 0644 /var/spool/cron/crontabs/root

# Expor porta (para healthcheck)
EXPOSE 3000

# Criar script de inicialização
RUN echo '#!/bin/sh\n\
# Iniciar cron\n\
crond -l 2 -d\n\
\n\
# Servidor HTTP simples para healthcheck\n\
node -e "\
const http = require(\"http\");\
const server = http.createServer((req, res) => {\
  if (req.url === \"/health\") {\
    res.writeHead(200, { \"Content-Type\": \"application/json\" });\
    res.end(JSON.stringify({ status: \"ok\", timestamp: new Date().toISOString() }));\
  } else {\
    res.writeHead(404);\
    res.end(\"Not Found\");\
  }\
});\
server.listen(3000, () => console.log(\"Health check server running on port 3000\"));\
" &\n\
\n\
# Manter container rodando\n\
tail -f /var/log/email-sender.log' > /app/start.sh

RUN chmod +x /app/start.sh

# Comando padrão
CMD ["/app/start.sh"]