"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/store';

export default function ProtectedRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const router = useRouter();

    useEffect(() => {
        // Hvis vi har sjekket auth ferdig og det IKKE finnes noen bruker -> Send til login
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // Vis ingenting eller en spinner mens vi sjekker tokenet
    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-[#00ffb3]">Laster...</p>
            </div>
        );
    }

    return children;
}