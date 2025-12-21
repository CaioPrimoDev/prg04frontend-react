import { useState } from "react";
// Importe seu CSS aqui se tiver

function CustomModal({
  id,
  title,
  fields,
  submitText,
  submitType = "button",
  footerLinkText,
  footerTarget,
  onSubmit,
  errorMessage,   // Recebe mensagem de erro do Pai
  successMessage, // Recebe mensagem de sucesso do Pai
  clearMessages   // Função para limpar avisos
}) {
  const [formData, setFormData] = useState({});

  // Limpa os dados sempre que o modal for aberto/fechado
  /*useEffect(() => {
    if (clearMessages) clearMessages();
  }, [id, clearMessages]);*/

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Limpa o erro assim que o usuário começa a corrigir
    //if (clearMessages) clearMessages();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content custom-modal">
          
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center" id={`${id}Label`}>
              {title}
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>

          <div className="modal-body">
            {/* --- EXIBIÇÃO DE MENSAGENS --- */}
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
                    className="form-control" // Se tiver CSS customizado, adicione aqui
                    placeholder={field.placeholder}
                    required={field.required}
                    // O value é importante para limpar o form depois
                    value={formData[field.name] || ""} 
                    onChange={handleChange}
                    // Adiciona minLength se for senha ou cpf pra ajudar na validação básica
                    minLength={field.name === "cpf" ? 11 : undefined}
                  />
                </div>
              ))}
              <button type={submitType} className="btn btn-danger w-100">
                {submitText}
              </button>
            </form>
          </div>

          {footerLinkText && (
            <div className="modal-footer border-0 justify-content-center">
              <a
                href="#"
                className="link-secundario" // Adicione estilo se quiser
                data-bs-target={`#${footerTarget}`}
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
                onClick={() => {
                   if(clearMessages) clearMessages();
                   setFormData({});
                }}
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