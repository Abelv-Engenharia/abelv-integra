
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export const SecurityNotification: React.FC = () => {
  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Melhorias de Segurança Aplicadas</AlertTitle>
      <AlertDescription className="text-green-700">
        <div className="space-y-2">
          <p>As seguintes melhorias de segurança foram implementadas:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Políticas RLS atualizadas para tabelas sensíveis</li>
            <li>Funções do banco de dados com proteção contra ataques de schema</li>
            <li>Sanitização de conteúdo HTML para prevenir XSS</li>
            <li>Log de auditoria para eventos de segurança</li>
          </ul>
          <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              <strong>Ação Requerida:</strong> Rotacione as credenciais do Supabase e SMTP conforme documentado no SECURITY.md
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
