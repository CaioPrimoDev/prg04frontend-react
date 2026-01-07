import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // --- CORREÇÃO PRINCIPAL: Inicialização Lazy ---
    // O React roda essa função APENAS na primeira vez que o app abre.
    // Se tiver token válido, o usuário já nasce logado (sem piscar tela).
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Se expirou, limpa e retorna null
                if (decoded.exp < currentTime) {
                    localStorage.removeItem("token");
                    return null;
                }
                
                // Se está válido, retorna o objeto do usuário
                return {
                    sub: decoded.sub,
                    roles: decoded.roles || [],
                    token: token
                };
            // eslint-disable-next-line no-unused-vars
            } catch (e) {
                // Token inválido/corrompido
                localStorage.removeItem("token");
                return null;
            }
        }
        return null; // Sem token, começa deslogado
    });

    const [loading, setLoading] = useState(false); // Apenas para loaders de requisição

    // Função de Login
    const login = async (loginData) => {
        setLoading(true);
        try {
            const data = await authService.login(loginData); // Chama a API
            const decoded = jwtDecode(data.token);
            
            // Atualiza o estado global
            setUser({
                sub: decoded.sub,
                roles: decoded.roles || [],
                token: data.token
            });
            
            return true;
        } catch (error) {
            console.error("Erro ao logar:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Função de Logout
    const logout = () => {
        authService.logout();
        setUser(null);
        window.location.href = "/";
    };

    // Função auxiliar para verificar admin
    const isAdmin = () => {
        
        // 1. Verificamos se o usuário está logado
        if (!user) {
            // console.log("isAdmin: Usuário nulo"); // (Opcional)
            return false;
        }

        // --- ESPIÃO (Adicione estas linhas) ---
        console.log("--- DEBUG PERMISSÕES ---");
        console.log("1. Objeto User completo:", user);
        console.log("2. Campo Roles/Role:", user.roles || user.role || "NÃO ENCONTRADO");
        // -------------------------------------

        // Sua lógica de verificação
        if (!user.roles) return false;
        
        // Verifica se tem permissão (ajuste conforme o que aparecer no console)
        const temPermissao = user.roles.includes("ADMIN") || 
                            user.roles.includes("ROLE_ADMIN") || 
                            user.roles.includes("GESTOR");
                            
        console.log("3. Resultado isAdmin:", temPermissao); // Ver se deu true ou false
        
        return temPermissao;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado
// O aviso de "Fast Refresh" pode aparecer aqui, mas é inofensivo em desenvolvimento.
// Se quiser remover, mova este hook para um arquivo separado (ex: hooks/useAuth.js).
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};