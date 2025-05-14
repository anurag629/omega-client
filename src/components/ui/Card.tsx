import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  withHover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  color = 'default',
  padding = 'md',
  className = '',
  onClick,
  interactive = false,
  withHover = false,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-sm',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-white/20 dark:border-gray-700/20',
  };
  
  // Color classes
  const colorClasses = {
    default: '',
    primary: 'border-blue-200 dark:border-blue-800',
    success: 'border-green-200 dark:border-green-800',
    warning: 'border-amber-200 dark:border-amber-800',
    error: 'border-red-200 dark:border-red-800',
  };
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  // Interactive classes
  const interactiveClasses = interactive 
    ? 'cursor-pointer active:scale-98 transition-transform' 
    : '';
  
  // Hover classes
  const hoverClasses = withHover 
    ? 'hover:shadow-md hover:-translate-y-1' 
    : '';
  
  // Combined classes
  const classes = `${baseClasses} ${variantClasses[variant]} ${colorClasses[color]} ${paddingClasses[padding]} ${interactiveClasses} ${hoverClasses} ${className}`;
  
  return (
    <motion.div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card; 