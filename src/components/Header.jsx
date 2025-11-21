import "../assets/styles/header.css";
import logo from "../assets/images/icon-final.png";

function Header() {
  return (
    <header>
      <nav
        className="navbar navbar-dark bg-dark py-2 fixed-top"
        style={{ boxShadow: "0 1px 4px rgba(255, 255, 255, 0.05)" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Logo */}
          <a href="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo me-2" />
            <span className="logo-text mb-0" style={{ cursor: "default" }}>
              Cine The Golden
            </span>
          </a>

          {/* Botão hamburguer */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu colapsável */}
          <div className="collapse navbar-collapse custom-collapse" id="navbarMenu">
            <ul className="navbar-nav ms-auto align-items-center text-center">
              <li className="nav-item">
                <a className="nav-link underline-animated" href="#">Início</a>
              </li>
              <li className="nav-item">
                <a className="nav-link underline-animated" href="/about">Sobre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link underline-animated" href="/contact">Contato</a>
              </li>
              <li className="nav-item mt-3">
                <a
                  className="btn btn-danger px-4"
                  href="#login"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  Entrar
                </a>
              </li>
              <li className="nav-item mt-2 mb-1">
                <a
                  className="btn btn-outline-danger px-4"
                  href="#tickets"
                  data-bs-toggle="modal"
                  data-bs-target="#ticketsModal"
                >
                  MEUS INGRESSOS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
