import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MigrationConfig {
  localStorageKey: string;
  supabaseTable: string;
  migrationFlagKey: string;
  mapFunction: (item: any) => any;
  enabled?: boolean;
}

export function useMigracaoLocalStorage(config: MigrationConfig) {
  const { toast } = useToast();
  const [migrationStatus, setMigrationStatus] = useState<{
    isRunning: boolean;
    completed: boolean;
    itemsMigrated: number;
    errors: number;
  }>({
    isRunning: false,
    completed: false,
    itemsMigrated: 0,
    errors: 0,
  });

  useEffect(() => {
    if (config.enabled === false) return;

    const executarMigracao = async () => {
      // Verificar se migração já foi executada
      const migrationCompleted = localStorage.getItem(config.migrationFlagKey);
      if (migrationCompleted === "true") {
        setMigrationStatus(prev => ({ ...prev, completed: true }));
        return;
      }

      // Verificar se há dados para migrar
      const dadosLocal = localStorage.getItem(config.localStorageKey);
      if (!dadosLocal) {
        localStorage.setItem(config.migrationFlagKey, "true");
        return;
      }

      try {
        const dados = JSON.parse(dadosLocal);
        if (!Array.isArray(dados) || dados.length === 0) {
          localStorage.setItem(config.migrationFlagKey, "true");
          return;
        }

        setMigrationStatus(prev => ({ ...prev, isRunning: true }));

        let migrated = 0;
        let errors = 0;

        // Migrar item por item (evita conflitos de ID)
        for (const item of dados) {
          try {
            const mappedItem = config.mapFunction(item);
            
            const { error } = await supabase
              .from(config.supabaseTable as any)
              .insert([mappedItem])
              .select();

            if (error) {
              console.error(`Erro ao migrar item:`, error);
              errors++;
            } else {
              migrated++;
            }
          } catch (err) {
            console.error(`Erro ao processar item:`, err);
            errors++;
          }
        }

        // Marcar migração como concluída
        localStorage.setItem(config.migrationFlagKey, "true");
        
        // Limpar localStorage após sucesso
        if (errors === 0) {
          localStorage.removeItem(config.localStorageKey);
        }

        setMigrationStatus({
          isRunning: false,
          completed: true,
          itemsMigrated: migrated,
          errors: errors,
        });

        // Notificar usuário
        if (migrated > 0) {
          toast({
            title: "Migração Concluída",
            description: `${migrated} registro(s) foram migrados com sucesso para o banco de dados.`,
          });
        }

        if (errors > 0) {
          toast({
            title: "Migração Parcial",
            description: `${errors} registro(s) não puderam ser migrados. Verifique o console.`,
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error("Erro na migração:", error);
        setMigrationStatus(prev => ({ ...prev, isRunning: false }));
        toast({
          title: "Erro na Migração",
          description: "Ocorreu um erro ao migrar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    executarMigracao();
  }, [config, toast]);

  return migrationStatus;
}
