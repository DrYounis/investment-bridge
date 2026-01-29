import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            startIcon,
            endIcon,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground mb-2">
                        {label}
                        {props.required && <span className="text-error ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
                            {startIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-3 rounded-lg
              border-2 border-gray-300
              bg-background text-foreground
              placeholder:text-foreground/40
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-error focus:ring-error' : ''}
              ${startIcon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${className}
            `}
                        {...props}
                    />

                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50">
                            {endIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-error">{error}</p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-sm text-foreground/60">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
