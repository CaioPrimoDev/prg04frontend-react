import { Link } from "react-router-dom";
import "../assets/styles/style-card.css";

function CardFilm({ image, title, description }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
      <div className="card h-100" style={{ width: "18rem" }}>
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          {description && <p className="card-text">{description}</p>}
          {/* Botão padrão leva para /ingressos */}
          <Link 
              to="/terms" 
              className="btn btn-danger"
          >
            Comprar Ingressos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardFilm;
