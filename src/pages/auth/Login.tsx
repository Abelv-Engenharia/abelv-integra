import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SystemLogo from "@/components/common/SystemLogo";
import { signInWithAzure } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleAzureLogin = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await signInWithAzure();
      if (error) {
        throw error;
      }
      // O redirecionamento será tratado automaticamente pelo Azure OAuth
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login com Azure";
      if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-2">ABELV ENGENHARIA</h1>
        <p className="text-gray-600">Sistema de Gestão Integrada</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Acesso ao Sistema</CardTitle>
          <CardDescription className="text-gray-600">
            Faça login com sua conta Microsoft corporativa
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAzureLogin} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
            </svg>
            {loading ? "Redirecionando..." : "Entrar com Microsoft"}
          </Button>
          
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Utilize suas credenciais corporativas da Microsoft para acessar o sistema
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Problemas para fazer login?</p>
            <p className="text-sm text-gray-600">Entre em contato com o administrador do sistema</p>
          </div>
        </CardFooter>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">© 2025 Abelv Engenharia Ltda. Todos os direitos reservados.</p>
      </div>
    </div>;
};
export default Login;