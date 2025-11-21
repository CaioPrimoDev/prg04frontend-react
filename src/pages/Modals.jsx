import CustomModal from "../components/customModal";

function Modals() {
  return (
    <>
      {/* Modal de Login */}
      <CustomModal
        id="loginModal"
        title="Entrar"
        fields={[
          { type: "email", placeholder: "E-mail", required: true },
          { type: "password", placeholder: "Senha", required: true },
        ]}
        submitText="Entrar"
        submitType="button"
        footerLinkText="Não tem conta? Cadastre-se"
        footerTarget="cadastroModal"
      />

      {/* Modal de Cadastro */}
      <CustomModal
        id="cadastroModal"
        title="Criar Conta"
        fields={[
          { type: "text", placeholder: "Nome completo", required: true },
          { type: "email", placeholder: "E-mail", required: true },
          { type: "password", placeholder: "Senha", required: true },
          { type: "password", placeholder: "Confirmar senha", required: true },
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
