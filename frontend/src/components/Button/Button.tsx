import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'social';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseStyles = 'px-10 py-4.5 rounded text-lg font-normal leading-[1.5] transition-colors';
  
  const variants = {
    primary: 'bg-[#5e3bee] text-white hover:bg-[#4d2fcc]',
    outline: 'border border-[#5e3bee] text-[#5e3bee] hover:bg-[#5e3bee] hover:text-white',
    social: 'bg-[#e62872] text-white hover:bg-[#d11f63] shadow-[0px_1.333px_2.667px_0px_rgba(16,24,40,0.05)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

