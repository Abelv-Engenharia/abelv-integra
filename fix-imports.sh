#!/bin/bash

# Script para corrigir todos os imports da Engenharia Matricial

# Diretórios
PAGES_DIR="src/pages/engenharia-matricial"
COMPONENTS_DIR="src/components/engenharia-matricial"
LIB_DIR="src/lib/engenharia-matricial"

# Substituir imports em todos os arquivos
find "$PAGES_DIR" "$COMPONENTS_DIR" "$LIB_DIR" -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  # Substituir @/contexts/OSContext por @/contexts/engenharia-matricial/OSContext
  sed -i "s|from ['\"]@/contexts/OSContext['\"]|from '@/contexts/engenharia-matricial/OSContext'|g" "$file"
  
  # Substituir @/lib/dadosAnuais por @/lib/engenharia-matricial/dadosAnuais
  sed -i "s|from ['\"]@/lib/dadosAnuais['\"]|from '@/lib/engenharia-matricial/dadosAnuais'|g" "$file"
  
  # Substituir @/lib/usuarios por @/lib/engenharia-matricial/usuarios
  sed -i "s|from ['\"]@/lib/usuarios['\"]|from '@/lib/engenharia-matricial/usuarios'|g" "$file"
  
  # Substituir @/components/FinalizacaoOSModal por @/components/engenharia-matricial/FinalizacaoOSModal
  sed -i "s|from ['\"]@/components/FinalizacaoOSModal['\"]|from '@/components/engenharia-matricial/FinalizacaoOSModal'|g" "$file"
  
  # Substituir formatarCCAComCliente de @/lib/utils por @/lib/engenharia-matricial/utils
  sed -i "s|from ['\"]@/lib/utils['\"]|from '@/lib/engenharia-matricial/utils'|g" "$file"
  
  echo "Fixed: $file"
done

echo "All imports fixed!"
