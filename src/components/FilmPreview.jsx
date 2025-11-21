import "../assets/styles/FilmPreview.css";

function FilmPreview({ image, description, trailerTarget }) {
  return (
    <section className="container-fluid mb-2 row align-items-center justify-content-center gap-3">
      <div className="col-6 col-lg-4 d-flex justify-content-center">
        <img 
          src={image} 
          alt="Cartaz do filme" 
          className="img-fluid poster"
        />

      </div>
      <div className="col-6 col-lg-4 d-flex flex-column justify-content-between ms-4">
        <p>{description}</p>
        <button
          type="button"
          className="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target={`#${trailerTarget}`}
        >
          Assistir Trailer
        </button>
      </div>
    </section>
  );
}

export default FilmPreview;
