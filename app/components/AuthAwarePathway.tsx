'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AuthAwarePathwayProps {
    role: 'investor' | 'entrepreneur'
    label: string
    subLabel: string
    icon: string
    protectedHref: string
    variant: 'light' | 'dark'
}

export default function AuthAwarePathway({
    role,
    label,
    subLabel,
    icon,
    protectedHref,
    variant,
}: AuthAwarePathwayProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }) => {
            setIsLoggedIn(!!data.user)
        }).catch(() => {
            setIsLoggedIn(false)
        })
    }, [])

    const href = isLoggedIn ? protectedHref : `/register?type=${role}`

    if (variant === 'dark') {
        return (
            <Link href={href} className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-deep-navy border border-gold/20">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-8 left-8 w-20 h-20 bg-white/5 rounded-2xl -rotate-12 group-hover:-rotate-45 transition-transform duration-700"></div>
                <div className="absolute bottom-12 right-8 w-16 h-16 bg-gold/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark text-deep-navy rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gold/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            {icon}
                        </div>
                        <h2 className="text-4xl font-bold text-luxury-gold mb-4 font-luxury">{label}</h2>
                        <p className="text-gold-light/90 text-lg leading-relaxed">{subLabel}</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-4 bg-white/5 text-gold rounded-xl font-bold group-hover:bg-gold group-hover:text-deep-navy transition-all duration-300 shadow-sm border border-gold/20">
                        <span>{isLoggedIn ? 'دخول المستثمرين' : 'سجل كمستثمر'}</span>
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={href} className="group relative overflow-hidden rounded-3xl h-[480px] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border border-gold/10">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-8 right-8 w-20 h-20 bg-gold/5 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
            <div className="absolute bottom-12 left-8 w-16 h-16 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                <div>
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark text-deep-navy rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gold/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {icon}
                    </div>
                    <h2 className="text-4xl font-bold text-deep-navy dark:text-white mb-4 font-luxury">{label}</h2>
                    <p className="text-deep-navy/80 dark:text-white/80 text-lg leading-relaxed">{subLabel}</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-gold/5 text-deep-navy dark:text-white rounded-xl font-bold group-hover:bg-deep-navy group-hover:text-gold dark:group-hover:bg-gold dark:group-hover:text-deep-navy transition-all duration-300 shadow-sm border border-gold/10">
                    <span>{isLoggedIn ? 'دخول رواد الأعمال' : 'سجل كرائد أعمال'}</span>
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
