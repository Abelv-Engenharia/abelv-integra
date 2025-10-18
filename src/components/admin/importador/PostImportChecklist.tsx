import { PostImportCheck } from '@/types/githubImport';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface PostImportChecklistProps {
  checks: PostImportCheck[];
  onCheckChange: (checks: PostImportCheck[]) => void;
}

export function PostImportChecklist({ checks, onCheckChange }: PostImportChecklistProps) {
  const handleItemCheck = (categoryIndex: number, itemIndex: number, checked: boolean) => {
    const updated = [...checks];
    updated[categoryIndex].items[itemIndex].checked = checked;
    
    // Atualizar status da categoria
    const allChecked = updated[categoryIndex].items.every(item => item.checked || !item.required);
    updated[categoryIndex].status = allChecked ? 'completed' : 'pending';
    
    onCheckChange(updated);
  };

  const getStatusIcon = (status: PostImportCheck['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getCategoryTitle = (category: PostImportCheck['category']) => {
    switch (category) {
      case 'env':
        return 'Variáveis de ambiente';
      case 'tailwind':
        return 'Tailwind / Shadcn';
      case 'supabase':
        return 'Supabase';
      case 'dependencies':
        return 'Dependências';
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {checks.map((check, categoryIndex) => (
        <AccordionItem key={check.category} value={check.category}>
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              {getStatusIcon(check.status)}
              <span>{getCategoryTitle(check.category)}</span>
              <Badge variant="outline">
                {check.items.filter(i => i.checked).length}/{check.items.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {check.items.map((item, itemIndex) => (
                <div key={item.name} className="flex items-start gap-3 pl-6">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => 
                      handleItemCheck(categoryIndex, itemIndex, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.name}</span>
                      {item.required && (
                        <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      )}
                    </div>
                    {item.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
