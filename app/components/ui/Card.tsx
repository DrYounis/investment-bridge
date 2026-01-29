import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    glass?: boolean;
    gradient?: 'primary' | 'secondary' | 'sunset' | 'ocean' | 'forest' | 'none';
    hover?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function Card({
    children,
    title,
    description,
    glass = false,
    gradient = 'none',
    hover = false,
    onClick,
    className = '',
}: CardProps) {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
    const glassStyles = glass ? 'glass' : 'bg-background border-2 border-gray-200';
    const gradientStyles = gradient !== 'none' ? `gradient-${gradient} text-white` : '';
    const hoverStyles = hover ? 'hover-lift cursor-pointer' : '';
    const clickableStyles = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${glassStyles} ${gradientStyles} ${hoverStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-xl font-bold mb-2">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className={gradient !== 'none' ? 'text-white/90' : 'text-foreground/70'}>
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}
