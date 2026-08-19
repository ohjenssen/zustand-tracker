'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.replace('/home');
        }
    }, [router]);

    return null; // Rendrer ingenting i HTML-en
}