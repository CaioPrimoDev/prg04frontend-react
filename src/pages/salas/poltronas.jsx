import StepsBar from "../../components/StepsBar";
import FooterNav from "../../components/FooterNav";
import SeatMap from "../../components/poltronas/SeatMap";
import { useNavigate } from "react-router-dom";

function PoltronasPage() {
  const navigate = useNavigate();

  // Função para lidar com seleção de poltronas
  const handleSelect = (seat) => {
    console.log("Selecionou:", seat);
    // aqui você pode salvar no estado global ou contexto
  };

  return (
    <>
      {/* Barra de progresso */}
      <StepsBar currentStep={2} doneSteps={[0, 1]} />

      {/* Mapa de poltronas */}
      <SeatMap onSelect={handleSelect} />

      {/* Rodapé com navegação */}
      <div className="fixed-bottom">
        <FooterNav
          onBack={() => navigate(-1)}
          onNext={() => navigate("/resumo")}
        />
      </div>
    </>
  );
}

export default PoltronasPage;
