
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Seja bem-vindo, Luis Ribeiro
          </h1>
        </div>
        <div>
          <p className="text-lg text-muted-foreground">
            {formatDateTime(currentDateTime)}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center items-center flex-1 mt-16">
        <img 
          src="/lovable-uploads/15c114e2-30c1-4767-9fe8-4ee84cc11daf.png" 
          alt="Hora da Segurança - Abelv Engenharia" 
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Dashboard;
