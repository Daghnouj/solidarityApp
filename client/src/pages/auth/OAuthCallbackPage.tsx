import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from './services/auth.service';
import LoadingSpinner from '../../components/LoadingSpinner';

const OAuthCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (token) {
                // Store token first
                localStorage.setItem('token', token);

                try {
                    // Fetch user data and store it
                    const user = await AuthService.getCurrentUser();
                    localStorage.setItem('user', JSON.stringify(user));

                    // Redirect to home
                    window.location.href = '/';
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                    // Still redirect, app might recover
                    window.location.href = '/';
                }
            } else if (error) {
                console.error("OAuth Error:", error);
                navigate('/login?error=' + error);
            } else {
                navigate('/login');
            }
        };

        handleAuth();
    }, [searchParams, navigate]);

    return (
        <LoadingSpinner message="Authenticating..." />
    );
};

export default OAuthCallbackPage;

