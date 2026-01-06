import { Link } from "react-router-dom";
import "../assets/styles/style-card.css";

// Adicionei 'children' e 'className' nas props
function cardFilm({ image, title, description, children, className }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
      {/* Adicionei a prop className no card para permitir customização (ex: bg-dark) */}
      <div className={`card h-100 ${className}`} style={{ width: "18rem" }}>
        
        {/* Tratamento simples: se image for null, põe um placeholder */}
        <img 
            src={image || "https://via.placeholder.com/300x450"} 
            className="card-img-top" 
            alt={title}
            style={{ height: '300px', objectFit: 'cover' }} // Garante que fiquem alinhados
        />
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          
          <p className="card-text flex-grow-1" style={{
             display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {description}
          </p>
          
          {/* LÓGICA MÁGICA: */}
          <div className="mt-3">
              {children ? (
                // Se o pai passou botões (Admin), mostra os botões do pai
                children 
              ) : (
                // Se não passou nada (Home), mostra o botão padrão
                <Link to="/ingressos" className="btn btn-danger w-100">
                  Comprar Ingressos
                </Link>
              )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default cardFilm;