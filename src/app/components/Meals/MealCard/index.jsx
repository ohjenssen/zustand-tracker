'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import styles from '../meals.module.css';

export default function MealCard({ meal, totals }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Sletter måltid med ID: ${meal.id}`);
    // Her kan du senere kalle feks. deleteMeal(meal.id)
  };

  return (
    <div className={styles.swipeContainer}>
      {/* Bakgrunnslag med sletteknapp */}
      <div className={styles.deleteBackground}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          <Trash2 size={20} />
          <span>Slett</span>
        </button>
      </div>

      {/* Forgrunnslag som sveipes */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        animate={{ x: isOpen ? -80 : 0 }}
        onDragEnd={(e, info) => {
          // Hvis brukeren har swipet mer enn 40px til venstre, lås den i åpen tilstand
          if (info.offset.x < -40) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        className={styles.motionCard}
      >
        <Link href={`/meal/${meal.id}`} className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.titleGroup}>
              <span className={styles.icon}>🍴</span>
              <span className={styles.title}>{meal.name || `Måltid #${meal.id}`}</span>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>{totals.kcal}<br/>kcal</div>
              <div className={styles.statItem}>{Number(totals.protein).toFixed(1)}g<br/>Prot</div>
              <div className={styles.statItem}>{Number(totals.fat).toFixed(1)}g<br/>Fat</div>
              <div className={styles.statItem}>{Number(totals.carbs).toFixed(1)}g<br/>Carbs</div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}