import Link from 'next/link';
import styles from './foodComponentCard.module.css';

export default function FoodComponentCard({ food }) {
    const factor = (food.gramsEaten || 0) / 100;
    const calculatedKcal = Math.round((food.kcal || 0) * factor);
    const calculatedProtein = ((food.protein || 0) * factor).toFixed(1);
    const calculatedFat = ((food.fat || 0) * factor).toFixed(1);
    const calculatedCarbs = ((food.carbs || 0) * factor).toFixed(1);

    return (
        <div className={styles.wrapper}>
            {/* Varenavn og Merke */}
            <h3 className={styles.title}>
                {food.name} {food.brand && <span className={styles.brand}>- {food.brand}</span>}
            </h3>

            {/* Cardt */}
            <Link href={`/details/${food.id}`} className={styles.card}>
                <div className={styles.gramBadge}>
                    {food.gramsEaten}g
                </div>
                
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>{calculatedKcal}<br/>kcal</div>
                    <div className={styles.statItem}>{calculatedProtein} g<br/>Proteins</div>
                    <div className={styles.statItem}>{calculatedFat} g<br/>Fats</div>
                    <div className={styles.statItem}>{calculatedCarbs} g<br/>Carbs</div>
                </div>
            </Link>
        </div>
    );
}