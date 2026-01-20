import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false
}) => {
  const baseClasses = "bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-white to-blue-50/30" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;