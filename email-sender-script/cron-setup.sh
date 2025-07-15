#!/bin/bash

# Script para configurar o cron job do email sender
# Execute com: bash cron-setup.sh

echo "=== Configurando Cron Job para Email Sender ==="

# Obter o diretório atual
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/email-sender.log"

# Criar arquivo de log se não existir
sudo touch $LOG_FILE
sudo chmod 666 $LOG_FILE

# Backup do crontab atual
echo "Fazendo backup do crontab atual..."
crontab -l > crontab_backup_$(date +%Y%m%d_%H%M%S).txt

# Criar entrada do cron job
CRON_JOB="*/5 * * * * cd $SCRIPT_DIR && /usr/bin/node index.js >> $LOG_FILE 2>&1"

# Adicionar ao crontab
echo "Adicionando cron job..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "=== Configuração concluída ==="
echo "Cron job configurado para executar a cada 5 minutos"
echo "Logs serão salvos em: $LOG_FILE"
echo ""
echo "Para verificar o crontab:"
echo "crontab -l"
echo ""
echo "Para ver os logs:"
echo "tail -f $LOG_FILE"
echo ""
echo "Para remover o cron job:"
echo "crontab -e"