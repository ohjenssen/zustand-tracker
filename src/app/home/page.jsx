'use client'
import { useEffect, useState } from 'react';
import styles from './home.module.css';
import { useAuthStore } from '../store/store';
import CalorieStats from './CalorieStats/CalorieStats';
import Meals from './Meals/Meals';
import DateNavigator from './DateNavigator/DateNavigator';
import Navbar from '@/app/components/Navbar/Navbar';
import FloatingActionButton from '@/app/components/FloatingActionButton/FloatingActionButton';

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
        const mealDate = meal.created_at.split('T')[0];
        return mealDate === formattedSelectedDate;
    });

    // Regn ut totalt inntak for kalorier og makroer for den valgte dagen
    const dailyTotals = filteredMeals.reduce((totals, meal) => {
        const foodComponents = meal.foodComponents || [];
        
        foodComponents.forEach((food) => {
            const grams = food.gramsEaten || 0;
            const factor = grams / 100;

            const protein = (food.protein || 0) * factor;
            const fat = (food.fat || 0) * factor;
            const carbs = (food.carbs || 0) * factor;

            const kcalPer100 = food.kcal || ((food.protein * 4) + (food.carbs * 4) + (food.fat * 9));
            const kcal = kcalPer100 * factor;

            totals.kcal += kcal;
            totals.protein += protein;
            totals.fat += fat;
            totals.carbs += carbs;
        });

        return totals;
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });

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