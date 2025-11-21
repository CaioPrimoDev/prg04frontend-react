import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/termos.css"; // se você extrair o CSS para um arquivo separado
import FooterNav from "../../components/FooterNav";

import { useNavigate } from "react-router-dom"

function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="bg-light p-1 d-flex flex-column min-vh-100">
      {/* Cabeçalho */}
      <header
        className="container-fluid text-white py-2"
        style={{ backgroundColor: "#000000" }}
      >
        <h1 className="text-center h4">TERMOS E CONDIÇÕES DE USO</h1>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-fill terms-font">
        <p className="fonte-size">
          <strong>TERMOS DE USO DO INGRESSO ELETRÔNICO:</strong> <br />
          1. Apenas uma unidade do Ingresso Eletrônico (impresso ou não), poderá ser utilizado para ter acesso à sala de exibição do cinema. Todas as outras cópias feitas do Ingresso Eletrônico serão recusadas. <br />
          2. Conforme a legislação vigente, é obrigatória a apresentação de documento que comprove o direito ao benefício da meia-entrada para acesso à sala de exibição, se esta for a modalidade deste ingresso eletrônico. <br />
          3. Pode ser solicitada a identificação por meio de documento com foto do titular da compra, bem como a apresentação do cartão de crédito utilizado na compra, se essa foi a forma de pagamento escolhida. <br />
          4. O cancelamento da compra deste ingresso poderá ser feito desde que seja obedecido o prazo mínimo de até duas horas antes do início da sessão e deverá ser realizado exclusivamente de forma on-line através da mesma plataforma utilizada para a compra deste ingresso eletrônico na internet. <br />
          5. Se o cliente consumidor solicitar o cancelamento da compra deste ingresso e este cancelamento for efetivado, então este ingresso perderá a validade automaticamente e não poderá ser utilizado para a entrada na sala de exibição do cinema. <br />
          6. Não nos responsabilizamos por ingressos comprados fora dos canais oficiais de venda, bem como por cópias indevidas de ingressos. <br />
          7. O ingresso é válido somente para a data, horário e local para o qual foi emitido. <br />
          8. Serão utilizados leitores óticos para validação do ingresso eletrônico.
        </p>
      </main>

      {/* Rodapé com botões */}
      <div className=" fixed-bottom">
        <FooterNav
            onBack={() => navigate(-1)}
            onNext={() => navigate("/ingressos")}
        />
      </div>
    </div>
  );
}

export default TermosDeUso;
