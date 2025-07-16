
#!/bin/bash

# Script para executar o processamento de emails a cada minuto
# Execute com: bash run-every-minute.sh

echo "=== Configurando execução a cada minuto do processador de emails ==="

# Obter o diretório atual
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/email-sender-minute.log"

# Criar arquivo de log se não existir
sudo touch $LOG_FILE
sudo chmod 666 $LOG_FILE

# Backup do crontab atual
echo "Fazendo backup do crontab atual..."
crontab -l > crontab_backup_$(date +%Y%m%d_%H%M%S).txt

# Remover cron job antigo se existir
echo "Removendo cron jobs antigos..."
crontab -l | grep -v "email-sender" | crontab -

# Criar entrada do cron job para executar a cada minuto
CRON_JOB="* * * * * cd $SCRIPT_DIR && /usr/bin/node improved-index.js >> $LOG_FILE 2>&1"

# Adicionar ao crontab
echo "Adicionando cron job..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "=== Configuração concluída ==="
echo "Cron job configurado para executar a cada minuto"
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
