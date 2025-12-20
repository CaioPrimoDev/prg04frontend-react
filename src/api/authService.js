import api from "./axiosConfig"; // Seu axios configurado

// Função de Login
const login = async (loginData) => {
  // loginData = { login: "...", senha: "..." }
  const response = await api.post("/auth/login", loginData);
  
  // Se der certo, salvamos o token aqui mesmo para centralizar a lógica
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

// Função de Cadastro
const register = async (registerData) => {
  // registerData = { cpf, email, senha, perfis... }
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

// Função de Logout (bônus)
const logout = () => {
  localStorage.removeItem("token");
};

// Exportamos como um objeto para ficar organizado
const authService = {
  login,
  register,
  logout,
};

export default authService;