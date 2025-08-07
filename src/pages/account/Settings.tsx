
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Palette, Lock, Mail, MessageSquare, Moon, Sun } from "lucide-react";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import { useUserSettings } from "@/hooks/useUserSettings";

const Settings = () => {
  const { settings, saveSettingsMutation } = useUserSettings();

  const handleNotificationChange = (key: string, value: boolean) => {
    saveSettingsMutation.mutate({
      [key]: value,
    });
  };

  const handleThemeChange = (darkMode: boolean) => {
    saveSettingsMutation.mutate({
      dark_mode: darkMode,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema e sua conta
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium">
                      Notificações por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings?.email_notifications ?? true}
                  onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base font-medium">
                      Notificações por SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações urgentes por SMS
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings?.sms_notifications ?? false}
                  onCheckedChange={(checked) => handleNotificationChange('sms_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Cores do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-base font-medium">
                      Modo Escuro
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alternar entre tema claro e escuro
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings?.dark_mode ?? false}
                  onCheckedChange={handleThemeChange}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Cores do Tema</Label>
                <div className="grid grid-cols-6 gap-3">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Azul</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Verde</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Roxo</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Vermelho</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Laranja</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer hover:scale-110 transition-transform" />
                    <span className="text-xs">Rosa</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <ChangePasswordForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
