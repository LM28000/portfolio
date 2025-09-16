import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminAuth from './AdminAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin();

  // Afficher un loader pendant la vérification de session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>;
};

export default AdminRoute;