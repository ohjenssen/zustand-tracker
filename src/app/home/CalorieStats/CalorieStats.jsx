import { useAuthStore } from "@/app/store/store";
import Spinner from "@/app/components/Spinner/Spinner";
import styles from "./calorieStats.module.css";

export default function CalorieStats({ eaten }) {
    const user = useAuthStore((state) => state.user);

    const proteins_in_calories = user?.gram_protein_need * 4;
    const fat_in_calories = user?.gram_fat_need * 9;
    const carbohydrates_in_calories = user?.gram_carbohydrate_need * 4;

    const dailyCalories = proteins_in_calories + fat_in_calories + carbohydrates_in_calories;

    const progressPercent = Math.min((eaten / dailyCalories) * 100, 100);

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Eaten</h2>
            <div className={styles.calorieText}>
                {eaten} / <span className={styles.targetText}>{dailyCalories ? `${dailyCalories} kcal` : <Spinner size='sm'/>}</span>
            </div>
            <div className={styles.progressBarBg}>
                <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </section>
    );
}