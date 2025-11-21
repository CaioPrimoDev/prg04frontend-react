import StepsBar from "../../../components/StepsBar";
import FooterNav from "../../../components/FooterNav";
import TicketLine from "../../../components/TicketLine";

import { useNavigate } from "react-router-dom"

function IngressosCompra() {
  const navigate = useNavigate();


  return (
    <>
    
      {/* Barra de progresso */}
      <StepsBar currentStep={1} doneSteps={[0]} />

      <main className="container py-4 mt-4">
        {/* Total */}
        <p className="fw-bold mb-3 text-center">TOTAL A PAGAR: R$ 00.00</p>
        <hr />
    
        <TicketLine 
            type="INTEIRA" 
            value={24}
        />
        <hr className="border border-secondary border-1 opacity-50 my-2" />
        <TicketLine 
            type="MEIA" 
            value={12}    
        />
        
      </main>

      <hr />

      {/* Rodapé com botões */}
      <div className=" fixed-bottom">
        <FooterNav
            onBack={() => navigate(-1)}
            onNext={() => navigate("/ingressos/compra/poltronas")}
        />
      </div>
      
    </>
  );
}

export default IngressosCompra;
