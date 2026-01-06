import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1. CSS DO BOOTSTRAP (Vem primeiro)
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// 2. SEU CSS (Vem por último para garantir o fundo escuro)
import './index.css'; 

import App from './App';

// 3. JAVASCRIPT CORRIGIDO
// Removemos o "import * as bootstrap from 'bootstrap'" que causava conflito.
// Importamos o BUNDLE e atribuímos ele ao window.
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)