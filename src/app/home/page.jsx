'use client'
import { useEffect } from 'react';
import styles from './home.module.css';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/store';
import CalorieStats from '../components/CalorieStats';
import Meals from '../components/Meals/Meals';
import AddButton from '@/app/components/AddButton'

export default function CalorieTrackerHome() {
    const token = useAuthStore((state) => state.token);
    const isLoading = useAuthStore((state) => state.isLoading);
    const getMeals = useAuthStore((state) => state.getMeals);

    useEffect(() => {
        if (token) {
            getMeals();
        }
    }, [token, getMeals]);

    return (
        <>
            {isLoading ? 
                <main className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Laster inn...</p>
                </main> :
                
                <main className={styles.main}>
                    <CalorieStats eaten={691} />

                    <Meals />

                    <AddButton href={'/search/?mealId=new'} />
                </main>
            }
        </>
    );
}