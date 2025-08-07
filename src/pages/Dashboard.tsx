
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Sistema de gestão empresarial ABELV.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
