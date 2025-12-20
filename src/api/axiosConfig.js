import axios from "axios";

const api = axios.create({
  baseURL: "https://prg04backend.onrender.com", 
  withCredentials: true, // <--- IMPORTANTE: Permite persistência da Sessão do Spring
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;