import "../assets/styles/footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="footer-content">
        {/* Texto principal */}
        <p className="mb-0">
          &copy; 2025 Cine The Golden - Todos os direitos reservados.
        </p>

        {/* Links extras */}
        <div className="mt-2">
          <a href="/about" className="text-white mx-2 text-decoration-none">
            Sobre
          </a>
          <a href="/contact" className="text-white mx-2 text-decoration-none">
            Contato
          </a>
          <a href="/politica" className="text-white mx-2 text-decoration-none">
            Política de Privacidade
          </a>
        </div>

        {/* Redes sociais (opcional) */}
        <div className="mt-2">
          <a href="https://facebook.com" className="text-white mx-2">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://instagram.com" className="text-white mx-2">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://twitter.com" className="text-white mx-2">
            <i className="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
