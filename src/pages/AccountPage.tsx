import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react"; // CORREÇÃO: Importação explícita de tipo

// 1. DEFINIÇÃO DO TIPO DE USUÁRIO
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  
  // --- NOVOS CAMPOS DO STRAPI ---
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

  // Carrega dados do LocalStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("evo_user");
    const storedToken = localStorage.getItem("evo_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        localStorage.removeItem("evo_user");
        localStorage.removeItem("evo_token");
      }
    }
    setIsLoading(false);
  }, []);

  // Função de Login (Salva Token e Dados)
  const login = (token: string, userData: User) => {
    localStorage.setItem("evo_token", token);
    localStorage.setItem("evo_user", JSON.stringify(userData));
    setUser(userData);
  };

  // Função de Logout (Limpa tudo)
  const logout = () => {
    localStorage.removeItem("evo_token");
    localStorage.removeItem("evo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);