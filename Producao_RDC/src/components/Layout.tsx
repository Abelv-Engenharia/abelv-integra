import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useLocation } from "react-router-dom"

const getTitleByRoute = (pathname: string): string => {
  if (pathname.startsWith('/eletrica-')) {
    return "Sistema de Registro - Elétrica/Instrumentação"
  }
  if (pathname.startsWith('/cadastro-') || pathname.startsWith('/areas-projeto') || pathname === '/ccas') {
    return "Cadastro Geral"
  }
  return "Sistema de Registro - Mecânica/Tubulação"
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const title = getTitleByRoute(location.pathname)
  const isEletricaModule = location.pathname.startsWith('/eletrica-')
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className={`h-12 flex items-center border-b px-4 ${
            isEletricaModule 
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
              : 'bg-card'
          }`}>
            <SidebarTrigger />
            <h1 className={`ml-4 text-lg font-semibold ${
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
      </div>
    </SidebarProvider>
  )
}