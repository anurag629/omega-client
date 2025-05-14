import React from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md shadow-sm';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white focus:ring-blue-500 dark:focus:ring-offset-gray-800',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    outline: 'bg-transparent text-blue-500 dark:text-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    text: 'bg-transparent text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 focus:ring-0 shadow-none',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white focus:ring-red-500 dark:focus:ring-offset-gray-800',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-500 dark:focus:ring-offset-gray-800',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
    xl: 'h-14 px-6 text-lg',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combined classes
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      whileTap={{ scale: 0.97 }}
      whileHover={!disabled && !isLoading ? { scale: 1.02, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 10 
      }}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2 flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="ml-2 flex-shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button; 