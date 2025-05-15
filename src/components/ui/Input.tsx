import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
  wrapperClassName?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal' | 'floating';
  successMessage?: string;
  rightIcon?: React.ReactNode;
  iconClick?: () => void;
  allowClear?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    icon, 
    helpText, 
    className = '', 
    wrapperClassName = '', 
    variant = 'default',
    successMessage,
    rightIcon,
    iconClick,
    allowClear = false,
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
    
    // Handle focus and blur events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (props.onFocus) props.onFocus(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (props.onBlur) props.onBlur(e);
    };
    
    // Update hasValue state when input value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      if (props.onChange) props.onChange(e);
    };
    
    // Handle clearing the input
    const handleClear = () => {
      // Create a synthetic event to clear the input
      const inputElement = document.getElementById(props.id || '') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
        
        // Update state to show the input is empty
        setHasValue(false);
        
        // Focus the input after clearing
        inputElement.focus();
        
        // Trigger onChange if provided
        if (props.onChange) {
          const syntheticEvent = {
            target: { value: '' },
            currentTarget: { value: '' },
          } as React.ChangeEvent<HTMLInputElement>;
          props.onChange(syntheticEvent);
        }
      }
    };
    
    // Determine variant-specific classes
    const getVariantClasses = () => {
      switch (variant) {
        case 'filled':
          return 'bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-transparent dark:focus:bg-transparent';
        case 'outlined':
          return 'bg-transparent border-2';
        case 'minimal':
          return 'border-0 border-b-2 border-gray-200 dark:border-gray-700 rounded-none px-0 focus:ring-0';
        case 'floating':
          return 'pt-6 pb-2';
        default:
          return '';
      }
    };
    
    // Display label differently based on variant
    const renderLabel = () => {
      if (variant === 'floating') {
        return (
          <label 
            htmlFor={props.id} 
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${(focused || hasValue) 
                ? 'text-xs top-2 text-blue-600 dark:text-blue-400' 
                : 'text-sm top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'}
            `}
          >
            {label}
          </label>
        );
      }
      
      if (label) {
        return (
          <label htmlFor={props.id} className="form-label">
            {label}
          </label>
        );
      }
      
      return null;
    };

    return (
      <div className={`form-group ${wrapperClassName}`}>
        {variant !== 'floating' && renderLabel()}
        
        <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
              {React.cloneElement(icon as React.ReactElement, {
                className: `text-gray-500 dark:text-gray-400 ${focused ? 'text-blue-500 dark:text-blue-400' : ''}`,
              })}
            </div>
          )}
          
          <div className="relative">
            <input
              ref={ref}
              className={`
                form-input
                ${getVariantClasses()}
                ${icon ? 'pl-10' : ''}
                ${(rightIcon || allowClear) ? 'pr-10' : ''}
                ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                ${successMessage ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
                ${className}
              `}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            
            {variant === 'floating' && renderLabel()}
            
            {/* Right icon or clear button */}
            {(rightIcon || (allowClear && hasValue)) && (
              <div 
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${iconClick || allowClear ? 'cursor-pointer' : ''}`}
                onClick={allowClear && hasValue ? handleClear : iconClick}
              >
                {allowClear && hasValue ? (
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </motion.svg>
                ) : rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {/* Error or success message with animation */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p 
              key="error"
              className="form-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          ) : successMessage ? (
            <motion.p 
              key="success"
              className="mt-1 text-sm text-green-600 dark:text-green-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {successMessage}
            </motion.p>
          ) : helpText ? (
            <motion.p 
              key="help"
              className="form-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {helpText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 