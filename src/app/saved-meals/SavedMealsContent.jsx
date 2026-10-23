'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/store';
import SavedMealCard from './SavedMealCard/SavedMealCard';
import styles from './savedMeals.module.css';

// "2026-10-23" -> "fredag 23. oktober" (lokal tid, ikke UTC)
function formatDate(dateString) {
    if (!dateString) return 'i dag';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return 'i dag';
    return new Date(y, m - 1, d).toLocaleDateString('nb-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

export default function SavedMealsContent() {
    const searchParams = useSearchParams();
    const date = searchParams.get('date');

    const token = useAuthStore((state) => state.token);
    const savedMeals = useAuthStore((state) => state.savedMeals);
    const getSavedMeals = useAuthStore((state) => state.getSavedMeals);

    // Hent alltid ferskt når siden åpnes
    useEffect(() => {
        if (token) getSavedMeals();
    }, [token, getSavedMeals]);

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>Lagrede måltider</h1>
                <p className={styles.subtitle}>Legges til {formatDate(date)}</p>
            </header>

            {!savedMeals ? (
                <p className={styles.statusMessage}>Henter lagrede måltider...</p>
            ) : savedMeals.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Du har ingen lagrede måltider ennå.</p>
                    <p className={styles.emptyHint}>
                        Åpne et måltid og trykk «Lagre som måltid» for å gjenbruke det senere.
                    </p>
                </div>
            ) : (
                <section className={styles.list}>
                    {savedMeals.map((savedMeal) => (
                        <SavedMealCard key={savedMeal.id} savedMeal={savedMeal} date={date} />
                    ))}
                </section>
            )}
        </>
    );
}
