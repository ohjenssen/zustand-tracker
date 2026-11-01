'use client'
import { useEffect, useState } from 'react';
import styles from './home.module.css';
import { useAuthStore } from '../store/store';
import CalorieStats from './CalorieStats/CalorieStats';
import Meals from './Meals/Meals';
import DateNavigator from './DateNavigator/DateNavigator';
import Navbar from '@/app/components/Navbar/Navbar';
import FloatingActionButton from '@/app/components/FloatingActionButton/FloatingActionButton';
import { getMealTotals } from '@/app/utils/mealTotals';
import { toLocalDateString } from '@/app/utils/dates';

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

    // Valgt dato som YYYY-MM-DD i lokal tid
    const formattedSelectedDate = toLocalDateString(selectedDate);

    // Filtrer måltidene for den valgte datoen. created_at er i UTC,
    // så vi gjør det om til lokal dato før vi sammenligner.
    const filteredMeals = allMeals.filter((meal) => {
        if (!meal.created_at) return false;
        return toLocalDateString(new Date(meal.created_at)) === formattedSelectedDate;
    });

    // Regn ut totalt inntak for kalorier og makroer for den valgte dagen
    const dailyTotals = getMealTotals(filteredMeals.flatMap((meal) => meal.foodComponents || []));

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

                    <CalorieStats 
                        eaten={Math.round(dailyTotals.kcal)} 
                        proteinEaten={Math.round(dailyTotals.protein)}
                        fatEaten={Math.round(dailyTotals.fat)}
                        carbsEaten={Math.round(dailyTotals.carbs)}
                    />

                    <Meals meals={filteredMeals} />

                    <FloatingActionButton date={formattedSelectedDate}/>
                </main>
            }
            <Navbar />
        </>
    );
}