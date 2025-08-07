
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigMenu } from "@/components/admin/ConfigMenu";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Administrativas</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigMenu />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
