import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithAzure } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
const Login = () => {
  const [loading, setLoading] = useState(false);
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
  return <div 
    className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center bg-no-repeat bg-fixed"
    style={{
      backgroundImage: `url('/fundo-login-abelv.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  >
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-40 h-40 bg-white rounded-full flex items-center justify-center mb-6 p-4">
            <img 
              src="/lovable-uploads/c0dc6a51-83ae-4747-84d4-c2b1c6c9f9b2.png" 
              alt="ABELV Engenharia Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ABELV ENGENHARIA
          </h1>
          <p className="text-muted-foreground">
            Sistema de Gestão Integrada
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Faça login com sua conta Microsoft corporativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={signInWithAzure}
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                  </svg>
                  Entrar com Microsoft
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Utilize suas credenciais corporativas da Microsoft para acessar o sistema
              </p>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Problemas para fazer login?</strong><br />
                Entre em contato com o administrador do sistema
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © 2025 Abelv Engenharia Ltda. Todos os direitos reservados.
          </p>
        </div>
    </div>;
};
export default Login;