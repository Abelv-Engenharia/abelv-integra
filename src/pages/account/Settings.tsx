
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { settings, updateSettings, isUpdating } = useUserSettings();
  const { toggleDarkMode } = useTheme();

  const handleToggleChange = (setting: keyof typeof settings) => {
    if (setting === 'dark_mode') {
      toggleDarkMode();
    } else {
      updateSettings({
        [setting]: !settings[setting]
      });
    }
  };

  const handleSelectChange = (setting: keyof typeof settings, value: string) => {
    updateSettings({
      [setting]: value
    });
  };

  const handleSave = () => {
    // Força uma atualização completa das configurações
    updateSettings(settings);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como você recebe notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-base">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre atualizações e tarefas por email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={() => handleToggleChange('email_notifications')}
                disabled={isUpdating}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications" className="text-base">Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre atualizações e tarefas por SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.sms_notifications}
                onCheckedChange={() => handleToggleChange('sms_notifications')}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Utilize o tema escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.dark_mode}
                onCheckedChange={() => handleToggleChange('dark_mode')}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências Regionais</CardTitle>
            <CardDescription>Configure suas preferências de idioma e fuso horário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSelectChange('language', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => handleSelectChange('timezone', value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasil (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">East Coast (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
