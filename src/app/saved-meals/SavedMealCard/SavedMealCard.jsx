'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, CookingPot, Plus } from 'lucide-react';
import { useAuthStore } from '@/app/store/store';
import { getMealTotals } from '@/app/utils/mealTotals';
import styles from '../savedMeals.module.css';

export default function SavedMealCard({ savedMeal, date }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLogging, setIsLogging] = useState(false);

    const logSavedMeal = useAuthStore((state) => state.logSavedMeal);
    const deleteSavedMeal = useAuthStore((state) => state.deleteSavedMeal);

    const foodComponents = savedMeal.foodComponents || [];
    const totals = getMealTotals(foodComponents);

    const handleLog = async () => {
        setIsLogging(true);
        const newMealId = await logSavedMeal(savedMeal.id, date);
        if (newMealId) {
            router.push(`/meal/${newMealId}`);
        } else {
            setIsLogging(false);
            alert('Kunne ikke legge til måltidet. Prøv igjen.');
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteSavedMeal(savedMeal.id);
    };

    return (
        <div className={styles.swipeContainer}>
            {/* Bakgrunnslag med sletteknapp (samme mønster som MealCard) */}
            <div className={styles.deleteBackground}>
                <button onClick={handleDelete} className={styles.deleteButton}>
                    <Trash2 size={20} />
                    <span>Slett</span>
                </button>
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.1}
                animate={{ x: isOpen ? -80 : 0 }}
                onDragEnd={(e, info) => setIsOpen(info.offset.x < -40)}
                className={styles.motionCard}
            >
                <div className={styles.card}>
                    <div className={styles.cardTop}>
                        <div className={styles.titleGroup}>
                            <CookingPot size={22} />
                            <span className={styles.cardTitle}>{savedMeal.name}</span>
                        </div>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>{totals.kcal}<br />kcal</div>
                            <div className={styles.statItem}>{totals.protein.toFixed(1)}g<br />Prot</div>
                            <div className={styles.statItem}>{totals.fat.toFixed(1)}g<br />Fat</div>
                            <div className={styles.statItem}>{totals.carbs.toFixed(1)}g<br />Carbs</div>
                        </div>
                    </div>

                    <ul className={styles.productList}>
                        {foodComponents.map((food) => (
                            <li key={food.id} className={styles.productItem}>
                                <span>
                                    {food.name}
                                    {food.variant && <span className={styles.faded}> / {food.variant}</span>}
                                </span>
                                <span className={styles.productGrams}>{food.gramsEaten} g</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className={styles.logButton}
                        onClick={handleLog}
                        disabled={isLogging}
                    >
                        <Plus size={18} strokeWidth={3} />
                        {isLogging ? 'Legger til...' : 'Legg til'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
