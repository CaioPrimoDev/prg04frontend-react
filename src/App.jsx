import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Home from "./pages/home/Home";
import Ingressos from "./pages/movies/ingressos";
import IngressosCompra from "./pages/payment/ingresso/IngressosCompra";
import Modals from "./components/user/Modals";
import PoltronasPage from "./pages/salas/poltronas";
import TermosDeUso from "./pages/terms/TermosDeUso";
import ResumoPage from "./pages/payment/resumo/ResumoPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home com Header exclusivo */}
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<TermosDeUso />} />
        <Route path="/ingressos" element={<Ingressos />} />
        <Route path="/ingressos/compra" element={<IngressosCompra />} />
        <Route path="/ingressos/compra/poltronas" element={<PoltronasPage />} />
        <Route path="/ingressos/compra/poltronas/resumo" element={<ResumoPage />} />
        <Route path="*" element={<Home />} /> {/* fallback para rotas desconhecidas */}
      </Routes>

      {/* Renderiza os modals aqui */}
      <Modals />
    </BrowserRouter>
  );
}

export default App;
