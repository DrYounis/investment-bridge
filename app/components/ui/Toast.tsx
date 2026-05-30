'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'success' | 'error';
}

export default function Toast({ message, isVisible, onClose, type = 'success' }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className={`
                        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                        flex items-center gap-3 px-6 py-3 rounded-full
                        shadow-lg border backdrop-blur-md font-medium text-sm
                        ${isSuccess
                            ? 'bg-[#fdfbf7]/95 border-gold text-primary'
                            : 'bg-red-50/95 border-error text-error'
                        }
                    `}
                >
                    {isSuccess ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}

                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
