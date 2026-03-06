import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootswatch/dist/cerulean/bootstrap.min.css"
import "datatables.net-dt/css/dataTables.dataTables.css"
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
