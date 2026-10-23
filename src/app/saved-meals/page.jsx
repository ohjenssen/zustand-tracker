import { Suspense } from 'react';
import SavedMealsContent from './SavedMealsContent';
import BackButton from '@/app/components/BackButton/BackButton';
import Navbar from '@/app/components/Navbar/Navbar';
import styles from './savedMeals.module.css';

export default function SavedMealsPage() {
    return (
        <main className={styles.main}>
            <Suspense fallback={<p className={styles.statusMessage}>Henter lagrede måltider...</p>}>
                <SavedMealsContent />
            </Suspense>
            <BackButton />
            <Navbar />
        </main>
    );
}
