import "../assets/styles/customModal.css";


function CustomModal({
  id,
  title,
  fields,
  submitText,
  submitType = "button", // pode ser "button" ou "submit"
  footerLinkText,
  footerTarget,
}) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content custom-modal">
          
          {/* Cabeçalho */}
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center" id={`${id}Label`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Fechar"
            ></button>
          </div>

          {/* Corpo */}
          <div className="modal-body">
            <form id={`${id}Form`}>
              {fields.map((field, index) => (
                <div className="mb-3" key={index}>
                  <input
                    type={field.type}
                    className="form-control form-control-custom"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ))}
              <button
                type={submitType}
                className="btn btn-danger w-100"
              >
                {submitText}
              </button>
            </form>
          </div>

          {/* Rodapé */}
          {footerLinkText && (
            <div className="modal-footer border-0 justify-content-center">
              <a
                href="#"
                className="link-alternar"
                data-bs-target={`#${footerTarget}`}
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                {footerLinkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
