"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const BACKEND_ME_URL = "http://localhost:3004/me";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: UserProfile | null;
  status: "loading" | "authenticated" | "unauthenticated";
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const response = await fetch(BACKEND_ME_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setStatus("authenticated");
        } else {
          localStorage.removeItem("authToken");
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setStatus("unauthenticated");
      }
    };

    fetchUserProfile();
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
