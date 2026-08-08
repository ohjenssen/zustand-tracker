import styles from './mealMacroStats.module.css';

export default function MealMacroStats({ totals }) {
  return (
    <>
      <section className={styles.calorieSection}>
        <h2 className={styles.calorieTitle}>Total calories</h2>
        <p className={styles.calorieValue}>{totals.kcal} kcal</p>
      </section>

      <section className={styles.macrosGrid}>
        <div>
          <p className={styles.macroValue}>{Number(totals.protein).toFixed(1)}g</p>
          <p className={styles.macroLabel}>Proteins</p>
        </div>
        <div>
          <p className={styles.macroValue}>{Number(totals.fat).toFixed(1)}g</p>
          <p className={styles.macroLabel}>Fats</p>
        </div>
        <div>
          <p className={styles.macroValue}>{Number(totals.carbs).toFixed(1)}g</p>
          <p className={styles.macroLabel}>Carbohydrates</p>
        </div>
      </section>
    </>
  );
}