import "bootstrap/dist/css/bootstrap.min.css";
import "./ResumoPage.css";
import StepsBar from "../../../components/StepsBar";
import FooterNav from "../../../components/FooterNav";

import { useNavigate } from "react-router-dom"

function ResumoPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 p-1">
      {/* Barra de etapas */}
      <StepsBar currentStep={3} doneSteps={[0, 1, 2]} />

      {/* Conteúdo principal */}
      <main className="container-fluid flex-fill">
        {/* Seção de informações */}
        <section className="info-section">
          <section className="section-shop">
            <div>
              <p className="text-center">RESUMO DA COMPRA</p>
            </div>
            <div>
              <p className="text-lg-start">TOTAL A PAGAR: xx</p>
            </div>
          </section>

          <section className="film-section">
            <div>
              <p className="text-lg-start">CINE ELDORADO (IRECÊ-BA)</p>
            </div>
            <div>
              <p className="text-lg-start">XX/XX/XXXX - Dia-semana</p>
            </div>
            <div>
              <p className="text-lg-start">NOME DO FILME</p>
            </div>
            <div>
              <p className="text-lg-start">HORA SESSÃO - HORA</p>
            </div>
          </section>
        </section>

        {/* Tabela de ingressos */}
        <section>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover text-center align-middle fs-6 fs-md-5 fs-lg-4">
              <thead className="table-dark">
                <tr>
                  <th>POLTRONA</th>
                  <th>ESPÉCIE DE INGRESSO</th>
                  <th>PREÇO</th>
                  <th>TAXAS</th>
                  <th>SUB-TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>D8</td>
                  <td>MEIA</td>
                  <td>14.00</td>
                  <td>2.10</td>
                  <td>16.10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Rodapé com botões */}
      <div className=" fixed-bottom">
        <FooterNav
            onBack={() => navigate(-1)}
            onNext={() => navigate("/home")}
        />
      </div>
    </div>
  );
}

export default ResumoPage;
