import React, { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
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

                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-3 rounded-lg
                        border-2 border-gray-300
                        bg-background text-foreground
                        placeholder:text-foreground/40
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        resize-vertical
                        ${error ? 'border-error focus:ring-error' : ''}
                        ${className}
                    `}
                    {...props}
                />

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

Textarea.displayName = 'Textarea';

export default Textarea;
