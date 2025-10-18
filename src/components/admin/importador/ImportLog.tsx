import { ImportLog as ImportLogType } from '@/types/githubImport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportLogProps {
  logs: ImportLogType[];
}

export function ImportLog({ logs }: ImportLogProps) {
  const getIcon = (type: ImportLogType['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getTextColor = (type: ImportLogType['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-96 w-full border rounded-lg p-4">
      <div className="space-y-2 font-mono text-xs">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-2">
            {getIcon(log.type)}
            <div className="flex-1">
              <span className="text-muted-foreground">
                [{log.timestamp.toLocaleTimeString()}]
              </span>
              {' '}
              <span className={cn(getTextColor(log.type))}>
                {log.message}
              </span>
              {log.file && (
                <span className="text-muted-foreground ml-2">
                  ({log.file})
                </span>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Nenhum log disponível
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
