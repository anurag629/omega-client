import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  wrapperClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className = '', wrapperClassName = '', ...props }, ref) => {
    return (
      <div className={`form-group ${wrapperClassName}`}>
        {label && (
          <label htmlFor={props.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            w-full rounded-lg border border-gray-300 bg-white px-3 py-2
            dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors ease-in-out duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-600' : ''}
            ${className}
          `}
          {...props}
        />
        
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helpText && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea; 