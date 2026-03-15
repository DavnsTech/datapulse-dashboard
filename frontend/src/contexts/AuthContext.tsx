import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import apiClient from "../api/client";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("datapulse_token")
  );

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiClient.post("/auth/login", { username, password });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("datapulse_token", accessToken);
    localStorage.setItem("datapulse_refresh_token", refreshToken);
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("datapulse_token");
    localStorage.removeItem("datapulse_refresh_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
