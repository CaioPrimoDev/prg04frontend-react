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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="filmes" replace />} />
            <Route path="filmes" element={<FilmesLista />} />

            <Route path="filmes/novo" element={<FilmeForm />} />

            <Route path="/admin/filmes/editar/:id" element={<FilmeForm />} />
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