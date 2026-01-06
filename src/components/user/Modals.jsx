import { useState, useCallback } from "react";
import CustomModal from "../customModal"; // Certifique-se que o caminho está certo
import authService from "../../api/authService"; // Para o registro
import { useAuth } from "../../api/context/AuthContext"; // Para o login
import * as bootstrap from 'bootstrap'; // Importação correta do Bootstrap

// --- CONFIGURAÇÃO DOS CAMPOS (Pode ficar aqui ou em outro arquivo) ---
const camposLogin = [
  { 
    name: "identificador", 
    type: "text", 
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
  const { login } = useAuth(); // Usamos o login do Contexto!
  
  // Estados de erro/sucesso
  const [loginError, setLoginError] = useState("");
  const [cadastroError, setCadastroError] = useState("");
  const [cadastroSuccess, setCadastroSuccess] = useState("");
  
  // Estado de carregamento (Spinner)
  const [isLoading, setIsLoading] = useState(false);

  const limparMensagens = useCallback(() => {
    setLoginError("");
    setCadastroError("");
    setCadastroSuccess("");
  }, []);

  // Função auxiliar para fechar modal via JS
  const fecharModal = (modalId) => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
    }
  };

  // Função auxiliar para trocar de modal (Cadastro -> Login)
  const trocarModal = (fecharId, abrirId) => {
      fecharModal(fecharId);
      setTimeout(() => {
          const abrirEl = document.getElementById(abrirId);
          if(abrirEl) {
            const modalInstance = new bootstrap.Modal(abrirEl);
            modalInstance.show();
          }
      }, 300); // Pequeno delay para animação fluir
  };

  // --- LÓGICA DE LOGIN ---
  const handleLoginSubmit = async (dados) => {
    limparMensagens();
    setIsLoading(true); // Ativa spinner
    
    // Limpeza do identificador (CPF)
    let identificador = dados.identificador;
    if (!identificador.includes('@')) {
       identificador = identificador.replace(/\D/g, ""); 
    }

    try {
      // Chama o login do AuthContext
      await login({
        login: identificador, 
        senha: dados.senha
      });
      
      // Se passar daqui, deu certo. Fechamos o modal.
      fecharModal("loginModal");
      // NÃO precisa de reload. O Contexto atualiza o Header sozinho.

    } catch (error) {
       console.error("Erro no Login:", error); 
       // Se o backend retornar 401/403
       setLoginError("Usuário ou senha inválidos.");
    } finally {
        setIsLoading(false); // Desativa spinner independente do resultado
    }
  };

  // --- LÓGICA DE CADASTRO ---
  const handleCadastroSubmit = async (dados) => {
    limparMensagens();
    
    if (dados.senha !== dados.confirmarSenha) {
      setCadastroError("As senhas não conferem!");
      return;
    }

    setIsLoading(true); // Ativa spinner

    const cpfLimpo = dados.cpf.replace(/\D/g, ""); 

    const usuarioDTO = {
      cpf: cpfLimpo,
      email: dados.email,
      senha: dados.senha,
    };

    try {
      // Cadastro não precisa passar pelo Context, usa o Service direto
      await authService.register(usuarioDTO);
      
      setCadastroSuccess("Conta criada com sucesso! Redirecionando para login...");
      
      // Espera 2 segundos mostrando a mensagem de sucesso e troca para Login
      setTimeout(() => {
        trocarModal("cadastroModal", "loginModal");
        setCadastroSuccess(""); // Limpa msg para a próxima vez
      }, 2000);

    } catch (error) {
       let mensagemErro = "Erro ao cadastrar.";

       if (error.response && error.response.data) {
           const data = error.response.data;
           // Lógica de tratamento de erro do seu Backend
           if (data.fieldsMessage && data.fieldsMessage.length > 0) {
               mensagemErro = data.fieldsMessage[0]; // Pega o primeiro erro da lista
           } else if (data.message) {
               mensagemErro = data.message;
           } else if (data.details) {
               mensagemErro = data.details;
           }
       }
       setCadastroError(mensagemErro);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <>
      {/* MODAL LOGIN */}
      <CustomModal
        id="loginModal"
        title="Entrar"
        fields={camposLogin}
        submitText={isLoading ? "Entrando..." : "Entrar"} // Muda o texto se estiver carregando
        submitType="submit"
        onSubmit={handleLoginSubmit}
        errorMessage={loginError}
        clearMessages={limparMensagens}
        footerLinkText="Não tem conta? Cadastre-se"
        footerTarget="cadastroModal"
        isLoading={isLoading} // Passamos o estado para desabilitar o botão
      />

      {/* MODAL CADASTRO */}
      <CustomModal
        id="cadastroModal"
        title="Criar Conta"
        fields={camposCadastro}
        submitText={isLoading ? "Cadastrando..." : "Cadastrar"}
        submitType="submit"
        onSubmit={handleCadastroSubmit}
        errorMessage={cadastroError}
        successMessage={cadastroSuccess}
        clearMessages={limparMensagens}
        footerLinkText="Já tem conta? Faça login"
        footerTarget="loginModal"
        isLoading={isLoading}
      />
    </>
  );
}

export default Modals;