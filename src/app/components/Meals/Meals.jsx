'use client';
import { useAuthStore } from "../../store/store";
import MealCard from "./MealCard";
import styles from "./meals.module.css";

export default function Meals() {
    const meals = useAuthStore((state) => state.meals);

    if (!meals) {
        return <div className={styles.statusMessage}>Henter måltider...</div>;
    }

    if (meals.length === 0) {
        return <div className={styles.statusMessage}>Ingen måltider registrert ennå.</div>;
    }

    return (
        <section className={styles.container}>
            {meals.map(meal => {
                const foodComponents = meal.foodComponents || [];
                
                const totals = foodComponents.reduce((acc, food) => {
                    const grams = food.gramsEaten || 0;
                    const factor = grams / 100;
                    const protein = parseFloat(food.protein || 0);
                    const fat = parseFloat(food.fat || 0);
                    const carbs = parseFloat(food.carbs || 0);
                    const kcal = food.kcal || Math.round((protein * 4) + (carbs * 4) + (fat * 9));

                    return {
                        kcal: acc.kcal + Math.round(kcal * factor),
                        protein: acc.protein + parseFloat((protein * factor).toFixed(1)),
                        fat: acc.fat + parseFloat((fat * factor).toFixed(1)),
                        carbs: acc.carbs + parseFloat((carbs * factor).toFixed(1)),
                    };
                }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });

                return (
                    <MealCard key={meal.id} meal={meal} totals={totals} />
                );
            })}
        </section>
    );
}