import { useLocation } from "react-router-dom"

const getTitleByRoute = (pathname: string): string => {
  if (pathname.startsWith('/operacional/eletrica-')) {
    return "Sistema de Registro - Elétrica/Instrumentação"
  }
  if (pathname.startsWith('/operacional/cadastro-') || pathname.startsWith('/operacional/areas-projeto') || pathname === '/operacional/ccas') {
    return "Cadastro Geral"
  }
  if (pathname === '/operacional') {
    return "Dashboard - Operacional"
  }
  return "Sistema de Registro - Mecânica/Tubulação"
}

export default function OperacionalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const title = getTitleByRoute(location.pathname)
  const isEletricaModule = location.pathname.startsWith('/operacional/eletrica-')
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className={`h-12 flex items-center border-b px-4 ${
        isEletricaModule 
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
          : 'bg-card'
      }`}>
        <h1 className={`text-lg font-semibold ${
          isEletricaModule 
            ? 'text-blue-800 dark:text-blue-200' 
            : 'text-foreground'
        }`}>
          {title}
        </h1>
      </header>
      <main className={`flex-1 p-6 ${
        isEletricaModule 
          ? 'bg-blue-50/30 dark:bg-blue-950/10' 
          : ''
      }`}>
        {children}
      </main>
    </div>
  )
}
