import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: pass }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Login failed with status:', response.status);
        console.error('Raw error response:', errorBody);

        let errorMessage = 'Falha na autenticação. Tente novamente.';

        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (jsonParseError) {
          if (response.status === 401) {
            errorMessage = 'Credenciais inválidas.';
          } else if (response.status === 400 && errorBody.includes('invalid credentials')) {
             errorMessage = 'Usuário ou senha inválidos.';
          } else if (response.status === 415) {
             errorMessage = 'Erro de configuração: Tipo de conteúdo não suportado pelo servidor.';
          } else {
             errorMessage = `Erro do servidor (${response.status}): ${errorBody.substring(0, 100)}...`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const jwtToken = data.token;

      if (jwtToken) {
        setToken(jwtToken);
        setIsAuthenticated(true);
        localStorage.setItem('jwt_token', jwtToken);
        return true;
      } else {
        console.error('Login successful, but no JWT token received in the response:', data);
        throw new Error('Token JWT não recebido da API.');
      }

    } catch (error: any) {
      console.error('Network or API error during login:', error.message);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('jwt_token');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setToken(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};