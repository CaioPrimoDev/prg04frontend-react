import CustomModal from "../customModal";

const camposLogin = [
  { name: "email", type: "email", placeholder: "E-mail", required: true },
  { name: "senha", type: "password", placeholder: "Senha", required: true },
];

const camposCadastro = [
  { name: "nome", type: "text", placeholder: "Nome completo", required: true },
  { name: "email", type: "email", placeholder: "E-mail", required: true },
  { name: "senha", type: "password", placeholder: "Senha", required: true },
  { name: "confirmarSenha", type: "password", placeholder: "Confirmar senha", required: true },
];

function Modals() {
  return (
    <>
      {/* Modal de Login */}
      <CustomModal
        id="loginModal"
        title="Entrar"
        fields={camposLogin}
        submitText="Entrar"
        submitType="button"
        footerLinkText="Não tem conta? Cadastre-se"
        footerTarget="cadastroModal"
      />

      {/* Modal de Cadastro */}
      <CustomModal
        id="cadastroModal"
        title="Criar Conta"
        fields={camposCadastro}
        submitText="Cadastrar"
        submitType="submit"
        footerLinkText="Já tem conta? Faça login"
        footerTarget="loginModal"
      />
    </>
  );
}

export default Modals;
