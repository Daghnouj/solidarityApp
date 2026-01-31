import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

interface AuthPromptModalProps {
    isOpen: boolean;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        navigate('/login', { state: { from: location } });
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleGoBack = () => {
        const from = (location.state as any)?.from?.pathname;
        if (from && from !== location.pathname) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gray-900/40"
                onClick={handleGoBack}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <h2 className="text-xl font-black text-gray-900 mb-2">Accès Restreint</h2>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Connectez-vous pour rejoindre notre communauté et accéder à ce contenu.
                </p>

                <div className="space-y-2">
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm"
                    >
                        <LogIn className="w-4 h-4" />
                        Se Connecter
                    </button>

                    <button
                        onClick={handleRegister}
                        className="w-full py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Créer un Compte
                    </button>
                </div>

                <button
                    onClick={handleGoBack}
                    className="mt-6 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 mx-auto text-xs font-semibold"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Retourner à l'accueil
                </button>
            </motion.div>
        </div>
    );
};

export default AuthPromptModal;
