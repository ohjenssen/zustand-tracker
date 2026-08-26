import { useAuthStore } from "@/app/store/store";
import Spinner from "@/app/components/Spinner/Spinner";
import styles from "./calorieStats.module.css";

export default function CalorieStats({ eaten, proteinEaten = 0, fatEaten = 0, carbsEaten = 0 }) {
    const user = useAuthStore((state) => state.user);

    const proteinGoal = user?.gram_protein_need || 0;
    const fatGoal = user?.gram_fat_need || 0;
    const carbsGoal = user?.gram_carbohydrate_need || 0;

    const dailyCalories = (proteinGoal * 4) + (fatGoal * 9) + (carbsGoal * 4);
    const progressPercent = Math.min((eaten / (dailyCalories || 1)) * 100, 100);

    return (
        <section className={styles.section}>
            <div className={styles.calorieText}>
                {eaten} / <span className={styles.targetText}>{dailyCalories ? `${dailyCalories} kcal` : <Spinner size='sm'/>}</span>
            </div>
            
            <div className={styles.progressBarBg}>
                <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Makro-oversikt */}
            <div className={styles.macroContainer}>
                <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{proteinEaten} / {proteinGoal}</span>
                    <span className={styles.macroLabel}>Proteins</span>
                </div>

                <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{fatEaten} / {fatGoal}</span>
                    <span className={styles.macroLabel}>Fat</span>
                </div>

                <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{carbsEaten} / {carbsGoal}</span>
                    <span className={styles.macroLabel}>Carbohydrates</span>
                </div>
            </div>
        </section>
    );
}