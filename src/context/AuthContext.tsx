// CORREÇÃO: Adicionado 'type' antes de ReactNode
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Definição do tipo de Usuário
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@evoprimal:user");
    const storedToken = localStorage.getItem("@evoprimal:jwt");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setJwt(storedToken);
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
        localStorage.removeItem("@evoprimal:user");
        localStorage.removeItem("@evoprimal:jwt");
      }
    }
    setLoading(false);
  }, []);

  function login(token: string, userData: User) {
    setUser(userData);
    setJwt(token);
    localStorage.setItem("@evoprimal:user", JSON.stringify(userData));
    localStorage.setItem("@evoprimal:jwt", token);
  }

  function logout() {
    setUser(null);
    setJwt(null);
    localStorage.removeItem("@evoprimal:user");
    localStorage.removeItem("@evoprimal:jwt");
    window.location.href = "/login";
  }

  function updateUser(userData: User) {
    setUser(userData);
    localStorage.setItem("@evoprimal:user", JSON.stringify(userData));
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      jwt, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);