
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

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
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getGreeting = (name: string) => {
    const femaleNames = [
      "ana", "maria", "joana", "carla", "fernanda", "juliana", "amanda", "patricia",
      "sandra", "monica", "lucia", "rita", "rosa", "helena", "beatriz", "camila",
      "daniela", "gabriela", "isabela", "leticia", "mariana", "natalia", "paula",
      "renata", "silvia", "tatiana", "vanessa", "viviane", "adriana", "andrea",
      "cristina", "debora", "elizabete", "fabiana", "gloria", "ingrid", "jessica",
      "karina", "larissa", "marcela", "nicole", "olivia", "priscila", "raquel",
      "sabrina", "tania", "ursula", "valeria", "wanderlea", "ximena", "yara", "zelia",
    ];

    const firstName = name.split(" ")[0].toLowerCase();
    const isFeminine = femaleNames.includes(firstName);

    return isFeminine ? "Seja bem-vinda" : "Seja bem-vindo";
  };

  const userName =
    profile?.nome ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Usuário";

  return (
    <div className="min-h-screen p-6">
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
          src="https://xexgdtlctyuycohzhmuu.supabase.co/storage/v1/object/public/public-assets/SaaS_Integra%20(2).png"
          alt="Abelv Integra"
          className="max-w-[400px] w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Dashboard;
