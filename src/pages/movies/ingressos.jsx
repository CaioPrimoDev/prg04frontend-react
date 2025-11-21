import StepsBar from "../../components/StepsBar";
import FilmPreview from "../../components/FilmPreview";
import SelectGroup from "../../components/SelectGroup";
import TrailerModal from "../../components/TrailerModal";
import FooterNav from "../../components/FooterNav";
import FilmImage from "../../assets/images/interestelar.jpeg";

import { useNavigate } from "react-router-dom"

function Ingressos() {
  const navigate = useNavigate();

  return (
    <>
      {/* Barra de progresso */}
      <StepsBar currentStep={0} />

      <main className="container py-4 mt-5">
        {/* Prévia do filme */}
        <FilmPreview
          image={FilmImage}
          description="Resumo do filme aqui. Pode ser um texto um pouco maior explicando algo sobre o conteúdo."
          trailerTarget="videoModal"
        />

        {/* Selects */}
        <section className="container-fluid my-4" style={{ maxWidth: "70%" }}>
          <SelectGroup title="FILME" options={["Opção 1", "Opção 2", "Opção 3"]} />
          <SelectGroup title="DATA" options={["Opção 1", "Opção 2", "Opção 3"]} />
          <SelectGroup title="SESSÃO" options={["Opção 1", "Opção 2", "Opção 3"]} />
        </section>
      </main>

      {/* Modal do trailer */}
      <TrailerModal
        id="videoModal"
        title="Trailer do Filme"
        videoUrl="https://www.youtube.com/embed/UpGFBQOrZmQ?si=U__NJXwFgKaGVX31"
      />

      {/* Rodapé com botões */}
      <FooterNav
        onBack={() => navigate(-1)}
        onNext={() => navigate("/ingressos/compra")}
      />
    </>
  );
}

export default Ingressos;
