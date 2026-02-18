import React from 'react';
import logoSrc from '../assets/logo.png';

interface LoadingSpinnerProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Branded loading spinner featuring the Solidarity logo
 * with a pulsing animation and orbiting ring.
 * Used across all pages for a consistent loading experience.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    fullScreen = true,
    size = 'md'
}) => {
    const sizeMap = {
        sm: { logo: 48, ring: 72 },
        md: { logo: 72, ring: 104 },
        lg: { logo: 96, ring: 136 },
    };

    const { logo: logoSize, ring: ringSize } = sizeMap[size];

    const containerStyle: React.CSSProperties = fullScreen
        ? { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }
        : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' };

    return (
        <div style={containerStyle}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    animation: 'solidarity-fade-in 0.5s ease-out',
                }}
            >
                {/* Logo + orbiting ring */}
                <div
                    style={{
                        position: 'relative',
                        width: ringSize,
                        height: ringSize,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Orbiting ring */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '3px solid #e0e7ff',
                            borderTopColor: '#6366f1',
                            borderRightColor: '#6366f1',
                            animation: 'solidarity-ring-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        }}
                    />

                    {/* Second faint ring (decorative) */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 4,
                            borderRadius: '50%',
                            border: '2px solid transparent',
                            borderBottomColor: '#a5b4fc',
                            borderLeftColor: '#a5b4fc',
                            animation: 'solidarity-ring-spin 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse',
                        }}
                    />

                    {/* Logo */}
                    <img
                        src={logoSrc}
                        alt="Solidarity"
                        style={{
                            width: logoSize,
                            height: 'auto',
                            objectFit: 'contain',
                            animation: 'solidarity-pulse 2s ease-in-out infinite',
                            filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.15))',
                        }}
                    />
                </div>

                {/* Message */}
                <p
                    style={{
                        color: '#6b7280',
                        fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
                        fontWeight: 500,
                        letterSpacing: '0.025em',
                        animation: 'solidarity-fade-in 0.8s ease-out 0.3s both',
                    }}
                >
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
