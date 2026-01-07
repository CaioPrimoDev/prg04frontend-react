import axios from "axios";

const api = axios.create({
  //baseURL: "https://prg04backend.onrender.com", 
  baseURL: 'http://localhost:8080', // TESTES
  withCredentials: true, // Mantém para caso use JSESSIONID ou Cookies
  headers: {
      'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Adiciona o Token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pega o token salvo no login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Padrão que o Spring Security espera
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
    response => response, // Se der certo, só retorna
    error => {
        // Se der erro 403 (Proibido/Expirado)
        if (error.response && error.response.status === 403) {
            // Verifica se não é a própria tela de login para não entrar em loop
            if (!window.location.pathname.includes('/login')) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                localStorage.removeItem("token"); // Limpa o token podre
                window.location.href = "/login"; // Manda pro login
            }
        }
        return Promise.reject(error);
    }
);

export default api;