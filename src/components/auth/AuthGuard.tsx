
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/common/PageLoader";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Reduced timeout for faster loading
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading || isChecking) {
    return <PageLoader text="Carregando..." size="md" />;
  }

  if (!user) {
    // Redirect to login page with the return url
    return (
      <Navigate
        to={`/login`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
