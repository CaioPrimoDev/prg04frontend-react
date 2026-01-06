import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/styles/header.css";
import logo from "../assets/images/icon-final.png";
import { useAuth } from "../api/context/AuthContext";

function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS MANUAIS (Para não depender do JS do Bootstrap) ---
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Alterna o Menu Mobile
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
    // Fecha o dropdown se abrir o menu, pra não ficar bagunçado
    setDropdownAberto(false); 
  };

  // Alterna o Dropdown do Usuário
  const toggleDropdown = (e) => {
    e.preventDefault(); // Evita pular para o topo da página
    setDropdownAberto(!dropdownAberto);
  };

  // Fecha tudo (usado ao clicar em links)
  const closeAll = () => {
    setMenuAberto(false);
    setDropdownAberto(false);
  };

  const handleLogout = () => {
    closeAll();
    logout();
    navigate("/");
  };

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark py-2 fixed-top"
        style={{ boxShadow: "0 1px 4px rgba(255, 255, 255, 0.05)" }}
      >
        <div className="container-fluid">
          
          {/* LOGO */}
          <Link to="/" className="navbar-brand d-flex align-items-center" onClick={closeAll}>
            <img src={logo} alt="Logo" className="logo me-2" />
            <span className="logo-text mb-0">Cine The Golden</span>
          </Link>

          {/* BOTÃO HAMBURGUER (Mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarMenu"
            aria-expanded={menuAberto}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* ÁREA DO MENU */}
          <div 
            className={`collapse navbar-collapse custom-collapse ${menuAberto ? 'show' : ''}`} 
            id="navbarMenu"
          >
            <ul className="navbar-nav ms-auto align-items-center text-center">
              
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeAll}>Início</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/terms" onClick={closeAll}>Termos</Link>
              </li>
              
              {user ? (
                <>
                    {isAdmin() && (
                        <li className="nav-item">
                            <Link 
                                className="nav-link text-warning fw-bold border border-warning rounded px-3 mx-2 my-1" 
                                to="/admin/filmes"
                                onClick={closeAll}
                            >
                                <i className="bi bi-gear-fill me-1"></i> ADMIN
                            </Link>
                        </li>
                    )}

                    {/* DROPDOWN DO USUÁRIO (Manual) */}
                    <li className="nav-item dropdown mt-2 mt-lg-0">
                        <button 
                            className={`nav-link dropdown-toggle btn btn-outline-light border-0 px-3 w-100 ${dropdownAberto ? 'show' : ''}`}
                            onClick={toggleDropdown}
                            id="userDropdown"
                            aria-expanded={dropdownAberto}
                        >
                            <i className="bi bi-person-circle me-1"></i> {user.sub || "Usuário"}
                        </button>
                        
                        {/* A classe 'show' aparece se dropdownAberto for true */}
                        <ul 
                            className={`dropdown-menu dropdown-menu-end dropdown-menu-dark shadow ${dropdownAberto ? 'show' : ''}`} 
                            aria-labelledby="userDropdown"
                            // Ajuste para garantir posição correta no mobile
                            style={menuAberto ? { position: 'static', textAlign: 'center', float: 'none' } : {}}
                        >
                            <li>
                                <Link className="dropdown-item" to="/ingressos" onClick={closeAll}>
                                    Meus Ingressos
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i> Sair
                                </button>
                            </li>
                        </ul>
                    </li>
                </>
              ) : (
                <li className="nav-item mt-3 mt-lg-0 ms-lg-2">
                  <button
                    className="btn btn-danger px-4"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                    onClick={closeAll}
                  >
                    Entrar
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;