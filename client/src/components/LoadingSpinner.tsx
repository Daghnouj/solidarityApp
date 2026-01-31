import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Unified loading spinner component used across all pages
 * Provides consistent loading experience for admin, user, professional dashboards and public pages
 * Uses the same double-circle spinner design as the community page
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    fullScreen = true,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-12 w-12',
        md: 'h-16 w-16',
        lg: 'h-20 w-20'
    };

    const containerClasses = fullScreen
        ? 'flex items-center justify-center min-h-screen'
        : 'flex items-center justify-center py-12';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className={`${sizeClasses[size]} rounded-full border-t-4 border-b-4 border-indigo-200`}></div>
                    <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-t-4 border-indigo-600 animate-spin`}></div>
                </div>
                <p className="text-gray-600 text-sm md:text-base font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
