import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  LoginSuperAdmin: (email: string, pass: string) => Promise<boolean>;
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
        throw new Error(`Falha no login: ${errorBody}`);
      }

      const data = await response.json();
      const jwtToken = data.token;

      if (jwtToken) {
        setToken(jwtToken);
        setIsAuthenticated(true);
        localStorage.setItem('jwt_token', jwtToken);
        return true;
      } else {
        throw new Error('Token JWT não recebido da API.');
      }

    } catch (error: any) {
      console.error('Erro de rede ou API durante o login:', error.message);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('jwt_token');
      throw error;
    }
  };

  const LoginSuperAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/auth/login/superadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: pass }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Falha no login de Super Admin: ${errorBody}`);
      }

      const data = await response.json();
      const jwtToken = data.token;

      if (jwtToken) {
        setToken(jwtToken);
        setIsAuthenticated(true);
        localStorage.setItem('jwt_token', jwtToken);
        return true;
      } else {
        throw new Error('Token JWT não recebido da API.');
      }

    } catch (error: any) {
      console.error('Erro de rede ou API durante o login de Super Admin:', error.message);
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
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, LoginSuperAdmin, logout, token }}>
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