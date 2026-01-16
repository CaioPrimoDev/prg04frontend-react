import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./api/context/AuthContext";
import './index.css';

// PAGES PÚBLICAS
import Home from "./pages/home/Home";
import Ingressos from "./pages/movies/ingressos";
import IngressosCompra from "./pages/payment/ingresso/IngressosCompra";
import Modals from "./components/user/Modals";
import PoltronasPage from "./pages/salas/poltronas";
import TermosDeUso from "./pages/terms/TermosDeUso";
import ResumoPage from "./pages/payment/resumo/ResumoPage";

// PAGES ADMIN
import AdminLayout from "./assets/layouts/AdminLayout";
import FilmesLista from "./pages/admin/FilmesLista"; 
import FilmeForm from "./pages/admin/FilmeForm";
// 1. IMPORTAR A NOVA PÁGINA
import AdminUsuarios from "./pages/admin/AdminUsuarios"; 

function App() {
  return (
    // 2. ENVOLVA TUDO COM AUTHPROVIDER
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermosDeUso />} />
          <Route path="/ingressos" element={<Ingressos />} />
          <Route path="/ingressos/compra" element={<IngressosCompra />} />
          <Route path="/ingressos/compra/poltronas" element={<PoltronasPage />} />
          <Route path="/ingressos/compra/poltronas/resumo" element={<ResumoPage />} />

          {/* --- ROTAS ADMINISTRATIVAS --- */}
          {/* O AdminLayout já contém o Sidebar e o <Outlet /> onde as páginas abaixo serão renderizadas */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Redireciona /admin direto para /admin/filmes */}
            <Route index element={<Navigate to="filmes" replace />} />
            
            <Route path="filmes" element={<FilmesLista />} />
            <Route path="filmes/novo" element={<FilmeForm />} />
            
            {/* Ajustei o path para ficar relativo (sem /admin na frente) pois já está dentro do pai */}
            <Route path="filmes/editar/:id" element={<FilmeForm />} />

            {/* 3. NOVA ROTA DE USUÁRIOS */}
            <Route path="usuarios" element={<AdminUsuarios />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>

        <Modals />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;