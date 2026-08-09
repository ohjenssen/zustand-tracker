"use client";
import styles from './mealPage.module.css';
import { useParams } from 'next/navigation';
import FoodComponentCard from '@/app/components/FoodComponentCard';
import MealHeader from '@/app/components/MealHeader';
import MealMacroStats from '@/app/components/MealMacroStats';
import { useAuthStore } from '@/app/store/store';
import AddButton from '@/app/components/AddButton';

export default function MealOverviewPage() {
    const { id } = useParams();
    const meals = useAuthStore((state) => state.meals);

    const currentMeal = meals?.find(m => m.id === parseInt(id));

    if (!meals || !currentMeal) {
        return (
            <main className={styles.main}>
                <p className={styles.loadingText}>Henter måltid...</p>
            </main>
        );
    }

    const foodComponents = currentMeal.foodComponents || [];
    console.log('food: ', foodComponents);

    const totals = foodComponents.reduce((acc, food) => {
        const factor = (food.gramsEaten || 0) / 100;
        return {
            kcal: acc.kcal + Math.round((food.kcal || 0) * factor),
            protein: acc.protein + parseFloat(((food.protein || 0) * factor).toFixed(1)),
            fat: acc.fat + parseFloat(((food.fat || 0) * factor).toFixed(1)),
            carbs: acc.carbs + parseFloat(((food.carbs || 0) * factor).toFixed(1)),
        };
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });

  return (
    <main className={styles.main}>
      
        <MealHeader name={currentMeal.name || `Måltid #${currentMeal.id}`} />

        <MealMacroStats totals={totals} />

        {/* Liste over matkomponenter */}
        <section className={styles.foodListSection}>
            {foodComponents.map((food, index) => (
                <FoodComponentCard key={food.id || index} food={food} />
            ))}
            
            <AddButton href={`/search?mealId=${currentMeal.id}`}/>
        </section>
    </main>
  );
}