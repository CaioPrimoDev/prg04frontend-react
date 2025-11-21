import "../assets/styles/FooterNav.css";

function FooterNav({ onBack, onNext }) {
  return (
    <footer className="d-flex justify-content-center mt-auto p-2">
      <div
        className="d-grid gap-2 d-md-flex justify-content-md-center mb-2"
        style={{ maxWidth: "50%" }}
      >
        <button
          className="btn btn-danger btn-lg flex-fill btn-big"
          onClick={onBack}
        >
          VOLTAR
        </button>

        <button
          className="btn btn-success btn-lg flex-fill btn-big"
          onClick={onNext}
        >
          AVANÇAR
        </button>
      </div>
    </footer>
  );
}

export default FooterNav;
