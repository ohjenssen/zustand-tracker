"use client";
import styles from './mealPage.module.css';
import { useParams } from 'next/navigation';
import FoodComponentCard from '@/app/meal/[id]/FoodComponentCard/FoodComponentCart';
import MealHeader from '@/app/meal/[id]/MealHeader/MealHeader';
import MealMacroStats from '@/app/meal/[id]/MealMacroStats/MealMacroStats';
import { useAuthStore } from '@/app/store/store';
import AddButton from '@/app/components/AddButton/AddButton';
import BackButton from '@/app/components/BackButton/BackButton';
import Navbar from '@/app/components/Navbar/Navbar';
import SaveMealForm from '@/app/meal/[id]/SaveMealForm/SaveMealForm';
import { getMealTotals } from '@/app/utils/mealTotals';

export default function MealOverviewPage() {
    const { id } = useParams();
    const meals = useAuthStore((state) => state.meals);

    const currentMeal = meals?.find(m => m.id === parseInt(id));

    const foodComponents = currentMeal?.foodComponents || [];

    const totals = getMealTotals(foodComponents);

  return (
    <main className={styles.main}>

        {!meals || !currentMeal ? 
            <p className={styles.loadingText}>Henter måltid...</p> :
            
            <>
                <MealHeader name={currentMeal.name || `Måltid #${currentMeal.id}`} />
                <MealMacroStats totals={totals} />
            
                <section className={styles.foodListSection}>
                    {foodComponents.map((food) => (
                        <FoodComponentCard key={food.id} food={food} mealId={currentMeal.id}/>
                    ))}    
                    <AddButton href={`/add-food?mealId=${currentMeal.id}`}/>
                    <SaveMealForm foodComponents={foodComponents} />
                </section>
            </>
        }

        <BackButton />
        <Navbar />
    </main>
  );
}