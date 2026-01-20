import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  icon,
  className = '', 
  ...rest 
}) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-blue-900 text-white hover:bg-blue-800 shadow-md hover:shadow-lg active:scale-95',
    ghost: 'bg-transparent border-2 border-blue-900 text-blue-900 hover:bg-blue-50 active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg active:scale-95'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...rest}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;