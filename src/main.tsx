import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootswatch/dist/cerulean/bootstrap.min.css"
import "datatables.net-dt/css/dataTables.dataTables.css"
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'
import "react-toastify/dist/ReactToastify.css"
import './acessoNegado.css'
import { AuthProvider } from 'react-oidc-context'
import { oidcConfig } from './config/authConfig.ts';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthProvider {...oidcConfig}>
    <App />
  </AuthProvider>
  </StrictMode>
)
