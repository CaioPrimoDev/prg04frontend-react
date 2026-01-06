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

export default api;