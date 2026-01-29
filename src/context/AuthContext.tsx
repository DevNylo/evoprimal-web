import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  full_name?: string;
  cpf?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define URL base
  const BASE_ENV_URL = import.meta.env.VITE_API_URL || "https://evoprimal-api.onrender.com";
  const API_URL = BASE_ENV_URL.endsWith("/api") ? BASE_ENV_URL : `${BASE_ENV_URL}/api`;

  // Função para buscar dados completos do usuário
  const fetchMe = async (token: string) => {
    try {
      // ?populate=* garante que venham todos os campos e imagens se houver
      const res = await fetch(`${API_URL}/users/me?populate=*`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const fullUserData = await res.json();
        localStorage.setItem("evo_user", JSON.stringify(fullUserData));
        setUser(fullUserData);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("evo_user");
    const storedToken = localStorage.getItem("evo_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Atualiza os dados em segundo plano ao recarregar a página
      fetchMe(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("evo_token", token);
    // Salva o inicial, mas busca o completo imediatamente
    localStorage.setItem("evo_user", JSON.stringify(userData));
    setUser(userData);
    fetchMe(token); 
  };

  const logout = () => {
    localStorage.removeItem("evo_token");
    localStorage.removeItem("evo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);