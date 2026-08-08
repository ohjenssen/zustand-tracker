import { History } from 'lucide-react';
import Link from 'next/link';
import styles from './searchItem.module.css';

export default function SearchItem({ mealId, food }) {
  const href = mealId ? `/details/${food.id}?mealId=${mealId}` : `/details/${food.id}`;

  return (
    <Link href={href} className={styles.itemLink}>
      <History className={styles.icon} size={24} />
      <span className={styles.title}>
        {food.name}{food.variant && <span className={styles.brand}> / {food.variant}</span>} {food.brand && <span className={styles.brand}>/ {food.brand}</span>}
      </span>
    </Link>
  );
}