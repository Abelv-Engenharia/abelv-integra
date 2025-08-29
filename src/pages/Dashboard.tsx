
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { SecurityAlert } from "@/components/admin/SecurityAlert";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
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

  const getGreeting = (name: string) => {
    // Lista de nomes femininos comuns (pode ser expandida)
    const femaleNames = [
      'ana', 'maria', 'joana', 'carla', 'fernanda', 'juliana', 'amanda', 'patricia',
      'sandra', 'monica', 'lucia', 'rita', 'rosa', 'helena', 'beatriz', 'camila',
      'daniela', 'gabriela', 'isabela', 'leticia', 'mariana', 'natalia', 'paula',
      'renata', 'silvia', 'tatiana', 'vanessa', 'viviane', 'adriana', 'andrea',
      'cristina', 'debora', 'elizabete', 'fabiana', 'gloria', 'ingrid', 'jessica',
      'karina', 'larissa', 'marcela', 'nicole', 'olivia', 'priscila', 'raquel',
      'sabrina', 'tania', 'ursula', 'valeria', 'wanderlea', 'ximena', 'yara', 'zelia'
    ];
    
    const firstName = name.split(' ')[0].toLowerCase();
    const isFeminine = femaleNames.includes(firstName);
    
    return isFeminine ? 'Seja bem-vinda' : 'Seja bem-vindo';
  };

  // Obter o nome do usuário logado do perfil ou do user metadata
  const userName = profile?.nome || user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen p-6">
      <SecurityAlert />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {getGreeting(userName)}, {userName}!
          </h1>
        </div>
        <div>
          <p className="text-lg text-muted-foreground">
            {formatDateTime(currentDateTime)}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center items-center flex-1 mt-32">
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
