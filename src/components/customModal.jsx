import CustomModal from "../components/customModal";
import api from "../api/axiosConfig"; // Importe o Axios

function Modals() {

  // --- Lógica de Login ---
  const handleLoginSubmit = async (dadosDoFormulario) => {
    try {
      // Ajuste "/login" para a rota correta do seu Java
      const response = await api.post("/login", dadosDoFormulario);
      alert("Login realizado com sucesso!");
      console.log("Token:", response.data);
      // Aqui você salvaria o token no localStorage e fecharia o modal
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login. Verifique senha e email.");
    }
  };

  // --- Lógica de Cadastro ---
  const handleCadastroSubmit = async (dadosDoFormulario) => {
    // Validação simples de senha
    if (dadosDoFormulario.senha !== dadosDoFormulario.confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      // O Backend não espera "confirmarSenha", então criamos um objeto limpo
      const usuarioParaEnviar = {
        nome: dadosDoFormulario.nome,
        email: dadosDoFormulario.email,
        senha: dadosDoFormulario.senha
      };

      // Ajuste "/usuarios" para a rota do seu Controller Java
      await api.post("/usuarios", usuarioParaEnviar);
      
      alert("Conta criada com sucesso! Faça login.");
      // Opcional: Acionar clique para fechar modal ou trocar para login
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar. Tente outro email.");
    }
  };

  return (
    <>
      {/* Modal de Login */}
      <CustomModal
        id="loginModal"
        title="Entrar"
        onSubmit={handleLoginSubmit}
        fields={[
          // "name" deve ser igual ao JSON que o Java espera
          { name: "email", type: "email", placeholder: "E-mail", required: true },
          { name: "senha", type: "password", placeholder: "Senha", required: true },
        ]}
        submitText="Entrar"
        submitType="submit" // Mudei para submit para funcionar com Enter
        footerLinkText="Não tem conta? Cadastre-se"
        footerTarget="cadastroModal"
      />

      {/* Modal de Cadastro */}
      <CustomModal
        id="cadastroModal"
        title="Criar Conta"
        onSubmit={handleCadastroSubmit}
        fields={[
          { name: "nome", type: "text", placeholder: "Nome completo", required: true },
          { name: "email", type: "email", placeholder: "E-mail", required: true },
          { name: "senha", type: "password", placeholder: "Senha", required: true },
          // Esse campo só existe no front para validação visual
          { name: "confirmarSenha", type: "password", placeholder: "Confirmar senha", required: true },
        ]}
        submitText="Cadastrar"
        submitType="submit"
        footerLinkText="Já tem conta? Faça login"
        footerTarget="loginModal"
      />
    </>
  );
}

export default Modals;