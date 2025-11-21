import { useEffect } from "react";
import "../assets/styles/TrailerModal.css";

function TrailerModal({ id, title, videoUrl }) {
  useEffect(() => {
    const modal = document.getElementById(id);
    const iframe = modal.querySelector("iframe");
    const src = iframe.src;

    modal.addEventListener("hidden.bs.modal", () => {
      iframe.src = "";
      iframe.src = src;
    });
  }, [id]);
  
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content custom-modal">
          <div className="modal-header border-0">
            <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div className="modal-body p-0">
            <div className="ratio ratio-16x9">
              <iframe
                src={videoUrl}
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
