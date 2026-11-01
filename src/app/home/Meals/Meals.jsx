import MealCard from "./MealCard/MealCard";
import styles from "./meals.module.css";
import { getMealTotals } from "@/app/utils/mealTotals";

export default function Meals({ meals }) {
    if (!meals) {
        return <div className={styles.statusMessage}>Henter måltider...</div>;
    }

    if (meals.length === 0) {
        return <div className={styles.statusMessage}>Ingen måltider registrert på denne dagen.</div>;
    }

    return (
        <section className={styles.container}>
            {meals.map((meal, index) => {
                const totals = getMealTotals(meal.foodComponents);

                return (
                    <MealCard key={meal.id} index={index} meal={meal} totals={totals} />
                );
            })}
        </section>
    );
}