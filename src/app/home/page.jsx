'use client'
import { useEffect, useState } from 'react';
import styles from './home.module.css';
import { useAuthStore } from '../store/store';
import CalorieStats from '../components/CalorieStats';
import Meals from '../components/Meals/Meals';
import AddButton from '@/app/components/AddButton';
import DateNavigator from '../components/DateNavigator';

export default function CalorieTrackerHome() {
    const token = useAuthStore((state) => state.token);
    const isLoading = useAuthStore((state) => state.isLoading);
    const allMeals = useAuthStore((state) => state.meals) || [];
    const getMeals = useAuthStore((state) => state.getMeals);

    // Valgt dato (standard til i dag)
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (token) {
            getMeals();
        }
    }, [token, getMeals]);

    // Konverter valgt dato til YYYY-MM-DD format
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

    // Filtrer måltidene for den valgte datoen
    const filteredMeals = allMeals.filter((meal) => {
        if (!meal.created_at) return false;
        // Hent YYYY-MM-DD fra created_at (f.eks. "2026-08-09T09:01:26.000000Z")
        const mealDate = meal.created_at.split('T')[0];
        return mealDate === formattedSelectedDate;
    });

    // Regn ut totalt antall spiste kalorier for den valgte dagen
    const totalEatenKcal = filteredMeals.reduce((total, meal) => {
        const foodComponents = meal.foodComponents || [];
        const mealKcal = foodComponents.reduce((sum, food) => {
            const grams = food.gramsEaten || 0;
            const factor = grams / 100;
            const kcalPer100 = food.kcal || Math.round((food.protein * 4) + (food.carbs * 4) + (food.fat * 9));
            return sum + Math.round(kcalPer100 * factor);
        }, 0);
        return total + mealKcal;
    }, 0);

    return (
        <>
            {isLoading ? 
                <main className={styles.loadingContainer}>
                    <p className={styles.loadingText}>Laster inn...</p>
                </main> :
                
                <main className={styles.main}>
                    <DateNavigator 
                        selectedDate={selectedDate} 
                        setSelectedDate={setSelectedDate} 
                    />

                    <CalorieStats eaten={totalEatenKcal} />

                    <Meals meals={filteredMeals} />

                    <AddButton href={`/add-food/?mealId=new&date=${formattedSelectedDate}`} />
                </main>
            }
        </>
    );
}