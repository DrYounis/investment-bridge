'use client'

import { useState } from 'react';
import { requestProjectDetails } from '@/app/actions/investor-requests';
import Toast from '@/app/components/ui/Toast';

interface InvestorRequestFormProps {
    repoName: string;
    repoUrl: string;
}

export default function InvestorRequestForm({ repoName, repoUrl }: InvestorRequestFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await requestProjectDetails(formData);
            setToastType('success');
            setToastMessage('Details requested successfully! Check your email soon.');
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastType('error');
            setToastMessage('Failed to submit request. Please try again.');
            setShowToast(true);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <form action={handleSubmit} className="mt-auto pt-4 border-t border-[#e5e0d8]">
                <input type="hidden" name="repoName" value={repoName} />
                <input type="hidden" name="repoUrl" value={repoUrl} />

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-[#0a192f] font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <span>Processing...</span>
                    ) : (
                        <>
                            <span>Request Investment Details</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                type={toastType}
            />
        </>
    );
}
