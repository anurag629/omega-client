import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helpText, className = '', wrapperClassName = '', ...props }, ref) => {
    return (
      <div className={`form-group ${wrapperClassName}`}>
        {label && (
          <label htmlFor={props.id} className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              form-input
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-error focus:border-error focus:ring-error' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && <p className="form-error">{error}</p>}
        {helpText && !error && <p className="mt-1 text-sm text-secondary-500">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 