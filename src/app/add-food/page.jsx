'use client'
import styles from './addMeal.module.css';
import { Sparkles, Search, Barcode, HelpCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AddFood() {
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const mealId = searchParams.get('mealId');
    return (
        <div className={styles.container}>
            {/* Sentrert tekstinnhold */}
            <main className={styles.content}>
                <p className={styles.description}>
                    Select one of the options below to add a component. You can choose a
                    meal you have pre-saved, scan the barcode, search in our database or
                    have AI scan your food.
                </p>
            </main>

            {/* Runde knapper over navigasjonslinjen */}
            <div className={styles.actionGrid}>
                <button 
                    className={styles.actionButton} 
                    aria-label="AI Scan"
                    onClick={() => console.log('AI Scan clicked')}
                >
                    <Sparkles size={28} />
                </button>

                <Link 
                    className={styles.actionButton} 
                    aria-label="Search Database"
                    href={`/search?mealId=${mealId}&date=${dateParam}`}
                    >
                    <Search size={28} />
                </Link>

                <button 
                    className={styles.actionButton} 
                    aria-label="Scan Barcode"
                    onClick={() => console.log('Barcode clicked')}
                    >
                    <Barcode size={28} />
                </button>

                <button 
                    className={styles.actionButton} 
                    aria-label="Help / Pre-saved Meals"
                    onClick={() => console.log('Help clicked')}
                    >
                    <HelpCircle size={28} />
                </button>
            </div>
        </div>
    );
}