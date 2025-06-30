
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useUserSettings, UserSettings } from "@/hooks/useUserSettings";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

const Settings = () => {
  const { settings, isLoading, saveSettingsMutation } = useUserSettings();
  const [form, setForm] = useState<Omit<UserSettings, "id" | "user_id">>({
    email_notifications: true,
    sms_notifications: false,
    dark_mode: false,
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  });

  // Sincroniza form local quando settings carregadas
  useEffect(() => {
    if (settings) {
      setForm({
        email_notifications: !!settings.email_notifications,
        sms_notifications: !!settings.sms_notifications,
        dark_mode: !!settings.dark_mode,
        language: settings.language || "pt-BR",
        timezone: settings.timezone || "America/Sao_Paulo"
      });
    }
  }, [settings]);

  const handleToggleChange = (field: keyof typeof form) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSelectChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        <Card>
          <CardContent>
            <div className="my-6 space-y-2">
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              <div className="h-8 w-full bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-6">
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
                    checked={form.email_notifications}
                    onCheckedChange={() => handleToggleChange('email_notifications')}
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
                    checked={form.sms_notifications}
                    onCheckedChange={() => handleToggleChange('sms_notifications')}
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
                    checked={form.dark_mode}
                    onCheckedChange={() => handleToggleChange('dark_mode')}
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
                      value={form.language}
                      onValueChange={(value) => handleSelectChange('language', value)}
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
                      value={form.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value)}
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
              <Button onClick={handleSave} disabled={saveSettingsMutation.isPending}>
                {saveSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
