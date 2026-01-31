import React from 'react';
import { useAuth } from '../pages/auth/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import AuthPromptModal from './AuthPromptModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message="Vérification de l'authentification..." />;
    }

    if (!user) {
        return <AuthPromptModal isOpen={true} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
