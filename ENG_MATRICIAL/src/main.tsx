import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OSProvider } from '@/contexts/OSContext'

createRoot(document.getElementById("root")!).render(
  <OSProvider>
    <App />
  </OSProvider>
);
