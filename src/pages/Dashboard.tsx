
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getUserName = () => {
    if (user?.user_metadata?.nome) {
      return user.user_metadata.nome;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuário';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Seja bem-vindo, {getUserName()}
          </h1>
        </div>
        <div>
          <p className="text-lg text-muted-foreground">
            {formatDateTime(currentDateTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
