import React from 'react';
import { Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps{
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({children}: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;