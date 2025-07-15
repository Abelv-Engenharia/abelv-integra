
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useUserSettings, UserSettings } from "@/hooks/useUserSettings";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import UploadTutoriais from "@/components/account/UploadTutoriais";
import ConfiguracaoEmails from "@/components/account/ConfiguracaoEmails";

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
      <div className="content-padding">
        <h1 className="heading-responsive mb-4 sm:mb-6">Configurações</h1>
        <Card>
          <CardContent className="pt-6">
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
    <div className="content-padding">
      <h1 className="heading-responsive mb-4 sm:mb-6">Configurações</h1>
      
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6">
          <TabsTrigger value="preferences" className="text-xs sm:text-sm">Preferências</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">Segurança</TabsTrigger>
          <TabsTrigger value="emails" className="text-xs sm:text-sm">E-mails</TabsTrigger>
          <TabsTrigger value="tutoriais" className="text-xs sm:text-sm">Upload Tutoriais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="section-spacing">
          <div className="card-grid">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Notificações</CardTitle>
                <CardDescription className="text-sm sm:text-base">Configure como você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <Label htmlFor="email-notifications" className="text-sm sm:text-base font-medium">Notificações por Email</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Receba notificações sobre atualizações e tarefas por email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={form.email_notifications}
                    onCheckedChange={() => handleToggleChange('email_notifications')}
                    className="flex-shrink-0"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <Label htmlFor="sms-notifications" className="text-sm sm:text-base font-medium">Notificações por SMS</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Receba notificações sobre atualizações e tarefas por SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={form.sms_notifications}
                    onCheckedChange={() => handleToggleChange('sms_notifications')}
                    className="flex-shrink-0"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Aparência</CardTitle>
                <CardDescription className="text-sm sm:text-base">Personalize a aparência do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <Label htmlFor="dark-mode" className="text-sm sm:text-base font-medium">Modo Escuro</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Utilize o tema escuro para reduzir o cansaço visual
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={form.dark_mode}
                    onCheckedChange={() => handleToggleChange('dark_mode')}
                    className="flex-shrink-0"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Preferências Regionais</CardTitle>
                <CardDescription className="text-sm sm:text-base">Configure suas preferências de idioma e fuso horário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="form-grid">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm sm:text-base">Idioma</Label>
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
                    <Label htmlFor="timezone" className="text-sm sm:text-base">Fuso Horário</Label>
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
            
            <div className="md:col-span-2 button-group-end">
              <Button onClick={handleSave} disabled={saveSettingsMutation.isPending} className="w-full sm:w-auto">
                {saveSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="section-spacing">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Alterar Senha</CardTitle>
              <CardDescription className="text-sm sm:text-base">Atualize sua senha de acesso</CardDescription>
            </CardHeader>
            <ChangePasswordForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="emails" className="section-spacing">
          <ConfiguracaoEmails />
        </TabsContent>
        
        <TabsContent value="tutoriais" className="section-spacing">
          <UploadTutoriais />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
