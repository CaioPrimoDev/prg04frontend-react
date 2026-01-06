import { useState, useEffect } from "react";

function CustomModal({
  id,
  title,
  fields,
  submitText,
  submitType = "button",
  footerLinkText,
  footerTarget,
  onSubmit,
  errorMessage,
  successMessage,
  clearMessages,
  isLoading = false 
}) {
  const [formData, setFormData] = useState({});

  // CORREÇÃO 1 e 2:
  // Removemos o setFormData({}) daqui pois ele causava o render duplo.
  // Adicionamos clearMessages nas dependências para satisfazer o linter.
  useEffect(() => {
     if(clearMessages) {
        clearMessages();
     }
  }, [id, clearMessages]); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Limpa msg de erro ao digitar
    if (errorMessage && clearMessages) {
        clearMessages();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Função auxiliar para limpar tudo (usada nos botões de fechar)
  const handleCloseOrSwitch = () => {
      setFormData({}); // Limpa os inputs
      if(clearMessages) clearMessages(); // Limpa as mensagens de erro
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content custom-modal">
          
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center" id={`${id}Label`}>
              {title}
            </h5>
            {/* Botão X (Fechar) */}
            <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Fechar"
                disabled={isLoading}
                // Adicionamos a limpeza aqui também
                onClick={handleCloseOrSwitch} 
            ></button>
          </div>

          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem" }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success py-2 text-center" style={{ fontSize: "0.85rem" }}>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <div className="mb-3" key={index}>
                  <input
                    type={field.type}
                    name={field.name}
                    className="form-control"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ""} 
                    onChange={handleChange}
                    disabled={isLoading}
                    minLength={field.name === "cpf" ? 11 : undefined}
                  />
                </div>
              ))}
              
              <button 
                type={submitType} 
                className="btn btn-danger w-100 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processando...
                    </>
                ) : (
                    submitText
                )}
              </button>
            </form>
          </div>

          {footerLinkText && (
            <div className="modal-footer border-0 justify-content-center">
              <a
                href="#"
                className={`link-secundario ${isLoading ? 'disabled' : ''}`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                data-bs-target={`#${footerTarget}`}
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
                // Ao clicar no link do rodapé (trocar modal), limpamos tudo
                onClick={handleCloseOrSwitch}
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