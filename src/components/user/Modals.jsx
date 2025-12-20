import { useState, useCallback } from "react";
import CustomModal from "../customModal";
import authService from "../../api/authService";

// LOGIN É "TEXT" (Para aceitar CPF ou Email) ---
const camposLogin = [
  { 
    name: "identificador", // Nome genérico para o input
    type: "text",          // Mudei de 'email' para 'text' para não exigir '@'
    placeholder: "E-mail ou CPF", 
    required: true 
  },
  { name: "senha", type: "password", placeholder: "Senha", required: true },
];

const camposCadastro = [
  { name: "cpf", type: "text", placeholder: "CPF (somente números)", required: true },
  { name: "email", type: "email", placeholder: "E-mail", required: true },
  { name: "senha", type: "password", placeholder: "Senha", required: true },
  { name: "confirmarSenha", type: "password", placeholder: "Confirmar senha", required: true },
];

function Modals() {
  const [loginError, setLoginError] = useState("");
  const [cadastroError, setCadastroError] = useState("");
  const [cadastroSuccess, setCadastroSuccess] = useState("");

  // Isso impede que ela seja recriada a cada renderização, parando o loop.
  const limparMensagens = useCallback(() => {
    setLoginError("");
    setCadastroError("");
    setCadastroSuccess("");
  }, []); // O array vazio [] diz: "Nunca recrie esta função"

  const fecharModal = (modalId) => {
    const modalEl = document.getElementById(modalId);
    if (window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(bd => bd.remove());
    document.body.classList.remove('modal-open');
    document.body.style = "";
  };

  // --- LOGIN LIMPO ---
  const handleLoginSubmit = async (dados) => {
    limparMensagens();
    
    // Lógica de limpar o CPF continua aqui pois é regra de VISUALIZAÇÃO/Input
    let identificador = dados.identificador;
    if (!identificador.includes('@')) {
       identificador = identificador.replace(/\D/g, ""); 
    }

    try {
      // O componente chama o serviço. Não importa a rota nem o axios aqui.
      await authService.login({
        login: identificador, 
        senha: dados.senha
      });
      
      fecharModal("loginModal");
      window.location.reload(); 

    } catch (error) {
       console.error("Erro no cadastro:", error); 

       let mensagemErro = "Erro ao cadastrar.";

       if (error.response && error.response.data) {
           const data = error.response.data;

           // 1. Prioridade: Erros de Validação (Ex: Senha curta, CPF inválido no @Valid)
           // Sua classe ValidationExceptionDetails retorna 'fieldsMessage'
           if (data.fieldsMessage && Array.isArray(data.fieldsMessage) && data.fieldsMessage.length > 0) {
               mensagemErro = data.fieldsMessage[0];
           }
           // 2. Erros de Regra de Negócio (Ex: BusinessException "CPF já cadastrado")
           // Sua classe ErrorResponse deve retornar 'message'
           else if (data.message) {
               mensagemErro = data.message;
           }
           // 3. Fallback para 'details' se houver
           else if (data.details) {
               mensagemErro = data.details;
           }
       } 
       // 4. Erro de conexão (Backend desligado)
       else if (error.message) {
           mensagemErro = error.message;
       }

       setCadastroError(mensagemErro);
    }
  };

  // --- CADASTRO LIMPO ---
  const handleCadastroSubmit = async (dados) => {
    limparMensagens();

    if (dados.senha !== dados.confirmarSenha) {
      setCadastroError("As senhas não conferem!");
      return;
    }

    const cpfLimpo = dados.cpf.replace(/\D/g, ""); 

    const usuarioDTO = {
      cpf: cpfLimpo,
      email: dados.email,
      senha: dados.senha,
      perfis: ["CLIENTE"]
    };

    try {
      // Chama o serviço
      await authService.register(usuarioDTO);
      
      setCadastroSuccess("Conta criada! Redirecionando...");
      
      setTimeout(() => {
        fecharModal("cadastroModal");
        const loginBtn = new window.bootstrap.Modal(document.getElementById('loginModal'));
        loginBtn.show();
      }, 2000);

    } catch (error) {
       // ... (Logica de erro visual igual) ...
       const msg = error.response?.data?.message || "Erro ao cadastrar.";
       setCadastroError(msg);
    }
  };

  return (
    <>
      <CustomModal
        id="loginModal"
        title="Entrar"
        fields={camposLogin}
        submitText="Entrar"
        submitType="submit"
        onSubmit={handleLoginSubmit}
        errorMessage={loginError}
        clearMessages={limparMensagens}
        footerLinkText="Não tem conta? Cadastre-se"
        footerTarget="cadastroModal"
      />

      <CustomModal
        id="cadastroModal"
        title="Criar Conta"
        fields={camposCadastro}
        submitText="Cadastrar"
        submitType="submit"
        onSubmit={handleCadastroSubmit}
        errorMessage={cadastroError}
        successMessage={cadastroSuccess}
        clearMessages={limparMensagens}
        footerLinkText="Já tem conta? Faça login"
        footerTarget="loginModal"
      />
    </>
  );
}

export default Modals;